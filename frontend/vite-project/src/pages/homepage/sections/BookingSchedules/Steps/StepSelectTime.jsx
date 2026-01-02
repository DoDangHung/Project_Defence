import React from 'react';
import { Clock } from 'lucide-react';
const StepSelectTime = ({ timeSlots, bookingData, handleInputChange }) => {
  return (
    <>
      <div className="!flex !flex-col grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Clock className="inline w-4 h-4 mr-1" /> Chọn giờ
          </label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.slice(0, 6).map((time) => (
              <button
                key={time}
                onClick={() => handleInputChange('time', time)}
                className={`p-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                  bookingData.time === time
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Khung giờ chiều
        </label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {timeSlots.slice(6).map((time) => (
            <button
              key={time}
              onClick={() => handleInputChange('time', time)}
              className={`p-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                bookingData.time === time
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default StepSelectTime;
