// Importing mongoose, a package used to create schemas and interact with MongoDB.
import mongoose from "mongoose";

// Destructuring Schema from the mongoose object for convenience.
const { Schema } = mongoose;

// Creating a new Schema for beehive metrics.
// A Schema defines the structure of the document, default values, validators, etc.
const beehiveMetricsSchema = new Schema(
  {
    // beehive_id is a reference to a Beehive model. 
    // It's stored as an ObjectId, a special type used in MongoDB for unique identifiers.
    beehive_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // This field is mandatory.
      ref: "Beehive", // Refers to the Beehive model for relationships between collections.
    },

    // CO2 level data. Type is set to String, but you might consider using a Number type 
    // if the data is numerical.
    CO2: {
      type: String,
    },

    // Temperature data. As with CO2, consider using the Number type for numerical data.
    Temperature: {
      type: String,
    },

    // Humidity data. Again, a Number type might be more suitable for numerical values.
    Humidity: {
      type: String,
    },

    // Weight data. This is likely a numerical value, so consider using the Number type.
    Weight: {
      type: String,
    },

    // Battery level data. This might be a percentage or a numerical value, so a Number type could be more appropriate.
    Battery_level: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields to the schema.
  }
);

// Creating a model from the schema. A model allows you to interact with a database collection for the beehive metrics.
export const BeehiveMetrics = mongoose.model('BeehiveMetrics', beehiveMetricsSchema);
