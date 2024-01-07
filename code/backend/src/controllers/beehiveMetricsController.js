import asyncHandler from "express-async-handler";
import { BeehiveMetrics } from "../models/beehiveMetricsModel.js";
import { createObjectCsvStringifier } from 'csv-writer';

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
  console.log("The beehive_id is:", beehive_id);

  try {
    const beehiveMetrics = await BeehiveMetrics.find({ beehive_id });
    if (!beehiveMetrics || beehiveMetrics.length === 0) {
      res.status(404);
      throw new Error("Beehive metrics not found");
    }

    // Transforming the data into the desired format
    const transformedData = beehiveMetrics.map(metric => ({
      createdAt: metric.createdAt,
      temperature: metric.Temperature,
      humidity: metric.Humidity,
      CO2: metric.CO2,
    }));

    res.status(200).json(transformedData);
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



export const exportBeehiveMetricsCsv = asyncHandler(async (req, res) => {
    const { beehive_id } = req.params;

    try {
        const beehiveMetrics = await BeehiveMetrics.find({ beehive_id });
        if (!beehiveMetrics || beehiveMetrics.length === 0) {
            res.status(404);
            throw new Error("Beehive metrics not found");
        }

        const csvStringifier = createObjectCsvStringifier({
            header: [
                { id: 'createdAt', title: 'Created At' },
                { id: 'temperature', title: 'Temperature' },
                { id: 'humidity', title: 'Humidity' },
                { id: 'CO2', title: 'CO2' },
                // Add other headers as needed
            ],
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="beehive-metrics-${beehive_id}.csv"`);

        const transformedData = beehiveMetrics.map(metric => ({
            createdAt: metric.createdAt,
            temperature: metric.Temperature,
            humidity: metric.Humidity,
            CO2: metric.CO2,
            // Include other fields if needed
        }));

        res.write(csvStringifier.getHeaderString());
        res.write(csvStringifier.stringifyRecords(transformedData));
        res.end();

    } catch (error) {
        console.error('Error generating CSV file', error);
        res.status(500).send('Error generating CSV file');
    }
});
