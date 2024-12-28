const express = require("express");
const {
  getOrders,
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  getTotalSales,
  getCount
} = require("../controllers/order.controller");

const router = express.Router();

// Routes
router.get("/", getOrders);
router.post("/create", createOrder);
router.delete("/delete/:id", deleteOrder);
router.put("/update/:id", updateOrder);
router.get("/:id", getOrderById);
router.get('/get/totalsales', getTotalSales);
router.get("/get/count", getCount);

module.exports = router;
