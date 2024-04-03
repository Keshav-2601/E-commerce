const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    userTypeCode: {
        type: Number,
        required: true,
        default: 1
    }

}, { timestamps: true });


module.exports = mongoose.model('user', UserSchema);