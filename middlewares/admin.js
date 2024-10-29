const jwt = require('jsonwebtoken');
const { JWT_ADMIN_PASSWORD } = require('../config');
const { adminRouter } = require('../routes/admin');
const cookieParser = require('cookie-parser');


function AdminMiddleware(req, res, next) {
    
    const token = req.cookies.token;
    if (!token) { 
      return res.status(403).json({ message: 'A token is required for authentication' });
  }
  
  
  

    jwt.verify(token, JWT_ADMIN_PASSWORD, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid Token' });
        }
        req.userId = decoded.id; 
        next();
    });
}

module.exports = {
    AdminMiddleware: AdminMiddleware
};
