const { validationResult } = require("express-validator");
const Post = require("./../models/postModel");
const User = require("./../models/userModel");
const fs = require("fs");
const path = require("path");

//-----------------------------------------------------------
exports.getPosts = (req, res, next) => {
  const currentPage = Number(req.query.page) || 1;
  const perPage = 2;
  let totalItems;

  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find({})
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res.status(200).json({ posts, totalItems });
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
  // validations results are handled here
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error("No image is provided");
    error.statusCode = 400;
    throw error;
  }

  let creator;
  const { title, content } = req.body;
  const imageUrl = req.file.path;
  const post = new Post({
    title,
    content,
    imageUrl,
    creator: req.userId,
  });
  post.save()
    .then(() => {
      return User.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      // user creator data is updated
      user.posts.push(post);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Post created successfully !",
        post,
        creator: { _id: creator._id, name: creator.name },
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

//-----------------------------------------------------------
exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    throw error;
  }

  const { title, content } = req.body;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    const error = new Error("No file picked !");
    error.statusCode = 400;
    throw error;
  }

  Post.findById(req.params.postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not Found");
        error.statusCode = 404;
        throw error;
      }

      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not Authorized");
        error.statusCode = 403;
        throw error;
      }

      if (imageUrl !== post.imageUrl) {
        clearFileUponUpdate(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;

      return post.save(); // returning the promise
    })
    .then((post) => {
      res.status(200).json({
        message: "Post updated successfully !",
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
exports.deletePost = (req, res, next) => {
  Post.findById(req.params.postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not Found");
        error.statusCode = 404;
        throw error;
      }

      // Here: check user authorization then accept/reject action
      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not Authorized");
        error.statusCode = 403;
        throw error;
      }

      clearFileUponUpdate(post.imageUrl);

      return post.deleteOne({ _id: req.params.postId });
    })
    .then(() => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(req.params.postId)
      return user.save();
    })
    .then(() =>
      res.status(200).json({ message: "Post deleted successfully !" })
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
