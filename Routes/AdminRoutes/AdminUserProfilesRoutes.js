
const express = require("express");
const router = express.Router();
const adminUserProfileController = require("../../Controllers/AdminController/AdminUserProfileController"); 
const { authenticate } = require("../../Middlewares/AuthMiddleware"); // Middleware for token verification

// All profiles - Admin routes can remain open if needed, or authenticate if necessary
router.get("/", authenticate, adminUserProfileController.getAllProfiles); 

// Fetch profile of logged-in user based on token
router.get("/user", authenticate, adminUserProfileController.getProfileByUserIdFromToken); // This route is protected by authentication

// Fetch profile by specific user_id (Admin purpose)
router.get("/user/:user_id",  adminUserProfileController.getProfileByUserId);

// Fetch profile by username
router.get("/username/:username", authenticate, adminUserProfileController.getProfileByUsername); 

// Fetch profile by profile_id
router.get("/:profile_id", authenticate, adminUserProfileController.getProfileById); 

// Create a new profile
router.post("/",  adminUserProfileController.createProfile);

// Update profile
router.put("/:profile_id",  adminUserProfileController.updateProfile);

// Delete profile
router.delete("/:profile_id",  adminUserProfileController.deleteProfile);

module.exports = router;
