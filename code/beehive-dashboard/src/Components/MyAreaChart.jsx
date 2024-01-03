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
  ResponsiveContainer
} from "recharts";
import { format } from "date-fns";

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
    // <ResponsiveContainer width="100%" height="100%">
    <AreaChart
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
    // </ResponsiveContainer>
  );
};

export default MyAreaChart;
