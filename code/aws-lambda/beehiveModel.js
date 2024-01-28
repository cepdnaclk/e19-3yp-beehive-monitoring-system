// Importing the mongoose library, which is used for database operations with MongoDB.
import mongoose from "mongoose";

// Destructuring the Schema constructor from the mongoose object.
const { Schema } = mongoose;

// Defining a new schema for a beehive. This schema will dictate the structure of documents in a MongoDB collection.
const beehiveSchema = new Schema(
  {
    // user_id refers to the ID of the user who owns this beehive. It is stored as an ObjectId, a type used by MongoDB for unique identifiers.
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // This field is mandatory.
      ref: "User", // This creates a reference to the User model, establishing a relationship between the Beehive and User documents.
    },

    // name is a required field that stores the name of the beehive.
    name: {
      type: String,
      required: [true, "Please add the beehive name"], // Setting the field as required and providing a custom error message if it's not provided.
    },

    // location stores the location of the beehive. It is optional and of type String.
    location: {
      type: String,
    },

    // The following fields represent various metrics associated with the beehive. 
    // They store the value of each metric at the time the user last interacted with the system.
    // Note: Consider using the 'Number' type for these if they represent numerical values.
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

    // email field to store contact information related to the beehive. This is optional.
    email: {
      type: String,
    },
  },
  {
    timestamps: true, // This option automatically adds 'createdAt' and 'updatedAt' fields to the schema, recording when the document is created and last updated.
  }
);

// Creating a model from the schema. This model 'Beehive' can be used to perform operations like create, read, update, and delete (CRUD) on documents in the 'Beehive' collection.
export const Beehive = mongoose.model("Beehive", beehiveSchema);
