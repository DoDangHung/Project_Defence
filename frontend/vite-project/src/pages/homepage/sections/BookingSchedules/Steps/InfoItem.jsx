import React from 'react';

export default function InfoItem({ label, value, icon, highlight, full }) {
  return (
    <div className={`${full ? 'md:col-span-2' : ''}`}>
      <p className="text-sm text-gray-500 flex items-center gap-1">
        {icon && <span className="w-4 h-4">{icon}</span>}
        {label}
      </p>
      <p
        className={`font-semibold ${
          highlight ? 'text-green-700' : 'text-gray-800'
        }`}
      >
        {value || '—'}
      </p>
    </div>
  );
}
