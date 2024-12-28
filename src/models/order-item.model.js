const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

// orderItemSchema.virtual("id").get(function () {
//     return this._id.toHexString();
//   });
  
// orderItemSchema.set("toJSON", {
// virtuals: true,
// });

module.exports = OrderItem;
