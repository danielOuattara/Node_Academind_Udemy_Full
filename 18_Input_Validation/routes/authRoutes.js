const express = require("express");
const authController = require("./../controllers/authControllers");
const router = express.Router();
const { signInValidate, loginValidate } = require("../middlewares/validators");

router.get("/signup", authController.getSignup);
router.post("/signup", signInValidate, authController.postSignup);

router.get("/login", authController.getLogin);
router.post("/login", loginValidate, authController.postLogin);
router.post("/logout", authController.postLogout);

router.get("/reset", authController.getResetPassword);
router.post("/reset", authController.postResetPassword);

router.get("/reset/:token", authController.getRenewPassword);
router.post("/newpwd", authController.postRenewPassword);

module.exports = router;
