import React, { createContext, useState, useEffect } from "react";
import { getNotificationRecords,updateAllNotificationRecords,updateNotificationRecord } from "../Services/notificationService";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotificationRecords] = useState([]);

    const fetchNotificationRecords = async () => {
        await getNotificationRecords()
            .then((notifications) => {
                console.log("Successfully fetched notification records:", notifications);
                setNotificationRecords(notifications);
            })
            .catch((error) => {
                console.error("Failed to fetch notification records:", error);
            })
            .finally(() => {
            });
        return Promise.resolve();
    }

    useEffect(() => {
        fetchNotificationRecords();
    }, []);

    const clearAllNotifications = async () => {
        setNotificationRecords([]);

        await updateAllNotificationRecords();

    }

    const clearNotification = async (notificationId) => {
        const updatedNotifications = notifications.filter(
            (notification) => notification._id !== notificationId
        );
        console.log("Updated Notifications:", updatedNotifications);
        setNotificationRecords(updatedNotifications);

        await updateNotificationRecord(notificationId);
    }


    return (
        <NotificationContext.Provider value={{ notifications, fetchNotificationRecords,clearAllNotifications,clearNotification }}>
            {children}
        </NotificationContext.Provider>
    );

}


