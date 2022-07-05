const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");
const { signUpValidate } = require("./../middlewares/validators");
const multer = require("./../middlewares/multer-config");

//--------------------------------------------------------------

router.put("/signup", signUpValidate, authController.signUp);
router.post("/login", authController.login);

//--------------------------------------------------------------
module.exports = router;
