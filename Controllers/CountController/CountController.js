const createError = require('http-errors');
const db = require('../../Config/db');  // Database connection

// Controller to get count of admin users
const getAdminUserCount = (req, res) => {
    const query = 'SELECT COUNT(*) AS userCount FROM tbl_admin_user_registration';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching admin user count:', err);
            return res.status(500).json({ message: 'Error fetching admin user count', error: err });
        }
        return res.status(200).json(results[0]);
    });
};

// Controller to get count of categories
const getCategoryCount = (req, res) => {
    const query = 'SELECT COUNT(*) AS categoryCount FROM tbl_admin_p_category';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching category count:', err);
            return res.status(500).json({ message: 'Error fetching category count', error: err });
        }
        return res.status(200).json(results[0]);
    });
};

// Controller to get count of subcategories
const getSubCategoryCount = (req, res) => {
    const query = 'SELECT COUNT(*) AS subcategoryCount FROM tbl_admin_p_sub_category';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching subcategory count:', err);
            return res.status(500).json({ message: 'Error fetching subcategory count', error: err });
        }
        return res.status(200).json(results[0]);
    });
};

// Controller to get count of retailer products
const getRetailerProductCount = (req, res) => {
    const query = 'SELECT COUNT(*) AS productCount FROM tbl_retailer_products';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching product count:', err);
            return res.status(500).json({ message: 'Error fetching product count', error: err });
        }
        return res.status(200).json(results[0]);
    });
};
const getRetailerCount = (req, res) => {
    const query = 'SELECT COUNT(*) AS retailerCount FROM tbl_retailer_reg';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching retailer count:', err);
            return res.status(500).json({ message: 'Error fetching retailer count', error: err });
        }
        return res.status(200).json(results[0]);
    });
};


const getCartItemCount = async (req, res) => {
    try {
        const customerId = req.cid; // The customer ID from the decoded token via middleware

        // Debugging: Print the customer ID received
        console.log('Decoded Customer ID:', customerId);

        if (!customerId) {
            // If CID is not found, return a 400 error
            return res.status(400).json({ message: "Customer ID not found in the request." });
        }

        // SQL query to count items in the cart for the given CID
        const query = `
            SELECT COUNT(*) AS item_count
            FROM tbl_cart_items
            JOIN tbl_cart ON tbl_cart.cart_id = tbl_cart_items.cart_id
            WHERE tbl_cart.cid = ?;
        `;

        // Execute the query
        db.query(query, [customerId], (err, results) => {
            if (err) {
                // Log the error if any
                console.error("Database error:", err);
                return res.status(500).json({ message: "Internal server error", error: err });
            }

            // Debugging: Print query results
            console.log("Query Results:", results);

            // Check if items are found
            if (results.length === 0 || results[0].item_count === 0) {
                return res.status(404).json({ message: "No items found in this cart." });
            }

            // Return the count as a response
            res.status(200).json({ item_count: results[0].item_count });
        });
    } catch (error) {
        // Catch unexpected errors
        console.error("Error in getCartItemCount:", error);
        res.status(500).json({ message: "Error fetching cart item count", error });
    }
};


  
// Exporting controller functions
module.exports = {
    getAdminUserCount,
    getCategoryCount,
    getSubCategoryCount,
    getRetailerProductCount,
    getRetailerCount,
    getCartItemCount
};
