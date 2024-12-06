
const db = require('../../Config/db');

const AdminRole = {
    create: (roleData, callback) => {
        db.query('INSERT INTO tbl_admin_roles (role_id, role_name) VALUES (?, ?)', 
        [roleData.role_id, roleData.role_name], callback);
    },

    getAll: (callback) => {
        db.query('SELECT * FROM tbl_admin_roles', callback);
    },

    getById: (role_id, callback) => {
        db.query('SELECT * FROM tbl_admin_roles WHERE role_id = ?', [role_id], callback);
    },

    update: (role_id, roleData, callback) => {
        db.query('UPDATE tbl_admin_roles SET role_name = ? WHERE role_id = ?', 
        [roleData.role_name, role_id], callback);
    },

    delete: (role_id, callback) => {
        db.query('DELETE FROM tbl_admin_roles WHERE role_id = ?', [role_id], callback);
    }
};

module.exports = AdminRole;
