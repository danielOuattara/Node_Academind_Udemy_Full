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
      type: Object,
      required: [true, "Creator is required for a new post"],
    },

    // ownerId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: [true, "OwnerId is required for a new post"],
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
