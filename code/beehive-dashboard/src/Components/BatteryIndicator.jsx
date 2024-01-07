import React, { useState, useEffect } from 'react';
import './BatteryIndicator.scss';

const BatteryIndicator = () => {
  const [batteryLevel, setBatteryLevel] = useState(100);

  useEffect(() => {
    // Simulate battery level change
    const interval = setInterval(() => {
      setBatteryLevel(prevLevel => prevLevel > 0 ? prevLevel - 10 : 100);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getBatteryLevelColor = () => {
    if (batteryLevel < 20) return 'red';
    if (batteryLevel < 60) return 'yellow';
    return 'green';
  };

  const isLowBattery = batteryLevel < 20;

  return (
    <div className="battery-indicator">
      <div
        className={`battery-level ${isLowBattery ? 'blink' : ''}`}
        style={{ width: `${batteryLevel}%`, backgroundColor: getBatteryLevelColor() }}
      >
        {batteryLevel}%
      </div>
    </div>
  );
};

export default BatteryIndicator;
