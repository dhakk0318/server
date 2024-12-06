const express = require('express');
const router = express.Router();
const retailerBankingController = require('../../Controllers/RetailProRegController/retailerBankingController');

// Fetch by retid
router.get('/:retid', retailerBankingController.getBankingDetailsByRetid);

// Fetch all banking details
router.get('/', retailerBankingController.getAllBankingDetails);

// Add new banking details (POST)
router.post('/', retailerBankingController.addBankingDetails);

// Update banking details (PATCH)
router.patch('/:retid', retailerBankingController.updateBankingDetails);

// Replace banking details (PUT)
router.put('/:retid', retailerBankingController.replaceBankingDetails);

module.exports = router;
