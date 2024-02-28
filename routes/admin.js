const express = require('express');
const passport = require('../passport/passConfig').passport;
const Order = require('../models/orders');
const User = require('../models/users');
const { isAdmin, checkAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/dashboard', checkAuthenticated, isAdmin, async (req, res) => {
    try {
        const admin = req.user; // Assuming this holds the currently logged-in admin
        const usersWithOrders = await User.find({ role: 'user' }).populate('orders').exec();
        res.render('admin', { admin, users: usersWithOrders });
    } catch (error) {
        console.error(error); 
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;