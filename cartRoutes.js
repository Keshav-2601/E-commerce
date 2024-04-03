const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const handleAddItemToCart = async (req, res) => {

    try {

        const sessionUserID = req.user.id;

        const { itemID, quantity } = req.body;

        const validateProduct = await Product.findById(itemID);

        if (!validateProduct || validateProduct.totalStock < 1) {
            return res.status(400).json({ success: false, message: "Product not available" });
        }

        const cart = await Cart({
            createdBy: sessionUserID,
            itemID,
            quantity: Number(quantity)
        });

        await cart.save();

        validateProduct.totalStock = validateProduct.totalStock - Number(quantity);

        await validateProduct.save();

        res.status(201).json({ success: true, message: "Item added to cart" });

    } catch (error) {

        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });

    }

}

const handleUpdateCartItemQuantity = async (req, res) => {

    try {

        const { itemID, quantity } = req.params;

        const validateItem = await Cart.findById(itemID);

        if (!validateItem) {
            return res.status(400).json({ success: false, message: "Item not found" });
        }

        if (Number(quantity) < 1) {

            await Cart.findByIdAndDelete(itemID);

            return res.status(200).json({ success: true, message: "Item removed from cart" });

        }

        await Cart.findByIdAndUpdate(itemID, { quantity: Number(quantity) });

        res.status(200).json({ success: true, message: "Item quantity updated" });

    } catch (error) {

        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });

    }

}

const handleGetCart = async (req, res) => {

    try {

        const data = await Cart.aggregate([
            {
                $match: {
                    createdBy: req.profile._id
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'itemID',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: '$product'
            }
        ]);

        res.status(200).json({ success: true, message: "Cart fetched successfully", data });

    } catch (error) {

        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });

    }

}

router.post('/add', verifyToken, handleAddItemToCart);

router.put('/update/:itemID/:quantity', verifyToken, handleUpdateCartItemQuantity);

router.get('/', verifyToken, handleGetCart);

module.exports = router;