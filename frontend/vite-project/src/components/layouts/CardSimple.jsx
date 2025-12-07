import React from 'react';

const CardSimple = ({ title, children }) => {
  return (
    <div className="bg-white border border-slate-100 p-4 rounded-md">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
};

export default CardSimple;
