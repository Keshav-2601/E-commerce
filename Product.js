const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [
        {
            type: String
        }
    ],
    size: [
        {
            type: String
        }
    ],
    gender: [{
        type: String
    }],
    color: [{
        type: String
    }],
    brand: {
        type: String,
    },
    totalStock: {
        type: Number,
        required: true
    },

}, { timestamps: true });


module.exports = mongoose.model('product', ProductSchema);