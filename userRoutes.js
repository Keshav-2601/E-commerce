const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');

const JWT_KEY = fs.readFileSync(process.env.JWT_KEY_PATH, 'utf8');

const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

// controllers

const handleCreateUser = async (req, res) => {

    try {

        const { email, password, name } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({ success: false, message: "Fields required" });

        }

        const validateUser = await User.findOne({
            email
        })

        if (validateUser) {

            return res.status(400).json({ success: false, message: "User already exists" });

        }

        const genSalt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(password, genSalt);

        const user = User({
            email,
            password: secPassword,
            name,
    
        });

        await user.save();

        res.status(201).json({ success: true, message: "User created successfully" });

    } catch (error) {

        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });

    }

}

const handleUserLogin = async (req, res) => {

    try {

        const { email, password } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: "Fields required" });
        }

        const validateUser = await User.findOne({
            email
        })

        if (!validateUser) {
            return res.status(400).json({ success: false, message: "Create Account", redirectType: "user-not-found" });
        }

        const validatePassword = await bcrypt.compare(password, validateUser.password);

        if (!validatePassword) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        const data = {
            user: {
                id: validateUser.id,
                isAdmin: validateUser.isAdmin
            }
        }

        const token = jwt.sign(data, JWT_KEY, { algorithm: "HS256" })

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token: token
        });

    } catch (error) {

        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });

    }

}

const handleUpdateUser = async (req, res) => {

    try {

        const { name, address } = req.body;

        const sessionUserID = req.user.id;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: "Fields required" });
        }

        const data = {}

        if (name) {
            data.name = name;
        }

        if (address) {
            data.address = address;
        }

        const updatedUser = await User.findByIdAndUpdate(sessionUserID, data, { new: true }).select('-password');

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        })

    } catch (error) {

        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });

    }

}

const handleGetProfile = async (req, res) => {

    try {

        const sessionUserID = req.user.id;

        if (!sessionUserID) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const userProfile = await User.findById(sessionUserID).select('-password');

        res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            data: userProfile
        })

    } catch (error) {

        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });

    }

}

const handleDeleteProfile = async (req, res) => {

    try {

        const sessionUserID = req.user.id;

        await User.findByIdAndDelete(sessionUserID);

        res.status(200).json({ success: true, message: "User deleted successfully" });

    } catch (error) {

        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });

    }

}

// routes

router.post('/create',
    [
        body('email', 'Please enter a valid email').isEmail(),
        body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
        body('name', 'Please enter a valid name').isLength({ min: 3 }),
    ]
    , handleCreateUser)

router.post('/login',
    [
        body('email', 'Please enter a valid email').isEmail(),
        body('password', 'Password must be at least 6 characters').isLength({ min: 6 })
    ], handleUserLogin)

router.put('/update', verifyToken, [
    body('name', 'Please enter a valid name').isLength({ min: 3 }),
    body('address', 'Please enter a valid address').isLength({ min: 10 })
], handleUpdateUser)

router.get('/profile', verifyToken, handleGetProfile)

router.delete('/delete', verifyToken, handleDeleteProfile)

module.exports = router;