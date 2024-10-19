const jwt = require("jsonwebtoken");
const User = require("../model/UserModel");
const { ACCESS_TOKEN_SECRET } = require("../config/index");
const authenticateToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  } catch (err) {
    res.sendStatus(403);
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
