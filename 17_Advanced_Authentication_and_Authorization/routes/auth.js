
const express = require('express');
const authController = require('./../controllers/auth');
const router = express.Router();


router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

router.get('/resetpassword', authController.getResetPassword);
router.post('/resetpassword', authController.postResetPassword);

router.get('/newpassword', authController.getRenewPassword);
router.post('/newpassword/:token', authController.postRenewPassword);


module.exports = router;
