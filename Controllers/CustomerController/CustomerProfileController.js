const db = require('../../Config/db'); // Database connection
const cloudinary = require('../../utils/cloudinaryConfig'); // Cloudinary setup

// Add Profile
exports.addProfile = async (req, res) => {
  try {
    const { cid, address, alternate_address, alternate_contact_no } = req.body;
    let profileImageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      profileImageUrl = result.secure_url;
    }

    await db.query(
      `INSERT INTO tbl_customer_profile (cid, address, alternate_address, alternate_contact_no, profile_image)
       VALUES (?, ?, ?, ?, ?)`,
      [cid, address, alternate_address, alternate_contact_no, profileImageUrl]
    );

    res.status(201).json({ message: 'Customer profile created successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating profile' });
  }
};

// Get Profile
exports.getProfile = (req, res) => {
  const { cid } = req.params;

  // Query to get profile based on cid
  db.query(
    `SELECT * FROM tbl_customer_profile WHERE cid = ?`,
    [cid],
    (error, results) => {
      if (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ error: 'Error retrieving profile' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      const profile = results[0]; // Get the first profile row
      res.status(200).json(profile);
    }
  );
};




// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { cid } = req.params;
    const { address, alternate_address, alternate_contact_no } = req.body;
    let profileImageUrl = null;

    // Upload new image if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      profileImageUrl = result.secure_url;
    }

    // Update query, conditionally setting profile_image only if profileImageUrl is defined
    const query = `
      UPDATE tbl_customer_profile
      SET address = ?, alternate_address = ?, alternate_contact_no = ?
      ${profileImageUrl ? ', profile_image = ?' : ''}
      WHERE cid = ?`;

    const params = [address, alternate_address, alternate_contact_no];
    if (profileImageUrl) params.push(profileImageUrl);
    params.push(cid);

    await db.query(query, params);

    res.status(200).json({ message: 'Customer profile updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile' });
  }
};


exports.deleteProfile = (req, res) => {
  const { cid } = req.params;
  const profileImageUrl = req.body.profile_image;

  db.query(
    `DELETE FROM tbl_customer_profile WHERE cid = ? AND profile_image = ?`,
    [cid, profileImageUrl],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error deleting profile' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      res.status(200).json({ message: 'Profile deleted successfully' });
    }
  );
};


// Get All Profiles
exports.getAllProfiles = async (req, res) => {
  try {
    // Fetch all profiles from the database
    const query = 'SELECT * FROM tbl_customer_profile';
    db.query(query, (error, results) => {
      if (error) { 
        console.error(error);
        return res.status(500).json({ error: 'Error retrieving profiles' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'No profiles found' });
      }
      res.status(200).json(results); // Send all profiles
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Error retrieving profiles' });
  }
};
