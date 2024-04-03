const express = require('express');
const User = require('../models/User');
const router = express.Router()
const multer = require('multer');
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const JWT_KEY = fs.readFileSync(process.env.JWT_KEY_PATH, 'utf8');


const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {

        const ext = path.extname(file.originalname);

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

        cb(null, file.fieldname + '-' + uniqueSuffix + ext + '.jpeg');

    }

})

const upload = multer({ storage });

const verifyAdmin = async (req, res, next) => {

    try {

        const token = req.header('auth-token');

        if (!token) {
            return res.status(401).json({ success: false, message: "Access Denied" });
        }

        const decoded = jwt.verify(token, JWT_KEY);

        const data = decoded.user

        const sessionUserID = data.id

        const userProfile = await User.findById(sessionUserID);

        if (!data.isAdmin || !userProfile.isAdmin || !userProfile) {
            return res.status(401).json({ success: false, message: "Access Denied" });
        }

        req.user = decoded.user;

        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Token Invalid" });
    }

}

const handleProductCreate = async (req, res) => {

    try {

        const { name, price, description, size, gender, totalStock, brand } = req.body;

        const uploadImageUrls = req.files.map((file) => {
            return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
        })

        const productData = await Product({
            name,
            price: Number(price),
            description,
            images: uploadImageUrls,
            size: size?.split(','),
            gender: gender?.split(','),
            totalStock: Number(totalStock),
            brand
        })

        await productData.save();

        res.status(201).json({
            success: true,
            message: "Product Created",
            data: productData
        })

    } catch (error) {

        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })

    }

}

const handleGetAllProducts = async (req, res) => {

    try {

        const data = await Product.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "All Products",
            data
        })

    } catch (error) {

        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })

    }

}

const handleUpdateProduct = async (req, res) => {

    try {

        const productID = req.params.productID;

        const { name, price, description, size, gender, color, totalStock, brand } = req.body;

        const uploadImageUrls = req.files.map((file) => {
            return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
        })

        const productData = await Product.findById(productID);

        if (!productData) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        const data = {}

        if (name) {
            data.name = name;
        }
        if (price) {
            data.price = Number(price);
        }
        if (description) {
            data.description = description;
        }
        if (size) {
            data.size = size.split(',');
        }
        if (gender) {
            data.gender = gender.split(',');
        }
        if (color) {
            data.color = color.split(',');
        }
        if (totalStock) {
            data.totalStock = Number(totalStock);
        }
        if (req.files) {
            data.images = [...productData.images, ...uploadImageUrls];
        }
        if (brand) {
            data.brand = brand;
        }

        const updatedData = await Product.findByIdAndUpdate(productID, data, { new: true });

        res.status(200).json({
            success: true,
            message: "Product Updated",
            data: updatedData
        })

    } catch (error) {

        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })

    }

}

const handleDeleteImage = async (req, res) => {

    try {

        const productID = req.params.productID;

        const productData = await Product.findById(productID);

        if (!productData) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        const { imageURL } = req.body;

        const updatedImages = productData.images.filter((image) => image !== imageURL);

        const updatedData = await Product.findByIdAndUpdate(productID, { images: updatedImages }, { new: true });

        const parts = imageURL.split('/');

        const fileName = parts[parts.length - 1];

        const imagePath = path.join("uploads", fileName);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        res.status(200).json({
            success: true,
            message: "Image Deleted",
            data: updatedData
        })

    } catch (error) {

        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })

    }

}

// const handleProductSearch = async (req, res) => {
//     try {
//         const searchQuery = req.params.searchQuery;
//         const searchRegex = new RegExp(searchQuery, "i");

//         const { size, price, gender } = req.body;
//         const conditions = [];

//         // Check if searchQuery is empty
//         if (searchQuery === "") {
//             conditions.push({
//                 $or: [
//                     { name: { $regex: searchRegex } },
//                     { description: { $regex: searchRegex } },
//                     { brand: { $regex: searchRegex } }
//                 ]
//             });
//         }

//         // Add size condition if size array is not empty
//         if (size.length > 0) {
//             conditions.push({ size: { $in: size } });
//         }

//         // Add gender and price conditions
//         if (gender.length > 0) {
//             conditions.push({ gender: { $in: gender } });
//         }

//         if (price.length > 0 && price[0] !== 0) {
//             conditions.push({ price: { $gte: price[0], $lte: price[1] } });
//         }

//         const results = await Product.find({ $and: conditions }).sort({ createdAt: -1 });

//         if (!results || results.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No products found"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Search Results",
//             data: results
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: "Server Error"
//         });
//     }
// };
const handleProductSearch = async (req, res) => {
    try {
        const searchQuery = req.params.searchQuery;
        const searchRegex = new RegExp(searchQuery, 'i');

        const { size, price, gender } = req.body;
        const conditions = [];

        if (searchQuery === '') {
            conditions.push({
                $or: [
                    { name: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } },
                    { brand: { $regex: searchRegex } }
                ]
            });
        }

        if (size.length > 0) {
            conditions.push({ size: { $in: size } });
        }

        if (gender.length > 0) {
            conditions.push({ gender: { $in: gender } });
        }

        if (price.length > 0 && price[0] !== 0) {
            conditions.push({ price: { $gte: price[0], $lte: price[1] } });
        }

        const results = await Product.find({ $and: conditions }).sort({ createdAt: -1 });

        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No products found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Search Results',
            data: results
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}




const handleGetProductDetails = async (req, res) => {

    try {

        const productID = req.params.productID;

        const productData = await Product.findById(productID);

        if (!productData) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Product Details",
            data: productData
        })

    } catch (error) {

        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })

    }
}

const handleDeleteProduct = async (req, res) => {

    try {

        const productID = req.params.productID;

        const productData = await Product.findById(productID);

        if (!productData) {

            return res.status(404).json({
                success: false,
                message: "Product not found"
            })

        }

        // delete all the images

        productData.images.forEach((image) => {

            const parts = image.split('/');

            const fileName = parts[parts.length - 1];

            const imagePath = path.join("uploads", fileName);

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

        })

        await Product.findByIdAndDelete(productID);

        res.status(200).json({

            success: true,

            message: "Product Deleted"

        })

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server Error"

        })
    }

}


router.post('/create', verifyAdmin, upload.array("images"), handleProductCreate);

router.get('/all', handleGetAllProducts);

router.put('/update/:productID', verifyAdmin, upload.array("images"), handleUpdateProduct)

router.delete('/deleteImage/:productID', verifyAdmin, handleDeleteImage);

router.post('/search/:searchQuery', handleProductSearch)

router.get('/get-details/:productID', handleGetProductDetails)

router.delete('/delete/:productID', verifyAdmin, handleDeleteProduct)

module.exports = router;