import React from 'react';
import CardFull from '../layouts/CardFull.jsx';

const BedOccupancyChart = () => {
  const barData = [
    { label: 'Arrived', value: 502 },
    { label: 'Cancel', value: 35 },
    { label: 'Payment Refund', value: 50 },
  ];

  return (
    <CardFull title="Clinic Overview">
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
