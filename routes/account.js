const express = require('express');
const flash = require('express-flash');
const User = require('../models/users');
const passport = require('../passport/passConfig');
const router = express.Router();
const argon2 = require('argon2');
const { checkNotAuthenticated } = require('../middleware/authMiddleware');

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
        req.flash('success', " Your registeration was successfully");
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

async function hashPassword(password) {
    try {
        return await argon2.hash(password);
    } catch (error) {
        throw new Error('Error hashing password');
    }
}

module.exports = router;