import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTemperatureHalf,
  faDroplet,
  faCloud,
  faWeightHanging,
  faLocationDot,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import BatteryIndicator from "./BatteryIndicator";
import HiveBox from "../Assets/Beehive_box.png";
import "../Styles/Components/BeehiveCard.scss";

const LOW_BATTERY = 20;

// A hive that has not reported yet has no metrics on its document, so every
// value is formatted defensively rather than assuming a number is there.
const format = (value, suffix, digits = 1) => {
  const number = Number(value);
  return Number.isFinite(number) ? `${number.toFixed(digits)}${suffix}` : "—";
};

function BeehiveCard({ beehiveData }) {
  const navigate = useNavigate();
  const battery = Number(beehiveData.Battery_level);
  const isLow = Number.isFinite(battery) && battery < LOW_BATTERY;

  const metrics = [
    {
      key: "temperature",
      icon: faTemperatureHalf,
      label: "Temperature",
      value: format(beehiveData.Temperature, "°C"),
    },
    {
      key: "humidity",
      icon: faDroplet,
      label: "Humidity",
      value: format(beehiveData.Humidity, "%"),
    },
    {
      key: "co2",
      icon: faCloud,
      label: "CO₂",
      value: format(beehiveData.CO2, " ppm", 0),
    },
    {
      key: "weight",
      icon: faWeightHanging,
      label: "Weight",
      value: format(beehiveData.Weight, " kg", 2),
    },
  ];

  return (
    <article
      className="hive-card"
      role="button"
      tabIndex={0}
      onClick={() => navigate("/graph", { state: { beehiveData } })}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate("/graph", { state: { beehiveData } });
        }
      }}
    >
      {/* Decorative watermark. Sits behind the content and bleeds off the
          bottom-right corner; the hive name identifies the card. */}
      <img src={HiveBox} alt="" className="hive-card__bg" aria-hidden="true" />

      <header className="hive-card__header">
        <div className="hive-card__identity">
          <h3>{beehiveData.name}</h3>
          {beehiveData.location && (
            <p>
              <FontAwesomeIcon icon={faLocationDot} />
              {beehiveData.location}
            </p>
          )}
        </div>
        <span
          className={`hive-card__status${isLow ? " hive-card__status--warn" : ""}`}
        >
          <i />
          {isLow ? "Low battery" : "Live"}
        </span>
      </header>

      <ul className="hive-card__metrics">
        {metrics.map(({ key, icon, label, value }) => (
          <li key={key} className={`hive-metric hive-metric--${key}`}>
            <span className="hive-metric__icon">
              <FontAwesomeIcon icon={icon} />
            </span>
            <span className="hive-metric__body">
              <small>{label}</small>
              <strong>{value}</strong>
            </span>
          </li>
        ))}
      </ul>

      <footer className="hive-card__footer">
        <BatteryIndicator level={battery} />
        <span className="hive-card__more">
          View charts
          <FontAwesomeIcon icon={faChevronRight} />
        </span>
      </footer>
    </article>
  );
}

export default BeehiveCard;
