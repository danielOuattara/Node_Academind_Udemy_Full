exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: "First Post", content: "This is the first post" }],
  });
};

exports.createPosts = (req, res, next) => {
  // Create post in db

  res.status(201).json({
      message: "Post created successfully !",
      post: { id: Date.now().toString(), ...req.body },
    });
};
