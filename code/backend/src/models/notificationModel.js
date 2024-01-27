import mongoose from "mongoose";
const { Schema } = mongoose;

const notificationSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        notificationType: {
            type: String,
            required: [true, "Please add the notification type"],
        },
        notificationMessage: {
            type: String,
            required: [true, "Please add the notification message"],
        },
        isRead: {
            type: Boolean,
        },
    },
    {
        timestamps: true,

    }
);

export const Notification = mongoose.model("Notification", notificationSchema);