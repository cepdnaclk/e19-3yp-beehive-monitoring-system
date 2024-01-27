import React, { useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faTrash } from "@fortawesome/free-solid-svg-icons";
import NotificationPopup from "./NotificationPopup";
import "../Styles/Components/Notification.scss";

const Notification = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, body: "Notification 1" },
    { id: 2, body: "Notification 2" },
  ]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const clearAllNotifications = useCallback((updatedNotifications) => {
    setNotifications(updatedNotifications);
  }, []);

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
          onClearNotification={clearAllNotifications}
        />
      )}
    </div>
  );
};

export default Notification;
