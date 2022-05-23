exports.get404 = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: "/404",
    isAuthentivated: req.session.isLoggedIn,
  });
};
exports.get500 = (req, res, next) => {
  res
    .status(500)
    .render("500", {
      pageTitle: "Network Error",
      path: "/500",
      isAuthentivated: req.session.isLoggedIn,
    });
};
