const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("../config");

const User = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

User.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(config.PASSWORD_SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(this.get("password"), salt);

    this.set("password", passwordHash);

    return next();
  } catch (error) {
    next(error);
  }
});

User.methods.verifyPassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
