import mongoose from "mongoose";

const { Schema } = mongoose;

const beehiveSchema = new Schema(
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
    location: {
      type: String,
    },

    // These Metrics represent the value of each metric at the time when the user last interacted
    CO2: {
      type: String,
    },
    Temperature: {
      type: String,
    },
    Humidity: {
      type: String,
    },
    Weight: {
      type: String,
    },

    Battery_level: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Beehive = mongoose.model("Beehive", beehiveSchema);
