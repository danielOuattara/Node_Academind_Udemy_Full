const { validationResult } = require("express-validator");
const Post = require("./../models/postModel");

//-----------------------------------------------------------
exports.getPosts = (req, res, next) => {
  Post.find({})
    .then((posts) => {
      if (!posts) {
        const error = new Error("Posts not Found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "Post found successfully !",
        posts,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

//-----------------------------------------------------------
exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    throw error;
  }

  Post.create({
    ...req.body,
    ...req.file,
    // imageUrl: "/images/anyPhoto.jpg",
    creator: { name: "Daniel" },
  })
    .then((post) => {
      res.status(201).json({
        message: "Post created successfully !",
        post,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

//-----------------------------------------------------------
exports.getOnePost = (req, res, next) => {
  Post.findById(req.params.postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not Found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "Post found successfully !",
        post,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};
