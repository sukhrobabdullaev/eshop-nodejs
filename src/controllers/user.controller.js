const User = require("../models/user.model.js");

getUsers = async (req, res) => {
  try {
    const productList = await Product.find();
    if (!productList) {
      res.status(404).json({ message: "Products Not Found", success: false });
    }
    res.status(200).json(productList);
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

createUser = async (req, res) => {
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

module.exports = { getUsers, createUser };
