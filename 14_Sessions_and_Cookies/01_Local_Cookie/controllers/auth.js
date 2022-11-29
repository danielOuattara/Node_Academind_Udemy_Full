const { get } = require("mongoose");
const User = require("./../models/user");

//---------------------------------------------------------------

/* basic authentication 
---------------------------- */
// exports.getLogin = (req, res, next) => {
//   res.render("auth/login", {
//     pageTitle: "Login Page",
//     path: "/login",
//     isAuthenticated: req.isLoggedIn, // dead if the req is dead :  not good !
//   });
// };

// exports.postLogin = (req, res, next) => {
//   // not good because this info disappear when redirection occurs: so nothing reach it
//   req.isLoggedIn = true;
//   res.redirect("/");
// };

//---------------------------------------------------------------

/* cookie authentication : cookie must be extracted in every page that requires it.
Here we extract it for /login only, i.e : cookie is not visible for other pages of the app
---------------------------- */
exports.getLogin = (req, res, next) => {
  let isAuthenticated = false;
  console.log('req.get("Cookie") =', req.get("Cookie"));
  if (req.get("Cookie")) {
    req
      .get("Cookie")
      .split(";")
      .forEach((cookie) => {
        if (cookie.includes("isLoggedIn")) {
          isAuthenticated = cookie.split("=")[1] === "true";
        }
      });
  }
  res.render("auth/login", {
    pageTitle: "Login Page",
    path: "/login",
    isAuthenticated: isAuthenticated,
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader("Set-Cookie", "isLoggedIn=true;Max-age=3600");
  res.redirect("/");
};

//---------------------------------------------------------------
