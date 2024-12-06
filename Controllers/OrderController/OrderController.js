

const db = require('../../Config/db');


exports.createOrder = (req, res) => {
  const { cart_id, cid } = req.body;

  if (!cart_id || !cid) {
    return res.status(400).json({ message: 'Cart ID and Customer ID are required' });
  }

  // Get all items in the cart
  const query = `
    SELECT ci.pid, ci.quantity, p.price 
    FROM tbl_cart_items ci
    JOIN tbl_retailer_products p ON ci.pid = p.pid  -- Changed from tbl_product to tbl_retailer_products
    WHERE ci.cart_id = ?
  `;

  db.query(query, [cart_id], (err, items) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (items.length === 0) {
      return res.status(400).json({ message: 'No items in the cart' });
    }

    // Calculate total amount
    let totalAmount = 0;
    items.forEach(item => {
      totalAmount += item.price * item.quantity;
    });

    // Insert into tbl_order
    const orderId = `order_${Date.now()}`;
    const orderQuery = `
      INSERT INTO tbl_order (order_id, cid, total_amount, payment_status, delivery_status)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(orderQuery, [orderId, cid, totalAmount, 'PENDING', 'PENDING'], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      // Insert items into tbl_order_items
      items.forEach(item => {
        const orderItemId = `order_item_${Date.now()}`;
        const orderItemQuery = `
          INSERT INTO tbl_order_items (order_item_id, order_id, pid, quantity, price)
          VALUES (?, ?, ?, ?, ?)
        `;
        db.query(orderItemQuery, [orderItemId, orderId, item.pid, item.quantity, item.price], (err, result) => {
          if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
          }
        });
      });

      // Respond with order details
      res.status(201).json({ message: 'Order created successfully', order_id: orderId, total_amount: totalAmount });
    });
  });
};



// Add items to the order
exports.addItemsToOrder = (req, res) => {
  const { order_id, pid, quantity, price } = req.body;

  if (!order_id || !pid || !quantity || !price) {
    return res.status(400).json({ message: 'Order ID, Product ID, Quantity, and Price are required' });
  }

  const orderItemId = `order_item_${Date.now()}`;
  const query = 'INSERT INTO tbl_order_items (order_item_id, order_id, pid, quantity, price) VALUES (?, ?, ?, ?, ?)';

  db.query(query, [orderItemId, order_id, pid, quantity, price], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(201).json({ message: 'Item added to order successfully' });
  });
};

// Get order details
// Get order details
exports.getOrderDetails = (req, res) => {
  const { order_id } = req.params;

  const query = 'SELECT * FROM tbl_order_items WHERE order_id = ?';

  db.query(query, [order_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(rows);
  });
};

