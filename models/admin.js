const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true, // Ensure email is required
        unique: true, // Ensure email is unique
        trim: true // Trim whitespace from email
    },
    password: {
        type: String,
        required: true // Ensure password is required
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Restrict role to 'user' or 'admin'
        default: 'admin' // Set default role to 'admin'
    }
});

// Create Admin model
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
