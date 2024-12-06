const nodemailer = require("nodemailer");

// Function to send OTP email
const sendOTPEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: to,
    subject: "Your OTP Code for TNPEcom Login",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
        <div style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #4CAF50; text-align: center;">Your OTP Code</h2>
          <p style="font-size: 16px; color: #333; text-align: center;">Please use the OTP below to complete your login process for <strong>TNPEcom</strong>.</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; font-size: 24px; color: #333; padding: 10px 20px; background-color: #e0e0e0; border-radius: 5px; letter-spacing: 4px; font-weight: bold;">${otp}</span>
          </div>
          <p style="font-size: 14px; text-align: center; color: #555;">This OTP is valid for the next 10 minutes. Please do not share this OTP with anyone.</p>
          <hr style="border: 0; height: 1px; background-color: #e0e0e0; margin: 20px 0;">
          <p style="font-size: 12px; color: #888; text-align: center;">If you did not request this OTP, please contact our support team.</p>
        </div>
      </div>
    `,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        reject(error);
      }
      console.log("OTP email sent successfully:", info.response);
      resolve(info.response);
    });
  });
};

const sendRegistrationEmail = async (to, customer_name, cid, contact_no) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: to,
    subject: "Welcome to TNPEcom!",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
        <div style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #4CAF50; text-align: center;">Welcome to TNPEcom, ${customer_name}!</h2>
          <p style="font-size: 16px; color: #333; text-align: center;">Thank you for registering with us. Your account has been created successfully!</p>
          
          <hr style="border: 1px solid #4CAF50; margin: 20px 0;">
          
          <p style="font-size: 16px; color: #333;"><strong>Your Customer ID:</strong> <span style="color: #4CAF50;">${cid}</span></p>
          <p style="font-size: 16px; color: #333;"><strong>Your Contact Number:</strong> ${contact_no}</p>
          <p style="font-size: 16px; color: #333;"><strong>Your Email:</strong> ${to}</p>
          
          <p style="font-size: 14px; color: #555;">For security reasons, we do not store your password in plain text. Please use the password you created during registration to log in to your account.</p>
          
          <br>
          <p style="font-size: 16px; color: #333; text-align: center;">We are thrilled to have you with us. Welcome aboard!</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://www.tnpecom.com/login" style="font-size: 16px; color: white; background-color: #4CAF50; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Your Account</a>
          </div>
          
          <hr style="border: 1px solid #e0e0e0; margin: 40px 0;">
          
          <p style="font-size: 14px; color: #999; text-align: center;">
            Best Regards, <br>
            <strong style="color: #4CAF50;">TNPEcom Team</strong> <br>
            <a href="https://www.tnpecom.com" style="color: #4CAF50; text-decoration: none;">www.tnpecom.com</a>
          </p>
          
          <p style="font-size: 12px; color: #888; text-align: center;">
            If you did not register this account, please contact our support immediately.
          </p>
        </div>
      </div>
    `,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending registration email:", error);
        reject(error);
      }
      console.log("Registration email sent successfully:", info.response);
      resolve(info.response);
    });
  });
};

module.exports = { sendOTPEmail, sendRegistrationEmail };
