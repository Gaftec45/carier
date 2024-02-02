const express = require('express');
const flash = require('express-flash');
const User = require('../models/users');
const { passport} = require('../passport/passConfig');
const router = express.Router();
const crypto = require('crypto');
const { checkNotAuthenticated } = require('../middleware/authMiddleware');

// Hash password with SHA-256
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

router.get('/register', (req, res) => {
    res.render('signup', { messages: req.flash() });
});

router.get('/login', (req, res) => {
    res.render('login', { messages: req.flash() });
});
/*
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

        const user = new User({ username, email, password }); // Save plain text password
        await user.save();
        req.flash('success', 'User registered successfully');
        res.render('login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});*/



router.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            req.flash('error', 'Username already exists');
            return res.render('register');
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            req.flash('error', 'Email already in use');
            return res.render('register');
        }
        const hashedPassword = hashPassword(password);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        req.flash('success', 'Your Registration was successful');
        res.render('login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}); 

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/user/dashboard',
    failureRedirect: '/account/login',
    failureFlash: true
}));

module.exports = router;