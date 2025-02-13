const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/categoryController");
// const authentication = require("../middlewares/authentication");
const { adminPrivilege } = require("../middlewares/authorization");

router.post("/", adminPrivilege, CategoryController.createCategory);
router.get("/", CategoryController.getCategories);
router.put("/:id", adminPrivilege, CategoryController.updateCategoryById);
router.delete("/:id", adminPrivilege, CategoryController.deleteCategoryById);

module.exports = router;
