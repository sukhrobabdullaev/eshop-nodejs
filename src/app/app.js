const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const verifyToken = require("../middlewares/authMiddleware.js");

require("dotenv").config(); // Load environment variables

const app = express();
const API_URL = process.env.API_URL || "/api/v1";

// CORS configuration
const corsOptions = {
  origin: "*", // Allow all origins; modify this for security in production
  //   process.env.ALLOWED_ORIGIN || "http://localhost:3000", // Replace with your frontend domain
  methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests globally

// Middleware
app.use(express.json());
app.use(morgan("tiny"));

// Routes
const productRoutes = require("../routes/product.routes.js");
const categoryRoutes = require("../routes/category.routes.js");
const userRoutes = require("../routes/user.routes.js");

app.use(verifyToken);

// Use routes with the API_URL as the base path
app.use(`${API_URL}/products`, productRoutes);
app.use(`${API_URL}/categories`, categoryRoutes);
app.use(`${API_URL}/users`, userRoutes);

module.exports = app;
