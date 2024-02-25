// Import necessary modules
const express = require('express');
const Admin = require('../models/admin');
const User = require('../models/users');
const orders = require('../models/orders');
const crypto = require('crypto');
const { isAdmin, checkAuthenticated, checkNotAuthenticated } = require('../middleware/auth4admin');


// Create an Express router
const router = express.Router();

// Sample user data (replace with your actual user data)
const users = [
    { id: 1, username: 'admin', password: 'password' }
];

router.get('/add/new', (req, res)=>{
    res.render('add')
})
router.post('/add/new', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the username already exists
        const existingUser = await Admin.findOne({ username });
        if (existingUser) {
            req.flash('error', 'Username already exists');
            return res.render('signup', { messages: req.flash() });
        }

        // Hash the password before storing it
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // Create a new Admin instance with the hashed password
        const newAdmin = new Admin({ 
            username,
            password: hashedPassword,
            role: 'admin' 
        });

        // Save the new admin user to the database
        await newAdmin.save();
        
        console.log('Admin user created successfully.');
        res.redirect('/admin/login'); // Redirect to the login page after successful registration
    } catch (error) {
        console.error('Error creating admin user:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Define route for login page
router.get('/login', (req, res) => {
    res.render('adminLogin');
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await Admin.findOne({ username });
        if (!user) {
            req.flash('error', 'Incorrect username or password.');
            return res.render('login');
        }

        // Hash the provided password to compare it with the stored hashed password
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // Compare the hashed password with the stored hashed password
        if (user.password !== hashedPassword) {
            req.flash('error', 'Incorrect username or password.');
            return res.render('login');
        }

        // Authentication successful, store user information in the session
        req.session.user = {
            id: user._id,
            username: user.username,
            role: user.role
        };

        // Redirect to the dashboard or appropriate page after successful login
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Logout route
router.get('/logout', (req, res) => {
    // Destroy session to logout
    req.session.destroy(() => {
        res.redirect('/admin/login');
    });
});

// Define route for dashboard (requires authentication)
router.get('/dashboard', async (req, res) => {
    try {
        const users = User.find()
        const usersWithOrders = await User.find().populate('orders').exec();
        res.render('admin', { users: usersWithOrders }); // Pass the usersWithOrders array to the EJS template
    } catch (error) {
        console.error(error); 
        res.status(500).send('Internal Server Error');
    }
}); 



// Export the router to use in the main application
module.exports = router;














/* // Import necessary modules
const express = require('express');
const User = require('../models/users');
const { isAdmin } = require('../middleware/authMiddleware');
const Admin = require('../models/admin');
const orders = require('../models/orders');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');

// Create an Express router
const router = express.Router();

// Function to hash a password
function hashPassword(password) {
    return crypto.createHmac('sha256', 'a secret key')
                  .update(password)
                  .digest('hex');
}

// Sample user data (replace with your actual user data)
const users = [
    { id: 1, username: 'admin', password: 'password' }
]; 

// Configure Passport.js to use LocalStrategy for authentication
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            // Find user by username
            const user = await Admin.findOne({ username: username });

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            // Hash the input password
            const inputPasswordHashed = hashPassword(password);

            // Check if password is correct
            if (user.password === inputPasswordHashed) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password.' });
            }
        } catch (error) {
            return done(error);
        }
    }
));

// Serialize user object into session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user object from session
passport.deserializeUser((id, done) => {
    const user = users.find(user => user.id === id);
    done(null, user);
});

// Define route for admin login page
router.get('/login', (req, res) => {
    res.render('adminLogin');
});

// Authenticate user with Passport.js middleware
router.post('/login', passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login',
    failureFlash: true
}));

// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/admin/login');
});

// Define route for admin dashboard (requires authentication)
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('admin', { user: req.user });
});

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/admin/login');
}

// Export the router to use in the main application
module.exports = router;
*/