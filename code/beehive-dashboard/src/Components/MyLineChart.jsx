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
    timestamp: format(new Date(item.createdAt), "HH:mm"),
  }));

  return (
    <div
      style={{
        scale: "0.5",
        padding: "5px",
        marginLeft: "-6rem",
        marginBottom: "-4rem",
        marginTop: "-4rem",
        cursor: "pointer",
      }}
    >
      <LineChart
        width={520}
        height={350}
        data={formattedData}
        margin={{
          top: 25,
          right: 30,
          left: 35,
          bottom: 40,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp">
          <Label value="Time" offset={0} position="insideBottom" style={{ fontWeight: "bold", fontSize: "1.15rem" }}/>
        </XAxis>
        <YAxis>
        <Label
          value={dataKeys.includes("weight") ? "Weight (kg)" : "Values"}
          offset={0}
          position="insideLeft"
          angle={270}
          style={{ fontWeight: "bold", fontSize: "1.15rem" }}
        />
        </YAxis>
        <Tooltip />

        {dataKeys.map((key, index) => (
          <React.Fragment key={key}>
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]} // Use provided colors or default ones
              fill={colors[index % colors.length]}
              strokeWidth={2}
            />{" "}
          </React.Fragment> // Use provided colors or default ones
        ))}
      </LineChart>
    </div>
  );
};

export default MyLineChart;
