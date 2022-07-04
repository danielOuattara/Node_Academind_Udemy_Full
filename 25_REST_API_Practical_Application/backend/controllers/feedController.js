const { validationResult } = require("express-validator");
const Post = require("./../models/postModel");

//-----------------------------------------------------------
exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "This is the first content",
        imageUrl: "images/dinausore.jpg",
        creator: {
          name: "Daniel",
        },
        createdAt: new Date(),
      },
    ],
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

  const { title, content } = req.body;

  const post = new Post({
    title,
    content,
    imageUrl: "images/dinausore.jpg",
    creator: { name: "Daniel" },
  });
  post.save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Post created successfully !",
        post: result,
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

// exports.createPost = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error(errors.array()[0].msg);
//     error.statusCode = 422;
//     throw error;
//   }

//   if (!req.file) {
//     const error = new Error("Image Not Provided");
//     error.statusCode = 404;
//     throw error;
//   }

//   Post.create({
//     ...req.body,
//     // imageUrl: req.file.path,
//     imageUrl: `${req.protocol}://${req.get("host")}/images/${
//       req.file.filename
//     }`,
//     creator: { name: "Daniel" },
//   })
//     .then((post) => {
//       res.status(201).json({
//         message: "Post created successfully !",
//         post,
//       });
//     })
//     .catch((error) => {
//       if (!error.statusCode) {
//         error.statusCode = 500;
//       }
//       next(error);
//     });
// };

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
