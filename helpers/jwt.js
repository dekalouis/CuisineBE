const jwt = require("jsonwebtoken");

// encoding
// let token = jwt.sign({ name: "JOKO" }, "shhh");
// console.log(token);

function signToken(data) {
  return jwt.sign(data, process.env.JWT_SECRET_KEY);
}

// decoding
// let decoded = jwt.verify(token, "shhh");
// console.log(decoded);

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
}

module.exports = {
  signToken,
  verifyToken,
};
