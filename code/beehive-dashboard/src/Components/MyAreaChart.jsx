import React from "react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from "recharts";
import { format } from "date-fns";
import { Scale } from "@mui/icons-material";

const MyAreaChart = ({
  data,
  dataKeys,
  colors = [ "#82ca9d","#ffc658","#8884d8", "#ff8042"],
}) => {
  const formattedData = data.map((item) => ({
    ...item,
    timestamp: format(new Date(item.timestamp), "HH:mm"),
  }));

  return (
    <div style={{ scale:"0.5", padding: "5px", marginLeft:"-6rem",  marginBottom:"-4rem", marginTop:"-4rem"  }}>
    <AreaChart
      width={500}
      height={350}
      data={formattedData}
      margin={{
        top: 5,
        right: 30,
        left: 35,
        bottom: 20,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="timestamp" >
        <Label value="Time" offset={-20} position="insideBottom" style={{fontWeight:"bold", fontSize:"1.15rem"}}/>
      </XAxis>
      <YAxis>
        <Label value={dataKeys[0] === "temperature" ? "Temperature (°C)" : dataKeys[0] === "humidity" ? "Humidity (%)" : `CO2 level (ppm)`} offset={0} position="insideLeft" angle={270} style={{fontWeight:"bold", fontSize:"1.15rem"}}/>
      </YAxis>
      <Tooltip />
      {/* <Legend /> */}
      {dataKeys.map((key, index) => (
        <>
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            fill={colors[index % colors.length]} // Use provided colors or default ones
          />
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]} // Use provided colors or default ones
            fill={colors[index % colors.length]}
            strokeWidth={3}
          />{" "}
        </> // Use provided colors or default ones
      ))}
    </AreaChart>
    </div>
  );
};

export default MyAreaChart;
