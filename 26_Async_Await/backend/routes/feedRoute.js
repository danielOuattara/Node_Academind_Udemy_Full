const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feedController");
const { postValidation } = require("./../middlewares/validators");
const multer = require("./../middlewares/multer-config");
const isAuth = require("./../middlewares/isAuth.js");

//--------------------------------------------------------------
router.get("/posts", isAuth, feedController.getPosts);
router.post(
  "/post",
  isAuth,
  multer,
  postValidation,
  feedController.createPost
);
router.get("/post/:postId", isAuth, feedController.getOnePost);
router.put(
  "/post/:postId",
  isAuth,
  multer,
  postValidation,
  feedController.updatePost
);
router.delete("/post/:postId", isAuth, feedController.deletePost);

//--------------------------------------------------------------
module.exports = router;
