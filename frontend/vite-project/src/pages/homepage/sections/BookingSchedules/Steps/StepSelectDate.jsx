import React from 'react';

const StepSelectDate = ({ onSelect, onBack }) => {
  const days = ['Hôm nay', 'Ngày mai', 'Thứ 6'];

  return (
    <div>
      <button onClick={onBack} className="mb-4 text-blue-600">
        ← Quay lại
      </button>

      <div className="flex gap-3 overflow-x-auto">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => onSelect(day)}
            className="px-4 py-3 border rounded-lg hover:bg-blue-50"
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StepSelectDate;
