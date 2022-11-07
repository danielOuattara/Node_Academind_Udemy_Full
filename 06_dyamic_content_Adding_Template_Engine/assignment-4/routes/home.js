const path = require("path");
const express = require("express");
const rootDir = require("../util/path");
const router = express.Router();

const users = [];

router.get("/", (req, res, next) => {
  res.render("home", {
    pageTitle: "Add User",
    path: "/",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
});

router.post("/", (req, res, next) => {
  users.push({ title: req.body.title });
  res.redirect("/users");
});

exports.routes = router;
exports.users = users;
