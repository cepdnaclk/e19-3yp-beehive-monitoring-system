import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faTrash,
  faBatteryQuarter,
  faBell,
  faBellSlash,
} from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from "date-fns";
import "../Styles/Components/NotificationPopup.scss";

// The backend only raises low_battery today, but keying off the type means a
// new one gets a sensible icon instead of no icon at all.
const ICONS = {
  low_battery: faBatteryQuarter,
};

const relativeTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return formatDistanceToNow(date, { addSuffix: true });
};

const NotificationPopup = ({
  notifications,
  onClose,
  onClearNotification,
  onClearAllNotifications,
}) => (
  <div className="notif__panel" role="dialog" aria-label="Notifications">
    <header className="notif__panel-header">
      <h3>
        Notifications
        {notifications.length > 0 && <span>{notifications.length}</span>}
      </h3>
      <button type="button" onClick={onClose} aria-label="Close notifications">
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </header>

    <div className="notif__list">
      {notifications.length === 0 ? (
        <div className="notif__empty">
          <FontAwesomeIcon icon={faBellSlash} />
          <p>You are all caught up</p>
          <small>Alerts about your hives will show up here.</small>
        </div>
      ) : (
        notifications.map((notification) => (
          <article className="notif__item" key={notification._id}>
            <span className="notif__item-icon">
              <FontAwesomeIcon
                icon={ICONS[notification.notificationType] ?? faBell}
              />
            </span>
            <div className="notif__item-body">
              <p>{notification.notificationMessage}</p>
              {relativeTime(notification.createdAt) && (
                <time>{relativeTime(notification.createdAt)}</time>
              )}
            </div>
            <button
              type="button"
              className="notif__item-clear"
              onClick={() => onClearNotification(notification._id)}
              aria-label="Dismiss notification"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </article>
        ))
      )}
    </div>

    {notifications.length > 0 && (
      <footer className="notif__panel-footer">
        <button type="button" onClick={onClearAllNotifications}>
          <FontAwesomeIcon icon={faTrash} />
          Clear all
        </button>
      </footer>
    )}
  </div>
);

export default NotificationPopup;
