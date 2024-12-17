const express = require("express");
const {
  getProducts,
  createProduct,
} = require("../controllers/product.controller");

const router = express.Router();

// Routes
router.get("/", getProducts);
router.post("/create", createProduct);

module.exports = router;
