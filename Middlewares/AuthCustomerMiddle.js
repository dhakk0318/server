const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Cookie se token le

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    // Decoded information ko request mein store karna
    req.cid = decoded.cid; // Customer ID
    req.customer_name = decoded.customer_name; // Customer name

    // Debugging: Check if the customer name is set correctly
    console.log('Decoded Customer Name:', req.customer_name);

    next(); // Next middleware ya route handler ko bulana
  });
};

module.exports = verifyToken;
 