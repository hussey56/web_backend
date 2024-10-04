const express = require("express");
const Router = express.Router();
const ResturantController = require("../controller/ResturantController");
const ProductController = require("../controller/ProductController");

// For checking purpose
Router.get("/test", (req, res) => res.json({ msg: "Working Backend!" }));

// Register a new Resturant
Router.post("/resturant/new", ResturantController.register);

// Register a Product Category for a resturant
Router.post("/resturant/category/new", ResturantController.addProductCategory);

// Create a product for a resturant
Router.post("/resturant/product/add", ProductController.create);

// Get all the resturant product by resturant id
Router.get(
  "/resturant/products/:id",
  ResturantController.findResturantProducts
);

module.exports = Router;
