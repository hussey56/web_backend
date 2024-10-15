const Joi = require("joi");
const Order = require("../model/OrderModel");
const OrderDTO = require("../dto/OrderDTO");
const MongoDbPattern = /^[0-9a-fA-F]{24}$/;

const OrderController = {
  async placeorder(req, res, next) {
    const modifierItemSchema = Joi.object({
      name: Joi.string().required(),
      price: Joi.number().positive().required(),
    });
    const orderItemSchema = Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      price: Joi.number().positive().required(),
      modifiers: Joi.array().items(modifierItemSchema).default([]),
    });
    const OrderInputSchema = Joi.object({
      name: Joi.string().min(3).required(),
      phone: Joi.string().min(11).required(),
      address: Joi.string().required(),
      orderitems: Joi.array().items(orderItemSchema).min(1).required(),
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
      orders = await Order.find({ status }).sort({ createdAt: -1 });
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
      order = await Order.findOne({ _id: orderid });
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
  async deleteOrder(req, res, next) {
    const deleteSchema = Joi.object({
      id: Joi.string().regex(MongoDbPattern).required(),
    });
    const { error } = deleteSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    let order;
    const { id } = req.params;
    try {
      order = await Order.findOne({ _id: id });
      if (!order) {
        return res.status(404).send("Order not found");
      }
    } catch (error) {
      return next(error);
    }
    try {
      await Order.deleteOne({ _id: id });
    } catch (error) {
      return next(error);
    }
    return res.status(200).json({ message: "Order Deleted" });
  },
  async readAll(req, res, next) {
    let orders;
    try {
      orders = await Order.find({}).sort({ createdAt: -1 });
      if (!orders) {
        return res.status(200).send({ data: null });
      }
      const data = [];
      for (let i = 0; i < orders.length; i++) {
        const order = new OrderDTO(orders[i]);

        data.push(order);
      }
      return res.status(200).json({ orders: data });
    } catch (error) {
      return next(error);
    }
  },
  async updateOrder(req, res, next) {
    const modifierItemSchema = Joi.object({
      name: Joi.string().required(),
      price: Joi.number().positive().required(),
    });
    const orderItemSchema = Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      price: Joi.number().positive().required(),
      modifiers: Joi.array().items(modifierItemSchema).default([]),
    });
    const OrderInputSchema = Joi.object({
      orderid: Joi.string().regex(MongoDbPattern).required(),
      name: Joi.string().min(3).required(),
      phone: Joi.string().min(11).required(),
      address: Joi.string().required(),
      orderitems: Joi.array().items(orderItemSchema).min(1).required(),
    });
    const { error } = OrderInputSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { name, phone, address, orderitems, orderid } = req.body;
    let order;
    try {
      order = await Order.findById(orderid);
      if (!order) {
        return res.status(404).send("Order not found");
      }
      order.status = "updated requested";
      order.customer_name = name;
      order.phone_number = phone;
      order.order_items = orderitems;
      order.shipping_address = address;
      await order.save();
      const dto = new OrderDTO(order);
      return res
        .status(200)
        .json({ message: "Order Updated Successfully!", order: dto });
    } catch (error) {
      return next(error);
    }
  },
};
module.exports = OrderController;
