import React from 'react';
import CardFull from '../layouts/CardFull.jsx';

const InOutPatientChart = () => {
  return (
    <CardFull title="In Patient - Out Patient Rate">
      <div className="w-full h-36">
        <svg viewBox="0 0 200 80" className="w-full h-full">
          <polyline
            fill="none"
            stroke="#FB7185"
            strokeWidth="2"
            points="0,60 40,55 80,30 120,45 160,50 200,60"
          />
          <polyline
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2"
            points="0,40 40,35 80,25 120,20 160,25 200,30"
          />
        </svg>
      </div>
    </CardFull>
  );
};

export default InOutPatientChart;
