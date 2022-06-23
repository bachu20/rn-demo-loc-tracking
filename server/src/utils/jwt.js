const jwt = require("jsonwebtoken");

exports.JWT_SECRET_KEY = "MY_SECRET_KEY";

exports.sign = (attrs, options = {}) => {
  options.expiresIn = options.expiresIn || "12h";
  return jwt.sign(attrs, exports.JWT_SECRET_KEY, options);
};

exports.decode = (token) => {
  return jwt.verify(token, exports.JWT_SECRET_KEY);
};
