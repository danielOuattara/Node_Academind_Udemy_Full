const path = require("path");
const fs = require("fs");
const { validationResult } = require("express-validator");
const User = require("./../models/userModel");
const Post = require("./../models/postModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

//-----------------------------------------------------------
exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  try {
    const { email, name, password } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 11);
    const user = await User.create({
      email,
      name,
      password: hashedPassword,
    });
    res.status(201).json({ user, message: "user successfully created! " });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
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

  let userOnLogin;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        const error = new Error("User not Found");
        error.statusCode = 404;
        throw error;
      }

      userOnLogin = user;

      return bcryptjs.compare(password, user.password);
    })
    .then((match) => {
      if (!match) {
        const error = new Error("Unauthorized");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          userId: userOnLogin._id,
          email: userOnLogin.email,
          name: userOnLogin.name,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );
      res.status(201).json({ token, userId: userOnLogin._id });
    })
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
