const express = require('express');
const router = express.Router();
const {
  signupUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require('../controllers/authcontroller');;

router.post('/signup',signupUser);
router.post('/login',loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
module.exports = router;