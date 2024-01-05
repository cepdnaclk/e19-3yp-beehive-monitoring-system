import express from "express";
import multer from "multer";
import {
  getCameraRecords,
  createCameraRecord,
} from "../controllers/cameraRecordController.js";
import { validateToken } from "../middleware/validateTokenHandler.js";

export const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(validateToken);

// Apply multer only to the POST route for file upload
router.route("/")
  .get(getCameraRecords)
  .post(upload.single('sample_image'), createCameraRecord); // assuming 'sample_image' is the field name for the image


