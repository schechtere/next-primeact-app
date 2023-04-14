// components/TimeBar.js
import React from 'react';

const TimeBar = () => {
  const hours = new Array(24).fill(null).map((_, i) => i);

  return (
    <div className="relative w-full h-8 bg-blue-300 px-4">
      {hours.map((hour, index) => (
        <React.Fragment key={index}>
          <div
            className="absolute h-full border-r border-gray-400"
            style={{ left: `${(index / 24) * 100}%` }}
          ></div>
          <span
            className="absolute text-xs text-gray-600"
            style={{ left: `${(index / 24) * 100}%`, top: '100%', whiteSpace: 'nowrap' }}
          >
            {hour}:00
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

export default TimeBar;
