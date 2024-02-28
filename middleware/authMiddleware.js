function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/user/dashboard');
    }
    next();
}

function isAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        console.log(req.user);

        if (req.user.role === 'admin') {
            return next();
        } else {
            return res.redirect('/user/dashboard');
        }
    }
    res.redirect('/account/login');
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
    isAdmin
};
