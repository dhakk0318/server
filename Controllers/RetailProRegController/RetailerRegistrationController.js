const RetailerRegistration = require('../../Model/RetailerProReg/RetailerRegistration');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getAllRetailers = (req, res) => {
    RetailerRegistration.getAll((err, results) => {
        console.log('Results from database:', results); // Log the results to see what is being returned
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};


exports.getRetailerById = (req, res) => {
    RetailerRegistration.getById(req.params.retid, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

exports.createRetailer = (req, res) => {
    const retailerData = req.body;
    const saltRounds = 10;
    
    // Hash the password before saving it
    bcrypt.hash(retailerData.password, saltRounds, (err, hashedPassword) => {
        if (err) return res.status(500).json(err);

        // Store the hashed password
        retailerData.password = hashedPassword;

        RetailerRegistration.create(retailerData, (err, result) => {
            if (err) return res.status(500).json(err);
            res.status(201).json({ message: 'Retailer created successfully', retailerId: result.insertId });
        });
    });
};

exports.updateRetailerDetails = (req, res) => {
    const { retid } = req.params;
    const updateData = req.body;

    if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'No update data provided' });
    }

    // If the password is being updated, hash it
    if (updateData.password) {
        const saltRounds = 10;
        updateData.password = bcrypt.hashSync(updateData.password, saltRounds);
    }

    RetailerRegistration.update(retid, updateData, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json({ message: 'Retailer details updated successfully' });
    });
};

exports.deleteRetailer = (req, res) => {
    RetailerRegistration.delete(req.params.retid, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Retailer deleted successfully' });
    });
};




 
 
exports.loginRetailer = (req, res) => {
    const { retname, password } = req.body;

    RetailerRegistration.getByName(retname, (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const retailer = results[0];

        bcrypt.compare(password, retailer.password, (err, isMatch) => {
            if (err) return res.status(500).json(err);
            if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

            try {
                const accessToken = jwt.sign(
                    { retid: retailer.retid, retname: retailer.retname },
                    process.env.JWT_SECRET_KEY || 'jwt-secret-key',
                    { expiresIn: '1h' }
                );
                
                const refreshToken = jwt.sign(
                    { retid: retailer.retid, retname: retailer.retname },
                    process.env.JWT_REFRESH_SECRET_KEY || 'jwt-refresh-secret-key',
                    { expiresIn: '7d' }
                );

                res.cookie('access_token', accessToken, { httpOnly: true, sameSite: 'Lax', secure: process.env.NODE_ENV === 'production', path: '/' });
                res.cookie('refresh_token', refreshToken, { httpOnly: true, sameSite: 'Lax', secure: process.env.NODE_ENV === 'production', path: '/' });
                res.cookie('retname', retailer.retname, { httpOnly: true, sameSite: 'Lax', secure: process.env.NODE_ENV === 'production', path: '/' });

                console.log('Login Successful. Retailer Name:', retailer.retname); // Debugging log

                res.json({ message: 'Login successful', retailerId: retailer.retid });
            } catch (err) {
                return res.status(500).json({ message: 'Error generating token', error: err });
            }
        });
    });
};


exports.logoutRetailer = (req, res) => {
    res.clearCookie('access_token'); // Clear the access token cookie
    res.clearCookie('refresh_token'); // Clear the refresh token cookie if applicable
    return res.status(200).json({ message: 'Logged out successfully' });
};

  
exports.getRetailerProfile = (req, res) => {
    const { retid } = req.user; // Retrieve retailer ID from the decoded token
    
    RetailerRegistration.getById(retid, (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]); // Return retailer details like retname, email, etc.
    });
  };
  
  
  exports.updatePassword = (req, res) => {
    const { retid } = req.user;
    const { oldPassword, newPassword } = req.body;
  
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old and new passwords are required' });
    }
  
    RetailerRegistration.getById(retid, (err, result) => {
      if (err) return res.status(500).json(err);
      const retailer = result[0];
  
      // Check if the old password matches
      bcrypt.compare(oldPassword, retailer.password, (err, isMatch) => {
        if (err) return res.status(500).json(err);
        if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });
  
        // Hash the new password and update it
        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
          if (err) return res.status(500).json(err);
  
          RetailerRegistration.update(retid, { password: hashedPassword }, (err, updateResult) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Password updated successfully' });
          });
        });
      });
    });
  };
  