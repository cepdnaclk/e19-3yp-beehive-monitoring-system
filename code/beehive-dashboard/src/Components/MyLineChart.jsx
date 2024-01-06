import React from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import { format } from "date-fns";

const MyLineChart = ({
  data,
  dataKeys,
  colors = ["#82ca9d", "#8884d8", "#ff8042", "#ffc658"],
}) => {
  const formattedData = data.map((item) => ({
    ...item,
    timestamp: format(new Date(item.timestamp), "HH:mm"),
  }));

  return (
    <div style={{ scale:"0.5", padding: "5px", marginLeft:"-6rem", marginBottom:"-4rem", marginTop:"-4rem" }}>
    <LineChart
      width={520}
      height={350}
      data={formattedData}
      margin={{
        top: 5,
        right: 30,
        left: 30,
        bottom: 15,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="timestamp" >
        <Label value="Time" offset={-15} position="insideBottom" />
      </XAxis>
      <YAxis>
        <Label value="Values" offset={5} position="insideLeft" angle={270} />
      </YAxis>
      <Tooltip />
      
      {dataKeys.map((key, index) => (
        <>
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]} // Use provided colors or default ones
            fill={colors[index % colors.length]}
            strokeWidth={2}
          />{" "}
        </> // Use provided colors or default ones
      ))}
    </LineChart></div>
  );
};

export default MyLineChart;
