import express from "express";
import multer from "multer";
import {
  getCameraRecords,
  getCameraRecord,
  createCameraRecord,
} from "../controllers/cameraRecordController.js";
import { validateToken } from "../middleware/validateTokenHandler.js";

export const router = express.Router();

// Multer configuration for multiple files
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(validateToken);

// Configure multer for multiple file uploads
router.route("/")
  .get(getCameraRecords)
  .post(upload.fields([
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 },
      { name: 'file3', maxCount: 1 }
    ]), createCameraRecord);

router.get("/beehive/:id", getCameraRecord);
