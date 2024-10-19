const Joi = require("joi");
const User = require("../model/UserModel");
const jwt = require("jsonwebtoken");
const UserDto = require("../dto/UserDTO.JS");
const passwordPattern = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,25}/;
const MongoDbPattern = /^[0-9a-fA-F]{24}$/;

const UserController = {
  async register(req, res, next) {
    const UserValidationSchema = Joi.object({
      username: Joi.string().min(3).required(),
      role: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(passwordPattern)
        .message(
          "Password must contain atleast 1 Uppercase letter, 1 Lowercase letter and 1 digit"
        )
        .required(),
    });
    const { error } = UserValidationSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { username, email, password, role } = req.body;

    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const newUser = new User({
        username,
        password,
        email,
        role,
      });

      await newUser.save();
      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      return next(error);
    }
  },
  async login(req, res, next) {
    const UserValidationSchema = Joi.object({
      username: Joi.string().min(3).required(),
      password: Joi.string().required(),
    });
    const { error } = UserValidationSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      const dto = new UserDto(user);
      return res.status(200).json({ token, user: dto });
    } catch (error) {
      return next(error);
    }
  },
  async refresh(req, res, next) {
    try {
      const user = req.user;
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      const dto = new UserDto(user);
      return res.status(200).json({ token, user: dto });
    } catch (error) {
      return next(error);
    }
  },
  async updateUser(req, res, next) {
    const UserValidationSchema = Joi.object({
      username: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(passwordPattern)
        .message(
          "Password must contain atleast 1 Uppercase letter, 1 Lowercase letter and 1 digit"
        )
        .required(),
    });
    const { error } = UserValidationSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { username, email, password } = req.body;
    const userId = req.user._id;
    let user;
    try {
      user = await User.findById(userId);
      user.username = username;
      user.email = email;
      user.password = password;
      await user.save();
      return res.status(200).json({ message: "Updated Successfully" });
    } catch (error) {
      return next(error);
    }
  },
  async deleteUser(req, res, next) {
    const deleteSchema = Joi.object({
      id: Joi.string()
        .regex(MongoDbPattern)
        .message("Invalid Id passed.")
        .required(),
    });
    const { error } = deleteSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const { id } = req.params;
    let user;
    try {
      user = await User.findById(id);
      if (!user) {
        return res.sendStatus(404);
      }
      await User.deleteOne({ _id: id });
    } catch (error) {
      return next(error);
    }
    return res.status(200).json({ message: "User Deleted" });
  },
};
module.exports = UserController;
