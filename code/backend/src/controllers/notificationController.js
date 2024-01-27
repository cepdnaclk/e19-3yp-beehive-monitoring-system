import asyncHandler from "express-async-handler";
import { Notification } from "../models/notificationModel.js";
import { User } from "../models/userModel.js";

//@desc Get all notifications
//@route GET /api/notifications
//@access private

export const getAllNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id, isRead: false});
  res.status(200).json(notifications);
});

//@desc update all notifications of a user (mark as read)
//@route PUT /api/notifications
//@access private

export const updateAllNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.updateMany(
    { userId: req.user.id },
    { isRead: true }
  );
  res.status(200).json({ message: "Notifications updated successfully" });
});

//@desc update a notification by id (mark as read)
//@route PUT /api/notifications/:id
//@access private

export const updateNotificationById = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }
  const updatedNotification = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true }
  );
  res.status(200).json(updatedNotification);
});
