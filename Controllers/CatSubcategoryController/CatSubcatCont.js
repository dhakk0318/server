const categoryModel = require('../../Model/Category&Subcategory/categoryModel');
const subCategoryModel = require('../../Model/Category&Subcategory/subCategoryModel');
const { validateCategory, validateSubCategory } = require('../Validation');
const createError = require('http-errors');

// Category Functions
const createCategory = (req, res, next) => {
    const { error } = validateCategory(req.body);
    if (error) return next(createError(400, error.details[0].message));

    const { catid, catname, startdate } = req.body;
    categoryModel.createCategory(catid, catname, startdate, (err, results) => {
        if (err) return next(createError(500, err.message));
        res.status(201).json({ message: 'Category created successfully', results });
    });
};

const getAllCategories = (req, res, next) => {
    categoryModel.getAllCategories((err, results) => {
        if (err) return next(createError(500, err.message));
        res.status(200).json(results);
    });
};

const getCategoryById = (req, res, next) => {
    const { catid } = req.params;
    categoryModel.getCategoryById(catid, (err, results) => {
        if (err) return next(createError(500, err.message));
        if (results.length === 0) return next(createError(404, 'Category not found'));
        res.status(200).json(results[0]);
    });
};

const updateCategory = (req, res, next) => {
    const { catid } = req.params;
    const { catname, startdate } = req.body;
    categoryModel.updateCategory(catid, catname, startdate, (err, results) => {
        if (err) return next(createError(500, err.message));
        if (results.affectedRows === 0) return next(createError(404, 'Category not found'));
        res.status(200).json({ message: 'Category updated successfully' });
    });
};

const deleteCategory = (req, res, next) => {
    const { catid } = req.params;
    categoryModel.deleteCategory(catid, (err, results) => {
        if (err) return next(createError(500, err.message));
        if (results.affectedRows === 0) return next(createError(404, 'Category not found'));
        res.status(200).json({ message: 'Category deleted successfully' });
    });
};

// Subcategory Functions
const createSubCategory = (req, res, next) => {
    const { error } = validateSubCategory(req.body);
    if (error) return next(createError(400, error.details[0].message));

    const { catid, sub_catid, subcat_name, addedon } = req.body;
    subCategoryModel.createSubCategory(catid, sub_catid, subcat_name, addedon, (err, results) => {
        if (err) return next(createError(500, err.message));
        res.status(201).json({ message: 'Subcategory created successfully', results });
    });
};

const getAllSubCategories = (req, res, next) => {
    subCategoryModel.getAllSubCategories((err, results) => {
        if (err) return next(createError(500, err.message));
        res.status(200).json(results);
    });
};

const getSubCategoryById = (req, res, next) => {
    const { sub_catid } = req.params;
    subCategoryModel.getSubCategoryById(sub_catid, (err, results) => {
        if (err) return next(createError(500, err.message));
        if (results.length === 0) return next(createError(404, 'Subcategory not found'));
        res.status(200).json(results[0]);
    });
};

const updateSubCategory = (req, res, next) => {
    const { sub_catid } = req.params;
    const { catid, subcat_name, addedon } = req.body;
    subCategoryModel.updateSubCategory(sub_catid, catid, subcat_name, addedon, (err, results) => {
        if (err) return next(createError(500, err.message));
        if (results.affectedRows === 0) return next(createError(404, 'Subcategory not found'));
        res.status(200).json({ message: 'Subcategory updated successfully' });
    });
};

const deleteSubCategory = (req, res, next) => {
    const { sub_catid } = req.params;
    subCategoryModel.deleteSubCategory(sub_catid, (err, results) => {
        if (err) return next(createError(500, err.message));
        if (results.affectedRows === 0) return next(createError(404, 'Subcategory not found'));
        res.status(200).json({ message: 'Subcategory deleted successfully' });
    });
};

const getSubCategoriesByCategoryId = (req, res, next) => {
    const catid = req.params.catid;
    subCategoryModel.getSubCategoriesByCategoryId(catid, (err, results) => {
        if (err) return next(createError(500, err.message));
        if (results.length === 0) return next(createError(404, 'Subcategories not found'));
        res.status(200).json(results);
    });
};

const getSubCategoriesByCategoryName = (req, res, next) => {
    const { categoryName } = req.params;
    subCategoryModel.getSubCategoriesByCategoryName(categoryName, (err, results) => {
        if (err) return next(createError(500, err.message));
        if (results.length === 0) return next(createError(404, 'No subcategories found for this category name'));
        res.status(200).json(results);
    });
};

module.exports = {
    // Category Functions
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,

    // Subcategory Functions
    createSubCategory,
    getAllSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory,
    getSubCategoriesByCategoryId,
    getSubCategoriesByCategoryName
};
