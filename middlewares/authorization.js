const authorizationAdmin = (req, res, next) => {
  try {
    console.log(req.user.role, `role usernyaaa`);
    if (req.user.role === "Admin") {
      next();
    } else {
      next({ name: "Forbidden", message: `Forbidden Access!` });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = authorizationAdmin;
