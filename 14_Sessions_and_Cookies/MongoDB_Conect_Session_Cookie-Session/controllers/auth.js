const { get } = require("mongoose");
const User = require("./../models/user");

//---------------------------------------------------------------

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
  req.session.isLoggedIn = true;
  req.session.user = req.user;
  res.redirect("/");
};

//------------------------------------------------------------------
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
};
