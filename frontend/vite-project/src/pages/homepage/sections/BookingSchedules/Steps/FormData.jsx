import React from 'react';
import { User, MapPin, Phone, Mail, FileText } from 'lucide-react';
export default function FormData({
  step,
  setStep,
  bookingData,
  handleInputChange,
}) {
  if (step !== 4) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Thông tin bệnh nhân</h2>

      {/* ===== ĐẶT KHÁM CHO ===== */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Đặt khám cho</label>
        <div className="flex gap-4">
          <button
            onClick={() => handleInputChange('bookingFor', 'self')}
            className={`flex-1 p-3 border-2 rounded-lg transition ${
              bookingData.bookingFor === 'self'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200'
            }`}
          >
            Bản thân
          </button>

          <button
            onClick={() => handleInputChange('bookingFor', 'other')}
            className={`flex-1 p-3 border-2 rounded-lg transition ${
              bookingData.bookingFor === 'other'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200'
            }`}
          >
            Người thân
          </button>
        </div>
      </div>

      {/* ===== HỌ TÊN + SĐT ===== */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Họ và tên *</label>
          <input
            type="text"
            value={bookingData.patientName || ''}
            onChange={(e) => handleInputChange('patientName', e.target.value)}
            placeholder="Nguyễn Văn A"
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Số điện thoại *
          </label>
          <input
            type="tel"
            value={bookingData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="0912345678"
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* ===== EMAIL + NGÀY SINH ===== */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={bookingData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="email@example.com"
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Ngày sinh *</label>
          <input
            type="date"
            value={bookingData.dob || ''}
            onChange={(e) => handleInputChange('dob', e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* ===== GIỚI TÍNH ===== */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Giới tính *</label>
        <div className="flex gap-4">
          {['Nam', 'Nữ', 'Khác'].map((gender) => (
            <button
              key={gender}
              onClick={() => handleInputChange('gender', gender)}
              className={`flex-1 p-3 border-2 rounded-lg transition ${
                bookingData.gender === gender
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>

      {/* ===== LÝ DO KHÁM ===== */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Lý do khám / Triệu chứng *
        </label>
        <textarea
          rows="3"
          value={bookingData.reason || ''}
          onChange={(e) => handleInputChange('reason', e.target.value)}
          placeholder="Mô tả triệu chứng, lý do cần khám..."
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none"
        />
      </div>

      {/* ===== TIỀN SỬ ===== */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Tiền sử bệnh (nếu có)
        </label>
        <textarea
          rows="2"
          value={bookingData.medicalHistory || ''}
          onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
          placeholder="Các bệnh đã/đang điều trị, dị ứng thuốc..."
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none"
        />
      </div>

      {/* ===== ACTION ===== */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep(3)}
          className="px-6 py-3 border rounded-lg hover:bg-gray-50"
        >
          Quay lại
        </button>

        <button
          onClick={() => setStep(5)}
          disabled={
            !bookingData.patientName ||
            !bookingData.phone ||
            !bookingData.gender ||
            !bookingData.reason
          }
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
        >
          Tiep Tuc
        </button>
      </div>
    </div>
  );
}
