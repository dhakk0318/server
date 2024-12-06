

// const mysql = require('mysql');
// const db = require('../../Config/db');

// const createSubCategory = (catid, sub_catid, subcat_name, addedon, callback) => {
//     const query = 'INSERT INTO tbl_admin_p_sub_category (catid, sub_catid, subcat_name, addedon) VALUES (?, ?, ?, ?)';
//     db.query(query, [catid, sub_catid, subcat_name, addedon], (err, results) => {
//         callback(err, results);
//     });
// };

// const getAllSubCategories = (callback) => {
//     const query = 'SELECT * FROM tbl_admin_p_sub_category';
//     db.query(query, (err, results) => {
//         callback(err, results);
//     });
// };

// const getSubCategoryById = (sub_catid, callback) => {
//     const query = 'SELECT * FROM tbl_admin_p_sub_category WHERE sub_catid = ?';
//     db.query(query, [sub_catid], (err, results) => {
//         callback(err, results);
//     });
// };

// const updateSubCategory = (sub_catid, catid, subcat_name, addedon, callback) => {
//     const query = 'UPDATE tbl_admin_p_sub_category SET catid = ?, subcat_name = ?, addedon = ? WHERE sub_catid = ?';
//     db.query(query, [catid, subcat_name, addedon, sub_catid], (err, results) => {
//         callback(err, results);
//     });
// };

// const deleteSubCategory = (sub_catid, callback) => {
//     const query = 'DELETE FROM tbl_admin_p_sub_category WHERE sub_catid = ?';
//     db.query(query, [sub_catid], (err, results) => {
//         callback(err, results);
//     });
// };

// const getSubCategoriesByCategoryId = (catid, callback) => {
//     const query = 'SELECT * FROM tbl_admin_p_sub_category WHERE catid = ?';
//     db.query(query, [catid], (err, results) => {
//         callback(err, results);
//     });
// };
// const getSubCategoriesByCategoryName = (categoryName, callback) => {
//     const query = `
//         SELECT sc.* 
//         FROM tbl_admin_p_sub_category sc
//         JOIN tbl_admin_p_category c ON sc.catid = c.catid
//         WHERE c.catname LIKE ?`;
//     db.query(query, [`%${categoryName}%`], (err, results) => {
//         callback(err, results);
//     });
// };


// module.exports = {
//     createSubCategory,
//     getAllSubCategories,
//     getSubCategoryById,
//     updateSubCategory,
//     deleteSubCategory,
//     getSubCategoriesByCategoryId,
//     getSubCategoriesByCategoryName
// };


const mysql = require('mysql');
const db = require('../../Config/db');

// Create a subcategory
const createSubCategory = (catid, sub_catid, subcat_name, addedon, callback) => {
    const query = 'INSERT INTO tbl_admin_p_sub_category (catid, sub_catid, subcat_name, addedon) VALUES (?, ?, ?, ?)';
    db.query(query, [catid, sub_catid, subcat_name, addedon], (err, results) => {
        callback(err, results);
    });
};

// Get all subcategories
const getAllSubCategories = (callback) => {
    const query = 'SELECT * FROM tbl_admin_p_sub_category';
    db.query(query, (err, results) => {
        callback(err, results);
    });
};

// Get a subcategory by ID
const getSubCategoryById = (sub_catid, callback) => {
    const query = 'SELECT * FROM tbl_admin_p_sub_category WHERE sub_catid = ?';
    db.query(query, [sub_catid], (err, results) => {
        callback(err, results);
    });
};

// Update a subcategory
const updateSubCategory = (sub_catid, catid, subcat_name, addedon, callback) => {
    const query = 'UPDATE tbl_admin_p_sub_category SET catid = ?, subcat_name = ?, addedon = ? WHERE sub_catid = ?';
    db.query(query, [catid, subcat_name, addedon, sub_catid], (err, results) => {
        callback(err, results);
    });
};

// Delete a subcategory
const deleteSubCategory = (sub_catid, callback) => {
    const query = 'DELETE FROM tbl_admin_p_sub_category WHERE sub_catid = ?';
    db.query(query, [sub_catid], (err, results) => {
        callback(err, results);
    });
};

// Get subcategories by category ID
const getSubCategoriesByCategoryId = (catid, callback) => {
    const query = 'SELECT * FROM tbl_admin_p_sub_category WHERE catid = ?';
    db.query(query, [catid], (err, results) => {
        callback(err, results);
    });
};

// Get subcategories by category name
const getSubCategoriesByCategoryName = (categoryName, callback) => {
    const query = `
        SELECT sc.* 
        FROM tbl_admin_p_sub_category sc
        JOIN tbl_admin_p_category c ON sc.catid = c.catid
        WHERE c.catname LIKE ?`;
    db.query(query, [`%${categoryName}%`], (err, results) => {
        callback(err, results);
    });
};

module.exports = {
    createSubCategory,
    getAllSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory,
    getSubCategoriesByCategoryId,
    getSubCategoriesByCategoryName
};
