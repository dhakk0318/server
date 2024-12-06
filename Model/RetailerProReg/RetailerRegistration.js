const db = require('../../Config/db');

const RetailerRegistration = {
    getAll: (callback) => {
        db.query('SELECT * FROM tbl_retailer_reg', callback);
    },
    
    getById: (retid, callback) => {
        db.query('SELECT * FROM tbl_retailer_reg WHERE retid = ?', [retid], callback);
    },
    
    create: (retailerData, callback) => {
        const { retid, retregno, retname, contactno, alternatecontact, address, state, city, pincode, email, url, pan, password, profile_pic } = retailerData;
        db.query(
            'INSERT INTO tbl_retailer_reg (retid, retregno, retname, contactno, alternatecontact, address, state, city, pincode, email, url, pan, password, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [retid, retregno, retname, contactno, alternatecontact, address, state, city, pincode, email, url, pan, password, profile_pic],
            callback
        );
    },
    
    getByName: (retname, callback) => {
        db.query('SELECT * FROM tbl_retailer_reg WHERE retname = ?', [retname], callback);
    },
    update: (retid, retailerData, callback) => {
        const fields = [];
        const values = [];

        if (retailerData.retname) {
            fields.push('retname = ?');
            values.push(retailerData.retname);
        }
        if (retailerData.contactno) {
            fields.push('contactno = ?');
            values.push(retailerData.contactno);
        }
        if (retailerData.alternatecontact) {
            fields.push('alternatecontact = ?');
            values.push(retailerData.alternatecontact);
        }
        if (retailerData.address) {
            fields.push('address = ?');
            values.push(retailerData.address);
        }
        if (retailerData.state) {
            fields.push('state = ?');
            values.push(retailerData.state);
        }
        if (retailerData.city) {
            fields.push('city = ?');
            values.push(retailerData.city);
        }
        if (retailerData.pincode) {
            fields.push('pincode = ?');
            values.push(retailerData.pincode);
        }
        if (retailerData.email) {
            fields.push('email = ?');
            values.push(retailerData.email);
        }
        if (retailerData.url) {
            fields.push('url = ?');
            values.push(retailerData.url);
        }
        if (retailerData.pan) {
            fields.push('pan = ?');
            values.push(retailerData.pan);
        }
        if (retailerData.password) {
            fields.push('password = ?');
            values.push(retailerData.password); // Ensure you hash the password before storing it
        }
        if (retailerData.status) {
            fields.push('status = ?');
            values.push(retailerData.status);
        }
        if (retailerData.profile_pic) {
            fields.push('profile_pic = ?');
            values.push(retailerData.profile_pic);
        }

        if (fields.length === 0) {
            return callback(new Error('No fields to update'));
        }

        values.push(retid); // Add retailer ID for the WHERE clause

        const query = `UPDATE tbl_retailer_reg SET ${fields.join(', ')} WHERE retid = ?`;
        db.query(query, values, callback);
    },
    
    delete: (retid, callback) => {
        db.query('DELETE FROM tbl_retailer_reg WHERE retid = ?', [retid], callback);
    }
};
module.exports = RetailerRegistration;
