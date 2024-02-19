const express = require('express');
const router = express.Router();
const User = require('../models/users');
const { isAdmin } = require('../middleware/authMiddleware');
const Admin = require('../models/admin');
const orders = require('../models/orders');

router.get('/admin/add', (req, res)=>{
    res.render('adminSignup');
});

router.get('/admin/login',(req, res)=>{
    res.render('adminLogin')
})
// Handle admin signup
router.post('/admin/add', async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = new Admin({ email, password });
        await admin.save();
        res.render('adminLogin');
    } catch (error) {
        console.error('Error signing up admin:', error);
        res.render('404');
    }
});

// Handle admin login
router.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email, password });
        if (admin) {
            res.render('admin');
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).send('Internal server error');
    }
});

/*
router.get('/admin', isAdmin, async (req, res)=>{
    try {
        const users = await User.find();
        res.render('admin', { users }); // Pass the 'users' data to the template
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users');
    }
}); */

// Admin route
router.get('/admin',  async (req, res) => {
    try {
        const users = await User.find().populate('orders');
        res.render('admin', { users });
    } catch (error) {
        console.error('Error fetching users and orders:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Add a route to handle user deletion
router.post('/admin/delete-user/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        // Find the user by ID and delete it
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).send('User not found');
        }
        res.redirect('/admin'); // Redirect to admin page after deletion
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal server error');
    }
});
router.get('/users', async (req, res) => {
    try {
      const usersWithOrders = await User.find().populate('orders').exec();
      res.render('duser', { users: usersWithOrders }); // Pass the usersWithOrders array to the EJS template
    } catch (error) {
      res.status(500).send(error);
    }
  });

router.post('/admin/updateOrderStatus/:orderId', async (req, res) => {
    const { orderId } = req.params; // Extract orderId from URL
    const { status } = req.body; // Extract the new status from the submitted form data

    try {
        // Find the order by ID and update its status
        await orders.findByIdAndUpdate(orderId, { status: status });

        // Redirect back or to another page after successful update
        res.redirect('back'); // or specify another path like '/manage-orders'
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).send('Error updating order status');
    }
});

module.exports = router;