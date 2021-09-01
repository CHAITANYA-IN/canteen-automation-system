const authenticator = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(403).json({ error: "Unauthorized" });
  }
};

module.exports = authenticator;
