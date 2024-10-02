const Joi = require("joi");
const MongoDbPattern = /^[0-9a-fA-F]{24}$/;
const { Resturant, categories } = require("../model/ResturantModel");
const ResturantDTO = require("../dto/ResturantDTO");
const ResturantController = {
  async register(req, res, next) {
    const resturantSchema = Joi.object({
      name: Joi.string().required(),
      whatsapp: Joi.string().required(),
      products: Joi.array().required().default([]),
      productCategories: Joi.array().required().default([]),
    });
    const { error } = resturantSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { name, whatsapp, products, productCategories } = req.body;
    let newResturant;
    try {
      newResturant = new Resturant({
        name,
        whatsapp,
        products,
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
};
module.exports = ResturantController;
