import React from "react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
} from "recharts";
import { format, setMinutes } from "date-fns";

const MyAreaChart = ({
  data,
  dataKeys,
  duration,
  colors = ["#82ca9d", "#ffc658", "#8884d8", "#ff8042"],
}) => {
  console.log("Duration:", duration)
  // Function to format date based on duration
  const formatDate = (date) => {
    switch (duration) {
      case "hour":
        return format(new Date(date), "mm:ss");
      case "day":
        console.log(format(new Date(date), "HH:mm"));
        return format(new Date(date), "HH:mm");
      case "week":
      case "month":
        return format(new Date(date), "MM-dd");
      default:
        return format(new Date(date), "yyyy-MM-dd HH:mm");
    }
  };

  // Function to group and average data based on frequency
  const groupDataByFrequency = (data, frequency) => {
    const groups = {};
    console.log("Frequency:", frequency)
    console.log("Data:", data)
    data.forEach((d) => {
      let groupKey;
      const date = new Date(d.createdAt);

      switch (frequency) {
        case "hour":
          // Group by every 5 minutes
          const roundedMinutes = 5 * Math.floor(date.getMinutes() / 5);
          groupKey = format(
            setMinutes(date, roundedMinutes),
            "yyyy-MM-dd HH:mm"
          );
          break;
        case "day":
          // Group by hour
          groupKey = format(date, "yyyy-MM-dd HH:mm");
          break;
        case "week":
          // Group by day
          groupKey = format(date, "yyyy-MM-dd");
          break;
        case "month":
          console.log("Month");
          // Group by 3 day segments
          const dayOfMonth = date.getDate();
          const segmentStartDay = dayOfMonth - (dayOfMonth % 3);
          groupKey = format(
            new Date(date.getFullYear(), date.getMonth(), segmentStartDay),
            "yyyy-MM-dd"
          );
          break;
        default:
          groupKey = format(date, "yyyy-MM-dd HH:mm:ss");
          break;
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(d);
    });

    // Average data in each group
    return Object.entries(groups).map(([groupKey, groupData]) => {
      const averageData = { timestamp: groupKey };
      dataKeys.forEach((key) => {
        const sum = groupData.reduce((acc, curr) => acc + curr[key], 0);
        averageData[key] = sum / groupData.length;
      });
      return averageData;
    });
  };

  let formattedData = groupDataByFrequency(
    data,
    duration
  ).map((item) => ({
    ...item,
    timestamp: formatDate(item.timestamp),
  }));
  console.log("Formatted data:", formattedData);

  return (
    <div
      style={{
        scale: "0.5",
        padding: "5px",
        marginLeft: "-6rem",
        marginBottom: "-4rem",
        marginTop: "-5rem",
        cursor: "pointer",
      }}
    >
      <AreaChart
        width={520}
        height={350}
        data={formattedData}
        margin={{
          top: 25,
          right: 80,
          left: 35,
          bottom: 50,
        }}
      >
        <defs>
          {dataKeys.map((key, index) => (
            <linearGradient
              key={key}
              id={`gradient-${key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="25%"
                stopColor={colors[index % colors.length]}
                stopOpacity={1}
              />
              <stop
                offset="100%"
                stopColor={colors[index % colors.length]}
                stopOpacity={0}
              />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp">
          <Label
            value="Time"
            offset={-5}
            position="insideBottom"
            style={{ fontWeight: "bold", fontSize: "1.15rem" }}
          />
        </XAxis>
        <YAxis>
          <Label
            value={
              dataKeys[0] === "temperature"
                ? "Temperature (°C)"
                : dataKeys[0] === "humidity"
                ? "Humidity (%)"
                : dataKeys[0] === "weight"
                ? "Weight (kg)"
                : "CO2 level (ppm)"
            }
            offset={0}
            position="insideLeft"
            angle={270}
            style={{ fontWeight: "bold", fontSize: "1.15rem" }}
          />
        </YAxis>
        <Tooltip />
        {dataKeys.map((key, index) => (
          <React.Fragment key={key}>
            <Area
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              fill={`url(#gradient-${key})`}
            />
            <Line
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={3}
            />
          </React.Fragment>
        ))}
      </AreaChart>
    </div>
  );
};

export default MyAreaChart;
