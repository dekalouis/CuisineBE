const jwt = require("jsonwebtoken");

// encoding
// let token = jwt.sign({ name: "JOKO" }, "shhh");
// console.log(token);

function signToken(data) {
  return jwt.sign(data, "secret_key");
}

// decoding
// let decoded = jwt.verify(token, "shhh");
// console.log(decoded);

function verifyToken(token) {
  return jwt.verify(token, "secret_key");
}

module.exports = {
  signToken,
  verifyToken,
};
