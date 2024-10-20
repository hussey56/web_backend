const Joi = require("joi");
const MongoDbPattern = /^[0-9a-fA-F]{24}$/;
const ProductDTO = require("../dto/ProductDTO");
const Product = require("../model/ProductModel");
const CategoryModel = require("../model/CategoryModel");

const ProductController = {
  async create(req, res, next) {
    const RegisterProductSchema = Joi.object({
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

    const { name, description, price, stock, imageUrl, categoryId, modifiers } =
      req.body;

    let ProductCategory;
    try {
      ProductCategory = await CategoryModel.findById(categoryId);
      if (!ProductCategory) {
        return res.status(404).send("Category not found");
      }
    } catch (error) {
      return next(error);
    }
    let newProduct;
    try {
      newProduct = new Product({
        name,
        description,
        stock,
        price,
        imageUrl,
        category: ProductCategory._id,
        modifiers,
      });
      await newProduct.save();
    } catch (error) {
      return next(error);
    }
    const Dto = new ProductDTO(newProduct);
    return res.status(201).json({ Product: Dto });
  },
  async singleread(req, res, next) {
    const getbyIdSchema = Joi.object({
      id: Joi.string().regex(MongoDbPattern).required(),
    });
    const { error } = getbyIdSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    let product;
    const { id } = req.params;
    try {
      product = await Product.findOne({ _id: id }).populate("category");
      if (!product) {
        return res.status(404).send("Product not found");
      }
    } catch (error) {
      return next(error);
    }
    const productdto = new ProductDTO(product);
    return res.status(200).json({ product: productdto });
  },
  async readall(req, res, next) {
    let products;
    try {
      products = await Product.find({}).populate("category");
    } catch (error) {
      return next(error);
    }
    let productsDto = [];
    for (let i = 0; i < products.length; i++) {
      const obj = new ProductDTO(products[i]);
      productsDto.push(obj);
    }
    return res.status(200).json({ products: productsDto });
  },
  async update(req, res, next) {
    const RegisterProductSchema = Joi.object({
      productId: Joi.string().regex(MongoDbPattern).required(),
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
      productId,
      name,
      description,
      price,
      stock,
      imageUrl,
      categoryId,
      modifiers,
    } = req.body;

    let product;
    try {
      product = await Product.findById(productId);
      if (!product) {
        return res.status(404).send("Product not found");
      }
    } catch (error) {
      return next(error);
    }
    let ProductCategory;
    try {
      ProductCategory = await CategoryModel.findById(categoryId);
      if (!ProductCategory) {
        return res.status(404).send("Category not found");
      }
    } catch (error) {
      return next(error);
    }
    await Product.updateOne(
      { _id: productId },
      {
        name,
        description,
        stock,
        price,
        imageUrl,
        category: ProductCategory._id,
        modifiers,
      }
    );
    return res.status(200).json({ message: "Product Updated" });
  },
  async deleteproduct(req, res, next) {
    const deleteSchema = Joi.object({
      id: Joi.string().regex(MongoDbPattern).required(),
    });
    const { error } = deleteSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    let product;
    const { id } = req.params;
    try {
      product = await Product.findOne({ _id: id });
      if (!product) {
        return res.status(404).send("Product not found");
      }
    } catch (error) {
      return next(error);
    }
    try {
      await Product.deleteOne({ _id: id });
    } catch (error) {
      return next(error);
    }
    return res.status(200).json({ message: "Product Deleted" });
  },
  async searchProduct(req, res, next) {
    const getbyIdSchema = Joi.object({
      query: Joi.string().required(),
    });
    const { error } = getbyIdSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { query } = req.params;
    let results;
    try {
      results = await Product.find({
        name: { $regex: new RegExp(query, "i") },
      });
    } catch (error) {
      return next(error);
    }

    let productsDto = [];
    for (let i = 0; i < results.length; i++) {
      const obj = new ProductDTO(results[i]);
      productsDto.push(obj);
    }
    return res.status(200).json({ products: productsDto });
  },
};
module.exports = ProductController;
