const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");
const {
  signUpValidation,
  loginValidation,
} = require("./../middlewares/validators");

//--------------------------------------------------------------

router.put("/signup", signUpValidation, authController.signUp);
router.post("/login", loginValidation, authController.login);

//--------------------------------------------------------------
module.exports = router;
