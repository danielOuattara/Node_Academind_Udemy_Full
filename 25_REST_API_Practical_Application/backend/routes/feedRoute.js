const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feedController");
const { postValidation } = require("./../middlewares/validators");
const multer = require("./../middlewares/multer-config");

//--------------------------------------------------------------
router.get("/posts", feedController.getPosts);
router.post("/post", multer, postValidation, feedController.createPost);
router.get("/post/:postId", feedController.getOnePost);
router.put(
  "/post/:postId",
  multer,
  postValidation,
  feedController.updatePost
);
router.delete("/post/:postId", feedController.deletePost);

//--------------------------------------------------------------
module.exports = router;
