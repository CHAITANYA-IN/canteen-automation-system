const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const authenticator = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // console.log({ authHeader });
  const token = authHeader && authHeader.split(" ")[1];
  // console.log({ token });
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    // console.log({ err, user });
    req.user = user;
    next();
  });
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    res.sendStatus(403);
  }
};

module.exports = { authenticator, isAdmin, validate };
