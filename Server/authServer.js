require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");

const { loginSchema } = require("./services/validator");
const { checkSchema } = require("express-validator");
const { validate } = require("./services/middlewares");

const app = express();

app.use(express.json());

const PORT = process.env.AUTH_PORT || 3000;

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.post("/login", [checkSchema(loginSchema), validate], (req, res) => {
  // Authentication
  const user = {
    mail_id: req.body.mail_id,
    admin: req.body.admin,
    customer_id: req.body.customer_id,
  };
  const accessToken = generateAccessToken(user);
  res.json({ accessToken });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.sendStatus(200);
});

generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
};

app.listen(PORT);
