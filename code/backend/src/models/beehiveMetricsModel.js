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
      min : 0,
      max : 100,
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

export const BeehiveMetrics = mongoose.model("BeehiveMetrics", beehiveMetricsSchema);
