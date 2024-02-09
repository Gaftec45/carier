const express = require('express');
const passport = require('../passport/passConfig');
const Order = require('../models/orders');
const User = require('../models/users');
const { checkAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/dashboard', checkAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you're using passport.js for authentication
    const orders = await Order.find({ user: userId });
    res.render('dashboard', { orders, user: req.user }); // Pass orders data to the EJS template
} catch (error) {
    console.error(error);
    res.render('404');
}
});

router.get('/order', (req, res)=>{
  res.render('orderdash');
})  

module.exports = router;
