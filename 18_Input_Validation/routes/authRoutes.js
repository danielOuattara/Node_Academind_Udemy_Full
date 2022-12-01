const express = require("express");
const authController = require("./../controllers/authControllers");
const router = express.Router();
const {
  signInValidations,
  loginValidations,
} = require("../middlewares/validators");

router.get("/signup", authController.getSignup);
router.post("/signup", signInValidations, authController.postSignup);

router.get("/login", authController.getLogin);
router.post("/login", loginValidations, authController.postLogin);
router.post("/logout", authController.postLogout);

router.get("/reset", authController.getResetPassword);
router.post("/reset", authController.postResetPassword);

router.get("/reset/:token", authController.getRenewPassword);
router.post("/newpwd", authController.postRenewPassword);

module.exports = router;
