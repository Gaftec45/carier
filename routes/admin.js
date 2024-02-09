const express = require('express');
const router = express.Router();
const User = require('../models/users');
const { isAdmin } = require('../middleware/authMiddleware');
const Admin = require('../models/admin');

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

router.get('/admin', isAdmin, async (req, res)=>{
    try {
        const users = await User.find();
        res.render('admin', { users }); // Pass the 'users' data to the template
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users');
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

module.exports = router;