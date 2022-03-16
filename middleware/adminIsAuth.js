

exports.adminIsAuth = (req, res, next) => {
    if (!req.session.adminIsLoggedIn) {
        return res.redirect('/admin/login');
    }
    next();
}