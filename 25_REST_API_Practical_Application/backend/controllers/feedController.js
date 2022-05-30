const { validationResult } = require("express-validator");
const Post = require("./../models/postModel");

//-----------------------------------------------------------
exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "01",
        title: "First Post",
        content: "This is the first post",
        imageUrl: "images/abstraction.jpg",
        creator: {
          name: "Daniel",
        },
        createdAt: new Date(),
      },
      {
        _id: "02",
        title: "Second Post",
        content: "This is the second post",
        imageUrl: "images/guinness.jpg",
        creator: {
          name: "Daniel",
        },
        createdAt: new Date(),
      },
    ],
  });
};

// //-----------------------------------------------------------
// backup

// exports.createPost = (req, res, next) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(422).json({ message: errors.array()[0].msg });
//   }
//   // Create post in db

//   console.log(req.body);
//   res.status(201).json({
//     message: "Post created successfully !",
//     post: {
//       _id: Date.now().toString(),
//       ...req.body,
//       creator: { name: "Daniel" },
//       createdAt: new Date(),
//     },
//   });
// };

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
