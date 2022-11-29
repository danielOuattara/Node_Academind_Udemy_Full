const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: [true, "This email is already in use !"],
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "I am new!",
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

// module.exports = mongoose.model("User", userSchema); // Not convenient with Mocha testing

module.exports = mongoose.models["User"]
  ? mongoose.model("User")
  : mongoose.model("User", userSchema);
