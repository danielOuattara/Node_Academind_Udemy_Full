/* 1 */
// module.exports = {
//   hello() {
//     return 'Hello World!'
//   },
// }

//-----------------------------

/* 2 */
// module.exports = {
//   hello() {
//     return {
//       text: 'Hello World!',
//       views: 12344,
//     }
//   },
// }

const User = require("./../models/userModel");
const Post = require("./../models/postModel");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const clearFile = require("./../utilities/clearFile");

module.exports = {
  hello() {
    return {
      text: "Hello World!",
      views: 12344,
    };
  },

  //-------------------------------------------
  createUser: async function (args, req) {
    const { email, name, password } = args.userInput;

    const errors = [];
    if (!validator.isEmail(email) || validator.isEmpty(email)) {
      errors.push(new Error("E-mail is invalid"));
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    ) {
      const error = new Error("Password is missing / too short");
      errors.push(error);
    }
    if (errors.length > 0) {
      errors.forEach((err) => {
        err.code = 400;
        throw err;
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User email already used");
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 11);
    const user = await User.create({ email, name, password: hashedPassword });
    return { ...user._doc, _id: user._id.toString() };
  },

  //-------------------------------------------
  login: async function (args, req) {
    const { email, password } = args;

    const errors = [];
    if (!validator.isEmail(email) || validator.isEmpty(email)) {
      errors.push(new Error("E-mail is invalid"));
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    ) {
      const error = new Error("Password is missing / too short");
      errors.push(error);
    }
    if (errors.length > 0) {
      errors.forEach((err) => {
        err.code = 400;
        throw err;
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Email OR Password is invalid");
      error.code = 403;
      throw error;
    }

    const isPasswordOk = await bcrypt.compare(password, user.password);
    if (!isPasswordOk) {
      const error = new Error("Email OR Password is invalid");
      error.code = 403;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

    return { userId: user._id, token };
  },

  //-------------------------------------------
  getAllPosts: async function ({ page }, req) {
    if (!req.isAuthenticated) {
      const error = new Error("User Not Authenticated");
      error.code = 401;
      throw error;
    }

    page = page || 1;
    const perPage = 2;
    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find({})
      .populate("creator")
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);
    return {
      posts: posts.map((item) => ({
        ...item._doc,
        _id: item._id.toString(),
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
      totalPosts,
    };
  },
  //-------------------------------------------
  getOnePost: async function (args, req) {
    if (!req.isAuthenticated) {
      const error = new Error("User Not Authenticated");
      error.code = 401;
      throw error;
    }
    const { id } = args;
    const post = await Post.findById(id).populate("creator");
    if (!post) {
      const error = new Error("No post found");
      error.code = 404;
      throw error;
    }

    return { ...post._doc, createdAt: post.createdAt.toISOString() };
  },

  //-------------------------------------------

  createPost: async (args, req) => {
    if (!req.isAuthenticated) {
      const error = new Error("User Not Authenticated");
      error.code = 401;
      throw error;
    }

    if (!req.userId) {
      const error = new Error("User Not Authenticated");
      error.code = 401;
      throw error;
    }

    const { title, content, imageUrl } = args.postInput;

    // validations are handled here
    const errors = [];
    if (validator.isEmpty(title)) {
      errors.push(new Error("Title cannot be empty"));
    }
    if (validator.isEmpty(content)) {
      errors.push(new Error("Description cannot be empty"));
    }
    if (validator.isEmpty(imageUrl)) {
      errors.push(new Error("No image is provided"));
    }
    if (errors.length > 0) {
      errors.forEach((err) => {
        err.code = 400;
        throw err;
      });
    }

    const user = await User.findById(req.userId);

    const post = await Post.create({
      title,
      content,
      imageUrl,
      creator: user,
    });

    user.posts.push(post);
    await user.save();

    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toString(),
    };
  },

  //-----------------------------------------------
  updatePost: async function (args, req) {
    if (!req.isAuthenticated) {
      const error = new Error("User Not Authenticated");
      error.code = 401;
      throw error;
    }

    if (!req.userId) {
      const error = new Error("User Not Authenticated");
      error.code = 401;
      throw error;
    }

    const { id, postInput } = args;

    const post = await Post.findById(id).populate("creator");
    if (!post) {
      const error = new Error("No post found");
      error.code = 404;
      throw error;
    }

    // Here: check user authorization then accept/reject action
    if (post.creator._id.toString() !== req.userId.toString()) {
      const error = new Error("Not Authorized");
      error.statusCode = 403;
      throw error;
    }

    // validations are handled here
    const errors = [];
    if (validator.isEmpty(postInput.title)) {
      errors.push(new Error("Title cannot be empty"));
    }
    if (validator.isEmpty(postInput.content)) {
      errors.push(new Error("Description cannot be empty"));
    }
    if (errors.length > 0) {
      errors.forEach((err) => {
        err.code = 400;
        throw err;
      });
    }

    post.title = postInput.title;
    post.content = postInput.content;
    if (postInput.imageUrl !== "undefined") {
      post.imageUrl = postInput.imageUrl;
    }

    await post.save();

    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.updatedAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  },

  //----------------------
  deletePost: async function (args, req) {
    if (!req.isAuthenticated) {
      const error = new Error("User Not Authenticated");
      error.code = 401;
      throw error;
    }

    if (!req.userId) {
      const error = new Error("User Not Authenticated");
      error.code = 401;
      throw error;
    }

    const { id } = args;
    const post = await Post.findById(id);
    if (!post) {
      const error = new Error("No post found");
      error.code = 404;
      throw error;
    }

    // Here: check user authorization then accept/reject action
    if (post.creator.toString() !== req.userId.toString()) {
      const error = new Error("Not Authorized");
      error.statusCode = 403;
      throw error;
    }
    const user = await User.findById(post.creator);
    user.posts.pull(id);
    await user.save();

    clearFile(post.imageUrl);
    await post.delete();

    return id;
  },

  //------------------------------------
  getUserStatus: async function (args, req) {
    if (!req.isAuthenticated) {
      const error = new Error("User Not Authenticated");
      error.code = 401;
      throw error;
    }

    if (!req.userId) {
      const error = new Error("User Not Authenticated");
      error.code = 401;
      throw error;
    }

    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("No User found");
      error.code = 404;
      throw error;
    }
    return user.status;
  },
  //------------------------------------
  updateUserStatus: async function (args, req) {
    if (!req.isAuthenticated) {
      const error = new Error("User Not Authenticated");
      error.code = 401;
      throw error;
    }

    if (!req.userId) {
      const error = new Error("User Not Authenticated");
      error.code = 401;
      throw error;
    }

    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("No User found");
      error.code = 404;
      throw error;
    }

    user.status = args.status;
    await user.save();

    return user.status;
  },
  //------------------------------------
};
