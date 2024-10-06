const Joi = require("joi");
const Order = require("../model/OrderModel");
const OrderDTO = require("../dto/OrderDTO");
const MongoDbPattern = /^[0-9a-fA-F]{24}$/;

const OrderController = {
  async placeorder(req, res, next) {
    const OrderInputSchema = Joi.object({
      name: Joi.string().min(3).required(),
      phone: Joi.string().min(11).required(),
      address: Joi.string().required(),
      orderitems: Joi.array().required(),
    });
    const { error } = OrderInputSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { name, phone, address, orderitems } = req.body;

    let newOrder;
    try {
      newOrder = new Order({
        customer_name: name,
        phone_number: phone,
        shipping_address: address,
        status: "requested",
        order_items: orderitems,
      });

      await newOrder.save();
    } catch (error) {
      return next(error);
    }
    const dto = new OrderDTO(newOrder);
    return res.status(201).json({ order: dto });
  },
  async readorderbytype(req, res, next) {
    const readingSchema = Joi.object({
      status: Joi.string().required(),
    });
    const { error } = readingSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { status } = req.params;
    let orders;
    try {
      orders = await Order.find({ status })
        .populate({
          path: "order_items.product",
          model: "Product",
        })
        .sort({ createdAt: -1 });
      if (!orders) {
        return res.status(200).send({ data: null });
      }
      const data = [];
      for (let i = 0; i < orders.length; i++) {
        const order = new OrderDTO(orders[i]);

        data.push(order);
      }
      return res.status(200).json({ data });
    } catch (error) {
      return next(error);
    }
  },
  async updateStatus(req, res, next) {
    const updateSchema = Joi.object({
      status: Joi.string().required(),
      orderid: Joi.string().regex(MongoDbPattern).required(),
    });
    const { error } = updateSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { status, orderid } = req.body;
    let order;
    try {
      order = await Order.findOne({ _id: orderid }).populate({
        path: "order_items.product",
        model: "Product",
      });
      if (!order) {
        return res.status(404).send("order not found");
      }
      order.status = status;
      await order.save();
      const dto = new OrderDTO(order);
      return res.status(200).json({ data: dto });
    } catch (error) {
      return next(error);
    }
  },
};
module.exports = OrderController;
