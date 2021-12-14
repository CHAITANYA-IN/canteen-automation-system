const { Router } = require("express");

const mailer = require("../services/mail");
const { authenticator } = require("../services/middlewares");

const router = Router();

router.post("/login", [passport.authenticate("local")], (req, res) => {
  res.status(200).send(req.body);
});



router.post("/forgot", (req, res) => {});

router.post("/mail", (req, res) => {
  mailer(req.body.to, req.body.subject, req.body.content, "");
  res.status(200).json({ message: "Sent" });
});

module.exports = router;
