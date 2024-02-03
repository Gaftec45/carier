const express = require('express');
const router = express.Router();
const Order = require('../models/orders'); // Assuming you have an Order model
const User = require('../models/users'); // Your User model
const { checkAuthenticated } = require('../middleware/authMiddleware');

router.get('/create-order', checkAuthenticated, (req, res)=>{
    res.render('create-order')
})
// Route to create a new order
router.post('/create-order', checkAuthenticated, async (req, res) => {
  try {
    const { senderName, receiverName, destination, pickupStation, packageDetails, status} = req.body;
    const userId = req.user._id; // Assuming you're using passport.js for authentication

    const order = new Order({ user: userId, senderName, receiverName, destination, pickupStation, packageDetails, status });
    await order.save();

    // Add order to the user's orders array
    await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });

    res.status(201).send(order);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to render the page displaying the user's orders
router.get('/my-orders', async (req, res) => {
    try {
        const userId = req.user._id; // Assuming you're using passport.js for authentication
        const orders = await Order.find({ user: userId });
        res.render('orderdash', { orders }); // Pass orders data to the EJS template
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
 
module.exports = router; 