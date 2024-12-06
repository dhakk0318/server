const createError = require('http-errors');
const db = require('../../Config/db'); // Ensure this path is correct

// Create a new offer
const createOffer = async (req, res, next) => {
  const { offercode, offername, sub_catid, percentagediscount, flatdiscount, validfrom, validto, status } = req.body;

  // Ensure that status is either '0' or '1'
  const validStatus = (status === '0' || status === '1') ? status : '1'; // Default to '1' if invalid

  try {
    const result = await db.query(
      'INSERT INTO tbl_admin_business_offers (offercode, offername, sub_catid, percentagediscount, flatdiscount, validfrom, validto, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
      [offercode, offername, sub_catid, percentagediscount, flatdiscount, validfrom, validto, validStatus]
    );

    res.status(201).json({ message: 'Offer created successfully', offerId: result.insertId });
  } catch (error) {
    console.error("Error creating offer:", error);
    next(createError(500, 'Error creating offer.'));
  }
};

// Get all offers
const getOffers = (req, res, next) => {
  db.query('SELECT * FROM tbl_admin_business_offers', (error, results) => {
    if (error) {
      console.error('Error executing query:', error.stack);
      return next(createError(500, 'Error fetching offers.'));
    }

    // Print the fetched offers to the console
    console.log('Fetched offers:', results);

    // Send the results as a response
    res.status(200).json(results);
  });
};

// Get offer by offer code
const getOfferByCode = (req, res, next) => {
  const { offercode } = req.params; // Extract the offer code from the request parameters

  // Define the SQL query and values
  const query = 'SELECT * FROM tbl_admin_business_offers WHERE offercode = ?';
  const values = [offercode];

  // Execute the query
  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error executing query:', error.stack);
      return next(createError(500, 'Error fetching offer.'));
    }

    // Check if any results were returned
    if (results.length === 0) {
      return next(createError(404, 'Offer not found.'));
    }

    // Print the fetched offer to the console
    console.log('Fetched offer:', results[0]); // Print the first result

    // Send the fetched offer as a response
    res.status(200).json(results[0]);
  });
};

// Update an offer
const updateOffer = async (req, res, next) => {
  const { offercode } = req.params;
  const { offername, sub_catid, percentagediscount, flatdiscount, validfrom, validto, status } = req.body;

  try {
    const query = `
      UPDATE tbl_admin_business_offers
      SET offername = ?, sub_catid = ?, percentagediscount = ?, flatdiscount = ?, validfrom = ?, validto = ?, status = ?
      WHERE offercode = ?
    `;
    const values = [offername, sub_catid, percentagediscount, flatdiscount, validfrom, validto, status, offercode];
    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return next(createError(404, 'Offer not found.'));
    }

    // Log the update success
    console.log(`Offer ${offercode} updated successfully.`);
    res.status(200).json({ message: 'Offer updated successfully.' });
  } catch (error) {
    console.error('Error updating offer:', error); // Improved error logging
    next(createError(500, 'Error updating offer.'));
  }
};

// Delete an offer
const deleteOffer = async (req, res, next) => {
  const { offercode } = req.params;

  try {
    const [result] = await db.query('DELETE FROM tbl_admin_business_offers WHERE offercode = ?', [offercode]);

    if (result.affectedRows === 0) {
      return next(createError(404, 'Offer not found.'));
    }

    // Log the deletion success
    console.log(`Offer ${offercode} deleted successfully.`);
    res.status(200).json({ message: 'Offer deleted successfully.' });
  } catch (error) {
    console.error('Error deleting offer:', error); // Improved error logging
    next(createError(500, 'Error deleting offer.'));
  }
};

module.exports = {
  createOffer,
  getOffers,
  getOfferByCode,
  updateOffer,
  deleteOffer,
};
