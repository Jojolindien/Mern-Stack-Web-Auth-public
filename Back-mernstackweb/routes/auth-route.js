const express = require("express");
const { ValidationHalt } = require("express-validator/src/base");
const router = express.Router();

//import controller
const {
  signup,
  accountActivation,
  signin,
  forgotPassword,
  resetPassword,
  googleLogin,
} = require("../controllers/auth-controller");

//import validator
const {
  userSignupValidator,
  userSigninValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/auth-validator");
const { runValidation } = require("../validators/index-validators");

//routes
router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/account-activation", accountActivation);
router.post("/signin", userSigninValidator, runValidation, signin);

router.put(
  "/forgot-password",
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);
router.put(
  "/reset-password",
  resetPasswordValidator,
  runValidation,
  resetPassword
);

router.post("/google-login", googleLogin);

module.exports = router;
