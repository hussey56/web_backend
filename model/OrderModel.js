const mongoose = require("mongoose");

const OrderItemSchema = mongoose.Schema({
  product: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  modifiers: {
    type: Array,
    default: [],
  },
});
const OrderSchema = mongoose.Schema(
  {
    customer_name: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    total_price: {
      type: Number,
    },
    shipping_address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    order_items: {
      type: [OrderItemSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.pre("save", function (next) {
  const order = this;
  const totalPrice = order.order_items.reduce((total, item) => {
    const itemModifiersTotal = item.modifiers.reduce(
      (modSum, mod) => modSum + mod.price,
      0
    );
    const modifierFactor = 1 + itemModifiersTotal / item.price;
    const itemSubtotal = item.price * item.quantity * modifierFactor;
    return total + itemSubtotal;
  }, 0);
  order.total_price = totalPrice;
  next();
});

module.exports = mongoose.model("Order", OrderSchema, "orders");
