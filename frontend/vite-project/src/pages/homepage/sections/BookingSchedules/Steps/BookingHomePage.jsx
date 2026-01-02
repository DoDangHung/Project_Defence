import React from 'react';
import { ChevronRight } from 'lucide-react';
function BookingHomePage({ step }) {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          MedPro Booking
        </h1>
        <p className="text-gray-600">Đặt lịch khám bệnh trực tuyến</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[
          { num: 1, label: 'Chuyên khoa' },
          { num: 2, label: 'Phòng khám' },
          { num: 3, label: 'Bác sĩ' },
          { num: 4, label: 'Lịch hẹn' },
          { num: 5, label: 'Thông tin' },
          { num: 6, label: 'Xác nhận' },
        ].map((s, idx) => (
          <React.Fragment key={s.num}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s.num
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {s.num}
              </div>
              <span
                className={`text-xs mt-1 ${
                  step >= s.num ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < 5 && (
              <div
                className={`w-12 h-1 mx-2 mb-6 ${
                  step > s.num ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}

export default BookingHomePage;
