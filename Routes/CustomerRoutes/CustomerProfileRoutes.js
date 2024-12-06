const express = require('express');
const multer = require('../../utils/multerConfig'); // Multer setup for handling images
const { addProfile, getProfile, updateProfile,getAllProfiles } = require('../../Controllers/CustomerController/CustomerProfileController');

const router = express.Router();


// POST - Add profile with optional image upload
router.post('/profile', multer.single('profile_image'), addProfile);

router.get('/profiles', getAllProfiles);

// GET - Fetch profile by customer_ida
router.get('/profile/:cid', getProfile);

// PUT - Update profile with new image
router.put('/profile/:cid', multer.single('profile_image'), updateProfile);

module.exports = router;
