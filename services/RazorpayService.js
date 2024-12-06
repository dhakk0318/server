const Razorpay = require('razorpay');
require('dotenv').config();

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// Function to create an order
const createOrder = async (amount, currency = 'INR') => {
  const options = {
    amount: amount * 100,  // Amount is in the smallest currency unit (paise for INR)
    currency,
    receipt: `order_${Math.random().toString(36).substr(2, 9)}`,
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    return order;
  } catch (error) {
    throw new Error('Error creating Razorpay order: ' + error.message);
  }
};

// Function to capture payment after the user completes the payment
const capturePayment = async (paymentId, amount) => {
  try {
    const payment = await razorpayInstance.payments.capture(paymentId, amount * 100); // Capture the payment
    return payment;
  } catch (error) {
    throw new Error('Error capturing Razorpay payment: ' + error.message);
  }
};

module.exports = { createOrder, capturePayment };
 