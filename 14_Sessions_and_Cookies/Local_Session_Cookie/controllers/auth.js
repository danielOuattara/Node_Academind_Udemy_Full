const { get } = require('mongoose');
const User = require('./../models/user');

//---------------------------------------------------------------

/* basic authentication 
---------------------------- */
// exports.getLogin = (req, res, next) => {
//   res.render('auth/login', {
//     pageTitle: 'Login Page',
//     path: '/login',
//     isAuthenticated: req.session.isLoggedIn // dead if the req is dead :  not good !
//   });
// };

// exports.postLogin = (req, res, next) => {
//   req.session.isLoggedIn = true // not good because this info disappear when redirection occurs: so nothing get it
//   res.redirect('/')
// };


//---------------------------------------------------------------

/* cookie authentication : cookie must be extracted in every page that requires it
---------------------------- */
// exports.getLogin = (req, res, next) => {
//   let isAuthenticated = false;
//   if(req.get('Cookie')){
//     req.get('Cookie').split(';').forEach( (cookie) => {
//       if(cookie.includes('isLoggedIn')){
//         isAuthenticated = cookie.split('=')[1] == 'true';
//       }
//     })
//   }
//   res.render('auth/login', {
//     pageTitle: 'Login Page',
//     path: '/login',
//     isAuthenticated,
//   });
// };

// exports.postLogin = (req, res, next) => {
//   res.setHeader('Set-Cookie', 'isLoggedIn=true');
//   res.redirect('/');
// };

//---------------------------------------------------------------

/* session authentication 
---------------------------- */
exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login Page',
    path: '/login',
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.redirect('/');
};

exports.postLogout = (req, res, next) => {  
  req.session.destroy( err => {
    if (err) console.log(err)
    res.redirect('/')
  })
};

//------------------------------------------------------------------

