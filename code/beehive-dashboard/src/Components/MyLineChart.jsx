import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format } from 'date-fns';

const MyLineChart = ({ data, dataKeys, colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'] }) => {
  const formattedData = data.map(item => ({
    ...item,
    timestamp: format(new Date(item.timestamp), 'yyyy-MM-dd HH:mm')
  }));

  return (
    <LineChart width={600} height={300} data={formattedData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="timestamp" />
      <YAxis />
      <Tooltip />
      <Legend />
      {
        dataKeys.map((key, index) => (
          <Line 
            key={key} 
            type="monotone" 
            dataKey={key} 
            stroke={colors[index % colors.length]} // Use provided colors or default ones
          />
        ))
      }
    </LineChart>
  );
};

export default MyLineChart;
