import React from "react";
import { useNavigate } from "react-router-dom";
import Box from "../Assets/Beehive_box.png";
import Ellipse from "../Assets/Card_Ellipse.png";
import "../Styles/Components/BeehiveCard.scss";
import BatteryIndicator from "./BatteryIndicator";
import { faThermometerHalf, faTint, faCloud } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


function BeehiveCard({ beehiveData }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/graph`, {state: {beehiveData: beehiveData}});
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
            <BatteryIndicator level={beehiveData.Battery_level} />
            <span>Battery: {beehiveData.Battery_level}%</span>
          </span>
        </li>
        <li>
          <span className="feature">
            <FontAwesomeIcon icon={faTint} className="icon-humidity" />
            <span>Humidity: {beehiveData.Humidity}%</span>
          </span>
        </li>
        <li>
          <span className="feature">
            <FontAwesomeIcon icon={faThermometerHalf} className="icon-temperature"/>
            <span>Temperature: {beehiveData.Temperature}{'\u00b0'}C</span>
          </span>
        </li>
        <li>
          <span className="feature">
            <FontAwesomeIcon icon={faCloud} className="icon-co2"/>
            <span>CO2: {beehiveData.CO2} ppm</span>
          </span>
        </li>
      </ul>
    </div>
  );
}

export default BeehiveCard;


