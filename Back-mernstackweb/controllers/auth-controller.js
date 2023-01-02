const jwt = require("jsonwebtoken");
const { expressjwt } = require("express-jwt");
const HttpError = require("../middleware/http-error");
const {
  sendConfirmationEmail,
  sendResetPasswordEmail,
} = require("../middleware/nodemail-config");
const _ = require("lodash");
const User = require("../models/User-model");
const { OAuth2Client } = require("google-auth-library");

// exports.signup = (req, res) => {
//   console.log("The REQ BODY is", req.body);
//   const { name, email, password } = req.body;

//   User.findOne({ email }).exec((err, user) => {
//     if (user) {
//       return res
//         .status(400)
//         .json({ error: "User email already registered, plz login" });
//     }
//   });

//   let newUser = new User({ name, email, password });

//   newUser.save((err, success) => {
//     if (err) {
//       console.log("SIGNUP ERROR", err);
//       return res.status(400).json({ error: err });
//     }
//     res.json({ message: "Signup success!" + success, user: newUser });
//   });
// };

exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signup went wrong, try again later", 500);
    return next(error);
  }

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User email already registered, plz login" });
  }

  let token;
  try {
    token = jwt.sign({ name, email, password }, process.env.SIGNUP_JWT_KEY, {
      expiresIn: "1h",
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, session creation failed, try again later",
      500
    );
    return next(error);
  }

  try {
    sendConfirmationEmail(name, email, token);
    console.log("SIGNUP EMAIL CONFIRMATION SENT");
    return res.json({
      message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, sending email activation failed, try again later",
      500
    );
    return next(error);
  }
};

exports.accountActivation = async (req, res, next) => {
  const { token } = req.body;

  if (token) {
    try {
      jwt.verify(token, process.env.SIGNUP_JWT_KEY);
    } catch (err) {
      console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err);
      const error = new HttpError("Expired link, Signup again", 401);
      return next(error);
    }

    const { name, email, password } = jwt.decode(token);

    // console.log(name, email, password);

    const user = new User({ name, email, password });

    try {
      await user.save();
    } catch (err) {
      const error = new Error(
        "Something went wrong, registration profil failed, try again later",
        500
      );
      return next(error);
    }

    res.json({ message: "Signup succes. Please signin" });
  } else {
    res.status(498).json({
      message: "Signup failed, no token activation. Please retry",
    });
  }
};

exports.signin = (req, res, next) => {
  const { email, password } = req.body;

  //check if user exist
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Account not found, please retry or signup",
      });
    }

    //authenticate (model)
    if (!user.authenticate(password)) {
      return res.status(400).json({
        message: "Wrong credentials, plz retry",
      });
    }

    //generate a token and send it to client
    try {
      const token = jwt.sign({ _id: user._id }, process.env.SIGNIN_JWT_KEY, {
        expiresIn: "1h",
      });
      const { _id, name, email, role } = user;

      return res.json({
        token,
        user: { _id, name, email, role },
      });
    } catch (err) {
      return res.status(400).json({
        message: "Signin token generator and user info failed, plz retry",
      });
    }
  });
};

//expressJwt({secret: process.env.SIGNIN_JWT_KEY}) ... will validate the token + make the data avalaible in the req => req.user._id (add the user property to the request object)
exports.requireSignin = expressjwt({
  secret: process.env.SIGNIN_JWT_KEY,
  algorithms: ["HS256"],
});

exports.adminMiddleware = (req, res, next) => {
  User.findById({ _id: req.auth._id }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        message: "user not found",
      });
    }
    console.log(user.role);
    if (user.role !== "admin") {
      return res.status(400).json({
        message: "Admin ressource acces denied",
      });
    }

    req.profile = user;
    next();
  });
};

exports.forgotPassword = (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        message: " Email error",
      });
    }

    let token;
    try {
      token = jwt.sign({ email: email }, process.env.RESETPASSWORD_JWT_KEY, {
        expiresIn: "10m",
      });
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, cookie creation failed, try again later",
        500
      );
      return next(error);
    }

    const name = user.name;

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        console.log("RESET PASSWORD LINK ERROR", err);
        return res.status(400).json({
          message: "Database connection error on user password forgot request",
        });
      } else {
        try {
          sendResetPasswordEmail(name, email, token);
          console.log("RESET PASSWORD EMAIL SENT");
          return res.json({
            message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
          });
        } catch (err) {
          const error = new HttpError(
            "Something went wrong, sending email activation failed, try again later",
            500
          );
          return next(error);
        }
      }
    });
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.RESETPASSWORD_JWT_KEY,
      function (err, decoded) {
        if (err) {
          return res.status(400).json({
            message: "error or expired link. try again",
          });
        }
        User.findOne({ resetPasswordLink }, (err, user) => {
          if (err || !user) {
            return res.status(400).json({
              message: "Cant find the user for reset password. try again",
            });
          }

          const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
          };

          user = _.extend(user, updatedFields);

          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                message: "Cant save the user with reseted password. try again",
              });
            }
            res.json({
              message: "Great! now you can login with your new password",
              user,
            });
          });
        });
      }
    );
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = (req, res) => {
  const { idToken } = req.body;
  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then((response) => {
      // console.log("GOOGLE LOGIN RESPONSE : ", response);
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign(
              { _id: user._id },
              process.env.SIGNIN_JWT_KEY,
              { expiresIn: "1h" }
            );
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          } else {
            //generate a new account
            let password = email + process.env.SIGNUP_JWT_KEY;
            user = new User({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR GOOGLE CREATE SIGNIN ON USER SAVE", err);
                return res
                  .status(404)
                  .json({ error: "User signup failed with google" });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.SIGNIN_JWT_KEY,
                { expiresIn: "1h" }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role },
              });
            });
          }
        });
      } else {
        return res
          .status(404)
          .json({ error: "Google login failed with not verified email" });
      }
    });
};
