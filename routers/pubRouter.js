const express = require("express");
const router = express.Router();
const CuisineController = require("../controllers/cuisineController");

router.get("/cuisines", CuisineController.getPublicCuisine);
router.get("/cuisines/:id", CuisineController.getPublicCuisineById);

module.exports = router;
