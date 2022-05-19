const { body } = require("express-validator");
const User = require("../../models/user");

const productValidate = [
  body("title").isLength({ min: 3 }).trim(),
  body("imageUrl").isURL(),
  body("price").isFloat(),
  body("description").trim().isLength({ min: 5, max: 400 }),
];

module.exports = productValidate;
