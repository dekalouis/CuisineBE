function errorHandler(err, req, res, next) {
  console.log(err);

  if (err.name === "Email dibutuhkan" || err.name === "Password dibutuhkan") {
    res.status(400).json({ message: err.name });
  } else if (err.name === "InvalidPass/Email") {
    res.status(401).json({ message: "Email/Password salah" });
  } else if (err.name === "SequelizeValidationError") {
    res.status(400).json({ message: err.errors[0].message });
  } else if (err.name === "SequelizeUniqueConstraintError") {
    res.status(400).json({ message: err.errors[0].message });
  } else if (err.name === "Forbidden") {
    res.status(403).json({ message: err.message });
  } else if (err.name === "JsonWebTokenError") {
    res.status(401).json({ message: "Invalid token" });
    return;
  } else if (err.name === "BadRequest") {
    res.status(400).json({ message: err.message });
  } else if (err.name === "Unauthorized") {
    res.status(401).json({ message: err.message });
  } else {
    res.status(500).json({ message: `Internal Server Error.` });
  }
}

module.exports = errorHandler;
