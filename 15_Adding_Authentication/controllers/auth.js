const User = require('./../models/user');
const bcryptjs = require('bcryptjs');
//---------------------------------------------------------------

/* session authentication 
---------------------------- */

//------------------------------------------------------------------
exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'signup Page',
    path: '/signup',
    isAuthenticated: req.session.isLoggedIn
  });
};

//------------------------------------------------------------------
exports.postSignup = (req, res, next) => {  
  User.findOne({ email: req.body.email })
    .then( userExist => {
      if(userExist) { //  ERROR: email is already used ! 
        return res.redirect('/signup');
      } 
      bcryptjs.hash(req.body.password, 11)
      .then( hashedPassword => {
        const user = new User({
          email: req.body.email, 
          password: hashedPassword,
          cart: { items: [] }
        });
        return user.save()
      })
      .then( user => {
        res.redirect('/login')
      })
    })
    .catch(err => console.log(err));
  }


//------------------------------------------------------------------
exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login Page',
    path: '/login',
    isAuthenticated: req.session.isLoggedIn
  });
};

//------------------------------------------------------------------
exports.postLogin = (req, res, next) => {
  User.findOne({email: req.body.email})
    .then( user => {
      if(!user) {  // user not found in DB
        return res.redirect('/login');
      }

      bcryptjs.compare(req.body.password, user.password)
      .then( doMatch => {
        if(!doMatch) {
          return res.redirect('/login');
        }
        
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save( err => {
          if(err) console.log(err);
          return res.redirect('/');
        });
      })
      .catch(err => {
        console.log(err)
        redirect('/login')
      })
    })
    .catch(err => {
      console.log(err)
    })
  };

//------------------------------------------------------------------
exports.postLogout = (req, res, next) => {  
  req.session.destroy( err => {
    if (err) console.log(err)
    res.redirect('/')
  })
};

