const { validationResult } = require("express-validator");
const Post = require("./../models/postModel");
const User = require("./../models/userModel");
const fs = require("fs");
const path = require("path");
const io = require("./../socket");

//-----------------------------------------------------------
exports.getPosts = async (req, res, next) => {
  try {
    const currentPage = Number(req.query.page) || 1;
    const perPage = 2;
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find({})
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    return res.status(200).json({ posts, totalItems });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//-----------------------------------------------------------
exports.createPost = async (req, res, next) => {
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

  try {
    const { title, content } = req.body;
    const imageUrl = req.file.path;

    const post = await Post.create({
      title,
      content,
      imageUrl,
      creator: req.userId,
    });

    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();

    /* 
      after saving the post in DB, and before returning 
      the response to client emit an action called "create", 
      that carrying the "post" itself to inform other clients.
    */

    io.getIO().emit("posts", { action: "create", post });

    return res
      .status(201)
      .json({ post, creator: { _id: user._id, name: user.name } });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//-----------------------------------------------------------
exports.getOnePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      const error = new Error("Post not Found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ post });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//-----------------------------------------------------------
exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    throw error;
  }

  try {
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

    const post = await Post.findById(req.params.postId);
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

    await post.save();
    return res.status(200).json({
      message: "Post updated successfully !",
      post,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
//-----------------------------------------------------------
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
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

    await post.deleteOne({ _id: req.params.postId });
    const user = await User.findById(req.userId);
    user.posts.pull(req.params.postId);
    await user.save();
    res.status(200).json({ message: "Post deleted successfully !" });
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
