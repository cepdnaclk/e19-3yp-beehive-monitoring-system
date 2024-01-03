import MyLineChart from "../Components/MyLineChart";
import MyAreaChart from "../Components/MyAreaChart";
import Table from "../Components/Table";
import Navbar from "../Components/NavbarBlack";
import React, { useState, useEffect, useRef } from "react";
import "../Styles/Pages/Graphs.scss";

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
    <div className="dashboard-container">
      <Navbar />
      {showTable && (
        <div className="table_container"><button
          className="close_button"
          onClick={(e) => {
            e.preventDefault();
            setShowTable(false);
          }}
        >
          X
        </button>
        <div className="table_containe" ref={backgroundClick}>
           
          <Table data={data} dataKeys={tableData} />
        </div></div>
        
      )}
      <div className="graph-container">
        <div
          className="graph"
          id="graph1"
          onClick={() => {
            setShowTable(true);
            setTableData(["temperature", "humidity", "CO2"]);
          }}
        >
          <MyLineChart
            data={data}
            dataKeys={["temperature", "humidity", "CO2"]}
          />
        </div>

        <div
          className="graph"
          id="graph2"
          onClick={() => {
            setShowTable(true);
            setTableData(["temperature"]);
          }}
        >
          <MyAreaChart
            data={data}
            dataKeys={["temperature"]}
            colors={["#82ca9d"]}
          />
        </div>

        <div
          className="graph"
          id="graph1"
          onClick={() => {
            setShowTable(true);
            setTableData(["humidity"]);
          }}
        >
          <MyAreaChart
            data={data}
            dataKeys={["humidity"]}
            colors={["#8884d8"]}
          />
        </div>

        <div
          className="graph"
          id="graph1"
          onClick={() => {
            setShowTable(true);
            setTableData(["CO2"]);
          }}
        >
          <MyAreaChart data={data} dataKeys={["CO2"]} colors={["#ff8042"]} />
        </div>
      </div>
    </div>
  );
};

export default Graphs;
