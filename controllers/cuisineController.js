const { Cuisine } = require("../models");

class CuisineController {
  static async createCuisine(req, res) {
    try {
      const newCuisine = await Cuisine.create(req.body);
      //   console.log(newCuisine);

      res.status(201).json({
        data: newCuisine,
        message: `Cuisine ${req.body.name} has been created`,
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

  static async getCuisine(req, res) {
    try {
      const cuisines = await Cuisine.findAll();
      //   console.log(cuisines);
      res.status(200).json(cuisines);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: `Internal Server Error.` });
    }
  }

  static async getCuisineById(req, res) {
    try {
      const { id } = req.params;
      const cuisineById = await Cuisine.findByPk(id);
      if (!cuisineById) {
        res.status(404).json({ message: `Cuisine id:${id} not found.` });
        return;
      }

      res.status(200).json(cuisineById);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: `Internal Server Error.` });
    }
  }

  static async updateCuisineById(req, res) {
    try {
      const { id } = req.params;
      const cuisineById = await Cuisine.findByPk(id);
      if (!cuisineById) {
        res.status(404).json({ message: `Cuisine id:${id} not found.` });
        return;
      }
      await cuisineById.update(req.body);
      //   console.log(cuisineById);
      //   res.status(200).json(cuisineById);
      res.json({ message: `Cuisine ${cuisineById.name} updated.` });
    } catch (err) {
      console.log(err);
      //dikasih validasi lagi in case user iseng ngosongin wkwkwk
      if (err.name === "SequelizeValidationError") {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: `Internal Server Error.` });
      }
    }
  }

  static async deleteCuisineById(req, res) {
    try {
      const { id } = req.params;
      const cuisineById = await Cuisine.findByPk(id);
      if (!cuisineById) {
        res.status(404).json({ message: `Cuisine id:${id} not found.` });
        return;
      }

      await cuisineById.destroy();
      res
        .status(200)
        .json({ message: `Cuisine ${cuisineById.name} successfully deleted` });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: `Internal Server Error.` });
    }
  }
}

module.exports = CuisineController;
