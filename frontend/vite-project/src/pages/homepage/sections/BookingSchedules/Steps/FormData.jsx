import React from 'react';
import { User, MapPin, Phone, Mail, FileText } from 'lucide-react';
export default function FormData({
  step,
  setStep,
  bookingData,
  handleInputChange,
  handleSubmit,
}) {
  return (
    <>
      {step === 4 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Thông tin cá nhân
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" /> Họ và tên *
              </label>
              <input
                type="text"
                value={bookingData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="inline w-4 h-4 mr-1" /> Số điện thoại *
                </label>
                <input
                  type="tel"
                  value={bookingData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="0912345678"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" /> Email
                </label>
                <input
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="example@email.com"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" /> Địa chỉ
              </label>
              <input
                type="text"
                value={bookingData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Số nhà, đường, quận/huyện, thành phố"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="inline w-4 h-4 mr-1" /> Lý do khám
              </label>
              <textarea
                value={bookingData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                placeholder="Mô tả triệu chứng hoặc lý do khám bệnh..."
                rows="4"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(3)}
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Quay lại
            </button>
            <button
              onClick={handleSubmit}
              disabled={!bookingData.fullName || !bookingData.phone}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all"
            >
              Xác nhận đặt lịch
            </button>
          </div>
        </div>
      )}
    </>
  );
}
