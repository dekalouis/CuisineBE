function errorHandler(err, req, res, next) {
  console.log(err);

  if (err.name === "NotFound") {
    res.status(404).json({ message: err.message });
  } else if (err.name === "InvalidPassEmail") {
    //email pass salah
    res.status(401).json({ message: err.message });
  } else if (err.name === "SequelizeValidationError") {
    //field ga lengkap (sqlize)
    res.status(400).json({ message: err.errors[0].message });
  } else if (err.name === "SequelizeUniqueConstraintError") {
    //sequelize untuk object yang harus unique
    res.status(400).json({ message: err.errors[0].message });
  } else if (err.name === "BadRequest") {
    //password/email ga diisi
    res.status(400).json({ message: err.message });
  } else if (err.name === "Forbidden") {
    //kalau tokennya salah
    res.status(403).json({ message: err.message });
  } else if (err.name === "Unauthorized") {
    //Not sure
    res.status(401).json({ message: err.message });
  } else if (err.name === "JsonWebTokenError") {
    //kalau tokennya salah saat nyoba activity CRUD
    res.status(401).json({ message: "Invalid token" });
  } else {
    res.status(500).json({ message: `Internal Server Error.` });
  }
}

module.exports = errorHandler;
