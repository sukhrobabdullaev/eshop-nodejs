const { default: mongoose } = require("mongoose");
const Category = require("../models/category.model.js");
const Product = require("../models/product.model.js");


const getProducts = async (req, res) => {
  try {
    const productList = await Product.find().select("name image");

    if (!productList || productList.length === 0) {
      res.status(404).json({ message: "Products Not Found", success: false });
    }
    res.status(200).json(productList);
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

const createProduct = async (req, res) => {
  try {
    const { category } = req.body;

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res
        .status(400)
        .json({ message: "Invalid Category ID format", success: false });
    }

    const categoryExist = await Category.findById(category);
    if (!categoryExist) {
      return res
        .status(400)
        .json({ message: "Invalid Category", success: false });
    }
    const file=req.file
    if (!file) {
      return res.status(400).json({ message: "No file uploaded", success: false });
    }

    const fileName = req.file.filename;
    const baseUrl = `${req.protocol}://${req.get("host")}/public/uploads/`;

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: `${baseUrl}${fileName}`,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { category } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res
        .status(400)
        .json({ message: "Invalid Category ID format", success: false });
    }

    const categoryExist = await Category.findById(category);
    if (!categoryExist) {
      return res
        .status(400)
        .json({ message: "Invalid Category", success: false });
    }

    const product=await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    const file=req.file
    
    if (!file) {
      return res.status(400).json({ message: "No file uploaded", success: false });
    }

    let imagePath;
    if(file) {
      const fileName = req.file.filename;
      const baseUrl = `${req.protocol}://${req.get("host")}/public/uploads/`;
      imagePath = `${baseUrl}${fileName}`;
    } else {
      imagePath = product.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: imagePath,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      },
      { new: true, runValidators: true } // `new: true` returns the updated document
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    console.error("Error updating Product:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (err) {
    console.error("Error deleting Product:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

getOne = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      res.status(404).json({ message: "Products Not Found", success: false });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

getCount = async (req, res) => {
  try {
    const productCount = await Product.countDocuments({});

    res.status(200).json({ count: productCount });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

getFeatured = async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true });

    res.status(200).json(featuredProducts);
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

getLimitedFeatured = async (req, res) => {
  try {
    // Parse the limit from query parameters, default to 5 if not provided
    const limit = parseInt(req.query.limit) || 5;

    // Fetch the featured products with the specified limit
    const featuredProducts = await Product.find({ isFeatured: true }).limit(
      limit
    );

    res.status(200).json(featuredProducts);
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

getProductsByCategory = async (req, res) => {
  try {
    let filter = {};

    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }

    const filteredProducts = await Product.find(filter).populate("category");

    res.status(200).json(filteredProducts);
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

module.exports = {
  getProducts,
  createProduct,
  getOne,
  updateProduct,
  deleteProduct,
  getCount,
  getFeatured,
  getLimitedFeatured,
  getProductsByCategory,
};
