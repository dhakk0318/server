const express = require('express');
const router = express.Router();
const TransactionController = require('../../Controllers/OrderController/TransactionController');  // Correct import

// Routes for payment processing
router.post('/create-order', TransactionController.createRazorpayOrder);
router.post('/verify-payment', TransactionController.verifyPayment);



router.post("/checkout/:id", TransactionController.checkOut);

module.exports = router; 