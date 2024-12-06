const express = require('express');
const customerController = require('../../Controllers/CustomerController/Customer');
const verifyToken = require('../../Middlewares/AuthCustomerMiddle'); 
const router = express.Router();

// Protected Route for fetching customer details
router.get('/protected', verifyToken, (req, res) => {
  // CID aur Customer Name verifyToken se aayenge
  console.log("Fetching details for Customer ID:", req.cid);

  res.json({ cid: req.cid, customer_name: req.customer_name });
});
// Refresh token route
// router.post('/refresh-token', customerController.refreshToken);

// Public route for getting customer by ID
router.get('/:cid', customerController.getCustomerById);
router.get('/', customerController.getAllCustomers);


// Other routes for authentication and CRUD
router.post('/', customerController.createCustomer);
router.post('/login', customerController.loginCustomer);
router.post('/verify-otp', customerController.verifyOTP);

router.patch('/:cid', verifyToken, customerController.updateCustomer); // Protect this route with verifyToken
router.post('/logout', customerController.logoutCustomer);

module.exports = router;
