 


const mysql = require('mysql');
const db = require('../../Config/db');

// Create a category
const createCategory = (catid, catname, startdate, callback) => {
    const query = 'INSERT INTO tbl_admin_p_category (catid, catname, startdate) VALUES (?, ?, ?)';
    db.query(query, [catid, catname, startdate], (err, results) => {
        callback(err, results);
    });
};

// Get all categories
const getAllCategories = (callback) => {
    const query = 'SELECT * FROM tbl_admin_p_category';
    db.query(query, (err, results) => {
        callback(err, results);
    });
};

// Get a category by ID
const getCategoryById = (catid, callback) => {
    const query = 'SELECT * FROM tbl_admin_p_category WHERE catid = ?';
    db.query(query, [catid], (err, results) => {
        callback(err, results);
    });
};

// Update a category
const updateCategory = (catid, catname, startdate, callback) => {
    const query = 'UPDATE tbl_admin_p_category SET catname = ?, startdate = ? WHERE catid = ?';
    db.query(query, [catname, startdate, catid], (err, results) => {
        callback(err, results);
    });
};

// Delete a category
const deleteCategory = (catid, callback) => {
    const query = 'DELETE FROM tbl_admin_p_category WHERE catid = ?';
    db.query(query, [catid], (err, results) => {
        callback(err, results);
    });
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
