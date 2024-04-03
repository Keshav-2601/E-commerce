const jwt = require('jsonwebtoken');
const fs = require('fs');
const User = require('../models/User');
const JWT_KEY = fs.readFileSync(process.env.JWT_KEY_PATH, 'utf8');

const verifyToken = async (req, res, next) => {

    try {

        const token = req.header('auth-token');

        if (!token) {
            return res.status(401).json({ success: false, message: "Access Denied" });
        }

        const decoded = jwt.verify(token, JWT_KEY);

        req.user = decoded.user;

        const userID = req.user.id;

        if (!userID) {
            return res.status(401).json({ success: false, message: "Access Denied" });
        }

        const validateUser = await User.findById(userID).select('-password');

        if (!validateUser) {
            return res.status(401).json({ success: false, message: "Access Denied" });
        }

        req.profile = validateUser;

        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Token Invalid" });
    }

}

module.exports = verifyToken;