const express = require("express");
const router = express.Router();
const userController = require("./../controllers/userController");
const isAuth = require("./../middlewares/isAuth");
const {userStatusValidation} = require("./../middlewares/validators");
//--------------------------------------------------------------

router.get("/get-status", isAuth, userController.getStatus);
router.patch(
  "/update-status",
  isAuth,
  userStatusValidation,
  userController.updateStatus
);

//--------------------------------------------------------------
module.exports = router;
