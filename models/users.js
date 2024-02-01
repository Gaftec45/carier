const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/ // Email validation regex
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user' // Default role is 'user'
  }
});

// Add Passport Local Mongoose plugin
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);






/*const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user' // Default role is 'user'
  }
});

// Add Passport Local Mongoose plugin
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

*/