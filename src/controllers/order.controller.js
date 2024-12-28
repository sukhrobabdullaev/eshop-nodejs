const OrderItem = require("../models/order-item.model.js");
const Order = require("../models/order.model.js");

const getOrders = async (req, res) => {
  try {
    const orderList = await Order.find().populate({
        path: "user",
        select: "name email",
        
    }).sort({
      dateOrdered: -1,
    });

    if (!orderList || orderList.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Orders Not Found",
      });
    }

    res.status(200).json(orderList);
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

const createOrder = async (req, res) => {
    try { 
        const orderItemsIds = await Promise.all(
            req.body.orderItems.map(async (orderItem) => {
              const newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product,
              });
              const savedOrderItem = await newOrderItem.save();
              return savedOrderItem._id;
            })
        );

     const totalPrices = await Promise.all(
        orderItemsIds.map(async (orderItem) => {
          const orderItemDetails = await OrderItem.findById(orderItem).populate(
            "product",
            "price")
          return orderItemDetails.quantity * orderItemDetails.product.price;
        })
    )

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
    
     const newOrder = new Order(
        {
            orderItems: orderItemsIds,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
            user: req.body.user
        }
    );
    const savedOrder = await newOrder.save();

    res.status(201).json({ success: true, data: savedOrder });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {      
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      data: deletedOrder,
    });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

const updateOrder = async (req, res) => {
  try {    
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

const getOrderById = async (req, res) => {
  try {    
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    ).populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

const getTotalSales=async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
    ]);
    if (!totalSales) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(200).json({totalSales: totalSales.pop().totalSales})
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};


const getCount = async (req, res) => {
    try {
      const orderCount = await Order.countDocuments({});
  
      res.status(200).json({ count: orderCount });
    } catch (err) {
      res.status(500).json({ error: err.message, success: false });
    }
};
  
const getUsersOrders = async (req, res) => {
    try {
      const userOrderList = await Order.find({user: req.params.userId}).populate("user", "name email").populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: "category",
        }
      }).sort({
        dateOrdered: -1,
      });
  
      if (!userOrderList || userOrderList.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Orders Not Found",
        });
      }
  
      res.status(200).json(userOrderList);
    } catch (err) {
      res.status(500).json({ error: err.message, success: false });
    }
  };

  
module.exports = {
  getOrders,
  createOrder,
  deleteOrder,
  updateOrder,
  getOrderById,
  getTotalSales,
  getCount,
  getUsersOrders
};
