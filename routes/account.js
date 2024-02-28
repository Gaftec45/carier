require('dotenv').config();
const express = require('express');
const flash = require('express-flash');
const User = require('../models/users');
const router = express.Router();
const crypto = require('crypto');
const { checkNotAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const { passport } = require('../passport/passConfig');

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

router.get('/register', (req, res) => {
    res.render('signup', { messages: req.flash() });
});

router.get('/login', (req, res) => {
    res.render('login', { messages: req.flash() });
});

router.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            req.flash('error', 'Username already exists');
            return res.render('signup', { messages: req.flash() });
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            req.flash('error', 'Email already in use');
            return res.render('signup', { messages: req.flash() });
        }
        const hashedPassword = hashPassword(password);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        req.flash('success', 'Your Registration was successful');
        res.redirect('/account/login');
    } catch (error) {
        console.error(error);
        res.render('500');
    }
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    failureRedirect: '/account/login',
    failureFlash: true
}), (req, res) => {
    if (req.user.role === 'admin') {
        res.redirect('/admin/dashboard');
    } else {
        res.redirect('/user/dashboard');
    }
});


async function createDefaultAdmin() {
    try {
        const defaultAdminEmail = process.env.ADMIN_EMAIL;
        const defaultAdminPassword = process.env.ADMIN_PASSWORD;
        const defaultAdmin = await User.findOne({ email: defaultAdminEmail });
        if (!defaultAdmin) {
            const hashedPassword = hashPassword(defaultAdminPassword);
            const adminUser = new User({
                username: "admin",
                email: defaultAdminEmail,
                password: hashedPassword,
                role: "admin"
            });

            await adminUser.save();
            console.log('Default admin user created');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error("Error creating default admin user:", error);
    }
}

// createDefaultAdmin();

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router; 