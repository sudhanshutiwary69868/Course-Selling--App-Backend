const jwt = require('jsonwebtoken');
const { JWT_USER_PASSWORD } = require('../config');

function userMiddleWare(req, res, next) {
    const token = req.headers.token; // assuming the token is passed as a header

    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_USER_PASSWORD);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = {
    userMiddleWare: userMiddleWare
};
