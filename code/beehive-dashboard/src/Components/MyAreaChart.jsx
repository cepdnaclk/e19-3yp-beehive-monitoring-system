import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, setMinutes, setDate, startOfHour, startOfDay } from "date-fns";

/*
Charts fill their card via ResponsiveContainer. The previous version rendered at
a fixed 520x350 and then shrank it with `scale: 0.5` plus about -6rem of negative
margin, so the chart never matched its container and the axis text ended up at
half size.
*/

// How readings are bucketed, and how the resulting bucket is labelled, for each
// duration the selector offers.
// startOfHour / startOfDay rather than setMinutes + setSeconds: the setters
// leave milliseconds untouched, so every reading kept a distinct bucket key and
// nothing was ever actually aggregated.
const GROUPING = {
  hour: {
    // Five-minute buckets.
    key: (date) => setMinutes(startOfHour(date), 5 * Math.floor(date.getMinutes() / 5)),
    label: "HH:mm",
  },
  day: {
    // Hourly buckets. This used to key on the string "yyyy-MM-dd HH:mm", which
    // is a separate bucket per minute.
    key: (date) => startOfHour(date),
    label: "HH:mm",
  },
  week: {
    key: (date) => startOfDay(date),
    label: "MMM d",
  },
  month: {
    // Three-day segments.
    key: (date) => setDate(startOfDay(date), date.getDate() - (date.getDate() % 3)),
    label: "MMM d",
  },
};

const groupData = (data, dataKeys, duration) => {
  const grouping = GROUPING[duration] ?? GROUPING.day;
  const buckets = new Map();

  data.forEach((reading) => {
    const date = new Date(reading.createdAt);
    if (Number.isNaN(date.getTime())) return;

    const bucketDate = grouping.key(date);
    const bucketId = bucketDate.getTime();
    if (!buckets.has(bucketId)) buckets.set(bucketId, { date: bucketDate, rows: [] });
    buckets.get(bucketId).rows.push(reading);
  });

  return [...buckets.values()]
    .sort((a, b) => a.date - b.date)
    .map(({ date, rows }) => {
      const point = { timestamp: format(date, grouping.label) };
      dataKeys.forEach((key) => {
        const values = rows
          .map((row) => Number(row[key]))
          .filter((n) => Number.isFinite(n));
        point[key] = values.length
          ? values.reduce((sum, n) => sum + n, 0) / values.length
          : null;
      });
      return point;
    });
};

const ChartTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip__time">{label}</span>
      <strong>
        {Number.isFinite(value) ? value.toFixed(2) : "—"}
        <small>{unit}</small>
      </strong>
    </div>
  );
};

const MyAreaChart = ({ data, dataKeys, duration, unit = "", colors = ["#f7941d"] }) => {
  const color = colors[0];
  const gradientId = `area-${dataKeys[0]}`;
  const points = groupData(data, dataKeys, duration);

  if (points.length === 0) {
    return <div className="chart-empty">No readings in this period</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={190}>
      <AreaChart data={points} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.32} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid stroke="#ece5d8" strokeDasharray="4 4" vertical={false} />
        <XAxis
          dataKey="timestamp"
          tick={{ fill: "#7a8593", fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: "#e8e0d2" }}
          minTickGap={24}
        />
        <YAxis
          tick={{ fill: "#7a8593", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={52}
          domain={["auto", "auto"]}
        />
        <Tooltip
          content={<ChartTooltip unit={unit} />}
          cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "3 3" }}
        />
        <Area
          type="monotone"
          dataKey={dataKeys[0]}
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
          connectNulls
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default MyAreaChart;
