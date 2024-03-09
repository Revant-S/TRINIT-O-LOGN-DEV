const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const authRouters = require("./Routers/authRouters");
const testOps = require("./Routers/TestOpsRoutes");
const mongoose = require("mongoose");
const requireAuth = require("./Middlewares/authMiddleware");
const cookies = require("cookie-parser");
app.use(cookies());
app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true }));
async function serverTurnON() {
  await mongoose.connect("mongodb://localhost:27017/testformator");
  console.log("DataBase Is Connected");
  app.listen(3000, function () {
    console.log("Server is activated");
  });
}
serverTurnON();
app.use(express.json());

app.use(authRouters);
app.use("/testOptions", requireAuth, testOps);
app.use(function (err, req, res, next) {
  res.json({ msg: "Something is up with the server" });
  console.log(err);
});
