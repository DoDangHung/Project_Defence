import React from 'react';

const StepPatientInfo = ({ onBack }) => {
  return (
    <>
      <button onClick={onBack} className="mb-4 text-blue-600">
        ← Quay lại
      </button>

      <h2 className="text-2xl font-bold mb-6">Thông tin bệnh nhân</h2>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <input
          className="w-full border p-3 rounded-lg"
          placeholder="Họ và tên"
        />
        <input
          className="w-full border p-3 rounded-lg"
          placeholder="Số điện thoại"
        />
        <input className="w-full border p-3 rounded-lg" placeholder="Email" />
        <textarea
          className="w-full border p-3 rounded-lg"
          rows="3"
          placeholder="Ghi chú (không bắt buộc)"
        />

        <button className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg hover:bg-blue-700 transition">
          Xác nhận đặt lịch
        </button>
      </div>
    </>
  );
};

export default StepPatientInfo;
