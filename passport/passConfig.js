const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');
const argon2 = require('argon2');

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Invalid email' });
        }
        const isValidPassword = verifyPassword(user.password, password);
        if (!isValidPassword) {
            return done(null, false, { message: 'Invalid password' });
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
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// Function to verify password using crypto
async function verifyPassword(hashedPassword, plainTextPassword) {
    try {
        return await argon2.verify(hashedPassword, plainTextPassword);
    } catch (error) {
        throw new Error('Error verifying password');
    }
}

module.exports = passport;