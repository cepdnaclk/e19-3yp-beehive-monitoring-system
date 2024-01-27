import React, { createContext, useState, useEffect } from "react";
import { getNotificationRecords } from "../Services/notificationService";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notificationRecords, setNotificationRecords] = useState([]);

    const fetchNotificationRecords = async () => {
        await getNotificationRecords()
            .then((notificationRecords) => {
                console.log("Successfully fetched notification records:", notificationRecords);
                setNotificationRecords(notificationRecords);
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


    return (
        <NotificationContext.Provider value={{ notificationRecords, fetchNotificationRecords }}>
            {children}
        </NotificationContext.Provider>
    );

}


