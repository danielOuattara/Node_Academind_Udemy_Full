const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {} = require("./../middlewares/validators");
const multer = require("./../middlewares/multer-config");

//--------------------------------------------------------------

router.put("/signUp", authController.createUser);

//--------------------------------------------------------------
module.exports = router;
