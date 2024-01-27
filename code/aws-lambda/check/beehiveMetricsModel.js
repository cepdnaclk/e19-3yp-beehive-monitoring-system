import mongoose from "mongoose";

const { Schema } = mongoose;

const beehiveMetricsSchema = new Schema(
  {
    beehive_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Beehive",
    },

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

export const BeehiveMetrics = mongoose.model('BeehiveMetrics', beehiveMetricsSchema);
