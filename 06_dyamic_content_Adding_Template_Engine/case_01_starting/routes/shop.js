const path = require("path");
const express = require("express");
const rootDir = require("../util/path");
const router = express.Router();
const adminRoutes = require("./admin");

router.get("/", (req, res, next) => {
  console.log(adminRoutes.products);
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
