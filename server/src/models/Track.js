const mongoose = require("mongoose");
const PointSchema = require("./Point");

const Track = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, ref: "User" },
  name: { type: String, default: "" },
  locations: [PointSchema],
});

module.exports = Track;
