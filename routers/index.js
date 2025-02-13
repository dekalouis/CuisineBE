const CuisineController = require("../controllers/cuisineController");
const CategoryController = require("../controllers/categoryController");
const UserController = require("../controllers/userController");
const express = require("express");
const authentication = require("../middlewares/authentication");
const {
  // authorizationAdmin,
  adminPrivilege,
} = require("../middlewares/authorization");
const errorHandler = require("../middlewares/errorHandlers");
const router = express.Router();
const cuisineRouter = require("./cuisineRouter");
const categoryRouter = require("./categoryRouter");
const pubRouter = require("./pubRouter");

router.get("/", (req, res) => {
  res.send(`App sukses dijalankan`);
});

//? public
// router.get("/pub/cuisines", CuisineController.getPublicCuisine);
// router.get("/pub/cuisines/:id", CuisineController.getPublicCuisineById);
router.use("/pub", pubRouter);

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
router.use("/cuisines", cuisineRouter);
//categories
router.use("/categories", categoryRouter);

router.use(errorHandler);

module.exports = router;
