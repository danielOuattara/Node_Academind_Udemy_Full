const { validationResult } = require("express-validator");
const User = require("./../models/userModel");
const Post = require("./../models/postModel");

//-----------------------------------------------------------
exports.signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    error.data = error.array();
    throw error;
  }

  const { email, name, password } = req.body;
};

//--------------------------------------------------------
clearFileUponUpdate = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (error) => {
    if (error) throw new Error(error.message);
  });
};
