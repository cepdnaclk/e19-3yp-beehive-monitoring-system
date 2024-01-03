import asyncHandler from "express-async-handler";
import { Beehive } from "../models/beehiveModel.js";

//@desc Get all data
//@route GET /api/data
//@access private

export const getBeehives = asyncHandler(async (req, res) => {
  const beehives = await Beehive.find({ user_id: req.user.id });
  //Add method to call the beehive metrics collection ans update the beehive object with latest metrics
  
  res.status(200).json({ beehives });
});

//@desc create new data
//@route POST /api/data
//@access private

export const createBeehive = asyncHandler(async (req, res) => {
  console.log("The request body is :", req.body);
  const { name, CO2, Temperature, Humidity, Weight } = req.body;
  if (!name || !CO2 || !Temperature || !Humidity || !Weight) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const beehive = await Beehive.create({
    name,
    CO2,
    Temperature,
    Humidity,
    Weight,
    user_id: req.user.id,
  });
  res.status(201).json(beehive);
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

  const updatedBeehive = await Beehive.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
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
