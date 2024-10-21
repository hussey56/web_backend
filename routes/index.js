const express = require("express");
const Router = express.Router();
const ProductController = require("../controller/ProductController");
const CategoryController = require("../controller/CategoryController");
const OrderController = require("../controller/OrderController");
const { authenticateToken, authorizeRole } = require("../middleware/RoleBased");
const Roles = require("../config/Roles");
const UserController = require("../controller/UserController");

// For checking purpose
Router.get("/test", (req, res) => res.json({ msg: "Working Backend!" }));

//  -------------------------------------- # ADMIN ----------------------------------------------

// Register an Admin
Router.post(
  "/admin/register",
  authenticateToken,
  authorizeRole([Roles.ADMIN]),
  UserController.register
);

// Login User for admin panel
Router.post("/admin/login", UserController.login);

// Refresh JWT Token
Router.get("/admin/refresh", authenticateToken, UserController.refresh);

// Update User Details
Router.put(
  "/admin/profile/update",
  authenticateToken,
  UserController.updateUser
);
// Delete a user
Router.delete(
  "/admin/user/delete/:id",
  authenticateToken,
  authorizeRole([Roles.ADMIN]),
  UserController.deleteUser
);
//  -------------------------------------- # CATEGORY ----------------------------------------------

// Read all Categories
Router.get(
  "/resturant/categories",

  CategoryController.readall
);

// Get Products by Category Id
Router.get("/resturant/category/:id", CategoryController.readCategoryProduct);

// Register a Product Category for a resturant
Router.post(
  "/resturant/category/new",
  authenticateToken,
  authorizeRole([Roles.ADMIN]),
  CategoryController.add
);

// Update a Category
Router.put(
  "/resturant/category/update",
  authenticateToken,
  authorizeRole([Roles.ADMIN]),
  CategoryController.update
);

// Delete the category alongs its all products
Router.delete(
  "/resturant/category/delete/:categoryId",
  authenticateToken,
  authorizeRole([Roles.ADMIN]),
  CategoryController.deleteCategory
);

//  -------------------------------------- # PRODUCTS ----------------------------------------------

// Create a product for a resturant
Router.post(
  "/resturant/product/add",
  authenticateToken,
  authorizeRole([Roles.ADMIN]),
  ProductController.create
);

// Find all products
Router.get("/resturant/products", ProductController.readall);

// Find specific product by ID
Router.get("/resturant/products/:id", ProductController.singleread);

// Update a Product
Router.put(
  "/resturant/product/update",
  authenticateToken,
  authorizeRole([Roles.ADMIN]),
  ProductController.update
);

// Delete a Product
Router.delete(
  "/resturant/product/delete/:id",
  authenticateToken,
  authorizeRole([Roles.ADMIN]),
  ProductController.deleteproduct
);

// Search a Product by name
Router.get(
  "/resturant/products/search/:query",
  ProductController.searchProduct
);

//  -------------------------------------- # ORDERS ----------------------------------------------

// Place an Order
Router.post("/resturant/place-order", OrderController.placeorder);

// Order by status status
Router.get("/resturant/orders/:status", OrderController.readorderbytype);

// Update Order Status
Router.post("/resturant/order/update-status", OrderController.updateStatus);

// Delete an Order by Admin
Router.delete(
  "/resturant/order/delete/:id",
  authenticateToken,
  authorizeRole([Roles.ADMIN]),
  OrderController.deleteOrder
);

// Read all Orders
Router.get(
  "/resturant/orders",
  authenticateToken,
  authorizeRole([Roles.ADMIN]),
  OrderController.readAll
);

// Update Order
Router.put("/resturant/order/update", OrderController.updateOrder);

module.exports = Router;
