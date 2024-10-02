const express = require("express");
const Router = express.Router();
const ResturantController = require("../controller/ResturantController");

// For checking purpose
Router.get("/test", (req, res) => res.json({ msg: "Working Backend!" }));

// Register a new Resturant
Router.post("/resturant/new", ResturantController.register);

// Register a Product Category for a resturant
Router.post("/resturant/category/new", ResturantController.addProductCategory);

module.exports = Router;
