const crypto = require("crypto"); // Node.js native module
const User = require("./../models/user");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PSWD,
  },
});

//------------------------------------------------------------------
exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    pageTitle: "signup Page",
    path: "/signup",
    errorMessage: message,
    userInputs: {
      email: "",
      // password: "",
      // passwordConfirmation: "",
    },
    validationsErrorsArray: [],
  });
};

//------------------------------------------------------------------
exports.postSignup = (req, res, next) => {
  /* validations are made in the previous middleware 
  (signUpValidation, see auth routes) but the results of 
  that validations are handled just below, before 
  the signUp controller logic 
  */

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "SignUp",
      errorMessage: errors.array()[0].msg,
      userInputs: {
        email: req.body.email,
        // password: req.body.password,
        // passwordConfirmation: req.body.passwordConfirmation,
      },
      validationsErrorsArray: errors.array(),
    });
  }

  bcryptjs
    .hash(req.body.password, 11)
    .then((hashedPassword) => {
      const user = new User({
        email: req.body.email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then(() => {
      res.redirect("/login");
      return transporter.sendMail(
        {
          from: process.env.ADMIN_EMAIL,
          to: req.body.email,
          subject: "Signup Successfull",
          html: `<h1> Signup Successfull!
            Welcome ${req.body.email} </h1>`,
        },
        function (error, info) {
          if (error) {
            console.log("EMAIL ERROR", error);
          } else {
            console.log("Email sent: " + info.response);
          }
        }
      );
    })
    .catch((error) => console.log(error));
};

//------------------------------------------------------------------
exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "Login Page",
    path: "/login",
    errorMessage: message,
    userInputs: {
      email: "",
      // password: "",
    },
    validationsErrorsArray: [],
  });
};

//------------------------------------------------------------------
exports.postLogin = (req, res, next) => {
  /* validations are made in the previous middleware 
  (loginValidation, see auth routes) but the results of 
  that validations are handled just below, before 
  the login controller logic 
  */

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      userInputs: {
        email: req.body.email,
        // password: req.body.password,
      },
      validationsErrorsArray: errors.array(),
    });
  }

  User.findOne({ email: req.body.email })
    .then((user) => {
      bcryptjs
        .compare(req.body.password, user.password)
        .then((doMatch) => {
          if (!doMatch) {
            req.flash("ErrorLogin", "Invalid email OR password");
            return res.redirect("/login");
          }

          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            if (err) console.log(err);
            return res.redirect("/");
          });
        })
        .catch((err) => {
          console.log(err);
          redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

//------------------------------------------------------------------
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
};

//------------------------------------------------------------------
exports.getResetPassword = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/resetPassword", {
    pageTitle: "Reset Password",
    path: "/reset",
    errorMessage: message,
  });
};

//------------------------------------------------------------------
// .then.catch()
exports.postResetPassword = (req, res, next) => {
  if (!req.body.email) {
    // check email provided !
    req.flash("error", "Invalid email OR password");
    return res.redirect("/login");
  }

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        // user not found in DB
        req.flash("error", "Invalid email OR password");
        return res.redirect("/login");
      }

      crypto.randomBytes(16, (err, buffer) => {
        // generate a Token
        if (err) {
          req.flash("error", "Invalid email OR password");
          console.log(err);
          return res.redirect("/reset");
        }
        const token = buffer.toString("hex");
        user.resetPasswordToken = token;
        const limitTime = 10; // minutes
        user.resetPasswordTokenExpiration = Date.now() + limitTime * 60 * 1000;
        user.save().then(() => {
          res.redirect("/login");
          return transporter.sendMail(
            {
              from: process.env.ADMIN_EMAIL,
              to: req.body.email,
              subject: "Password reset !",
              html: `
            <h1> Password Reset !
            Welcome ${req.body.email} </h1>
            <p>You request a password rest</p>
            <p>Click <a href="http://localhost:3000/reset/${token}">Reset Password</a> to reset your password</p>
            <p>You have ${limitTime} minutes to reset your password.</p>
            <p>Thank you.</p>`,
            },
            function (error, info) {
              if (error) {
                console.log("EMAIL ERROR", error);
              } else {
                console.log("Email sent: " + info.response);
              }
            }
          );
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//------------------------------------------------------------------
exports.getRenewPassword = (req, res, next) => {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid User, Try Again");
        return res.redirect("/login");
      }

      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/newPassword", {
        pageTitle: "Renew Password",
        path: "/reset",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: req.params.token,
      });
    })
    .catch((error) => console.log(error));
};

//---------------------------------------------------------------------------

exports.postRenewPassword = (req, res, next) => {
  User.findOne({
    resetPasswordToken: req.body.passwordToken,
    resetPasswordTokenExpiration: { $gt: Date.now() },
    _id: req.body.userId,
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "Error, Try Again");
        return res.redirect("/login");
      }

      bcryptjs
        .hash(req.body.password, 11)
        .then((hash) => {
          user.password = hash;
          user.resetPasswordToken = undefined;
          user.resetPasswordTokenExpiration = undefined;
          return user.save();
        })
        .then(() => {
          req.flash("success", "Update successfull, try login again ;)");
          res.redirect("/login");

          return transporter.sendMail(
            {
              from: process.env.ADMIN_EMAIL,
              to: user.email,
              subject: "Password reset !",
              html: `
            <h1> Password Reset Success!
            Welcome again ${user.email} </h1>
            <p>You request a password rest</p>
            <p>Your password has been succefully updated.</p>
            <p>Thank you.</p>`,
            },
            function (error, info) {
              if (error) {
                console.log("EMAIL ERROR", error);
              } else {
                console.log("Email sent: " + info.response);
              }
            }
          );
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
