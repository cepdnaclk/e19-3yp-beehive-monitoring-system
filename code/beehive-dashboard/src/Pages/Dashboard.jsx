import Navbar from "../Components/NavbarBlack";
import BeehiveCard from "../Components/BeehiveCard";
import AddCard from "../Components/AddCard";
import "../Styles/Pages/Dashboard.scss";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBeehives } from "../Services/beehiveService";

function Dashboard() {
  const navigate = useNavigate();

  const [fetching, setFetching] = useState(false);

  const [beehiveDataList, setBeehiveDataList] = useState({
    beehives: [
      {
        name: "Beehive 01",
        humidity: "45%",
        temperature: "36.3 °C",
        co2Level: "550 ppm",
      },
      {
        name: "Beehive 02",
        humidity: "40%",
        temperature: "35.5 °C",
        co2Level: "500 ppm",
      },
      {
        name: "Beehive 03",
        humidity: "50%",
        temperature: "37.0 °C",
        co2Level: "600 ppm",
      },
      {
        name: "Beehive 04",
        humidity: "42%",
        temperature: "34.8 °C",
        co2Level: "520 ppm",
      },
      {
        name: "Beehive 05",
        humidity: "48%",
        temperature: "36.8 °C",
        co2Level: "580 ppm",
      },
      {
        name: "Beehive 06",
        humidity: "39%",
        temperature: "35.2 °C",
        co2Level: "490 ppm",
      },
      {
        name: "Beehive 07",
        humidity: "47%",
        temperature: "36.5 °C",
        co2Level: "570 ppm",
      },
    ],
  });

  useEffect(() => {
    getAllBeehives().then((data) => {
      setBeehiveDataList(data);
      console.log(data);
    });
  }, [fetching]);

  return (
    <div className="dashboard-container">
      <Navbar />
      <button className="fetch-button" onClick={() => setFetching(!fetching)}>
        Sync
      </button>
      <div className="beehive-cards-container">
        {/* Fetch Sync button */}

        {beehiveDataList.beehives.map((data, index) => (
          <BeehiveCard key={index} beehiveData={data} />
        ))}
        {/* <AddCard /> */}
      </div>
    </div>
  );
}

export default Dashboard;
