const { Cuisine } = require("../models");

const authorizationAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      next({ name: "Unauthorized", message: `Tidak boleh masuk!` });
      return;
    }
    // console.log(req);
    // console.log(req.user.role, `role usernyaaa`);

    //! UNTUK MASING MASING CUISINE
    if (req.originalUrl === `/cuisines/${req.params.id}`) {
      const { id } = req.params;
      const cuisineById = await Cuisine.findByPk(id);

      if (!cuisineById) {
        next({ name: "NotFound", message: `Cuisine id:${id} not found!` });
        return;
      }

      if (req.user.role !== "Admin" && cuisineById.authorId !== req.user.id) {
        next({
          name: "Forbidden",
          message: `Forbidden Access! Kamu bukan Admin!`,
        });
        return;
      }
    }
    next();
  } catch (err) {
    next(err);
  }
};

const adminPriviledge = (req, res, next) => {
  try {
    if (!req.user) {
      next({ name: "Unauthorized", message: `Tidak boleh masuk!` });
      return;
    }
    if (req.user.role === "Admin") {
      next();
    } else {
      next({
        name: "Forbidden",
        message: `Forbidden Access!`,
      });
    }
    //
  } catch (err) {
    next(err);
  }
};

module.exports = { authorizationAdmin, adminPriviledge };
