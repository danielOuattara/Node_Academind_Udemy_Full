const { validationResult } = require("express-validator");
const User = require("./../models/userModel");
const Post = require("./../models/postModel");
const bcyptjs = require("bcryptjs");

//-----------------------------------------------------------
exports.signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const { email, name, password } = req.body;
  bcyptjs
    .hash(password, 11)
    .then((hashedPassword) => {
      console.log("Here");
      return User.create({ email, name, password: hashedPassword });
    })
    .then((user) =>
      res
        .status(201)
        .json({ user, message: "user successfully created! " })
    )
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

//--------------------------------------------------------
clearFileUponUpdate = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (error) => {
    if (error) throw new Error(error.message);
  });
};
