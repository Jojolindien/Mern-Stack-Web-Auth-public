const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// require("dotenv").config(); not working so i use nodemon.json

const app = express();

//import routes
const authRoutes = require("./routes/auth-route");
const userRoutes = require("./routes/user-route");
const adminRoutes = require("./routes/admin-route");

//app midlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());

//middlewares
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

//no routes reached
app.use((req, res, next) => {
  const error = new Error("Could not find this route", 404);
  throw error;
});

//error handling
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occured" });
});

//connection top DB (cloud atlas mongodb)
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@userclusterwebstackmern.k8vr8q0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(
        `API is running on port ${process.env.PORT} - env port : ${process.env.PORT} `
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
