const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  countInStock: { type: Number, required: true, min: 0 },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
