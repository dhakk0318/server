const express = require("express");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createSubCategory,
  getAllSubCategories,
  updateSubCategory,
  deleteSubCategory,
  getSubCategoriesByCategoryId,
  getSubCategoriesByCategoryName,
} = require("../../Controllers/CatSubcategoryController/CatSubcatCont");

const { authenticate, authorize } = require('../../Middlewares/AuthMiddleware'); // Adjust path as necessary

const router = express.Router();

// Category Routes
router.post("/categories", authenticate, authorize(['admin']), createCategory); 
router.get("/categories",  getAllCategories); 
router.get("/categories/:catid", authenticate, getCategoryById); 
router.put("/categories/:catid", authenticate, authorize(['admin']), updateCategory); 
router.delete("/categories/:catid", authenticate, authorize(['admin']), deleteCategory); 

// Subcategory Routes
router.post("/subcategories", authenticate, authorize(['admin']), createSubCategory); 
router.get("/subcategories", getAllSubCategories); 
router.get("/subcategories/category/:catid", getSubCategoriesByCategoryId); 
router.get("/subcategories/search/:categoryName",  getSubCategoriesByCategoryName); 
router.put("/subcategories/:sub_catid", authenticate, authorize(['admin']), updateSubCategory); 
router.delete("/subcategories/:sub_catid", authenticate, authorize(['admin']), deleteSubCategory); 

module.exports = router;

