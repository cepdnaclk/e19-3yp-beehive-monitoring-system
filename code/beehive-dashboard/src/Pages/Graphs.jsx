import MyLineChart from "../Components/MyLineChart";
import MyAreaChart from "../Components/MyAreaChart";
import Table from "../Components/Table";
import Navbar from "../Components/NavbarBlack";
import React, { useState, useEffect, useRef } from "react";
import ImageCarousel from "../Components/Carousel";
import "../Styles/Pages/Graphs.scss";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FcSynchronize, FcExport } from "react-icons/fc";
import { TiExportOutline } from "react-icons/ti";

const Graphs = () => {
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const backgroundClick = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleBackgroundClick);

    return () => {
      document.removeEventListener("click", handleBackgroundClick);
    };
  }, []);

  const handleBackgroundClick = (e) => {
    if (e.target === backgroundClick.current) {
      setShowTable(false);
    }
  };

  const imageUrls = [
    "https://img.freepik.com/premium-photo/bees-entering-beehive-with-collected-floral-nectar_130265-3819.jpg?w=1380",
    "https://static3.bigstockphoto.com/8/5/2/large1500/258793825.jpg",
  ];

  const data = [
    {
      timestamp: "2024-01-01T10:00:00.000Z",
      temperature: 12,
      humidity: 60,
      CO2: 300,
    },
    {
      timestamp: "2024-01-01T11:00:00.000Z",
      temperature: 15,
      humidity: 65,
      CO2: 320,
    },
    {
      timestamp: "2024-01-01T12:00:00Z",
      temperature: 14.480638127331558,
      humidity: 61.105928601719484,
      CO2: 353,
    },
    {
      timestamp: "2024-01-01T13:00:00Z",
      temperature: 14.312689925488288,
      humidity: 59.01917911620542,
      CO2: 327,
    },
    {
      timestamp: "2024-01-01T14:00:00Z",
      temperature: 13.323954187164201,
      humidity: 66.20053437080327,
      CO2: 337,
    },
    {
      timestamp: "2024-01-01T15:00:00Z",
      temperature: 15.787548422931067,
      humidity: 68.99521451828583,
      CO2: 396,
    },
    {
      timestamp: "2024-01-01T16:00:00Z",
      temperature: 13.269477066827797,
      humidity: 50.27777777763697,
      CO2: 360,
    },
    {
      timestamp: "2024-01-01T17:00:00Z",
      temperature: 16.86646918373297,
      humidity: 55.02876886162029,
      CO2: 334,
    },
    {
      timestamp: "2024-01-01T18:00:00Z",
      temperature: 14.726577354647768,
      humidity: 57.4560784122444,
      CO2: 382,
    },
    {
      timestamp: "2024-01-01T19:00:00Z",
      temperature: 14.950598344062467,
      humidity: 65.566236593079,
      CO2: 341,
    },
    {
      timestamp: "2024-01-01T20:00:00Z",
      temperature: 12.827280451977341,
      humidity: 63.294163336436114,
      CO2: 358,
    },
    {
      timestamp: "2024-01-01T21:00:00Z",
      temperature: 13.284715345942043,
      humidity: 55.44195549343026,
      CO2: 350,
    },
  ];
  return (
    <div className="dashboard_container">
      <Navbar />
      {showTable && (
        <div className="table">
          <div className="table_container">
            <button
              className="close_button"
              onClick={(e) => {
                e.preventDefault();
                setShowTable(false);
              }}
            >
              <IoCloseCircleOutline />
            </button>
            <button
              className="sync_button"
              onClick={(e) => {
                e.preventDefault();
                setShowTable(false);
              }}
            >
              <FcSynchronize /> {" "}Sync
            </button>
            <button
              className="export_button"
              onClick={(e) => {
                e.preventDefault();
                setShowTable(false);
              }}
            >
              <TiExportOutline /> Export
            </button>

            <select className="sort_button" name="sort" id="sort">
              <option value="hour">Last hour</option>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>

            <div className="table_background" ref={backgroundClick}>
              <Table data={data} dataKeys={tableData} />
            </div>
          </div>
        </div>
      )}
      <div className="graph_container">
        <p className="topic">Beehive 01</p>
        <div className="graph_card_container">
        <div className="graph_card">
          <div className="graph" id="graph1">
            <div className="graph_details">
              <p>All Data</p>
              <p className="value">{" ----"}</p>
            </div>
            <hr />
            <div className="sort">
              <p>Variation Through :</p>
              <select className="dropdown" name="sort" id="sort">
                <option value="hour">Last hour</option>
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
            <button
              className="info_button"
              onClick={() => {
                setShowTable(true);
                setTableData(["temperature", "humidity", "CO2"]);
              }}
            >
              i
            </button>
            <MyLineChart
              data={data}
              dataKeys={["temperature", "humidity", "CO2"]}
            />
          </div>
        </div>

        <div className="graph_card">
          <div className="graph" id="graph2">
            <div className="graph_details">
              <p>Tempreture</p>
              <p className="value">
                {data[data.length - 1].temperature.toFixed(1)} °C
              </p>
            </div>
            <hr />
            <div className="sort">
              <p>Variation Through :</p>
              <select className="dropdown" name="sort" id="sort">
                <option value="hour">Last hour</option>
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
            <button
              className="info_button"
              onClick={() => {
                setShowTable(true);
                setTableData(["temperature"]);
              }}
            >
              i
            </button>
            <div
              onClick={() => {
                setShowTable(true);
                setTableData(["temperature"]);
              }}
              className="graph_click"
            >
              <MyAreaChart
                data={data}
                dataKeys={["temperature"]}
                colors={["#82ca9d"]}
              />
            </div>
          </div>
        </div>

        <div className="graph_card">
          <div className="graph" id="graph1">
            <div className="graph_details">
              <p>Humidity</p>
              <p className="value">
                {data[data.length - 1].humidity.toFixed(1)} %
              </p>
            </div>
            <hr />
            <div className="sort">
              <p>Variation Through :</p>
              <select className="dropdown" name="sort" id="sort">
                <option value="hour">Last hour</option>
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
            <button
              className="info_button"
              onClick={() => {
                setShowTable(true);
                setTableData(["humidity"]);
              }}
            >
              i
            </button>
            <div
              onClick={() => {
                setShowTable(true);
                setTableData(["humidity"]);
              }}
              className="graph_click"
            >
              <MyAreaChart
                data={data}
                dataKeys={["humidity"]}
                colors={["#8884d8"]}
              />
            </div>
          </div>
        </div>

        <div className="graph_card">
          <div className="graph" id="graph1">
            <div className="graph_details">
              <p>CO&#8322; Level</p>
              <p className="value">
                {data[data.length - 1].CO2.toFixed(2)} ppm
              </p>
            </div>
            <hr />
            <div className="sort">
              <p>Variation Through :</p>
              <select className="dropdown" name="sort" id="sort">
                <option value="hour">Last hour</option>
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
            </div>
            <button
              className="info_button"
              onClick={() => {
                setShowTable(true);
                setTableData(["CO2"]);
              }}
            >
              i
            </button>
            <div
              onClick={() => {
                setShowTable(true);
                setTableData(["CO2"]);
              }}
              className="graph_click"
            >
              <MyAreaChart
                data={data}
                dataKeys={["CO2"]}
                colors={["#ff8042"]}
              />
            </div>
          </div>
        </div>

        <div className="general_info_card">
          <div className="general_info">
            <p>General Informations:</p>
            <div className="general_info_details">
              <div className="info_box">
                <p className="key">Age of the hive</p>
                <p className="value">2 months</p>
              </div>
              <div className="info_box">
                <p className="key">Connection Status</p>
                <p className="value">Connected 🟢</p>
              </div>
            </div>
          </div>
        </div>

        <div className="video_card">
          <div className="video_container">
          <button
              className="info_button"
              onClick={() => {
                setShowTable(true);
                setTableData(["CO2"]);
              }}
            >
              i
            </button>
            <div className="video">
              <ImageCarousel imageUrls={imageUrls} />
              {/* <img src="https://img.freepik.com/premium-photo/bees-entering-beehive-with-collected-floral-nectar_130265-3819.jpg?w=1380"></img> */}
            </div>
            <div className="vl"></div>
            <div className="video_details">
              <p>Video Size</p>
              <p className="value">2 MB</p>
              <p>Video Duration</p>
              <p className="value">10 min</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Graphs;
