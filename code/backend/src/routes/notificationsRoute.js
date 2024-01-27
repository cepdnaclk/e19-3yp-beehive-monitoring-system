import express from "express";
import { validateToken } from "../middleware/validateTokenHandler.js";
import { getAllNotifications } from "../controllers/notificationController.js";

export const router = express.Router();

router.use(validateToken);

router.route("/").get(getAllNotifications);

