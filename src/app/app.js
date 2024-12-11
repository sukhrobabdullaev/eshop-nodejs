const express = require("express");
const morgan = require("morgan");
require("dotenv").config(); // Load environment variables

const app = express();
const API_URL = process.env.API_URL || "/api/v1";

// Middleware
app.use(express.json());
app.use(morgan("tiny"));

// Routes
const productRoutes = require("../routes/product.routes.js");

// Use routes with the API_URL as the base path
app.use(`${API_URL}/products`, productRoutes);

module.exports = app;
