const asyncHandler = require("express-async-handler");
const Beehive = require("../models/beehiveModel");

//@desc Get all data
//@route GET /api/data
//@access private

const getBeehives = asyncHandler(async (req, res) => {
  const beehives = await Beehive.find({ user_id: req.user.id });
  res.status(200).json({ beehives });
});

//@desc create new data
//@route POST /api/data
//@access private

const createBeehive = asyncHandler(async (req, res) => {
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
    uder_id: req.user.id,
  });
  res.status(201).json(beehive);
});

//@desc get data
//@route GET /api/data/:id
//@access private

const getBeehive = asyncHandler(async (req, res) => {
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

const updateBeehive = asyncHandler(async (req, res) => {
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

const deleteBeehive = asyncHandler(async (req, res) => {
  const beehive = await Beehive.findById(req.params.id);
  if (!beehive) {
    res.status(404);
    throw new Error("Beehive not found");
  }
  await beehive.remove();
  res.status(201).json(beehive);
});

module.exports = {
  getBeehives,
  createBeehive,
  getBeehive,
  updateBeehive,
  deleteBeehive,
};
