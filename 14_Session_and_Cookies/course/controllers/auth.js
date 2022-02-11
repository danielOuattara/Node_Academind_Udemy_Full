const User = require('../models/user');



exports.getLogin = (req, res, next) => {
    let isLoggedIn = false;
    if (req.get('Cookie')) {
        let cookieArray = req.get('Cookie').split(';');
        cookieArray.forEach((cookie) => {
            if (cookie.includes('isLoggedIn')) {
                isLoggedIn = cookie.split('=')[1] === 'true';
                return isLoggedIn;
            }
        })
    }
    res.render('auth/login', {
        pageTitle: 'login',
        path: '/login',
        isAuthenticated: isLoggedIn
    });
}


exports.postLogin = (req, res, next) => {
    // req.isLoggedIn = true;  // cookie way
    // res.setHeader('Set-Cookie', 'isLoggedIn=true')
    req.session.isLoggedIn = true
    res.redirect('/');
};