const { validationResult } = require("express-validator");
const User = require("./../models/userModel");
const Post = require("./../models/postModel");
const bcryptjs = require("bcryptjs");

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
  bcryptjs
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

//-----------------------------------------------------------
exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        const error = new Error("User not Found");
        error.statusCode = 404;
        throw error;
      }

      return bcryptjs.compare(password, user.password);
    })
    .then((match) => {
      if (!match) {
        const error = new Error("Unauthorized");
        error.statusCode = 401;
        throw error;
      }
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });

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
    );
};

//--------------------------------------------------------
clearFileUponUpdate = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (error) => {
    if (error) throw new Error(error.message);
  });
};
