import asyncHandler from "express-async-handler";
import { Notification } from "../models/notificationModel.js";
import { User } from "../models/userModel.js";

//@desc Get all notifications
//@route GET /api/notifications
//@access private

export const getAllNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id });
  res.status(200).json( notifications );
});
