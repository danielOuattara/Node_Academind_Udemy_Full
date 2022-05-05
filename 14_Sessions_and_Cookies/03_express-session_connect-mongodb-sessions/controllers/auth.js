const { get } = require("mongoose");
const User = require("./../models/user");

/* session authentication 
---------------------------- */

//------------------------------------------------------------------
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login Page",
    path: "/login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

//------------------------------------------------------------------
exports.postLogin = (req, res, next) => {
  User.findById("62736e534df7769a3f585095")
    .then((user) => {
      // here user is NOT a full mongoose model: Not all methods and properties
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((error) => console.log(error));
};

//------------------------------------------------------------------
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
};
