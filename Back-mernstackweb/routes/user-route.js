const express = require("express");
const router = express.Router();

//import controller
const { read, update } = require("../controllers/user-controller");
const {
  requireSignin,
} = require("../controllers/auth-controller");

//import validator

//routes
router.put("/update", requireSignin, update);
router.get("/:id", requireSignin, read);

module.exports = router;
