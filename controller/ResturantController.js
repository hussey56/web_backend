const Joi = require("joi");
const MongoDbPattern = /^[0-9a-fA-F]{24}$/;
const { Resturant, categories } = require("../model/ResturantModel");
const ResturantDTO = require("../dto/ResturantDTO");
const ProductModel = require("../model/ProductModel");
const ProductDto = require("../dto/ProductDTO");
const ResturantController = {
  async register(req, res, next) {
    const resturantSchema = Joi.object({
      name: Joi.string().required(),
      whatsapp: Joi.string().required(),
      productCategories: Joi.array().required().default([]),
    });
    const { error } = resturantSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { name, whatsapp, productCategories } = req.body;
    let newResturant;
    try {
      newResturant = new Resturant({
        name,
        whatsapp,
        productCategories,
      });
      await newResturant.save();
    } catch (error) {
      return next(error);
    }
    const Dto = new ResturantDTO(newResturant);
    return res.status(201).json({ resturant: Dto });
  },
  async addProductCategory(req, res, next) {
    const categoriesSchema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      imageUrl: Joi.string().required(),
      resturantId: Joi.string()
        .regex(MongoDbPattern)
        .message("Invalid Resturant Id Format")
        .required(),
    });

    const { error } = categoriesSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { name, description, imageUrl, resturantId } = req.body;
    let FindResturant;
    try {
      FindResturant = await Resturant.findById(resturantId);
      if (!FindResturant) {
        return res.status(404).send("Resturant not found");
      }
    } catch (error) {
      return next(error);
    }
    let newCategory;
    try {
      newCategory = {
        name,
        description,
        imageUrl,
      };
      FindResturant.productCategories.push(newCategory);
      await FindResturant.save();
    } catch (error) {
      return next(error);
    }
    const Dto = new ResturantDTO(FindResturant);
    return res.status(201).json({ resturant: Dto });
  },
  async findResturantProducts(req, res, next) {
    const getbyIdSchema = Joi.object({
      id: Joi.string().regex(MongoDbPattern).message("Invalid Id").required(),
    });
    const { error } = getbyIdSchema.validate(req.params);
    if (error) {
      return next(error);
    }

    const { id } = req.params;
    let products;
    try {
      products = await ProductModel.find({ resturantId: id });
    } catch (error) {
      return next(error);
    }
    let productsDto = [];
    for (let i = 0; i < products.length; i++) {
      const obj = new ProductDto(products[i]);
      productsDto.push(obj);
    }
    return res.status(200).json({ products: productsDto });
  },
};
module.exports = ResturantController;
