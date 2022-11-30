const crypto = require("crypto"); // Node.js native module
const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");

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
exports.getSignup = (req, res) => {
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
  });
};

//------------------------------------------------------------------
exports.postSignup = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((userExist) => {
      if (userExist) {
        //  ERROR: email is already used !
        req.flash(
          "error",
          "E-Mail exists already, please pick a different one.",
        );
        return res.redirect("/signup");
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
            },
          );
        })
        .catch((error) => console.log(error));
    })
    .catch((err) => console.log(err));
};

//------------------------------------------------------------------
exports.getLogin = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  let infoMessage = req.flash("info");
  if (infoMessage.length > 0) {
    infoMessage = infoMessage[0];
  } else {
    infoMessage = null;
  }
  res.render("auth/login", {
    pageTitle: "Login Page",
    path: "/login",
    errorMessage: message,
    infoMessage,
  });
};

//------------------------------------------------------------------
exports.postLogin = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        // user not found in DB
        req.flash("error", "Invalid email OR password");
        return res.redirect("/login");
      }

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
exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
};

//------------------------------------------------------------------
exports.getResetPassword = (req, res) => {
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
// async/await: function called on "reset Password" button clicked
exports.postResetPassword = async (req, res) => {
  try {
    // check email provided !
    if (!req.body.email) {
      req.flash(
        "error",
        "Please provide a valid email for resetting your password",
      );
      return res.redirect("/reset");
    }

    const user = await User.findOne({ email: req.body.email });
    // user not found in DB
    if (!user) {
      req.flash(
        "info",
        "Check your email box for more instructions to reset your password",
      );
      return res.redirect("/login");
    }
    let token;
    // generate a Token
    crypto.randomBytes(16, async (err, buffer) => {
      if (err) {
        req.flash("error", `${err.message}`);
        return res.redirect("/reset");
      }

      token = buffer.toString("hex");
      user.resetPasswordToken = token;
      const limitTime = 7; // minutes
      user.resetPasswordTokenExpiration = Date.now() + limitTime * 60 * 1000;

      await user.save();

      req.flash(
        "info",
        "Check your email box for more instructions to reset your password",
      );
      res.redirect("/login");
      await transporter.sendMail(
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
        },
      );
    });
  } catch (error) {
    console.log(error);
  }
};
// //----
// // .then.catch(): function called on "reset Password" button clicked
// // OK!
// exports.postResetPassword = (req, res) => {
//   if (!req.body.email) {
//     // check email provided !
//     req.flash(
//       "error",
//       "Please provide a valid email for resetting your password",
//     );
//     return res.redirect("/reset");
//   }

//   User.findOne({ email: req.body.email })
//     .then((user) => {
//       if (!user) {
//         // user not found in DB
//         req.flash(
//           "info",
//           "Check your email box for more instructions to reset your password",
//         );
//         return res.redirect("/login");
//       }

//       crypto.randomBytes(16, (err, buffer) => {
//         // generate a Token
//         if (err) {
//           req.flash("error", `${err.message}`);
//           console.log(err);
//           return res.redirect("/reset");
//         }
//         const token = buffer.toString("hex");
//         user.resetPasswordToken = token;
//         const limitTime = 10; // minutes
//         user.resetPasswordTokenExpiration = Date.now() + limitTime * 60 * 1000;
//         user.save().then(() => {
//           res.redirect("/login");
//           return transporter.sendMail(
//             {
//               from: process.env.ADMIN_EMAIL,
//               to: req.body.email,
//               subject: "Password reset !",
//               html: `
//             <h1> Password Reset !
//             Welcome ${req.body.email} </h1>
//             <p>You request a password rest</p>
//             <p>Click <a href="http://localhost:3000/reset/${token}">Reset Password</a> to reset your password</p>
//             <p>You have ${limitTime} minutes to reset your password.</p>
//             <p>Thank you.</p>`,
//             },
//             function (error, info) {
//               if (error) {
//                 console.log("EMAIL ERROR", error);
//               } else {
//                 console.log("Email sent: " + info.response);
//               }
//             },
//           );
//         });
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

//------------------------------------------------------------------
// async/await  OK !!
//
// exports.getRenewPassword = async (req, res) => {
//   try {
//     const user = await User.findOne({
//       resetPasswordToken: req.params.token,
//       resetPasswordTokenExpiration: { $gt: Date.now() },
//     });
//     if (!user) {
//       req.flash("error", "Invalid User, Try Again");
//       return res.redirect("/login");
//     }

//     let message = req.flash("error");
//     if (message.length > 0) {
//       message = message[0];
//     } else {
//       message = null;
//     }
//     res.render("auth/newPassword", {
//       pageTitle: "Renew Password",
//       path: "/reset",
//       errorMessage: message,
//       userId: user._id.toString(),
//       passwordToken: req.params.token,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
//------
// .then().catch()
//
exports.getRenewPassword = (req, res) => {
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

// exports.postRenewPassword = async (req, res) => {
//   try {
//     const user = await User.findOne({
//       resetPasswordToken: req.body.passwordToken,
//       resetPasswordTokenExpiration: { $gt: Date.now() },
//       _id: req.body.userId,
//     });
//     if (!user) {
//       req.flash("error", "Error, Try Again");
//       return res.redirect("/login");
//     }

//     const hash = await bcryptjs.hash(req.body.password, 11);
//     user.password = hash;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordTokenExpiration = undefined;
//     await user.save();
//     req.flash("success", "Update successfull, try login again ;)");
//     res.redirect("/login");

//     await transporter.sendMail(
//       {
//         from: process.env.ADMIN_EMAIL,
//         to: user.email,
//         subject: "Password reset !",
//         html: `
//             <h1> Password Reset Success!
//             Welcome again ${user.email} </h1>
//             <p>You request a password rest</p>
//             <p>Your password has been succefully updated.</p>
//             <p>Thank you.</p>`,
//       },
//       function (error, info) {
//         if (error) {
//           console.log("EMAIL ERROR", error);
//         } else {
//           console.log("Email sent: " + info.response);
//         }
//       },
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };
//
//-----

exports.postRenewPassword = (req, res) => {
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
            },
          );
        });
    })
    .catch((err) => console.log(err));
};
