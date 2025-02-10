const CuisineController = require("../controllers/cuisineController");
const CategoryController = require("../controllers/categoryController");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send(`App sukses dijalankan`);
});

router.post("/cuisines", CuisineController.createCuisine);
router.get("/cuisines", CuisineController.getCuisine);
router.get("/cuisines/:id", CuisineController.getCuisineById);

router.put("/cuisines/:id", CuisineController.updateCuisineById);
router.delete("/cuisines/:id", CuisineController.deleteCuisineById);

//categories
router.post("/categories", CategoryController.createCategory);
router.get("/categories", CategoryController.getCateogires);
router.put("/categories/:id", CategoryController.updateCategoryById);
router.delete("/categories/:id", CategoryController.deleteCategoryById);

module.exports = router;
