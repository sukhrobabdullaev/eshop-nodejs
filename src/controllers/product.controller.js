const Product = require("../models/product.model.js");

getProducts = async (req, res) => {
  try {
    const productList = await Product.find();
    if (!productList || productList.length === 0) {
      res.status(404).json({ message: "Products Not Found", success: false });
    }
    res.status(200).json(productList);
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};
getOne = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Products Not Found", success: false });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

createProduct = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.image ||
    req.body.countInStock === undefined
  ) {
    return res
      .status(400)
      .json({ message: "Missing required fields", success: false });
  }

  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  try {
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

module.exports = { getProducts, createProduct, getOne };
