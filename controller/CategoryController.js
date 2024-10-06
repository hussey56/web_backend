const Joi = require("joi");
const CategoryModel = require("../model/CategoryModel");

const CategoryController = {
  async add(req, res, next) {
    const categoriesSchema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      imageUrl: Joi.string().required(),
    });

    const { error } = categoriesSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { name, description, imageUrl } = req.body;

    let newCategory;
    try {
      newCategory = await CategoryModel.findOne({ name });
      if (newCategory) {
        return res.status(409).send("Category name already exist");
      }
    } catch (error) {
      return next(error);
    }
    try {
      newCategory = new CategoryModel({
        name,
        description,
        imageUrl,
      });
      await newCategory.save();
    } catch (error) {
      return next(error);
    }

    return res.status(201).json({ category: newCategory });
  },
};
module.exports = CategoryController;
