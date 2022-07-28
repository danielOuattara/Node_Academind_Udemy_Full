const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required for a new post"],
    },
    imageUrl: {
      type: String,
      required: [true, "image is required for a new post"],
    },
    content: {
      type: String,
      required: [true, "Title is required for a new post"],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
