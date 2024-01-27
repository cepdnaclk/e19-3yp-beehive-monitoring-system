import React, { useState, useCallback,useContext,useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faTrash } from "@fortawesome/free-solid-svg-icons";
import NotificationPopup from "./NotificationPopup";
import { NotificationContext } from "../Context/NotificationContext";

const Notification = () => {
  const [showPopup, setShowPopup] = useState(false);
  const {notifications,fetchNotificationRecords,clearAllNotifications,clearNotification} = useContext(NotificationContext);
  useEffect(() => {
    console.log("Notifications:", notifications);
    fetchNotificationRecords();
  }
  , []);

  

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // const clearAllNotifications = useCallback((updatedNotifications) => {
  //  // setNotifications(updatedNotifications);
  // }, []);

  return (
    <div className="notification-container">
      <div className="notification-icon" onClick={togglePopup}>
        <FontAwesomeIcon icon={faBell} size="lg" />
        {notifications.length > 0 && <span>{notifications.length}</span>}
      </div>

      {showPopup && (
        <NotificationPopup
          notifications={notifications}
          onClose={togglePopup}
          onClearNotification={clearNotification}
          onClearAllNotifications={clearAllNotifications}
        />
      )}
    </div>
  );
};

export default Notification;
