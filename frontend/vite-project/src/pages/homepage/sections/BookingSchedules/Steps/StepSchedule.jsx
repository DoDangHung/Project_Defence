import React from 'react';

const days = ['Hôm nay', 'Ngày mai', 'Thứ 6', 'Thứ 7'];
const times = ['08:00', '09:30', '10:30', '14:00', '15:30'];

const StepSchedule = ({ onNext, onBack }) => {
  return (
    <>
      <button onClick={onBack} className="mb-4 text-blue-600">
        ← Quay lại
      </button>

      <h2 className="text-2xl font-bold mb-4">Chọn lịch khám</h2>

      <h3 className="font-semibold mb-2">Ngày khám</h3>
      <div className="flex gap-3 overflow-x-auto pb-3">
        {days.map((d) => (
          <button
            key={d}
            className="px-5 py-2 border rounded-full hover:bg-blue-50 whitespace-nowrap"
          >
            {d}
          </button>
        ))}
      </div>

      <h3 className="font-semibold mt-6 mb-2">Giờ khám</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {times.map((t) => (
          <button
            key={t}
            onClick={onNext}
            className="border py-3 rounded-lg hover:bg-blue-50"
          >
            {t}
          </button>
        ))}
      </div>
    </>
  );
};

export default StepSchedule;
