import React from 'react';
import CardFull from '../layouts/CardFull.jsx';

const PatientSatisfactionCard = () => {
  return (
    <CardFull title="Patient Satisfaction">
      <div className="flex items-center justify-center">
        <svg
          width="120"
          height="120"
          viewBox="0 0 42 42"
          className="transform -rotate-90"
        >
          <circle
            r="15.9"
            cx="21"
            cy="21"
            fill="transparent"
            stroke="#F3F4F6"
            strokeWidth="6"
          ></circle>
          <circle
            r="15.9"
            cx="21"
            cy="21"
            fill="transparent"
            stroke="#F472B6"
            strokeWidth="6"
            strokeDasharray="54 46"
          ></circle>
        </svg>
      </div>
      <div className="text-center text-2xl font-bold text-indigo-700 mt-2">
        76%
      </div>
      <div className="text-xs text-slate-400 text-center">
        Patient Satisfaction Rate
      </div>
    </CardFull>
  );
};

export default PatientSatisfactionCard;
