const express = require('express');
const router = express.Router();
const retailerProductDescriptionController = require('../../Controllers/RetailProRegController/RetailerProductDescriptionController');

router.get('/', retailerProductDescriptionController.getAllDescriptions); // Get all product descriptions
router.get('/:product_description_id', retailerProductDescriptionController.getDescriptionById); // Get a description by ID
router.post('/', retailerProductDescriptionController.createDescription); // Create a new product description
router.patch('/:product_description_id', retailerProductDescriptionController.updateDescription); // Update a product description
router.delete('/:product_description_id', retailerProductDescriptionController.deleteDescription); // Delete a product description

module.exports = router;
