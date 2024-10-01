const mongoose = require("mongoose");
const { Schema } = mongoose;

const categories = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);
const ResturantSchema = new Schema(
  {
    name: { type: String, required: true },
    whatsapp: { type: String, required: true },
    products: { type: Array, required: true, default: [] },
    productCategories: { type: [categories], required: true, default: [] },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Resturant", ResturantSchema, "resturants");
