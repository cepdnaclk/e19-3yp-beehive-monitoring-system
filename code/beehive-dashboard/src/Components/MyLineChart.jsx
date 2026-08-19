import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

/*
Line variant of MyAreaChart, selected with type="line" on MyChartHandler. Styled
to match it: responsive rather than a fixed 520x350 shrunk with `scale: 0.5` and
negative margins, and the same axis, grid and tooltip treatment.
*/

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

const MyLineChart = ({ data, dataKeys, unit = "", colors = ["#f7941d"] }) => {
  const points = data
    .map((item) => {
      const at = new Date(item.createdAt);
      if (Number.isNaN(at.getTime())) return null;
      return { ...item, timestamp: format(at, "HH:mm") };
    })
    .filter(Boolean);

  if (points.length === 0) {
    return <div className="chart-empty">No readings in this period</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={190}>
      <LineChart data={points} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
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
          cursor={{ stroke: colors[0], strokeWidth: 1, strokeDasharray: "3 3" }}
        />
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MyLineChart;
