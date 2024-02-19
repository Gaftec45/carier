const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/admin');
const crypto = require('crypto');

function initializess(passport) {
    // Function to verify the password
    function verifyPassword(storedPassword, submittedPassword) {
        const hashedSubmittedPassword = crypto.createHash('sha256').update(submittedPassword).digest('hex');
        return storedPassword === hashedSubmittedPassword;
    }

    passport.use('admin', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const admin = await Admin.findOne({ email });
            if (!admin) {
                return done(null, false, { message: 'No admin with that email' });
            }
            const hashedSubmittedPassword = crypto.createHash('sha256').update(password).digest('hex');
            if (!verifyPassword(admin.password, hashedSubmittedPassword)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, admin);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const admin = await Admin.findById(id);
            done(null, admin);
        } catch (error) {
            done(error);
        }
    });
}

module.exports = {initializess};