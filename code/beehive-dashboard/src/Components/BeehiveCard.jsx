import React from "react";
import { useNavigate } from "react-router-dom";
import Box from "../Assets/Beehive_box.png";
import Ellipse from "../Assets/Card_Ellipse.png";
import "../Styles/Components/BeehiveCard.scss";

function BeehiveCard({ beehiveData }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/hive-dashboard/${beehiveData.name}`);
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
          <span className="feature">Humidity</span>: {beehiveData.humidity}
        </li>
        <li>
          <span className="feature">Temperature</span>: {beehiveData.temperature}
        </li>
        <li>
          <span className="feature">CO2 Level</span>: {beehiveData.co2Level}
        </li>
      </ul>
    </div>
  );
}

export default BeehiveCard;
