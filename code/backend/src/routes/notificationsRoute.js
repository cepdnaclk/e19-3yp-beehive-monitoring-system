import express from "express";
import { validateToken } from "../middleware/validateTokenHandler.js";
import { getAllNotifications,updateAllNotifications,updateNotificationById } from "../controllers/notificationController.js";

export const router = express.Router();

router.use(validateToken);

router.route("/").get(getAllNotifications);

router.route("/").put(updateAllNotifications);

router.route("/:id").put(updateNotificationById);


