const express = require("express");
const Router = express.Router();
const ProductController = require("../controller/ProductController");
const CategoryController = require("../controller/CategoryController");
const whatsappClient = require("../services/WhatsappClient");
const OrderController = require("../controller/OrderController");
// For checking purpose
Router.get("/test", (req, res) => res.json({ msg: "Working Backend!" }));

// Register a Product Category for a resturant
Router.post("/resturant/category/new", CategoryController.add);

// Create a product for a resturant
Router.post("/resturant/product/add", ProductController.create);

// Find all products
Router.get("/resturant/products", ProductController.readall);

// Find specific product by ID
Router.get("/resturant/products/:id", ProductController.singleread);

// Place an Order
Router.post("/resturant/place-order", OrderController.placeorder);

// Order by status status
Router.get("/resturant/orders/:status", OrderController.readorderbytype);

// Update Order Status
Router.post("/resturant/order/update-status", OrderController.updateStatus);

module.exports = Router;
