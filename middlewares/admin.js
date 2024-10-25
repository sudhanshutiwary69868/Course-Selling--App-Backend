const jwt = require('jsonwebtoken');
const { JWT_ADMIN_PASSWORD } = require('../config');

function AdminMiddleware(req, res, next) {
    // Check for the Authorization header
    const authorization = req.headers['authorization'];
    if (!authorization) { // Check if the authorization header is missing
      return res.status(403).json({ message: 'A token is required for authentication' });
  }
  
    // Extract the token (format should be "Bearer <token>")
    const token = authorization
    if (!token) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }


    jwt.verify(token, JWT_ADMIN_PASSWORD, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid Token' });
        }
        req.userId = decoded.id; // Assuming your JWT payload contains `id`
        next();
    });
}

module.exports = {
    AdminMiddleware: AdminMiddleware
};
