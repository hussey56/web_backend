const Joi = require("joi");
const MongoDbPattern = /^[0-9a-fA-F]{24}$/;
const { Resturant, categories } = require("../model/ResturantModel");
const ResturantDTO = require("../dto/ResturantDTO");
const ProductDTO = require("../dto/ProductDTO");
const Product = require("../model/ProductModel");

const ProductController = {
  async create(req, res, next) {},
};
module.exports = ProductController;
