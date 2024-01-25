import {useState,useEffect} from 'react'
import MyAreaChart from "./MyAreaChart"
import MyLineChart from "./MyLineChart"
export const MyChartHandler = ({ data, dataKeys, duration, colors, type }) => {
    const [chartType, setChartType] = useState(type);
    const [chartData, setChartData] = useState(data);
    const [chartDataKeys, setChartDataKeys] = useState(dataKeys);
    const [chartColor, setChartColor] = useState(colors);

    useEffect(() => {
        const filteredData = filterData(duration, data); // Use duration directly and pass the current data
        console.log("Filtered data:", filteredData);
        setChartData(filteredData);
    }, [duration, data]); // Add data to the dependency array

    // Filter Data according to duration
    const filterData = (duration, data) => {
        const now = new Date();
        return data.filter(item => {
            const createdAt = new Date(item.createdAt);
            switch (duration) {
                case 'hour':
                    return now - createdAt <= 3600000; // 3600000 milliseconds = 1 hour
                case 'day':
                    return now - createdAt <= 86400000; // 86400000 milliseconds = 1 day
                case 'week':
                    return now - createdAt <= 604800000; // 604800000 milliseconds = 7 days
                case 'month':
                    return now - createdAt <= 2629800000; // 2629800000 milliseconds = approx 1 month (30.44 days)
                default:
                    return true;
            }
        });
    };
    console.log(duration);

    // if type is line return line chart
    // if type is Area return area chart
    return (
        <>
            {chartType === 'line' && <MyLineChart data={chartData} dataKeys={chartDataKeys} colors={chartColor} duration={duration} />}
            {chartType === 'area' && <MyAreaChart data={chartData} dataKeys={chartDataKeys} colors={chartColor} duration={duration} />}
        </>
    );
};
