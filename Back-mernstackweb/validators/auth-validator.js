const { check } = require("express-validator");

exports.userSignupValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),

  check("password")
    .isLength({ min: 6 })
    .withMessage("password 6 caracteres long is required"),

  check("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email format is required"),
];

exports.userSigninValidator = [
  check("password")
    .isLength({ min: 5 })
    .withMessage("password 5 caracteres long is required"),

  check("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email format is required"),
];

exports.forgotPasswordValidator = [
  check("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email format is required"),
];

exports.resetPasswordValidator = [
  check("newPassword")
    .isLength({ min: 5 })
    .withMessage("password 5 caracteres long is required"),
];
