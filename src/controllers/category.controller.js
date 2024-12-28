const Category = require("../models/category.model.js");

const getCategories = async (req, res) => {
  try {
    const categoryList = await Category.find();
    if (!categoryList || categoryList.length === 0) {
      res.status(404).json({ message: "Categories Not Found", success: false });
    }
    res.status(200).json(categoryList);
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

const createCategory = async (req, res) => {
  const { name, color, icon, image } = req.body;

  try {
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }

    const newCategory = await Category.create({ name, color, icon, image });

    res.status(201).json({ success: true, data: newCategory });
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ error: err.message, success: false });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, color, icon, image } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, color, icon, image },
      { new: true, runValidators: true } // `new: true` returns the updated document
    );

    if (!updatedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, data: category });
  } catch (err) {
    console.error("Error fetching category by ID:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  getCategoryById,
};
