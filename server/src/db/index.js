const mongoose = require("mongoose");

const MONGODB_URI = "";

exports.sync = () => {
  const models = require("../models");

  for (const type in models) {
    mongoose.model(type, models[type]);
  }
};

exports.start = () => {
  exports.sync();

  mongoose.connect(MONGODB_URI);

  mongoose.connection.on("connected", () =>
    console.log("Connected to mongo instance")
  );
  mongoose.connection.on("error", (error) =>
    console.error("Error connecting to mongo", error)
  );
};
