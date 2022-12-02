const express = require("express");
const authController = require("./../controllers/authControllers");
const router = express.Router();

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.get(
  "/signup-validate/:token/:email/:tokenExpiration",
  authController.getSignupValidate,
);
router.post("/signup-validate", authController.postSignupValidate);

router.get("/reset", authController.getResetPassword);
router.post("/reset", authController.postResetPassword);

router.get("/reset/:token", authController.getRenewPassword);
router.post("/newpassword", authController.postRenewPassword);

module.exports = router;
