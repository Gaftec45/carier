// Middleware to check if user is authenticated
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed to the next middleware
    }
    // User is not authenticated, redirect to the home page
    res.redirect('/');
}

// Middleware to check if user is not authenticated
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        // User is authenticated, redirect to the dashboard
        return res.redirect('/user/dashboard');
    }
    // User is not authenticated, proceed to the next middleware
    next();
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated
};
