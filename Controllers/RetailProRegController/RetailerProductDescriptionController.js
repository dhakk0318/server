const RetailerProductDescription = require('../../Model/RetailerProReg/RetailerProductDescription');

exports.getAllDescriptions = (req, res) => {
    RetailerProductDescription.getAll((err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.getDescriptionById = (req, res) => {
    RetailerProductDescription.getById(req.params.product_description_id, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

exports.createDescription = (req, res) => {
    RetailerProductDescription.create(req.body, (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: 'Product description created successfully', descriptionId: result.insertId });
    });
};

exports.updateDescription = (req, res) => {
    RetailerProductDescription.update(req.params.product_description_id, req.body, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Product description updated successfully' });
    });
};

exports.deleteDescription = (req, res) => {
    RetailerProductDescription.delete(req.params.product_description_id, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Product description deleted successfully' });
    });
};
