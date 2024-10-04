const mongoose = require("mongoose");
const { Schema } = mongoose;

const categories = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
});
const ResturantSchema = new Schema(
  {
    name: { type: String, required: true },
    whatsapp: { type: String, required: true },
    productCategories: { type: [categories], required: true, default: [] },
  },
  { timestamps: true }
);
const Resturant = mongoose.model("Resturant", ResturantSchema, "resturants");
module.exports = { Resturant, categories };
