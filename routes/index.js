const express = require("express");
const Router = express.Router();

Router.get("/test", (req, res) => res.json({ msg: "Working Backend!" }));

module.exports = Router;
