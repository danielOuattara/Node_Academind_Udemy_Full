const { body } = require("express-validator");

const postValidation = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage("Title must be between 5 and 50 chars long"),
  body("content")
    .trim()
    .isLength({ min: 5, max: 400 })
    .withMessage("Content must be between 5 and 400 chars long"),
  //   body("imageUrl").isURL().withMessage("Image url is required"),
];

module.exports = postValidation;
