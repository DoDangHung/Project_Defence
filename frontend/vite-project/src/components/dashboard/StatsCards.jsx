import React from 'react';
import CardSimple from '../layouts/CardSimple.jsx';

const StatsCards = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <CardSimple title="Total Admitted Patients">
        <div className="text-3xl font-bold text-indigo-700">
          859 <span className="text-red-500 text-base">↓2%</span>
        </div>
        <div className="text-xs text-slate-500 mt-2">529 Male • 330 Female</div>
      </CardSimple>

      <CardSimple title="Total Active Staff">
        <div className="text-2xl font-bold">83</div>
        <div className="text-xs text-slate-500 mt-2">
          38 Doctors • 45 Nursing
        </div>
      </CardSimple>

      <CardSimple title="Operational Cost">
        <div className="text-2xl font-bold text-green-600">
          $75,256 <span className="text-xs text-green-500">↑5%</span>
        </div>
        <div className="text-xs text-slate-500 mt-2">
          Avg. cost per patient 2k
        </div>
      </CardSimple>

      <CardSimple title="Patient Satisfaction">
        <div className="flex items-center justify-center">
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
              stroke="#F97316"
              strokeWidth="6"
              strokeDasharray="54 46"
            ></circle>
          </svg>
        </div>
        <div className="text-center text-sm font-semibold mt-2">
          76%{' '}
          <span className="text-xs text-slate-400">Patient Satisfaction</span>
        </div>
      </CardSimple>
    </section>
  );
};

export default StatsCards;
