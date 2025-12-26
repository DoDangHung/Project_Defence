import React from 'react';

const StepSelectTime = ({ onSelect, onBack }) => {
  const slots = ['08:00', '09:00', '10:30', '14:00'];

  return (
    <div>
      <button onClick={onBack} className="mb-4 text-blue-600">
        ← Quay lại
      </button>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {slots.map((slot) => (
          <button
            key={slot}
            onClick={() => onSelect(slot)}
            className="py-3 border rounded-lg hover:bg-blue-50"
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StepSelectTime;
