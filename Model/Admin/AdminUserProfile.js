
const db = require('../../Config/db');

const AdminUserProfile = {
    getAll: (callback) => {
        db.query('SELECT * FROM tbl_admin_user_profile', callback);
    },
    
    getById: (profile_id, callback) => { 
        db.query('SELECT * FROM tbl_admin_user_profile WHERE profile_id = ?', [profile_id], callback);
    },

    // create: (profileData, callback) => {
    //     db.query(
    //         'INSERT INTO tbl_admin_user_profile (user_id, first_name, last_name, email, mobile, address, city, state, country, pin_code, date_of_birth, gender, profile_pic_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    //         [
    //             profileData.user_id,
    //             profileData.first_name,
    //             profileData.last_name,
    //             profileData.email,
    //             profileData.mobile,
    //             profileData.address,
    //             profileData.city,
    //             profileData.state,
    //             profileData.country,
    //             profileData.pin_code,
    //             profileData.date_of_birth,
    //             profileData.gender,
    //             profileData.profile_pic_url
    //         ], 
    //         callback
    //     );
    // },
    
    create: (profileData, callback) => {
        db.query(
            'INSERT INTO tbl_admin_user_profile (user_id, first_name, last_name, email, mobile, address, city, state, country, pin_code, date_of_birth, gender, profile_pic_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [
                profileData.user_id,
                profileData.first_name,
                profileData.last_name,
                profileData.email,
                profileData.mobile,
                profileData.address,
                profileData.city,
                profileData.state,
                profileData.country,
                profileData.pin_code,
                profileData.date_of_birth,
                profileData.gender,
                profileData.profile_pic_url
            ], 
            callback
        );
    },
    

    update: (profile_id, profileData, callback) => {
        db.query(
            'UPDATE tbl_admin_user_profile SET first_name = ?, last_name = ?, email = ?, mobile = ?, address = ?, city = ?, state = ?, country = ?, pin_code = ?, date_of_birth = ?, gender = ?, profile_pic_url = ? WHERE profile_id = ?', 
            [
                profileData.first_name,
                profileData.last_name,
                profileData.email,
                profileData.mobile,
                profileData.address,
                profileData.city,
                profileData.state,
                profileData.country,
                profileData.pin_code,
                profileData.date_of_birth,
                profileData.gender,
                profileData.profile_pic_url,
                profile_id
            ], 
            callback
        );
    },
    
    delete: (profile_id, callback) => {
        db.query('DELETE FROM tbl_admin_user_profile WHERE profile_id = ?', [profile_id], callback);
    },

    getByUsername: (username, callback) => {
        const query = 'SELECT * FROM tbl_admin_user_profile WHERE user_id = ?'; // Yahan user_id se search karein
        db.query(query, [username], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    
    

    getByUserId: (user_id, callback) => {
        const query = 'SELECT * FROM tbl_admin_user_profile WHERE user_id = ?';
        db.query(query, [user_id], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    getByEmail: (email, callback) => {
        const query = 'SELECT * FROM tbl_admin_user_profile WHERE email = ?';
        db.query(query, [email], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    }
};

module.exports = AdminUserProfile;
