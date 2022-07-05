const { check, body } = require("express-validator");
const User = require("./../../models/userModel");

const signUpValidate = [
  check("email")
    .isEmail()
    .withMessage("Email address is Invalid / Missing")
    // .normalizeEmail()
    .custom((value, { req }) => {
      if (value === "test@test.com") {
        throw new Error("Some words are forbidden as email parts");
      }
      // return true;

      return User.findOne({ email: req.body.email }).then((user) => {
        if (user) {
          return Promise.reject(
            "E-Mail exists already, please pick a different one."
          );
        }
      });
    }),
  body("password", "Please, enter a password at least 5 chars long")
    .trim()
    .isLength({
      min: 5,
    }),

  body("name").trim().not().isEmpty(),
];

module.exports = signUpValidate;
