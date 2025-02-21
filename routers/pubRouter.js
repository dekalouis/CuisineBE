const express = require("express");
const router = express.Router();
const CuisineController = require("../controllers/cuisineController");

router.get("/cuisines", CuisineController.getPublicCuisine);
router.get("/cuisines/:id", CuisineController.getPublicCuisineById);
router.get("/categories", CuisineController.getPublicCategories);

module.exports = router;
