const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");
const { signUpValidate } = require("./../middlewares/validators");
const multer = require("./../middlewares/multer-config");

//--------------------------------------------------------------

router.put("/signUp", signUpValidate, authController.signUp);

//--------------------------------------------------------------
module.exports = router;
