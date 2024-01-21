import React from "react";
import { useNavigate } from "react-router-dom";
import Box from "../Assets/Beehive_box.png";
import Ellipse from "../Assets/Card_Ellipse.png";
import "../Styles/Components/BeehiveCard.scss";
import BatteryIndicator from "./BatteryIndicator";
import {
  faThermometerHalf,
  faTint,
  faCloud,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function BeehiveCard({ beehiveData }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/graph`, { state: { beehiveData: beehiveData } });
  };

  return (
    <div className="beehive-card" onClick={handleClick}>
      <p className="name">{beehiveData.name}</p>
      <div className="box-container">
        <img src={Box} alt="" className="box" />
      </div>
      <img src={Ellipse} alt="" className="ellipse" />
      <ul className="card-features">
        <li>
          <span className="feature-battery">
            <BatteryIndicator level={parseFloat(beehiveData.Battery_level)} />
            <span>
              Battery: {parseFloat(beehiveData.Battery_level).toFixed(2)}%
            </span>
          </span>
        </li>
        <li>
          <span className="feature">
            <FontAwesomeIcon icon={faTint} className="icon-humidity" />
            <span>
              Humidity: {parseFloat(beehiveData.Humidity).toFixed(2)}%
            </span>
          </span>
        </li>
        <li>
          <span className="feature">
            <FontAwesomeIcon
              icon={faThermometerHalf}
              className="icon-temperature"
            />
            <span>
              Temperature: {parseFloat(beehiveData.Temperature).toFixed(2)}
              {"\u00b0"}C
            </span>
          </span>
        </li>
        <li>
          <span className="feature">
            <FontAwesomeIcon icon={faCloud} className="icon-co2" />
            <span>CO2: {parseFloat(beehiveData.CO2).toFixed(2)} ppm</span>
          </span>
        </li>
      </ul>
    </div>
  );
}

export default BeehiveCard;
