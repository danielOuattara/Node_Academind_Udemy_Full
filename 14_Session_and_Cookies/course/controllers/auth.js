//-----------------------------------------------------------------------------------
// simple request method : req.isLoggedIn is dead as soon as req is terminated ! Bad

// exports.getLogin = (req, res, next) => {
//     res.render('auth/login', {
//         pageTitle: 'login',
//         path: '/login',
//         isAuthenticated: req.isLoggedIn
//     });
// }

// exports.postLogin = (req, res, next) => {
//     req.isLoggedIn = true; // 
//     res.redirect('/');
// };


//----------------------------------------------------------------------
//  cookie way: Good start!

// exports.getLogin = (req, res, next) => {
//     let isLoggedIn = false;
//     if (req.get('Cookie')) {
//         req.get('Cookie').split(';').forEach((cookie) => {
//             if (cookie.includes('isLoggedIn')) {
//                 isLoggedIn = cookie.split('=')[1] === 'true';
//                 return isLoggedIn;
//             }
//         })
//     }
//     res.render('auth/login', {
//         pageTitle: 'login',
//         path: '/login',
//         isAuthenticated: isLoggedIn
//     });
// }

// exports.postLogin = (req, res, next) => {
//     res.setHeader('Set-Cookie', 'isLoggedIn=true') // cookie way: Good start! 
//     res.redirect('/');
// };


//--------------------------------------------------------------------------------
//session way: Good start!


const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'login',
        path: '/login',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.postLogin = (req, res, next) => {
    User.findById('6208db9bad6fc9fa11177cbc')
        .then(user => {
            req.session.user = user;
            req.session.isLoggedIn = true;
            return req.session.save() 
        })
        .then(() => {
            res.redirect('/');
        })
        .catch(err => console.log(err))
};


exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if(err) console.log(err);
        res.redirect('/')
    })};