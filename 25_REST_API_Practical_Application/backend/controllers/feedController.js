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

//-----------------------------------------------------------
exports.createPost = (req, res, next) => {
  // Create post in db
  console.log(req.body);
  res.status(201).json({
    message: "Post created successfully !",
    post: {
      _id: Date.now().toString(),
      ...req.body,
      creator: { name: "Daniel" },
      createdAt: new Date(),
    },
  });
};
