const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');
const crypto = require('crypto');

// Function to verify the password
function verifyPassword(storedPassword, submittedPassword) {
    const hashedSubmittedPassword = crypto.createHash('sha256').update(submittedPassword).digest('hex');
    return storedPassword === hashedSubmittedPassword;
}

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'No user with that email' });
        }
        const hashedSubmittedPassword = crypto.createHash('sha256').update(password).digest('hex');
        if (user.password !== hashedSubmittedPassword) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

module.exports = passport;