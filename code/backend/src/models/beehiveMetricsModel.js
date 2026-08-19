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
      type: Number,
      min: 0,
    },
    Temperature: {
      type: Number,
    },
    Humidity: {
      type: Number,
      min: 0,
      max: 100,
    },
    Weight: {
      type: Number,
      min: 0,
    },

    Battery_level: {
      type: Number,
      //range
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Every chart query filters by beehive_id and sorts by time. Without this the
// lookup is a full collection scan, which matters once readings arrive at 1 Hz.
beehiveMetricsSchema.index({ beehive_id: 1, createdAt: -1 });

export const BeehiveMetrics = mongoose.model(
  "BeehiveMetrics",
  beehiveMetricsSchema
);
