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
    <LineChart
      width={600}
      height={300}
      data={formattedData}
      margin={{
        top: 5,
        right: 30,
        left: 30,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="timestamp" />
      <YAxis />
      <Tooltip />
      <Legend />
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
    </LineChart>
  );
};

export default MyLineChart;
