const User = require("../models/userModel");

/* session authentication 
---------------------------- */

//------------------------------------------------------------------
exports.getLogin = (req, res) => {
  res.render("auth/login", {
    pageTitle: "Login Page",
    path: "/login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

//------------------------------------------------------------------
exports.postLogin = (req, res) => {
  User.findById("6385b5c6596218c2921e592a")
    .then((user) => {
      req.session.isLoggedIn = true;
      // here user is NOT a full mongoose model: Not all methods and properties
      req.session.user = user;
      req.session.save((err) => {
        if (err) console.log(err);
        res.redirect("/");
      });
    })
    .catch((error) => console.log(error));
};

//------------------------------------------------------------------
exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
};
