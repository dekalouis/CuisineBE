const { Category } = require("../models");

class CategoryController {
  static async createCategory(req, res, next) {
    try {
      const newCategory = await Category.create(req.body);

      res.status(201).json({
        data: newCategory,
        message: `Category ${req.body.name} has been created.`,
      });
    } catch (err) {
      next(err);
      // console.log(err);
      // if (err.name === "SequelizeValidationError") {
      //   res.status(400).json({ message: err.errors[0].message });
      //   return;
      // }

      // res.status(500).json({ message: `Internal Server Error.` });
    }
  }

  static async getCategories(req, res, next) {
    try {
      const categories = await Category.findAll();
      //   console.log(categories);
      res.status(200).json(categories);
    } catch (err) {
      next(err);
      // console.log(err);
      // res.status(500).json({ message: `Internal Server Error.` });
    }
  }

  static async updateCategoryById(req, res, next) {
    try {
      if (!req.body.name) {
        // res.status(400).json({ message: "Nama category diperlukan" });
        next({ name: "BadRequest", message: "Nama category diperlukan" });
        return;
      }

      const { id } = req.params;

      if (!id) {
        next({ name: "BadRequest", message: "ID category diperlukan" });
        // res.status(400).json({ message: "ID category diperlukan" });
        return;
      }

      const categoryById = await Category.findByPk(id);
      if (!categoryById) {
        next({ name: "NotFound", message: `Category id:${id} not found!` });
        // res.status(404).json({ message: `Category id:${id} not found.` });
        return;
      }
      await categoryById.update(req.body);

      res.json({ message: `Category id:${categoryById.id} updated.` });
    } catch (err) {
      next(err);
      // console.log(err);
      // res.status(500).json({ message: `Internal Server Error.` });
    }
  }

  static async deleteCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const categoryById = await Category.findByPk(id);
      if (!categoryById) {
        next({ name: "NotFound", message: `Category id:${id} not found!` });
        // res.status(404).json({ message: `Category id:${id} not found.` });
        return;
      }

      await categoryById.destroy();
      res.status(200).json({
        message: `Category ${categoryById.name} successfully deleted`,
      });
    } catch (err) {
      next(err);
      // console.log(err);
      // res.status(500).json({ message: `Internal Server Error.` });
    }
  }
}

module.exports = CategoryController;
