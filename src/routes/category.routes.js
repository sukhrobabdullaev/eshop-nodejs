const express = require("express");
const {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  getCategoryById,
} = require("../controllers/category.controller");

const router = express.Router();

// Routes
router.get("/", getCategories);
router.post("/create", createCategory);
router.delete("/delete/:id", deleteCategory);
router.put("/update/:id", updateCategory);
router.get("/:id", getCategoryById);

module.exports = router;
