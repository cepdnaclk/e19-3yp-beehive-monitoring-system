const mongoose = require("mongoose");

const beehiveSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please add the beehive name"],
    },
    CO2: {
      type: String,
      required: [true, "Please add the CO2 level"],
    },
    Temperature: {
      type: String,
      required: [true, "Please add the Temperature"],
    },
    Humidity: {
      type: String,
      required: [true, "Please add the Humidity"],
    },
    Weight: {
      type: String,
      required: [true, "Please add the weight"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Beehive", beehiveSchema);
