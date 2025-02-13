const CuisineController = require("../controllers/cuisineController");
const CategoryController = require("../controllers/categoryController");
const UserController = require("../controllers/userController");
const express = require("express");
const authentication = require("../middlewares/authentication");
const {
  authorizationAdmin,
  adminPrivilege,
} = require("../middlewares/authorization");
const errorHandler = require("../middlewares/errorHandlers");
const router = express.Router();
//multer
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
  // authorizationAdmin,
  adminPrivilege,
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
router.delete(
  "/cuisines/:id",
  authorizationAdmin,
  CuisineController.deleteCuisineById
);
//! edit foto
router.patch(
  "/cuisines/:id/image-url",
  authorizationAdmin,
  upload.single("photo"),
  CuisineController.updateImageUrl
);

//categories
router.post("/categories", adminPrivilege, CategoryController.createCategory);
router.get("/categories", CategoryController.getCategories);
router.put(
  "/categories/:id",
  adminPrivilege,
  CategoryController.updateCategoryById
);
router.delete(
  "/categories/:id",
  adminPrivilege,
  CategoryController.deleteCategoryById
);

router.use(errorHandler);

module.exports = router;
