const { Router } = require("express");
const passport = require("passport");

const router = Router();

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).send(req.body);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
