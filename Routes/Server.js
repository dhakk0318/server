const express = require("express");
const router = express.Router();

//Admin
const AdminRoutes = require("./AdminRoutes/adminRoutes");
const AdminUserProfileRoutes = require("./AdminRoutes/AdminUserProfilesRoutes");

//Category/Subcategpry

const catSubcatRoutes = require("./CategorySubcategoryRoutes/catSubcatRoutes");

////Retailer

const retailerProductDescriptionRoutes = require("./RetailProRegRoutes/RetailerProductDescriptionRoutes");
const retailerRegistrationRoutes = require("./RetailProRegRoutes/RetailerRegistrationRoutes");
const retailerBankingRoutes = require("./RetailProRegRoutes/retailerBankingRoutes");

//Products
const productRoutes = require("./ProductRoutes/productRoutes");

//Count
const countRoutes = require("./CountRoutes/CountRoutes");

//AdminOffer
const offerRoutes = require("./AdminOfferRoutes/OfferRoutes");

//Customer
const CustomerRoutes = require("./CustomerRoutes/CustomerRoutes");
const CustomerProfileRoutes = require("./CustomerRoutes/CustomerProfileRoutes");

//Cart
const cartRoutes = require("./CartRoutes/CartRoutes");

//Order
const orderRoutes = require("./OrderRoutes/OrderRoutes");

//Transaction
const transactionRoutes = require("./OrderRoutes/TransactionRoutes");

//Admin
router.use("/", AdminRoutes);
router.use("/profiles", AdminUserProfileRoutes);

//Category/Subcategory
router.use("/", catSubcatRoutes);

//Retailer
router.use("/descriptions", retailerProductDescriptionRoutes);
router.use("/retailers", retailerRegistrationRoutes);
router.use("/retailer_banking", retailerBankingRoutes);

//Products
router.use("/product", productRoutes);

//Count
router.use("/count", countRoutes);

//AdminOffer
router.use("/offers", offerRoutes);

//Customer
router.use("/customers", CustomerRoutes);

router.use("/customer", CustomerProfileRoutes);

//Cart
router.use("/cart", cartRoutes);

//Order
router.use("/order", orderRoutes);

//Transaction
router.use("/transactions", transactionRoutes);

module.exports = router;
