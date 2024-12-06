const express = require('express');
const router = express.Router();
const orderController = require('../../Controllers/OrderController/OrderController');

router.post('/create', orderController.createOrder);
router.post('/add-item', orderController.addItemsToOrder);



router.get('/:order_id', orderController.getOrderDetails);


module.exports = router;



// const express = require('express');
// const router = express.Router();
// const orderController = require('../../Controllers/OrderController/OrderController');
// const verifyToken = require('../../Middlewares/AuthCustomerMiddle'); // Add authentication

// // Route to create a new order
// router.post('/create-order', verifyToken, orderController.createOrder);

// // Route to capture the payment after successful transaction
// router.post('/capture-payment', verifyToken, orderController.capturePayment);

// module.exports = router;
