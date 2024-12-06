const express = require('express');
const router = express.Router();
const retailerRegistrationController = require('../../Controllers/RetailProRegController/RetailerRegistrationController');
const { authenticate } = require('../../Middlewares/AuthMiddleware'); 

router.post('/login', retailerRegistrationController.loginRetailer); 

router.post('/logout', retailerRegistrationController.logoutRetailer); 

router.get('/profile', authenticate, retailerRegistrationController.getRetailerProfile);

// Update retailer password
router.patch('/update-password',  retailerRegistrationController.updatePassword);

router.get('/protected-route', authenticate, (req, res) => {
    console.log('User from req.user:', req.user); 
    res.json({ message: 'Welcome, authenticated retailer!', user: req.user });
});

router.get('/', retailerRegistrationController.getAllRetailers); 
router.get('/:retid', retailerRegistrationController.getRetailerById); 
router.post('/', retailerRegistrationController.createRetailer); 
router.patch('/:retid', retailerRegistrationController.updateRetailerDetails); 
router.delete('/:retid', retailerRegistrationController.deleteRetailer); 

module.exports = router;
