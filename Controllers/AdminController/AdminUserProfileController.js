

// const createError = require('http-errors');
// const AdminUserProfile = require('../../Model/Admin/AdminUserProfile');

// // Get all profiles
// exports.getAllProfiles = (req, res, next) => {
//     AdminUserProfile.getAll((err, results) => {
//         if (err) return next(createError(500, err.message));
//         res.json(results);
//     });
// };

// // Get profile by ID
// exports.getProfileById = (req, res, next) => {
//     AdminUserProfile.getById(req.params.profile_id, (err, result) => {
//         if (err) return next(createError(500, err.message));
//         if (!result) return next(createError(404, 'Profile not found'));
//         res.json(result);
//     });
// };

// // Create a new profile
// exports.createProfile = (req, res, next) => {
//     AdminUserProfile.create(req.body, (err, result) => {
//         if (err) return next(createError(500, err.message));
//         res.status(201).json({ message: 'Profile created successfully', profileId: result.insertId });
//     });
// };

// // Update an existing profile
// exports.updateProfile = (req, res, next) => {
//     AdminUserProfile.update(req.params.profile_id, req.body, (err, result) => {
//         if (err) return next(createError(500, err.message));
//         if (result.affectedRows === 0) return next(createError(404, 'Profile not found'));
//         res.json({ message: 'Profile updated successfully' });
//     });
// };

// // Delete a profile
// exports.deleteProfile = (req, res, next) => {
//     AdminUserProfile.delete(req.params.profile_id, (err, result) => {
//         if (err) return next(createError(500, err.message));
//         if (result.affectedRows === 0) return next(createError(404, 'Profile not found'));
//         res.json({ message: 'Profile deleted successfully' });
//     });
// };

// // Fetch profile by user_id
// exports.getProfileByUserId = (req, res, next) => {
//     const userId = req.params.user_id; // Use user_id from the request parameters
//     console.log("Fetching profile for user_id:", userId); // Debugging line
//     AdminUserProfile.getByUserId(userId, (err, result) => {
//         if (err) {
//             console.error("Database Error:", err); // Log database error
//             return next(createError(500, err.message));
//         }
//         console.log("Database Result:", result); // Log database result
//         if (!result || result.length === 0) {
//             console.warn("No profile found for user_id:", userId); // Log no profile found
//             return next(createError(404, 'Profile not found'));
//         }
//         res.json(result);
//     });
// };

// exports.getProfileByUsername = (req, res, next) => {
//     const username = req.params.username; // Get the username from params
//     console.log("Fetching profile for username:", username); // Debugging line
//     AdminUserProfile.getByUsername(username, (err, result) => {
//         if (err) {
//             console.error("Database Error:", err); // Log database error
//             return next(createError(500, err.message));
//         }
//         console.log("Database Result:", result); // Log database result
//         if (!result || result.length === 0) {
//             console.warn("No profile found for username:", username); // Log no profile found
//             return next(createError(404, 'Profile not found'));
//         }
//         res.json(result);
//     });
// };


// exports.getProfileByUserIdFromToken = (req, res, next) => {
//     const userId = req.user_id; // Extracted from token by authenticate middleware
//     console.log("Fetching profile for user_id:", userId);

//     AdminUserProfile.getByUserId(userId, (err, result) => {
//         if (err) {
//             console.error("Database Error:", err);
//             return next(createError(500, err.message));
//         }
//         if (!result || result.length === 0) {
//             console.warn("No profile found for user_id:", userId);
//             return next(createError(404, 'Profile not found'));
//         }
//         res.json(result);
//     });
// };


const createError = require('http-errors');
const AdminUserProfile = require('../../Model/Admin/AdminUserProfile');

// Get all profiles
exports.getAllProfiles = (req, res, next) => {
    AdminUserProfile.getAll((err, results) => {
        if (err) return next(createError(500, err.message));
        res.json({ profiles: results });
    });
};

// Get profile by ID
exports.getProfileById = (req, res, next) => {
    AdminUserProfile.getById(req.params.profile_id, (err, result) => {
        if (err) return next(createError(500, err.message));
        if (!result) return next(createError(404, 'Profile not found'));
        res.json({ profile: result });
    });
};

// Create a new profile
exports.createProfile = (req, res, next) => {
    AdminUserProfile.create(req.body, (err, result) => {
        if (err) return next(createError(500, err.message));
        res.status(201).json({ message: 'Profile created successfully', profileId: result.insertId });
    });
};

// Update an existing profile
exports.updateProfile = (req, res, next) => {
    AdminUserProfile.update(req.params.profile_id, req.body, (err, result) => {
        if (err) return next(createError(500, err.message));
        if (result.affectedRows === 0) return next(createError(404, 'Profile not found'));
        res.json({ message: 'Profile updated successfully' });
    });
};

// Delete a profile
exports.deleteProfile = (req, res, next) => {
    AdminUserProfile.delete(req.params.profile_id, (err, result) => {
        if (err) return next(createError(500, err.message));
        if (result.affectedRows === 0) return next(createError(404, 'Profile not found'));
        res.json({ message: 'Profile deleted successfully' });
    });
};

// Fetch profile by user_id from request params
exports.getProfileByUserId = (req, res, next) => {
    const userId = req.params.user_id;
    console.log("Fetching profile for user_id:", userId);
    AdminUserProfile.getByUserId(userId, (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return next(createError(500, err.message));
        }
        if (!result || result.length === 0) {
            console.warn("No profile found for user_id:", userId);
            return next(createError(404, 'Profile not found'));
        }
        res.json({ profile: result });
    });
};

// Fetch profile by username
exports.getProfileByUsername = (req, res, next) => {
    const username = req.params.username;
    console.log("Fetching profile for username:", username);
    AdminUserProfile.getByUsername(username, (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return next(createError(500, err.message));
        }
        if (!result || result.length === 0) {
            console.warn("No profile found for username:", username);
            return next(createError(404, 'Profile not found'));
        }
        res.json({ profile: result });
    });
};

exports.getProfileByUserIdFromToken = (req, res, next) => {
    const userId = req.user.userId; // Extracted from token by authenticate middleware
    console.log("Fetching profile for user_id:", userId); // Log user_id

    AdminUserProfile.getByUserId(userId, (err, result) => {
        if (err) {
            console.error("Database Error:", err); // Log database error
            return next(createError(500, err.message));
        }
        if (!result || result.length === 0) {
            console.warn("No profile found for user_id:", userId); // Log no profile found
            return next(createError(404, 'Profile not found'));
        }
        res.json(result);
    });
};

