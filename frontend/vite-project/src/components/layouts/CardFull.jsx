import React from 'react';

const CardFull = ({ title, children }) => {
  return (
    <div className="bg-white border border-slate-100 p-4 rounded-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-medium text-slate-800">{title}</h3>
        <a className="text-sm text-indigo-600 cursor-pointer">Details →</a>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default CardFull;
