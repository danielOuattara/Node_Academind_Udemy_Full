
const User = require('../models/user');


exports.getLogin = (req, res, next) => {

    let isLoggedIn = false;
    res.render('auth/login', {
        pageTitle: 'login',
        path: '/login',
        isAuthenticated: isLoggedIn
    });
}

exports.postLogin = (req, res, next) => {  
    User.findById('620629680736ff7f92a2263a')
    .then( user => {
        req.session.user = user;
        req.session.isLoggedIn = true 
        res.redirect('/');
    })
    .catch(err => console.log(err))
};