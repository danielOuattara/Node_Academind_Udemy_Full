const User = require("./../models/userModel");

//--------------------------------------------------------
exports.getStatus = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User Unknown");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ status: user.status });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

//--------------------------------------------------------
exports.updateStatus = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User Unknown");
        error.statusCode = 404;
        throw error;
      }

      user.status = req.body.status;
      return user.save();
    })
    .then(() => {
      res.status(200).json({ message: "status updated !" });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
