const express = require("express");
const router = express.Router();
const adminController = require("../../Controllers/CountController/CountController");
const verifyToken = require("../../Middlewares/AuthCustomerMiddle");

// Route to get counts
router.get("/admin-users", adminController.getAdminUserCount);
router.get("/categories", adminController.getCategoryCount);
router.get("/subcategories", adminController.getSubCategoryCount);
router.get("/retailer-products", adminController.getRetailerProductCount);
router.get("/retailers", adminController.getRetailerCount);
// routes file
router.get('/cart', verifyToken, adminController.getCartItemCount);

module.exports = router;
