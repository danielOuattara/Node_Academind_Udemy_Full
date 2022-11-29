const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  let isLoggedIn = false;
  res.render("auth/login", {
    pageTitle: "login",
    path: "/login",
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("62850447f0e0bafec68c0989")
    .then((user) => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};
