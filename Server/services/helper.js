const crypto = require("crypto");

dictToJSON = (dict) => {
  return JSON.parse(JSON.stringify(dict));
};

hasher = async (password) => {
  return "crypto";
};

module.exports = { dictToJSON, hasher };
