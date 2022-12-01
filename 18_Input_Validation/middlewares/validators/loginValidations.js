const { check, body } = require("express-validator");
const User = require("./../../models/userModel");

const loginValidate = [
  // SignUp
  check("email")
    .isEmail()
    .withMessage("Email address is Invalid / Missing")
    .custom((value) => {
      return User.findOne({ email: value }).then((user) => {
        if (!user) {
          return Promise.reject("Email address is Invalid / Missing");
        }
      });
    }),

  body("password", "Please, enter your password. At least 5 chars long")
    .isLength({ min: 5 })
    .trim(),
];

module.exports = loginValidate;
