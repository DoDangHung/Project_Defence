import React from 'react';
import { Calendar } from 'lucide-react';
const StepSelectDate = ({ bookingData, handleInputChange }) => {
  return (
    <>
      <h3 className="font-bold text-gray-800 mb-4">Chọn ngày và giờ khám</h3>
      <div className="!flex !flex-col grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" /> Chọn ngày
          </label>
          <input
            type="date"
            value={bookingData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>
    </>
  );
};

export default StepSelectDate;
