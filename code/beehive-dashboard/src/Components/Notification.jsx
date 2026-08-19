import { useState, useContext, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

import NotificationPopup from "./NotificationPopup";
import { NotificationContext } from "../Context/NotificationContext";
import "../Styles/Components/NotificationPopup.scss";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const {
    notifications,
    fetchNotificationRecords,
    clearAllNotifications,
    clearNotification,
  } = useContext(NotificationContext);

  useEffect(() => {
    fetchNotificationRecords();
  }, []);

  // A dropdown that only closes via its own X button is easy to strand open,
  // so dismiss on an outside click or Escape as well.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const count = notifications.length;

  return (
    <div className="notif" ref={containerRef}>
      <button
        type="button"
        className={`notif__button${isOpen ? " is-active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={
          count > 0 ? `Notifications, ${count} unread` : "Notifications"
        }
      >
        <FontAwesomeIcon icon={faBell} />
        {count > 0 && (
          <span className="notif__badge">{count > 9 ? "9+" : count}</span>
        )}
      </button>

      {isOpen && (
        <NotificationPopup
          notifications={notifications}
          onClose={() => setIsOpen(false)}
          onClearNotification={clearNotification}
          onClearAllNotifications={clearAllNotifications}
        />
      )}
    </div>
  );
};

export default Notification;
