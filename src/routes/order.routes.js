const express = require("express");
const {
  getOrders,
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controllers/order.controller");

const router = express.Router();

// Routes
router.get("/", getOrders);
router.post("/create", createOrder);
router.delete("/delete/:id", deleteOrder);
router.put("/update/:id", updateOrder);
router.get("/:id", getOrderById);

module.exports = router;
