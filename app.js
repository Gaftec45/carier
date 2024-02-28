require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const mongoose = require('mongoose');
const accountRoutes = require('./routes/account');
const dashRoutes = require('./routes/dashboard');
const {initialize} =require('./passport/passConfig');
const User = require('./models/users');
const Order = require('./models/orders');
const orderRoute = require('./routes/order');
const adminRoute = require('./routes/admin');
const createAdmin = require('./createAdmin');
const URI =process.env.MONGODB_URI || process.env.MONGO_URI;
const app = express();



async function mongoDB() {
  try {
      await mongoose.connect(URI, {
          serverSelectionTimeoutMS: 5000
      });
      console.log('Connected to MongoDB');
      return mongoose.connection; 
  } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
  }
}

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
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


initialize(passport,
    id => users.find(user => user.id === id),
    email => users.find(user => user.email === email)
)
initialize(passport);
app.use(flash());

mongoose.set('debug', true);

// Set up view engine
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// Routes
app.use('/account', accountRoutes);
app.use('/user', dashRoutes);
app.use('/order', orderRoute);
app.use('/admin', adminRoute)

app.get('/', (req, res) => {
    res.render('index'); 
});

// createAdmin()

async function startServer() {
  try {
      await mongoDB();

      const PORT = process.env.PORT_I || 4500;
      app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
      });

  } catch (error) {
      console.error('Error starting server:', error);
      process.exit(1);
  }
}

startServer();