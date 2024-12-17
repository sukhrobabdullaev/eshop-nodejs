const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  countInStock: { type: Number, required: true, min: 0 },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
