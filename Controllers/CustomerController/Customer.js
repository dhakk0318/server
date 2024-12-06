const jwt = require("jsonwebtoken");  
const bcrypt = require("bcrypt");
const db = require("../../Config/db");
const { sendOTPEmail,sendRegistrationEmail  } = require("../../utils/nodemailer"); // Import Nodemailer
// const { sendSms } = require("../../utils/twilio"); // Import Twilio
const nodemailer = require("nodemailer");
// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Function to generate a random OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

 
// Login Function
exports.loginCustomer = async (req, res) => {
  const { contact_no, password } = req.body;

  db.query("SELECT * FROM tbl_customer_registration WHERE contact_no = ?", [contact_no], async (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      return res.status(500).json({ message: "Error logging in", error });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const customer = results[0];
    const validPassword = await bcrypt.compare(password, customer.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Create a JWT with OTP and customer info
    const otpToken = jwt.sign(
      { otp, cid: customer.cid, customer_name: customer.customer_name },
      JWT_SECRET,
      { expiresIn: "10m" }
    );

    // Send OTP Email and SMS
    try {
      await sendOTPEmail(customer.email, otp); // Email bhejna

      // Format phone number for SMS (assuming contact_no doesn't include country code)
      // const formattedPhoneNumber = "+91" + contact_no; // Country code add karna
      // await sendSms(formattedPhoneNumber, otp); // Send OTP via SMS

      res.json({
        message: "OTP sent to your email and phone.",
        otpToken,
      }); 
    } catch (error) {
      console.error("Error sending OTP:", error);
      return res.status(500).json({ message: "Failed to send OTP." });
    }
  });
};

// OTP Verification Function
exports.verifyOTP = (req, res) => {
  const { otp, otpToken } = req.body;

  if (!otpToken) {
    return res.status(400).json({ message: "OTP token must be provided." });
  }

  try {
    const decoded = jwt.verify(otpToken, JWT_SECRET);
    
    if (otp && otp === decoded.otp) {
      const token = jwt.sign(
        { cid: decoded.cid, customer_name: decoded.customer_name },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      const findCounterQuery = "SELECT * FROM tbl_customer_registration WHERE cid = ?";
      db.query(findCounterQuery, [decoded.cid], (error, results) => {
        if (error) {
          console.error("Error querying database:", error);
          return res.status(500).json({ message: "Error logging in", error });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: "Customer not found" });
        } 

        const customer = results[0];
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600000,
        });
  
        res.json({
          message: "OTP verified, you are now logged in.",
          customerId: decoded.cid,
          customer
        });

      });

      
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired OTP token" });
  }
};



