const mongoose = require("mongoose");
const jwt = require("../utils/jwt");
const config = require("../config");

const User = mongoose.model("User");

exports.load = (app) => {
  app.post("/login", async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const isAuthorized = user && user.verifyPassword(password);

    if (!isAuthorized) {
      return next(config.AUTH_FAILED_RESPONSE);
    }

    const access_token = jwt.sign({
      userID: user._id,
      email: user.email,
    });

    return res.status(200).json({ access_token });
  });

  app.post("/signup", async (req, res, next) => {
    const { email, password } = req.body;

    const user = new User({ email, password });

    if (!(email && password)) {
      return next({
        status: 422,
        message: "email and password required",
      });
    }

    try {
      const newUser = (await user.save()).toObject();

      const access_token = jwt.sign({ userID: newUser._id, email });

      return res.status(200).json({ access_token });
    } catch (error) {
      return next({ message: error.errmsg });
    }
  });

  return app;
};

exports.skipAuth = true;
