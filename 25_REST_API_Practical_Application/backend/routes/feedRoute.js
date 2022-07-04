const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feedController");
const { postValidation } = require("./../middlewares/validators");
const multer = require("./../middlewares/multer-config");

router.get("/posts", feedController.getPosts);
router.post("/post", multer, postValidation, feedController.createPost);
router.get("/post/:postId", feedController.getOnePost);

module.exports = router;
