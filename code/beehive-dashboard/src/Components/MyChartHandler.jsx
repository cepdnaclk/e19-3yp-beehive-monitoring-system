import { useMemo } from "react";
import MyAreaChart from "./MyAreaChart";
import MyLineChart from "./MyLineChart";

const WINDOWS = {
  hour: 3600000,
  day: 86400000,
  week: 604800000,
  month: 2629800000,
};

/*
Trims the series to the selected window, then hands it to the chart.

The window used to be measured from a hardcoded 2024-01-29 timestamp. Every
reading newer than that produced a negative age, which satisfies every
comparison, so the selector did nothing and each chart drew the whole history.
*/
export const MyChartHandler = ({
  data,
  dataKeys,
  duration,
  colors,
  type,
  unit,
}) => {
  const chartData = useMemo(() => {
    const window = WINDOWS[duration];
    if (!window) return data;
    const cutoff = Date.now() - window;
    return data.filter((item) => new Date(item.createdAt).getTime() >= cutoff);
  }, [data, duration]);

  const Chart = type === "line" ? MyLineChart : MyAreaChart;

  return (
    <Chart
      data={chartData}
      dataKeys={dataKeys}
      colors={colors}
      duration={duration}
      unit={unit}
    />
  );
};

export default MyChartHandler;