exports.createCustomer = async (req, res) => {
  const { customer_name, age, contact_no, email, gender, status, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const cid = Math.floor(1000 + Math.random() * 9000);

    const query = `
      INSERT INTO tbl_customer_registration (cid, customer_name, age, contact_no, email, gender, status, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [cid, customer_name, age, contact_no, email, gender, status, hashedPassword],
      async (error) => {
        if (error) {
          return res.status(500).json({ message: "Error creating customer", error });
        }

        try {
          // Send welcome email after successful registration
          await sendRegistrationEmail(email, customer_name, cid, contact_no);

          res.json({
            message: "Customer created and email sent",
            customerId: cid,
          });
        } catch (emailError) {
          return res.status(500).json({ message: "Customer created, but failed to send email." });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Error creating customer", error });
  }
};

 



exports.getAllCustomers = (req, res) => {
  db.query("SELECT * FROM tbl_customer_registration", (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Error fetching customers", error });
    }
    res.json(results);
  });
};

exports.getCustomerById = (req, res) => {
  const cid = req.params.cid;

  db.query(
    "SELECT * FROM tbl_customer_registration WHERE cid = ?",
    [cid],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Error retrieving customer", error });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Customer not found" });
      }

      // Assuming results[0] contains customer data
      const customer = results[0];
      res.json({ cid: customer.cid, customer_name: customer.name }); // Replace 'name' with actual column name
    }
  );
};

exports.updateCustomer = (req, res) => {
  const { cid } = req.params;
  const updates = req.body;

  let query = "UPDATE tbl_customer_registration SET ";
  const values = [];

  Object.keys(updates).forEach((key, index) => {
    query += `${key} = ?`;
    if (index < Object.keys(updates).length - 1) {
      query += ", ";
    }
    values.push(updates[key]);
  });

  query += " WHERE cid = ?";
  values.push(cid);

  db.query(query, values, (error) => {
    if (error) {
      return res.status(500).json({ message: "Error updating customer", error });
    }
    res.json({ message: "Customer updated" });
  });
};

exports.logoutCustomer = (req, res) => {
  res.clearCookie("token"); // 'token' is the name of your cookie
  res.json({ message: "Logged out" });
};


// const jwt = require("jsonwebtoken");  
// const bcrypt = require("bcrypt");
// const db = require("../../Config/db");
// const { sendOTPEmail,sendRegistrationEmail  } = require("../../utils/nodemailer"); // Import Nodemailer
// const { sendSms } = require("../../utils/twilio"); // Import Twilio
// const nodemailer = require("nodemailer");
// // Secret key for JWT
// const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// // Function to generate a random OTP
// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
// }

 
// // Login Function
// exports.loginCustomer = async (req, res) => {
//   const { contact_no, password } = req.body;

//   db.query("SELECT * FROM tbl_customer_registration WHERE contact_no = ?", [contact_no], async (error, results) => {
//     if (error) {
//       console.error("Error querying database:", error);
//       return res.status(500).json({ message: "Error logging in", error });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     const customer = results[0];
//     const validPassword = await bcrypt.compare(password, customer.password);

//     if (!validPassword) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // Generate OTP
//     const otp = generateOTP();

//     // Create a JWT with OTP and customer info
//     const otpToken = jwt.sign(
//       { otp, cid: customer.cid, customer_name: customer.customer_name },
//       process.env.JWT_SECRET_REFRESH,  // Ensure this is the same secret
//       { expiresIn: "10m" }
//     );
    

//     // Send OTP Email and SMS
//     try {
//       await sendOTPEmail(customer.email, otp); // Email bhejna

//       // Format phone number for SMS (assuming contact_no doesn't include country code)
//       const formattedPhoneNumber = "+91" + contact_no; // Country code add karna
//       await sendSms(formattedPhoneNumber, otp); // Send OTP via SMS

//       res.json({
//         message: "OTP sent to your email and phone.",
//         otpToken,
//       }); 
//     } catch (error) {
//       console.error("Error sending OTP:", error);
//       return res.status(500).json({ message: "Failed to send OTP." });
//     }
//   });
// };

// // OTP Verification Function
// exports.verifyOTP = (req, res) => {
//   const { otp, otpToken } = req.body;

//   if (!otpToken) {
//     return res.status(400).json({ message: "OTP token must be provided." });
//   }

//   try {
//     // Verify the OTP token
//     const decoded = jwt.verify(otpToken, process.env.JWT_SECRET_REFRESH);

//     // Check if the OTP matches
//     if (otp && otp === decoded.otp) {
//       const token = jwt.sign(
//         { cid: decoded.cid, customer_name: decoded.customer_name },
//         process.env.JWT_SECRET_REFRESH,
//         { expiresIn: "1h" }
//       );

//       res.cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         maxAge: 3600000,
//       });

//       res.json({
//         message: "OTP verified, you are now logged in.",
//         customerId: decoded.cid,
//       });
//     } else {
//       return res.status(400).json({ message: "Invalid OTP." });
//     }
//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     if (error instanceof jwt.TokenExpiredError) {
//       return res.status(400).json({ message: "OTP token expired." });
//     }
//     return res.status(400).json({ message: "Invalid OTP token." });
//   }
// };


// exports.createCustomer = async (req, res) => {
//   const { customer_name, age, contact_no, email, gender, status, password } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const cid = Math.floor(1000 + Math.random() * 9000);

//     const query = `
//       INSERT INTO tbl_customer_registration (cid, customer_name, age, contact_no, email, gender, status, password)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     db.query(
//       query,
//       [cid, customer_name, age, contact_no, email, gender, status, hashedPassword],
//       async (error) => {
//         if (error) {
//           return res.status(500).json({ message: "Error creating customer", error });
//         }

//         try {
//           // Send welcome email after successful registration
//           await sendRegistrationEmail(email, customer_name, cid, contact_no);

//           res.json({
//             message: "Customer created and email sent",
//             customerId: cid,
//           });
//         } catch (emailError) {
//           return res.status(500).json({ message: "Customer created, but failed to send email." });
//         }
//       }
//     );
//   } catch (error) {
//     res.status(500).json({ message: "Error creating customer", error });
//   }
// };

 



// exports.getAllCustomers = (req, res) => {
//   db.query("SELECT * FROM tbl_customer_registration", (error, results) => {
//     if (error) {
//       return res.status(500).json({ message: "Error fetching customers", error });
//     }
//     res.json(results);
//   });
// };

// exports.getCustomerById = (req, res) => {
//   const cid = req.params.cid;

//   db.query(
//     "SELECT * FROM tbl_customer_registration WHERE cid = ?",
//     [cid],
//     (error, results) => {
//       if (error) {
//         return res.status(500).json({ message: "Error retrieving customer", error });
//       }

//       if (results.length === 0) {
//         return res.status(404).json({ message: "Customer not found" });
//       }

//       // Assuming results[0] contains customer data
//       const customer = results[0];
//       res.json({ cid: customer.cid, customer_name: customer.name }); // Replace 'name' with actual column name
//     }
//   );
// };

// exports.updateCustomer = (req, res) => {
//   const { cid } = req.params;
//   const updates = req.body;

//   let query = "UPDATE tbl_customer_registration SET ";
//   const values = [];

//   Object.keys(updates).forEach((key, index) => {
//     query += `${key} = ?`;
//     if (index < Object.keys(updates).length - 1) {
//       query += ", ";
//     }
//     values.push(updates[key]);
//   });

//   query += " WHERE cid = ?";
//   values.push(cid);

//   db.query(query, values, (error) => {
//     if (error) {
//       return res.status(500).json({ message: "Error updating customer", error });
//     }
//     res.json({ message: "Customer updated" });
//   });
// };

// exports.logoutCustomer = (req, res) => {
//   res.clearCookie("token"); // 'token' is the name of your cookie
//   res.json({ message: "Logged out" });
// };

// exports.refreshToken = (req, res) => {
//   const { refresh_token } = req.body;

//   if (!refresh_token) {
//     return res.status(400).json({ message: "Refresh token required." });
//   }

//   // Log received refresh token
//   console.log('Received Refresh Token:', refresh_token);

//   try {
//     // Log secret being used for verification
//     console.log('JWT_SECRET_REFRESH:', process.env.JWT_SECRET_REFRESH);  // Ensure this is correct

//     // Verify the refresh token with the secret
//     const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH);

//     // Log the decoded token to check its validity
//     console.log('Decoded Token:', decoded);

//     // After successful verification, create a new token
//     const newToken = jwt.sign(
//       { cid: decoded.cid, customer_name: decoded.customer_name },
//       process.env.JWT_SECRET_REFRESH, // Use the same refresh secret
//       { expiresIn: "7d" }
//     );

//     res.json({ token: newToken });
//   } catch (error) {
//     // Log the error to see what went wrong
//     console.error("Error verifying refresh token:", error);

//     // Return an appropriate error message
//     if (error instanceof jwt.JsonWebTokenError) {
//       return res.status(400).json({ message: "Invalid or expired refresh token" });
//     }

//     return res.status(500).json({ message: "An unexpected error occurred", error });
//   }
// };
