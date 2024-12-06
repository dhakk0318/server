const express = require('express');
const router = express.Router();
const cartController = require('../../Controllers/CartController/CartController');
const verifyToken = require('../../Middlewares/AuthCustomerMiddle');
router.get("/card/items/",verifyToken, cartController.getAllItemINCart)
// router.post('/create', cartController.createCart);
router.post('/add-item',verifyToken, cartController.addItemToCart);


router.get('/:cart_id',verifyToken, cartController.getCartItems);
module.exports = router;
