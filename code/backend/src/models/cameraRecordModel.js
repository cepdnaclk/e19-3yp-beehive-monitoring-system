import mongoose from "mongoose";

const { Schema } = mongoose;

const cameraRecordSchema = new Schema(
  {
    beehive_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Beehive",
    },
    folder_name: {
      type: String,
      required: [true, "Please add the folder name"],
    },
    folder_size: {
      type: String,
    },
    sample_image_names: {
      
      type: Array,
    },
    isRetrieved: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

export const CameraRecord = mongoose.model("CameraRecord", cameraRecordSchema);
