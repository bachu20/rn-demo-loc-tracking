const mongoose = require("mongoose");

const Track = mongoose.model("Track");

exports.load = (app) => {
  app.get("/tracks", async (req, res, next) => {
    try {
      const tracks = await Track.find({ user_id: req.user._id }).lean();
      return res.status(200).json({ tracks });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/tracks/:id", async (req, res, next) => {
    try {
      const track = await Track.findOne({
        _id: req.params.id,
        user_id: req.user._id,
      }).lean();

      return res.status(200).json({ track });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/tracks", async (req, res, next) => {
    const { name, locations } = req.body;

    if (!(name && locations)) {
      return next({
        status: 422,
        message: "name and locations required",
      });
    }

    try {
      const track = await new Track({
        name,
        locations,
        user_id: req.user._id,
      }).save();

      return res.status(200).json({ track: track.toObject() });
    } catch (error) {
      return next(error);
    }
  });

  app.patch("/tracks/:id", async (req, res, next) => {
    const { name, locations } = req.body;

    const track = await Track.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      { name, locations }
    ).lean();

    return res.status(200).json({ track });
  });

  app.delete("/tracks/:id", async (req, res, next) => {
    try {
      await Track.findOneAndDelete({
        _id: req.params.id,
        user_id: req.user._id,
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      return next(error);
    }
  });

  return app;
};
