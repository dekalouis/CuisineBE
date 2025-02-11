const CuisineController = require("../controllers/cuisineController");
const CategoryController = require("../controllers/categoryController");
const UserController = require("../controllers/userController");
const express = require("express");
const authentication = require("../middlewares/authentication");
const authorizationAdmin = require("../middlewares/authorization");
const errorHandler = require("../middlewares/errorHandlers");
const router = express.Router();

// const { verifyToken } = require("../helpers/jwt");
// const { User } = require("../models/");

router.get("/", (req, res) => {
  res.send(`App sukses dijalankan`);
});

//? public
router.get("/pub/cuisines", CuisineController.getPublicCuisine);
router.get("/pub/cuisines/:id", CuisineController.getPublicCuisineById);

//userendpoints:
router.post(
  "/add-user",
  authentication,
  authorizationAdmin,
  UserController.addUser
);
router.post("/login", UserController.login);

router.use(authentication);
//main table- cuisine
router.post("/cuisines", CuisineController.createCuisine);
router.get("/cuisines", CuisineController.getCuisine);
router.get("/cuisines/:id", CuisineController.getCuisineById);

router.put(
  "/cuisines/:id",
  authorizationAdmin,
  CuisineController.updateCuisineById
);
router.delete("/cuisines/:id", CuisineController.deleteCuisineById);

//categories
router.post("/categories", CategoryController.createCategory);
router.get("/categories", CategoryController.getCateogires);
router.put("/categories/:id", CategoryController.updateCategoryById);
router.delete("/categories/:id", CategoryController.deleteCategoryById);

router.use(errorHandler);

module.exports = router;
