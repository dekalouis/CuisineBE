const express = require("express");
const router = express.Router();
const CuisineController = require("../controllers/cuisineController");
// const authentication = require("../middlewares/authentication");
const { authorizationAdmin } = require("../middlewares/authorization");

//multer
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", CuisineController.createCuisine);
router.get("/", CuisineController.getCuisine);
router.get("/:id", CuisineController.getCuisineById);

router.put("/:id", authorizationAdmin, CuisineController.updateCuisineById);
router.delete("/:id", authorizationAdmin, CuisineController.deleteCuisineById);
//! edit foto
router.patch(
  "/:id/image-url",
  authorizationAdmin,
  upload.single("photo"),
  CuisineController.updateImageUrl
);

module.exports = router;
