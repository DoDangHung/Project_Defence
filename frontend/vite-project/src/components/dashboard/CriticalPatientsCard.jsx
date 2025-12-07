import React from 'react';
import CardFull from '../layouts/CardFull.jsx';

const CriticalPatientsCard = () => {
  return (
    <CardFull title="Critical Patients">
      <div className="flex items-center space-x-4">
        <div>
          <svg
            width="72"
            height="72"
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
              stroke="#FB923C"
              strokeWidth="6"
              strokeDasharray="30 70"
            ></circle>
          </svg>
        </div>
        <div>
          <div className="text-2xl font-bold">396</div>
          <div className="text-sm text-slate-500 mt-1">Patients</div>
          <div className="mt-2 text-sm text-slate-500">
            Active 118 (30%) • Recovered 209 (53%)
          </div>
        </div>
      </div>
      <div className="mt-4 p-3 bg-slate-50 text-xs text-slate-600">
        21/33 Ventilators in Use/Available •{' '}
        <a className="text-indigo-600 cursor-pointer">
          Ventilator Usage Rate →
        </a>
      </div>
    </CardFull>
  );
};

export default CriticalPatientsCard;
