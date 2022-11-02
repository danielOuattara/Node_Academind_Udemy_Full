const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res, next) => {
  console.log('in the "/" middleware');
  res.sendFile(path.join(__dirname, "./..", "views", "shop.html"));
});

module.exports = router;
