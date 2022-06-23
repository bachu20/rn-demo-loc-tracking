const mongoose = require("mongoose");
const jwt = require("../utils/jwt");
const { TokenExpiredError } = require("jsonwebtoken");

const config = require("../config");

const User = mongoose.model("User");

module.exports = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const token = authorization.split("Bearer ")[1];

  if (!token) {
    return next(config.AUTH_FAILED_RESPONSE);
  }

  try {
    const decoded = jwt.decode(token);
    const user = await User.findById(decoded.userID);

    if (!user) {
      return next(config.AUTH_FAILED_RESPONSE);
    }

    req.user = user;
    return next();
  } catch (error) {
    return error instanceof TokenExpiredError
      ? next(config.AUTH_FAILED_RESPONSE)
      : next(error);
  }
};
