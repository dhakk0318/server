
const Razorpay = require("razorpay");
const db = require("../../Config/db");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createRazorpayOrder = async (req, res) => {
  const { order_id, amount } = req.body;

  if (!order_id || !amount) {
    return res.status(400).json({ message: "Order ID and Amount are required" });
  }

  // Razorpay options
  const options = {
    amount: amount * 100, // Amount in paisa
    currency: "INR", 
    receipt: `receipt_${order_id}`, // Receipt ID
    payment_capture: 1, // Auto capture (1 means automatically capturing payments)
    notes: {
      order_id: order_id,
    },
  };

  try {
    // Create order with Razorpay API
    const order = await razorpayInstance.orders.create(options);
    console.log("Razorpay Order Created:", order);

    // Save order info in database
    const query = "UPDATE tbl_order SET payment_id = ?, payment_status = 'PENDING' WHERE order_id = ?";
    await db.queryPromise(query, [order.id, order_id]);

    // Send response to the client
    res.status(200).json({ message: "Razorpay order created", order });
  } catch (err) {
    console.error("Razorpay Error:", err);
    res.status(500).json({ message: "Razorpay error", error: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const query = "SELECT total_amount FROM tbl_order WHERE order_id = ?";
    const [order] = await db.queryPromise(query, [razorpay_order_id]);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Generate signature using your Razorpay API secret
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Compare signatures
    if (generatedSignature === razorpay_signature) {
      const paymentQuery = `
        INSERT INTO tbl_payment 
        (transaction_id, order_id, transaction_amount, payment_status, razorpay_payment_id, razorpay_order_id, payment_signature) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const transactionId = `TX_${uuidv4()}`;
      await db.queryPromise(paymentQuery, [
        transactionId,
        razorpay_order_id,
        order.total_amount,
        "SUCCESS",
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      ]);

      res.status(200).json({ message: "Payment verified successfully", transaction_id: transactionId });
    } else {
      res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (err) {
    console.error("Error verifying payment:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};

exports.checkOut = (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  const findCartQuery = `
    SELECT ci.*, p.productname, p.price 
    FROM tbl_cart_items ci 
    JOIN tbl_retailer_products p ON ci.pid = p.pid 
    WHERE ci.cart_id = (SELECT cart_id FROM tbl_cart WHERE cid = ? LIMIT 1)
  `;

  db.query(findCartQuery, [id], (err, cartItems) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (cartItems.length === 0) {
      return res.status(404).json({ message: "No cart items found" });
    }

    const order_id = uuidv4();
    const orderItemsData = cartItems.map(item => [order_id, item.pid, item.quantity, item.price, uuidv4()]);

    const createOrderQuery = "INSERT INTO tbl_order (order_id, cid, total_amount) VALUES (?, ?, ?)";
    db.query(createOrderQuery, [order_id, id, amount], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      const addOrderItemsQuery = "INSERT INTO tbl_order_items (order_id, pid, quantity, price, order_item_id) VALUES ?";
      db.query(addOrderItemsQuery, [orderItemsData], err => {
        if (err) return res.status(500).json({ message: "Error adding order items", error: err });

        res.status(200).json({ message: "Order created", order_id });
      });
    });
  });
};
