import React from "react";
import { timeTo12Hour } from "../Utilities/DateTime";
import "../Styles/Components/Table.scss";

const Table = ({ data, dataKeys }) => {
  const formatTimestamp = (timestamp) => {
    const dateObject = new Date(timestamp);
    const formattedDate = dateObject.toLocaleDateString("en-US", { month: 'short', day: '2-digit' });;
    const formattedTime = timeTo12Hour(dateObject);
    return `${formattedTime}, ${formattedDate}`;
  };
  return (
    
        <table className="data_table">
          <thead>
            <tr>
              {dataKeys.map((key, index) => (
                <th key={index}>{key}</th>
              ))}
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {dataKeys.map((key, index) => (
                  <td key={index}>{row[key]}</td>
                ))}
                <td>{formatTimestamp(row.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
    
  );
};

export default Table;
