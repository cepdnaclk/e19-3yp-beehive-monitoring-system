import React from 'react';
import '../Styles/Components/BatteryIndicator.scss'

const BatteryIndicator = ({ level }) => {
  const getBatteryLevelColor = () => {
    if (level < 20) return 'red';
    if (level < 60) return 'yellow';
    return 'green';
  };

  const isLowBattery = level < 20;

  return (
    <div className="battery-indicator">
      <div
        className={`battery-level ${isLowBattery ? 'blink' : ''}`}
        style={{ width: `${level}%`, backgroundColor: getBatteryLevelColor() }}
      >
        {level}%
      </div>
    </div>
  );
};

export default BatteryIndicator;
