const express = require("express");
const Router = express.Router();
const ProductController = require("../controller/ProductController");
const CategoryController = require("../controller/CategoryController");
const whatsappClient = require("../services/WhatsappClient");
const OrderController = require("../controller/OrderController");
4;

// For checking purpose
Router.get("/test", (req, res) => res.json({ msg: "Working Backend!" }));

//  -------------------------------------- # CATEGORY ----------------------------------------------

// Read all Categories
Router.get("/resturant/categories", CategoryController.readall);

// Get Products by Category Id
Router.get("/resturant/category/:id", CategoryController.readCategoryProduct);

// Register a Product Category for a resturant
Router.post("/resturant/category/new", CategoryController.add);

// Update a Category
Router.put("/resturant/category/update", CategoryController.update);

// Delete the category alongs its all products
Router.delete(
  "/resturant/category/delete/:categoryId",
  CategoryController.deleteCategory
);

//  -------------------------------------- # PRODUCTS ----------------------------------------------

// Create a product for a resturant
Router.post("/resturant/product/add", ProductController.create);

// Find all products
Router.get("/resturant/products", ProductController.readall);

// Find specific product by ID
Router.get("/resturant/products/:id", ProductController.singleread);

// Update a Product
Router.put("/resturant/product/update", ProductController.update);

// Delete a Product
Router.delete("/resturant/product/delete/:id", ProductController.deleteproduct);

//  -------------------------------------- # ORDERS ----------------------------------------------

// Place an Order
Router.post("/resturant/place-order", OrderController.placeorder);

// Order by status status
Router.get("/resturant/orders/:status", OrderController.readorderbytype);

// Update Order Status
Router.post("/resturant/order/update-status", OrderController.updateStatus);

module.exports = Router;
