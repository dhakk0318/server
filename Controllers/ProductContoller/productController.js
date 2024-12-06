const db = require('../../Config/db');

 exports.getAllProducts = (req, res) => {
    const query = `
      SELECT p.pid, p.productname, p.price, p.qty, p.company, 
             d.product_description, d.tags, d.url, d.review, 
             s.subcat_name  -- Correct column name
      FROM tbl_retailer_products p
      JOIN tbl_retailer_p_description d ON p.pid = d.pid
      LEFT JOIN tbl_admin_p_sub_category s ON p.sub_catid = s.sub_catid`;  // Ensured this matches the actual table/column name

    console.log(message = "successfully fetched all products");

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error executing query: ", error.message);
        return res.status(500).json({ error: 'Database error', details: error.message });
      }

      if (results.length > 0) { 
        res.json(results);
      } else {
        res.status(404).json({ message: 'No products found' });
      }
    });
};


exports.createProduct = (req, res) => {
    const { sub_catid, retid, pid, productname, price, qty, company, product_description, tags, url, review } = req.body;
  
    if (!pid) {
      return res.status(400).json({ error: 'Product ID (pid) is required' });
    }
  
    db.beginTransaction((err) => {
      if (err) return res.status(500).json({ error: 'Transaction error' });
  
      // Check if pid already exists
      const checkProductQuery = `SELECT pid FROM tbl_retailer_products WHERE pid = ?`;
      db.query(checkProductQuery, [pid], (checkErr, checkResult) => {
        if (checkErr) {
          console.error("Check product error: ", checkErr.message);
          return db.rollback(() => res.status(500).json({ error: 'Check product failed', details: checkErr.message }));
        }
  
        if (checkResult.length > 0) {
          // If the product ID already exists, return an error
          return db.rollback(() => res.status(400).json({ error: 'Product ID already exists' }));
        }
  
        // Insert into tbl_retailer_products
        const productQuery = `
          INSERT INTO tbl_retailer_products (sub_catid, retid, pid, productname, price, qty, company)
          VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
        db.query(productQuery, [sub_catid, retid, pid, productname, price, qty, company], (error) => {
          if (error) {
            console.error("Product insert error: ", error.message);
            return db.rollback(() => res.status(500).json({ error: 'Product insert failed', details: error.message }));
          }
  
          // Insert into tbl_retailer_p_description
          const descriptionQuery = `
            INSERT INTO tbl_retailer_p_description (pid, product_description_id, product_description, tags, url, review)
            VALUES (?, ?, ?, ?, ?, ?)`;
  
          db.query(descriptionQuery, [pid, pid, product_description, tags, url, review], (error) => {
            if (error) {
              console.error("Description insert error: ", error.message);
              return db.rollback(() => res.status(500).json({ error: 'Product description insert failed', details: error.message }));
            }
  
            db.commit((err) => {
              if (err) {
                console.error("Commit failed: ", err.message);
                return db.rollback(() => res.status(500).json({ error: 'Commit failed', details: err.message }));
              }
              res.status(201).json({ message: 'Product created successfully' });
            });
          });
        });
      });
    });
  };
  
// Get product with description by product id
exports.getProductById = (req, res) => {
  const { pid } = req.params;

  const query = `
    SELECT p.pid, p.productname, p.price, p.qty, p.company, 
             d.product_description, d.tags, d.url, d.review, 
             s.subcat_name  
      FROM tbl_retailer_products p
      JOIN tbl_retailer_p_description d ON p.pid = d.pid
      LEFT JOIN tbl_admin_p_sub_category s ON p.sub_catid = s.sub_catid
    WHERE p.pid = ?`;

  console.log("Executing Query: ", query);  // Log query for debugging

  db.query(query, [pid], (error, result) => {
    if (error) {
      console.error("Error executing query: ", error.message);
      return res.status(500).json({ error: 'Database error', details: error.message });
    }

    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  });
};

// Update product and description
exports.updateProduct = (req, res) => {
  const { pid } = req.params;
  const { productname, price, qty, company, product_description, tags, url, review } = req.body;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: 'Transaction error' });

    // Update product
    const updateProductQuery = `
      UPDATE tbl_retailer_products 
      SET productname = ?, price = ?, qty = ?, company = ?
      WHERE pid = ?`;

    db.query(updateProductQuery, [productname, price, qty, company, pid], (error) => {
      if (error) {
        console.error("Product update failed: ", error.message);
        return db.rollback(() => res.status(500).json({ error: 'Product update failed', details: error.message }));
      }

      // Update description
      const updateDescriptionQuery = `
        UPDATE tbl_retailer_p_description 
        SET product_description = ?, tags = ?, url = ?, review = ?
        WHERE pid = ?`;

      db.query(updateDescriptionQuery, [product_description, tags, url, review, pid], (error) => {
        if (error) {
          console.error("Description update failed: ", error.message);
          return db.rollback(() => res.status(500).json({ error: 'Product description update failed', details: error.message }));
        }

        db.commit((err) => {
          if (err) {
            console.error("Commit failed: ", err.message);
            return db.rollback(() => res.status(500).json({ error: 'Commit failed', details: err.message }));
          }
          res.status(200).json({ message: 'Product updated successfully' });
        });
      });
    });
  });
};

// Controller to fetch subcategories based on categoryId
exports.getSubcategories = (req, res) => {
    const { categoryId } = req.params;  // Get categoryId from request params
  
    // SQL query to fetch subcategories for a specific category
    const query = `
      SELECT s.sub_catid, s.subcat_name 
      FROM tbl_admin_p_sub_category s
      JOIN tbl_retailer_products p ON s.sub_catid = p.sub_catid
      WHERE s.catid = ?`;
    
    db.query(query, [categoryId], (err, results) => {
      if (err) {
        console.error('Error fetching subcategories:', err.message);
        return res.status(500).json({ message: 'Error fetching subcategories.' });
      }
      res.json({ subcategories: results });
    });
  };
  // Get Categories with Subcategories
// Get Categories with Subcategories
// Get Categories with Subcategories
exports.getCategoriesWithSubcategories = (req, res) => {
    console.log("Fetching categories with subcategories...");

    // Step 1: Get all categories
    db.query('SELECT * FROM tbl_admin_p_category', (err, categories) => {
      if (err) {
        console.error("Error fetching categories:", err.message);
        return res.status(500).json({ message: 'Error fetching categories', error: err.message });
      }

      if (categories.length === 0) {
        console.log("No categories found");
        return res.status(404).json({ message: 'No categories found' });
      }

      console.log("Categories fetched:", categories);

      // Step 2: Fetch subcategories for all categories
      let categoryIds = categories.map(cat => cat.catid);  // Get all category IDs
      let query = `SELECT * FROM tbl_admin_p_sub_category WHERE catid IN (?)`;  // Fetch subcategories for all categories

      db.query(query, [categoryIds], (err, subcategories) => {
        if (err) {
          console.error('Error fetching subcategories:', err.message);
          return res.status(500).json({ message: 'Error fetching subcategories.' });
        }

        console.log("Subcategories fetched:", subcategories);

        // Step 3: Map the subcategories to their respective categories
        const categorySubcategories = categories.map(category => {
          return {
            ...category,
            subcategories: subcategories.filter(subcat => subcat.catid === category.catid)
          };
        });

        // Step 4: Return the combined result
        res.json({ categories: categorySubcategories });
      });
    });
};

 