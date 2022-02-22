const User = require('./../models/user');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const sendgridTransport = require('nodemailer-sendgrid-transport');


const  transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key:'RETRIEVE KEY FROM YOUR ACCOUNT' 
  }
}));


//------------------------------------------------------------------
exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    pageTitle: 'signup Page',
    path: '/signup',
    errorMessage: message
  });
};

//------------------------------------------------------------------
exports.postSignup = (req, res, next) => {  
  User.findOne({ email: req.body.email })
    .then( userExist => {
      if(userExist) { //  ERROR: email is already used ! 
        req.flash('error', 'E-Mail exists already, please pick a different one.');
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
      .then( () => {
        transporter.sendMail({
          to: req.body.email,
          from: 'from_me@gmail.com',
          subject: 'Signup successfulll !',
          html:'<h1>You succefully signed up !</h1>'
        })
        res.redirect('/login')
      })
    })
    .catch(err => console.log(err));
  }


//------------------------------------------------------------------
exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    pageTitle: 'Login Page',
    path: '/login',
    errorMessage: message
  });
};

//------------------------------------------------------------------
exports.postLogin = (req, res, next) => {
  User.findOne({email: req.body.email})
    .then( user => {
      if(!user) {  // user not found in DB
        req.flash('ErrorLogin','Invalid email OR password')
        return res.redirect('/login');
      }

      bcryptjs.compare(req.body.password, user.password)
      .then( doMatch => {
        if(!doMatch) {
          req.flash('ErrorLogin','Invalid email OR password')
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

