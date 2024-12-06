
const jwt = require('jsonwebtoken');


const authenticate = (req, res, next) => {
    const accessToken = req.cookies['access_token'];
    console.log("Access Token:", accessToken);
    if (!accessToken) {
        return res.status(401).json({ message: "No access token provided" });
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY || 'jwt-secret-key');
        console.log("Decoded Token:", decoded);
        req.user = decoded; 
        next();
    } catch (err) {
        const message = err.name === 'TokenExpiredError' ? "Token expired" : "Invalid token";
        return res.status(403).json({ message });
    }
};

  const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.roles) {
            return res.status(401).json({ message: "Unauthorized: User not authenticated" });
        }

        const userRoles = req.user.roles;
        const hasRole = roles.some(role => userRoles.map(r => r.toLowerCase()).includes(role.toLowerCase()));
        if (!hasRole) {
            return res.status(403).json({ message: "Access denied. Role required: " + roles.join(", ") });
        }
        next();
    };
};



  
module.exports = { authenticate, authorize };
