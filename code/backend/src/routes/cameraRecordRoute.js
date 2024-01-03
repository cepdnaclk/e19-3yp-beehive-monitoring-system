import {
  getCameraRecords,
  createCameraRecord,
} from "../controllers/cameraRecordController.js";
import express from "express";
import { validateToken } from "../middleware/validateTokenHandler.js";

export const router = express.Router();

//router.use(validateToken);

router.route("/").get(getCameraRecords).post(createCameraRecord);
