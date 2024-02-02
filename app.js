require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const mongoose = require('mongoose');
const accountRoutes = require('./routes/account');
const dashRoutes = require('./routes/dashboard');
const User = require('./models/users');
const app = express();

mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Extend timeout to 5000ms or more
  }).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));
  

// Set up session middleware with a fallback secret key
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
passport.use(User.createStrategy()); // Assuming passport-local-mongoose is used for User model
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set up express-flash middleware
app.use(flash());

mongoose.set('debug', true);

// Set up view engine
app.set('view engine', 'ejs');

// Body parser middleware to parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Routes
app.use('/account', accountRoutes);
app.use('/user', dashRoutes);

app.get('/', (req, res) => {
    res.render('index'); 
});

// Listening on port from environment variable or fallback to 4500
const PORT = process.env.PORT_I || 4500;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
