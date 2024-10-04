const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    category: { type: Object, required: true },
    modifiers: {
      type: Array,
      required: true,
      default: [],
    },
    resturantId: { type: mongoose.SchemaTypes.ObjectId, ref: "Resturant" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", ProductSchema, "products");
