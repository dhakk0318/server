const db = require('../../Config/db');

const RetailerProductDescription = {
    getAll: (callback) => {
        db.query('SELECT * FROM tbl_retailer_p_description', callback);
    },
    getById: (product_description_id, callback) => {
        db.query('SELECT * FROM tbl_retailer_p_description WHERE product_description_id = ?', [product_description_id], callback);
    },
    create: (descriptionData, callback) => {
        const { pid, product_description_id, product_description, tags, url, review } = descriptionData;
        db.query(
            'INSERT INTO tbl_retailer_p_description (pid, product_description_id, product_description, tags, url, review) VALUES (?, ?, ?, ?, ?, ?)',
            [pid, product_description_id, product_description, tags, url, review],
            callback
        );
    },
    update: (product_description_id, descriptionData, callback) => {
        const { product_description, tags, url, review } = descriptionData;
        db.query(
            'UPDATE tbl_retailer_p_description SET product_description = ?, tags = ?, url = ?, review = ? WHERE product_description_id = ?',
            [product_description, tags, url, review, product_description_id],
            callback
        );
    },
    delete: (product_description_id, callback) => {
        db.query('DELETE FROM tbl_retailer_p_description WHERE product_description_id = ?', [product_description_id], callback);
    }
};

module.exports = RetailerProductDescription;
