import React from 'react';
import {
  CheckCircle,
  CreditCard,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
} from 'lucide-react';
import formatPaymentMethod from './formatPaymentMethod';
import InfoItem from './InfoItem';

export default function BookingSuccess({
  step,
  bookingData,
  selectedSpecialty,
  selectedClinic,
  resetBooking,
}) {
  return (
    <>
      {step === 6 && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-3xl w-full rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in">
            {/* SUCCESS HEADER */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">
                Đặt lịch thành công 🎉
              </h2>
              <p className="text-gray-600 mt-2">
                Yêu cầu đặt lịch của bạn đã được ghi nhận
              </p>
            </div>

            {/* BOOKING INFO */}
            <div className="bg-blue-50 rounded-xl p-6 mb-6 space-y-5">
              <h3 className="text-lg font-semibold text-gray-800">
                🩺 Thông tin lịch khám
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <InfoItem label="Chuyên khoa" value={selectedSpecialty?.name} />
                <InfoItem label="Phòng khám" value={selectedClinic?.name} />
                <InfoItem label="Địa chỉ" value={selectedClinic?.address} />
                <InfoItem label="Bác sĩ" value={bookingData.doctor} />
                <InfoItem
                  label="Ngày khám"
                  value={bookingData.date}
                  icon={<Calendar />}
                />
                <InfoItem
                  label="Giờ khám"
                  value={bookingData.time}
                  icon={<Clock />}
                />
              </div>
            </div>

            {/* PATIENT INFO */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                👤 Thông tin bệnh nhân
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <InfoItem
                  label="Họ và tên"
                  value={bookingData.fullName}
                  icon={<User />}
                />
                <InfoItem
                  label="Số điện thoại"
                  value={bookingData.phone}
                  icon={<Phone />}
                />
                {bookingData.email && (
                  <InfoItem
                    label="Email"
                    value={bookingData.email}
                    icon={<Mail />}
                  />
                )}
                {bookingData.gender && (
                  <InfoItem label="Giới tính" value={bookingData.gender} />
                )}
                {bookingData.reason && (
                  <InfoItem
                    label="Lý do khám"
                    value={bookingData.reason}
                    full
                  />
                )}
              </div>
            </div>

            {/* PAYMENT INFO */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                💳 Thông tin thanh toán
              </h3>

              <div className="space-y-3">
                <InfoItem
                  label="Hình thức thanh toán"
                  value={formatPaymentMethod(bookingData.paymentMethod)}
                  icon={<CreditCard />}
                />
                <InfoItem
                  label="Phí khám"
                  value={`${bookingData.price?.toLocaleString()} VNĐ`}
                />
                <InfoItem
                  label="Trạng thái"
                  value={
                    bookingData.paymentMethod === 'cash'
                      ? 'Thanh toán tại phòng khám'
                      : 'Đã thanh toán'
                  }
                  highlight
                />
              </div>
            </div>

            {/* NOTE */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Lưu ý:</strong> Vui lòng đến trước giờ hẹn{' '}
                <b>15 phút</b> để làm thủ tục. Tin nhắn xác nhận sẽ được gửi đến
                số điện thoại của bạn.
              </p>
            </div>

            {/* ACTION */}
            <button
              onClick={resetBooking}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition"
            >
              Đặt lịch mới
            </button>
          </div>
        </div>
      )}
    </>
  );
}
