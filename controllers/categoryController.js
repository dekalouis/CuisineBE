const { Category } = require("../models");

class CategoryController {
  static async createCategory(req, res) {
    try {
      const newCategory = await Category.create(req.body);

      res.status(201).json({
        data: newCategory,
        message: `Category ${req.body.name} has been created.`,
      });
    } catch (err) {
      console.log(err);
      if (err.name === "SequelizeValidationError") {
        res.status(400).json({ message: err.errors[0].message });
        return;
      }

      res.status(500).json({ message: `Internal Server Error.` });
    }
  }

  static async getCateogires(req, res) {
    try {
      const categories = await Category.findAll();
      //   console.log(Categorys);
      res.status(200).json(categories);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: `Internal Server Error.` });
    }
  }

  static async updateCategoryById(req, res) {
    try {
      if (!req.body.name) {
        res.status(400).json({ message: "Nama category diperlukan" });
        return;
      }

      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: "ID category diperlukan" });
        return;
      }

      const categoryById = await Category.findByPk(id);
      if (!categoryById) {
        res.status(404).json({ message: `Category id:${id} not found.` });
        return;
      }
      await categoryById.update(req.body);

      res.json({ message: `Category id:${categoryById.id} updated.` });
    } catch (err) {
      console.log(err);

      res.status(500).json({ message: `Internal Server Error.` });
    }
  }

  static async deleteCategoryById(req, res) {
    try {
      const { id } = req.params;
      const categoryById = await Category.findByPk(id);
      if (!categoryById) {
        res.status(404).json({ message: `Category id:${id} not found.` });
        return;
      }

      await categoryById.destroy();
      res
        .status(200)
        .json({
          message: `Category ${categoryById.name} successfully deleted`,
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: `Internal Server Error.` });
    }
  }
}

module.exports = CategoryController;
