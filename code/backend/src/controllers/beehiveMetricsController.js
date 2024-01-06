import asyncHandler from "express-async-handler";
import { BeehiveMetrics } from "../models/beehiveMetricsModel.js";

//@desc Get all beehive metrics
//@route GET /api/beehive-metrics
//@access private

export const getAllBeehiveMetrics = asyncHandler(async (req, res) => {
  const beehiveMetrics = await BeehiveMetrics.find().populate("beehive_id");
  res.status(200).json({ beehiveMetrics });
});

//@desc Get beehive metrics by Beehive ID with individual and combined graphs
//@route GET /api/beehive-metrics/:beehive_id
//@access private

export const getBeehiveMetricsById = asyncHandler(async (req, res) => {
  const { beehive_id } = req.params;
  try {
    const beehiveMetrics = await BeehiveMetrics.find({ beehive_id });
    if (!beehiveMetrics) {
      res.status(404);
      throw new Error("Beehive metrics not found");
    }
    // Filter the metrics for the specific beehive_id
    const filteredMetrics = beehiveMetrics.filter(
      (metric) => metric.beehive_id.toString() === beehive_id
    );

    // Extracting individual metric arrays and createdAt
    const CO2 = [];
    const Temperature = [];
    const Humidity = [];
    const createdAt = [];

    filteredMetrics.forEach((metric) => {
      CO2.push(metric.CO2);
      Temperature.push(metric.Temperature);
      Humidity.push(metric.Humidity);
      createdAt.push(metric.createdAt);
    });

    // Prepare individual data for each graph
    const temperatureData = Temperature.map((values, index) => ({
      x: createdAt[index],
      y: values,
    }));

    const humidityData = Humidity.map((values, index) => ({
      x: createdAt[index],
      y: values,
    }));

    const co2Data = CO2.map((values, index) => ({
      x: createdAt[index],
      y: values,
    }));

    // Prepare the combined graph data
    const combinedGraphData = {
      CO2: CO2.flat(),
      Temperature: Temperature.flat(),
      Humidity: Humidity.flat(),
      createdAt: createdAt.flat(),
    };

    const graphsData = {
      temperature: temperatureData,
      humidity: humidityData,
      co2: co2Data,
      combined: combinedGraphData,
    };

    res.status(200).json(graphsData);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//@desc Add new beehive metrics
//@route POST /api/beehive-metrics
//@access private

export const addBeehiveMetrics = asyncHandler(async (req, res) => {
  const { beehive_id, CO2, Temperature, Humidity, Weight, Battery_level } =
    req.body;
  if (
    !beehive_id ||
    !CO2 ||
    !Temperature ||
    !Humidity ||
    !Weight ||
    !Battery_level
  ) {
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

  const updatedMetrics = await BeehiveMetrics.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
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
  res
    .status(201)
    .json({ beehiveMetrics, message: "Beehive metrics deleted successfully" });
});
