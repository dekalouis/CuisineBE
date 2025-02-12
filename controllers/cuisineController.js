const { Cuisine, User } = require("../models");

class CuisineController {
  static async createCuisine(req, res, next) {
    try {
      const userId = req.user.id;

      const newCuisine = await Cuisine.create({
        ...req.body,
        authorId: userId,
      });
      //   console.log(newCuisine);

      res.status(201).json({
        data: newCuisine,
        message: `Cuisine ${req.body.name} has been created.`,
      });
    } catch (err) {
      //   console.log(err);
      //   if (err.name === "SequelizeValidationError") {
      //     res.status(400).json({ message: err.errors[0].message });
      //     return;
      //   }
      //   res.status(500).json({ message: `Internal Server Error.` });
      next(err);
    }
  }

  static async getCuisine(req, res, next) {
    try {
      const cuisines = await Cuisine.findAll({
        include: [
          {
            model: User,
            attributes: { exclude: ["password"] },
          },
        ],
      });
      //   console.log(cuisines);
      res.status(200).json(cuisines);
    } catch (err) {
      //   console.log(err);
      //   res.status(500).json({ message: `Internal Server Error.` });
      next(err);
    }
  }

  static async getCuisineById(req, res, next) {
    try {
      const { id } = req.params;
      const cuisineById = await Cuisine.findByPk(id, {
        include: [
          {
            model: User,
            attributes: { exclude: ["password"] },
          },
        ],
      });
      if (!cuisineById) {
        next({ name: "NotFound", message: `Cuisine id:${id} not found!` });
        // res.status(404).json({ message: `Cuisine id:${id} not found.` });
        // return;
      } else {
        res.status(200).json(cuisineById);
      }
    } catch (err) {
      next(err);
    }
  }

  static async updateCuisineById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      if (!id) {
        // res.status(400).json({ message: "ID cuisine diperlukan" });
        next({ name: "BadRequest", message: "ID cuisine diperlukan" });
        return;
      }

      //validasi manual
      if (!req.body.name) {
        // res.status(400).json({ message: "Nama cuisine diperlukan" });
        next({ name: "BadRequest", message: "Nama cuisine diperlukan" });
        return;
      }
      if (!req.body.description) {
        // res.status(400).json({ message: "Description diperlukan" });
        next({ name: "BadRequest", message: "Description diperlukan" });
        return;
      }
      if (!req.body.price) {
        // res.status(400).json({ message: "Harga diperlukan" });
        next({ name: "BadRequest", message: "Harga diperlukan" });
        return;
      }
      if (!req.body.categoryId) {
        // res.status(400).json({ message: "Category diperlukan" });
        next({ name: "BadRequest", message: "Category diperlukan" });
        return;
      }
      //   if (!req.body.authorId) {
      //     // res.status(400).json({ message: "Author diperlukan" });
      //     next({ name: "BadRequest", message: "Author diperlukan" });
      //     return;
      //   }
      //validasi selesai

      const cuisineById = await Cuisine.findByPk(id);

      if (!cuisineById) {
        // res.status(404).json({ message: `Cuisine id:${id} not found.` });
        next({ name: "NotFound", message: `Cuisine id:${id} not found!` });
        return;
      }
      console.log(
        userRole,
        `INI ROLENYA DAN IDnYA`,
        cuisineById.authorId,
        `JUGA,`,
        userId
      );

      //   if (userRole !== "Admin" && cuisineById.authorId !== userId) {
      //     // return res.status(403).json({ message: "Forbidden hanya bisa mengupdate makanan sendiri!" });
      //     next({
      //       name: "Forbidden",
      //     });
      //     return;
      //   }

      await cuisineById.update(req.body);
      //   console.log(cuisineById);
      //   res.status(200).json(cuisineById);
      res.json({ message: `Cuisine id:${cuisineById.id} updated.` });
    } catch (err) {
      //   console.log(err);
      //dikasih validasi lagi in case user iseng ngosongin wkwkwk
      //   if (err.name === "SequelizeValidationError") {
      //     res.status(400).json({ message: err.errors[0].message });
      //   } else {
      //     res.status(500).json({ message: `Internal Server Error.` });
      //   }
      next(err);
    }
  }

  static async deleteCuisineById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;
      const cuisineById = await Cuisine.findByPk(id);
      if (!cuisineById) {
        next({ name: "NotFound", message: `Cuisine id:${id} not found!` });
        return;
      }

      if (userRole !== "Admin" && cuisineById.authorId !== userId) {
        next({
          name: "Forbidden",
          message: "Forbidden hanya bisa mengupdate makanan sendiri!",
        });
        return;
      }

      await cuisineById.destroy();
      res
        .status(200)
        .json({ message: `Cuisine ${cuisineById.name} successfully deleted` });
    } catch (err) {
      next(err);
    }
  }

  static async getPublicCuisine(req, res, next) {
    try {
      const cuisines = await Cuisine.findAll();
      //   console.log(cuisines);
      res.status(200).json(cuisines);
    } catch (err) {
      //   console.log(err);
      //   res.status(500).json({ message: `Internal Server Error.` });
      next(err);
    }
  }

  static async getPublicCuisineById(req, res, next) {
    try {
      const { id } = req.params;
      const cuisineById = await Cuisine.findByPk(id);
      if (!cuisineById) {
        next({ name: "NotFound", message: `Cuisine id:${id} not found!` });
        return;
      }

      res.status(200).json(cuisineById);
    } catch (err) {
      //   console.log(err);
      //   res.status(500).json({ message: `Internal Server Error.` });
      next(err);
    }
  }
}

module.exports = CuisineController;
