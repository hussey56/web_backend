const Joi = require("joi");
const MongoDbPattern = /^[0-9a-fA-F]{24}$/;
const { Resturant, categories } = require("../model/ResturantModel");
const ResturantDTO = require("../dto/ResturantDTO");
const ProductDTO = require("../dto/ProductDTO");
const Product = require("../model/ProductModel");

const ProductController = {
  async create(req, res, next) {
    const RegisterProductSchema = Joi.object({
      resturant: Joi.string().regex(MongoDbPattern).required(),
      name: Joi.string().required(),
      description: Joi.string().min(5).required(),
      price: Joi.number().required(),
      stock: Joi.number().required(),
      imageUrl: Joi.string().required(),
      categoryId: Joi.string().regex(MongoDbPattern).required(),
      modifiers: Joi.array().required(),
    });
    const { error } = RegisterProductSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const {
      resturant,
      name,
      description,
      price,
      stock,
      imageUrl,
      categoryId,
      modifiers,
    } = req.body;
    let Hotel;
    try {
      Hotel = await Resturant.findById(resturant);
      if (!Hotel) {
        return res.status(404).send("Resturant not found");
      }
      Hotel = new ResturantDTO(Hotel);
    } catch (error) {
      return next(error);
    }
    let categoryFound = false;
    let ProductCategory;
    for (category of Hotel.categories) {
      if (category._id == categoryId) {
        categoryFound = true;
        ProductCategory = category;
      }
    }
    if (!categoryFound) {
      return res.status(404).send("Category not found in this resturant");
    }
    let newProduct;
    try {
      newProduct = new Product({
        name,
        description,
        stock,
        price,
        imageUrl,
        category: ProductCategory,
        modifiers,
        resturantId: resturant,
      });
      await newProduct.save();
    } catch (error) {
      return next(error);
    }
    const Dto = new ProductDTO(newProduct);
    return res.status(201).json({ Product: Dto });
  },
};
module.exports = ProductController;
