const { body } = require("express-validator");

const productValidations = [
  body("title").isLength({ min: 3 }).trim(),
  body("imageUrl").isURL(),
  body("price").isFloat(),
  body("description").isLength({ max: 400 }),
];

module.exports = productValidations;
