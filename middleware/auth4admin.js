// Middleware to check if user is authenticated
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed to the next middleware
    }
    // User is not authenticated, redirect to the home page
    res.redirect('/admin/login');
}

// Middleware to check if user is not authenticated
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        // User is authenticated, redirect to the dashboard
        return res.redirect('/admin/dashboard');
    }
    // User is not authenticated, proceed to the next middleware
    next();
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed to the next middleware/route handler
    }
    // User is not authenticated, redirect to login page or send an error response
    res.redirect('/login'); // Example: Redirect to the login page
}

function isAdmin(req, res, next) {
    console.log(req.user); // Log the user object
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    // Redirect or send error message if user is not admin
    res.redirect('/login');
}

module.exports = { 
    checkAuthenticated,
    checkNotAuthenticated, 
    isAdmin
};
