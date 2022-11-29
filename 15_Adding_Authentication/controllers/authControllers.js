const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");

//------------------------------------------------------------------
exports.getSignup = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    pageTitle: "Signup Page",
    path: "/signup",
    errorMessage: message,
  });
};

//------------------------------------------------------------------
/* Async /Await */
// exports.postSignup = async (req, res) => {
//   try {
//     const oldUser = await User.findOne({ email: req.body.email });
//     if (oldUser) {
//       //  ERROR: email is already used !
//       req.flash("error", "E-Mail exists already, please pick a different one.");
//       return res.redirect("/signup");
//     }
//     const hashedPassword = await bcryptjs.hash(req.body.password, 11);
//     const user = new User({
//       email: req.body.email,
//       password: hashedPassword,
//       cart: { items: [] },
//     });
//     await user.save();
//     res.redirect("/login");
//   } catch (error) {
//     console.log(error);
//   }
// };

//-----
exports.postSignup = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        //  ERROR: email is already used !
        req.flash(
          "error",
          "E-Mail exists already, please pick a different one.",
        );
        return res.redirect("/signup");
      } else {
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
          });
      }
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
  res.render("auth/login", {
    pageTitle: "Login Page",
    path: "/login",
    errorMessage: message,
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
      } else {
        bcryptjs
          .compare(req.body.password, user.password)
          .then((isValidPassword) => {
            if (!isValidPassword) {
              req.flash("ErrorLogin", "Invalid email OR password");
              return res.redirect("/login");
            }
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(() => {
              return res.redirect("/");
            });
          })
          .catch((err) => {
            console.log(err);
            redirect("/login");
          });
      }
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
