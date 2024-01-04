import asyncHandler from "express-async-handler";
import { BeehiveMetrics } from "../models/beehiveMatricsModel.js";

//@desc Get all beehive metrics
//@route GET /api/beehive-metrics
//@access private

export const getAllBeehiveMetrics = asyncHandler(async (req, res) => {
  const beehiveMetrics = await BeehiveMetrics.find().populate("beehive_id");
  res.status(200).json({ beehiveMetrics });
});

//@desc Get beehive metrics by ID
//@route GET /api/beehive-metrics/:id
//@access private

export const getBeehiveMetricsById = asyncHandler(async (req, res) => {
  const beehiveMetrics = await BeehiveMetrics.findById(req.params.id).populate("beehive_id");
  if (!beehiveMetrics) {
    res.status(404);
    throw new Error("Beehive metrics not found");
  }
  res.status(200).json(beehiveMetrics);
});

//@desc Add new beehive metrics
//@route POST /api/beehive-metrics
//@access private

export const addBeehiveMetrics = asyncHandler(async (req, res) => {
  const { beehive_id, CO2, Temperature, Humidity, Weight, Battery_level } = req.body;
  if (!beehive_id || !CO2 || !Temperature || !Humidity || !Weight || !Battery_level) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const beehiveMetrics = await BeehiveMetrics.create({
    beehive_id,
    CO2,
    Temperature,
    Humidity,
    Weight,
    Battery_level,
  });
  res.status(201).json(beehiveMetrics);
});

//@desc Update beehive metrics
//@route PUT /api/beehive-metrics/:id
//@access private

export const updateBeehiveMetrics = asyncHandler(async (req, res) => {
  const beehiveMetrics = await BeehiveMetrics.findById(req.params.id);
  if (!beehiveMetrics) {
    res.status(404);
    throw new Error("Beehive metrics not found");
  }

  const updatedMetrics = await BeehiveMetrics.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedMetrics);
});

//@desc Delete beehive metrics
//@route DELETE /api/beehive-metrics/:id
//@access private

export const deleteBeehiveMetrics = asyncHandler(async (req, res) => {
  const beehiveMetrics = await BeehiveMetrics.findById(req.params.id);
  if (!beehiveMetrics) {
    res.status(404);
    throw new Error("Beehive metrics not found");
  }
  await beehiveMetrics.deleteOne();
  res.status(201).json({ beehiveMetrics, message: "Beehive metrics deleted successfully" });
});
