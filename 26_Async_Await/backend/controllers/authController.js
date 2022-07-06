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
exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not Found");
      error.statusCode = 404;
      throw error;
    }

    const match = await bcryptjs.compare(password, user.password);
    if (!match) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.status(201).json({ token, userId: user._id });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//--------------------------------------------------------
clearFileUponUpdate = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (error) => {
    if (error) throw new Error(error.message);
  });
};
