import React from 'react';
import CardFull from '../layouts/CardFull.jsx';

const BedOccupancyChart = () => {
  const barData = [
    { label: 'Not Ready', value: 128 },
    { label: 'Arrived', value: 35 },
    { label: 'Open', value: 502 },
    { label: 'Admitted', value: 859 },
    { label: 'Registered', value: 11 },
    { label: 'Wait', value: 38 },
    { label: 'Hold', value: 224 },
  ];

  return (
    <CardFull title="Bed Occupancy (938/1797)">
      <div className="w-full h-48 flex items-end space-x-3">
        {barData.map((b, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div style={{ height: `${b.value / 10}px` }} className="w-full">
              <div className="w-full h-full bg-gradient-to-b from-green-400 to-green-300" />
            </div>
            <div className="mt-2 text-xs text-slate-400">{b.label}</div>
          </div>
        ))}
      </div>
    </CardFull>
  );
};

export default BedOccupancyChart;
