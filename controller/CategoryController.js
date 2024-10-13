const Joi = require("joi");
const CategoryModel = require("../model/CategoryModel");
const ProductModel = require("../model/ProductModel");
const ProductDto = require("../dto/ProductDTO");
const MongoDbPattern = /^[0-9a-fA-F]{24}$/;

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
  async update(req, res, next) {
    const categoriesSchema = Joi.object({
      id: Joi.string().regex(MongoDbPattern).required(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      imageUrl: Joi.string().required(),
    });

    const { error } = categoriesSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { name, description, imageUrl, id } = req.body;

    let category;
    try {
      category = await CategoryModel.findOne({ _id: id });
      if (!category) {
        return res.status(404).send("Category not found");
      }
    } catch (error) {
      return next(error);
    }
    try {
      await CategoryModel.updateOne(
        { _id: id },
        {
          name,
          description,
          imageUrl,
        }
      );
    } catch (error) {
      return next(error);
    }

    return res.status(200).json({ message: "Category Updated" });
  },
  async readall(req, res, next) {
    let categories;
    try {
      categories = await CategoryModel.find({});
    } catch (error) {
      return next(error);
    }
    return res.status(200).json({ categories });
  },
  async readCategoryProduct(req, res, next) {
    const deleteSchema = Joi.object({
      id: Joi.string().regex(MongoDbPattern).required(),
    });
    const { error } = deleteSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    let category;
    const { id } = req.params;
    try {
      category = await CategoryModel.findOne({ _id: id });
      if (!category) {
        return res.status(404).send("Category not found");
      }
    } catch (error) {
      return next(error);
    }
    let products;
    try {
      products = await ProductModel.find({ category: id });
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
  async deleteCategory(req, res, next) {
    const deleteSchema = Joi.object({
      categoryId: Joi.string().regex(MongoDbPattern).required(),
    });
    const { error } = deleteSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { categoryId } = req.params;

    try {
      const category = await CategoryModel.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      await ProductModel.deleteMany({ category: categoryId });

      await CategoryModel.findByIdAndDelete(categoryId);

      res
        .status(200)
        .json({ message: "Category and its products deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting category", error });
    }
  },
};
module.exports = CategoryController;
