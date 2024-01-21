import asyncHandler from "express-async-handler";
import { Beehive } from "../models/beehiveModel.js";
import { BeehiveMetrics } from "../models/beehiveMetricsModel.js";

//@desc Get all data
//@route GET /api/data
//@access private

export const getBeehives = asyncHandler(async (req, res) => {
  const beehives = await Beehive.find({ user_id: req.user.id });

  for (let i = 0; i < beehives.length; i++) {
    const beehive = beehives[i];
    const latestMetrics = await BeehiveMetrics.findOne({
      beehive_id: beehive._id,
    }).sort({ createdAt: -1 });

    if (latestMetrics) {
      beehives[i].CO2 = latestMetrics.CO2;
      beehives[i].Temperature = latestMetrics.Temperature;
      beehives[i].Humidity = latestMetrics.Humidity;
      beehives[i].Weight = latestMetrics.Weight;
      beehives[i].Battery_level = latestMetrics.Battery_level;
      await beehives[i].save();
    }
  }

  res.status(200).json({ beehives });
});

//@desc create new data
//@route POST /api/data
//@access private

export const createBeehive = asyncHandler(async (req, res) => {
  console.log("The request body is :", req.body);
  const { name, location, CO2, Temperature, Humidity, Weight, Battery_level } =
    req.body;
  if (
    !name ||
    !location ||
    !CO2 ||
    !Temperature ||
    !Humidity ||
    !Weight ||
    !Battery_level
  ) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const beehive = await Beehive.create({
    name,
    location,
    user_id: req.user.id,
  });

  const beehiveMetrics = await BeehiveMetrics.create({
    beehive_id: beehive._id,
    CO2,
    Temperature,
    Humidity,
    Weight,
    Battery_level,
  });

  res.status(201).json({ beehive, beehiveMetrics });
});

//@desc get data
//@route GET /api/data/:id
//@access private

export const getBeehive = asyncHandler(async (req, res) => {
  const beehive = await Beehive.findById(req.params.id);
  if (!beehive) {
    res.status(404);
    throw new Error("Beehive not found");
  }

  const latestMetrics = await BeehiveMetrics.findOne({
    beehive_id: beehive._id,
  }).sort({ createdAt: -1 });

  if (latestMetrics) {
    beehive.CO2 = latestMetrics.CO2;
    beehive.Temperature = latestMetrics.Temperature;
    beehive.Humidity = latestMetrics.Humidity;
    beehive.Weight = latestMetrics.Weight;
    beehive.Battery_level = latestMetrics.Battery_level;
  }

  res.status(200).json(beehive);
});

//@desc update data
//@route PUT /api/data/:id
//@access private

export const updateBeehive = asyncHandler(async (req, res) => {
  const beehive = await Beehive.findById(req.params.id);
  if (!beehive) {
    res.status(404);
    throw new Error("Beehive not found");
  }

  // Update specific fields of the beehive
  const { CO2, Temperature, Humidity, Weight, Battery_level } = req.body;
  beehive.CO2 = CO2 || beehive.CO2;
  beehive.Temperature = Temperature || beehive.Temperature;
  beehive.Humidity = Humidity || beehive.Humidity;
  beehive.Weight = Weight || beehive.Weight;
  beehive.Battery_level = Battery_level || beehive.Battery_level;

  const updatedBeehive = await beehive.save();
  res.status(200).json(updatedBeehive);
});

//@desc delete data
//@route DELETE /api/data/:id
//@access private

export const deleteBeehive = asyncHandler(async (req, res) => {
  const beehive = await Beehive.findById(req.params.id);
  if (!beehive) {
    res.status(404);
    throw new Error("Beehive not found");
  }
  await beehive.deleteOne();
  res.status(201).json({ beehive, message: "Beehive deleted successfully" });
});
