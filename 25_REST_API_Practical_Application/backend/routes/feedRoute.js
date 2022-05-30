const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feedController");
const { postValidation } = require("./../middlewares/validators");

router.get("/posts", feedController.getPosts);
router.post("/post", postValidation, feedController.createPost);

module.exports = router;
