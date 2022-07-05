const mongoose = require("mongoose");
const { schema } = require("./postModel");

//--------------------------------------------------------------
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    posts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

//--------------------------------------------------------------
module.exports = mongoose.model("User", userSchema);
