const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  countInStock: { type: Number, required: true, min: 0 },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
