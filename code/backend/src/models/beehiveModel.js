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
      required: [true, "Please add the beehive location"],
    },
    

  },
  {
    timestamps: true,
  }
);

export const Beehive =  mongoose.model("Beehive", beehiveSchema);
