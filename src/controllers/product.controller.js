const Product = require("../models/product.model");

exports.getProducts = async (req, res) => {
  res.send("HEY HOW YOU DOING?");
};

exports.createProduct = async (req, res) => {
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
