const express = require("express");
const {
  getProducts,
  createProduct,
  getOne,
  updateProduct,
  deleteProduct,
  getCount,
  getFeatured,
  getLimitedFeatured,
  getProductsByCategory,
} = require("../controllers/product.controller");
const uploadOptions = require("../helpers/upload-config");

const router = express.Router();

// Routes
router.get("/", getProducts);
router.get("/:id", getOne);
router.post("/create", uploadOptions.single('image'), createProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

router.get("/get/count", getCount);
router.get("/get/featured", getFeatured);
router.get("/get/featured?limit=count", getLimitedFeatured);
router.get("/get/filterbycategory", getProductsByCategory);

module.exports = router;
