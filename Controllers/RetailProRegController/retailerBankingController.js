const RetailerBanking = require('../../Model/RetailerProReg/retailerBankingModel');

// Get banking details by retid
exports.getBankingDetailsByRetid = (req, res) => {
    const { retid } = req.params;
    
    RetailerBanking.getBankingDetails(retid, (err, result) => {
        if (err) {
            console.error('Error fetching banking details:', err);
            return res.status(500).json({ error: "Error fetching banking details" });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "No banking details found for the given retid" });
        }
        res.json({ success: true, data: result });
    });
};

// Get all banking details
exports.getAllBankingDetails = (req, res) => {
    RetailerBanking.getAllBankingDetails((err, result) => {
        if (err) {
            console.error('Error fetching banking details:', err);
            return res.status(500).json({ error: "Error fetching banking details" });
        }
        res.json({ success: true, data: result });
    });
};

// Add new banking details
exports.addBankingDetails = (req, res) => {
    const data = req.body;

    RetailerBanking.addBankingDetails(data, (err, result) => {
        if (err) {
            console.error('Error adding banking details:', err);
            return res.status(500).json({ error: "Error adding banking details" });
        }
        res.json({ message: "Banking details added successfully", id: result.insertId });
    });
};

// Update banking details
exports.updateBankingDetails = (req, res) => {
    const { retid } = req.params;
    const updates = req.body;

    RetailerBanking.updateBankingDetails(retid, updates, (err, result) => {
        if (err) {
            console.error('Error updating banking details:', err);
            return res.status(500).json({ error: "Error updating banking details" });
        }
        res.json({ message: "Banking details updated successfully" });
    });
};

// Replace banking details
exports.replaceBankingDetails = (req, res) => {
    const { retid } = req.params;
    const data = req.body;

    RetailerBanking.replaceBankingDetails(retid, data, (err, result) => {
        if (err) {
            console.error('Error replacing banking details:', err);
            return res.status(500).json({ error: "Error replacing banking details" });
        }
        res.json({ message: "Banking details replaced successfully" });
    });
};
