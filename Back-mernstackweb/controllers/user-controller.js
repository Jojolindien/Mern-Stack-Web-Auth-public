const User = require("../models/User-model");

exports.read = async (req, res) => {
  const userId = req.params.id;

  console.log(userId);

  User.findById(userId)
    .select("-hashed_password")
    .select("-salt")
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          message: "User not found",
        });
      }
      res.json(user);
    });
};

exports.update = async (req, res) => {
    console.log("Update - req.user :", req.auth, "req data :", req.body);
  const { name, password } = req.body;
  User.findOne({ _id: req.auth._id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    if (!name) {
      return res.status(400).json({
        message: "Name is required",
      });
    } else {
      user.name = name;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          message: "Password need 6 caracteres miniumum",
        });
      } else {
        user.password = password;
      }
    }

    user.save((err, updatedUser) => {
      if (err) {
        console.log("UserUpdate Error", err);
        return res.status(400).json({
          message: "User update failed",
        });
      }
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json(updatedUser);
    });
  });
};
