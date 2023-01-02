const express = require("express");
const router = express.Router();

//import controller
const { read, update } = require("../controllers/user-controller");
const {
  requireSignin,
  adminMiddleware,
} = require("../controllers/auth-controller");

//import validator

//routes
router.put("/update", requireSignin, adminMiddleware, update);


module.exports = router;
