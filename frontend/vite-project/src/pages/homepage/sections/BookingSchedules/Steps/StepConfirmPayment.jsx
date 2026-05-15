import React, { useEffect, useState, useRef } from 'react';
import {
  CreditCard,
  Wallet,
  Banknote,
  Smartphone,
  ShieldCheck,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { appointmentService, paymentService } from '../../Services/Payment.js';

/* ===========================
   STEP 5: CONFIRM + PAYMENT
=========================== */
export default function StepConfirmPayment() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentFormData, setPaymentFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [reason, setReason] = useState('');
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const loadBooking = () => {
      const stored = JSON.parse(localStorage.getItem('booking') || 'null');
      if (!stored) {
        setBooking(null);
        return;
      }

      const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
      let currentPatientId = null;

      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          currentPatientId = user.patientId || user.id;
        } catch (e) {}
      }

      if (currentPatientId) {
        stored.patientId = currentPatientId;
        localStorage.setItem('booking', JSON.stringify(stored));
      }

      setBooking(stored);
      setReason(stored?.reason || '');
    };

    loadBooking();
    const handleStorageChange = (e) => {
      if (e.key === 'booking' || e.key === 'user') loadBooking();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleConfirmBooking = async () => {
    if (!paymentMethod) {
      setError('Vui lòng chọn phương thức thanh toán');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bookingData = booking.bookingInfo || booking;
      
      // Get patientId from current user
      const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
      let patientId = 1;
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          patientId = user.patientId || user.id;
        } catch (e) {}
      }

      // Step 1: Create appointment
      const appointmentResponse = await appointmentService.createAppointment({
        patientId,
        doctorId: bookingData.doctorId,
        clinicId: bookingData.clinicId,
        scheduleId: bookingData.scheduleId,
        date: bookingData.appointmentDate,
        startTime: bookingData.startTime || bookingData.start,
        endTime: bookingData.endTime || bookingData.end,
        slotIndex: bookingData.slotIndex,
        reason: booking.reason || bookingData.reason || '',
      });

      const appointmentId = appointmentResponse.data.id;

      // Step 2: Create payment record
      const paymentResponse = await paymentService.createPayment({
        appointmentId,
        patientId,
        consultationFee: booking.consultationFee || 500000,
        paymentMethod,
      });

      const paymentId = paymentResponse.data.id;

      // Step 3: Process payment based on method
      // For online payments (visa, apple/google pay, bank transfer), auto-process deposit
      const needsDeposit = ['visa_mastercard', 'apple_google_pay', 'bank_transfer'].includes(paymentMethod);
      
      if (needsDeposit) {
        await paymentService.processDeposit(paymentId, {});
      }

      // Success
      setSuccess(true);
      localStorage.removeItem('booking');

      setTimeout(() => {
        navigate('/booking/appointment/success', {
          state: {
            appointmentId,
            paymentId,
            paymentMethod,
            depositAmount: paymentResponse.data.depositAmount,
            consultationFee: paymentResponse.data.consultationFee,
            remainingAmount: paymentResponse.data.remainingAmount,
          },
        });
      }, 2000);
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!booking) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Không có dữ liệu đặt lịch</p>
        <button
          onClick={() => navigate('/appointments/new')}
          className="mt-4 text-blue-600 hover:underline"
        >
          Quay lại đặt lịch
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Xác nhận thông tin & Thanh toán
      </h2>

      {success && (
        <div className="mb-6 bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-center gap-3 animate-pulse">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-semibold text-green-800">Đặt lịch thành công!</p>
            <p className="text-sm text-green-700">Đang chuyển hướng đến trang xác nhận...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border-2 border-red-500 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Có lỗi xảy ra</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <ConfirmBookingInfo booking={booking} />

      {!(booking.reason || booking.bookingInfo?.reason) && (
        <ReasonInput reason={reason} onChange={setReason} />
      )}

      <PaymentSection
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        paymentFormData={paymentFormData}
        setPaymentFormData={setPaymentFormData}
        consultationFee={booking.consultationFee || 500000}
      />

      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate(-1)}
          disabled={loading}
          className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Quay lại
        </button>

        <button
          onClick={handleConfirmBooking}
          disabled={loading || !paymentMethod}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold
          hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition
          flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            'Xác nhận đặt lịch'
          )}
        </button>
      </div>
    </div>
  );
}

/* ===========================
   CONFIRM BOOKING INFO
=========================== */
function ConfirmBookingInfo({ booking }) {
  const toTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const toDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const calculateEstimatedTime = () => {
    const queue = booking.queuePosition || booking.bookingInfo?.queuePosition;
    if (!queue) return '';
    const minutes = (queue - 1) * 15;
    return `${minutes} phút`;
  };

  const bookingData = booking.bookingInfo || booking;

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
      <h3 className="font-semibold text-lg text-gray-800 mb-4">Thông tin đặt lịch</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <InfoItem
          label="Bác sĩ"
          value={booking.doctorName || bookingData.doctorName}
        />
        <InfoItem
          label="Chuyên khoa"
          value={booking.specialtyName || bookingData.specialtyName}
        />
        <InfoItem
          label="Phòng khám"
          value={booking.clinicName || bookingData.clinicName}
        />
        <InfoItem
          label="Địa chỉ"
          value={booking.clinicAddress || bookingData.clinicAddress}
        />
        <InfoItem
          label="Ngày khám"
          value={toDate(booking.appointmentDate || bookingData.appointmentDate)}
        />
        <InfoItem
          label="Giờ khám"
          value={`${toTime(booking.startTime || bookingData.startTime)} - ${toTime(booking.endTime || bookingData.endTime)}`}
        />

        {booking.queuePosition || bookingData.queuePosition ? (
          <div className="md:col-span-2 bg-green-100 border border-green-300 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-800">
              <Users className="w-5 h-5" />
              <span className="font-semibold">Số thứ tự đăng ký:</span>
              <span className="text-xl font-bold">
                {booking.queuePosition || bookingData.queuePosition}
              </span>
            </div>
          </div>
        ) : (
          <InfoItem
            label="Số thứ tự"
            value="Sẽ được xác nhận sau khi đặt lịch"
          />
        )}

        <InfoItem
          label="Bệnh nhân"
          value={booking.fullName || bookingData.fullName}
        />
        <InfoItem
          label="Số điện thoại"
          value={booking.phoneNumber || bookingData.phone}
        />
        <InfoItem
          label="Lý do khám"
          value={booking.reason || bookingData.reason}
        />
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value || '—'}</p>
    </div>
  );
}

/* ===========================
   PAYMENT SECTION
=========================== */
const DEPOSIT_PERCENTAGE = 25;

function PaymentSection({
  paymentMethod,
  setPaymentMethod,
  paymentFormData,
  setPaymentFormData,
  consultationFee,
}) {
  const depositAmount = (consultationFee * DEPOSIT_PERCENTAGE) / 100;
  const remainingAmount = consultationFee - depositAmount;

  const payments = [
    {
      key: 'cash',
      label: 'Thanh toán khi đến khám',
      desc: 'Tiền mặt, thẻ tại quầy',
      icon: <Banknote className="w-6 h-6" />,
      color: 'amber',
      requiresDeposit: false,
      note: 'Thanh toán toàn bộ phí khám khi đến phòng khám. Không mất phí đặt cọc.',
    },
    {
      key: 'visa_mastercard',
      label: 'Thẻ Visa / Mastercard',
      desc: 'Thanh toán online an toàn',
      icon: <CreditCard className="w-6 h-6" />,
      color: 'blue',
      requiresDeposit: true,
      note: `Đặt cọc ${DEPOSIT_PERCENTAGE}% (${depositAmount.toLocaleString('vi-VN')}đ). Phần còn lại thanh toán khi đến khám.`,
    },
    {
      key: 'apple_google_pay',
      label: 'Apple Pay / Google Pay',
      desc: 'Thanh toán nhanh qua ví điện tử',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'indigo',
      requiresDeposit: true,
      note: `Đặt cọc ${DEPOSIT_PERCENTAGE}% (${depositAmount.toLocaleString('vi-VN')}đ). Phần còn lại thanh toán khi đến khám.`,
    },
    {
      key: 'bank_transfer',
      label: 'Chuyển khoản ngân hàng',
      desc: 'Chuyển khoản trước khi khám',
      icon: <Wallet className="w-6 h-6" />,
      color: 'green',
      requiresDeposit: true,
      note: `Đặt cọc ${DEPOSIT_PERCENTAGE}% (${depositAmount.toLocaleString('vi-VN')}đ). Phần còn lại thanh toán khi đến khám.`,
    },
  ];

  const colorClasses = {
    amber: {
      selected: 'border-amber-500 bg-amber-50',
      unselected: 'border-gray-200 hover:border-amber-400',
      iconBg: 'bg-amber-100 text-amber-600',
      iconSelected: 'bg-amber-500 text-white',
    },
    blue: {
      selected: 'border-blue-500 bg-blue-50',
      unselected: 'border-gray-200 hover:border-blue-400',
      iconBg: 'bg-blue-100 text-blue-600',
      iconSelected: 'bg-blue-500 text-white',
    },
    indigo: {
      selected: 'border-indigo-500 bg-indigo-50',
      unselected: 'border-gray-200 hover:border-indigo-400',
      iconBg: 'bg-indigo-100 text-indigo-600',
      iconSelected: 'bg-indigo-500 text-white',
    },
    green: {
      selected: 'border-green-500 bg-green-50',
      unselected: 'border-gray-200 hover:border-green-400',
      iconBg: 'bg-green-100 text-green-600',
      iconSelected: 'bg-green-500 text-white',
    },
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-gray-800">
          Phương thức thanh toán
        </h3>
        <div className="text-right">
          <p className="text-sm text-gray-600">Phí khám</p>
          <p className="text-xl font-bold text-blue-600">
            {consultationFee.toLocaleString('vi-VN')}đ
          </p>
        </div>
      </div>

      {/* Refund Policy Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-2">Chính sách hủy lịch & hoàn tiền:</p>
            <ul className="space-y-1">
              <li>• <strong>Hủy trước 24 giờ:</strong> Hoàn 100% tiền đặt cọc</li>
              <li>• <strong>Hủy trước 12 giờ:</strong> Hoàn 50% tiền đặt cọc</li>
              <li>• <strong>Hủy trong 2 giờ:</strong> Không hoàn tiền đặt cọc</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {payments.map((p) => (
          <button
            key={p.key}
            onClick={() => {
              setPaymentMethod(p.key);
              setPaymentFormData(null);
            }}
            className={`flex items-start gap-4 p-4 border-2 rounded-xl text-left transition
              ${paymentMethod === p.key ? colorClasses[p.color].selected : colorClasses[p.color].unselected}`}
          >
            <div className={`p-2 rounded-lg ${paymentMethod === p.key ? colorClasses[p.color].iconSelected : colorClasses[p.color].iconBg}`}>
              {p.icon}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{p.label}</p>
              <p className="text-sm text-gray-600">{p.desc}</p>
              {paymentMethod === p.key && (
                <p className="text-xs text-blue-600 mt-2 font-medium">{p.note}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Payment Summary */}
      {paymentMethod && (
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <h4 className="font-semibold text-gray-800 mb-3">Chi tiết thanh toán</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Phí khám:</span>
              <span className="font-medium">{consultationFee.toLocaleString('vi-VN')}đ</span>
            </div>
            {paymentMethod !== 'cash' && (
              <>
                <div className="flex justify-between text-green-600">
                  <span>Đặt cọc ({DEPOSIT_PERCENTAGE}%):</span>
                  <span className="font-medium">-{depositAmount.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-orange-600">
                  <span>Thanh toán khi đến khám:</span>
                  <span className="font-medium">{remainingAmount.toLocaleString('vi-VN')}đ</span>
                </div>
              </>
            )}
            <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
              <span>Tổng cần thanh toán online:</span>
              <span className="text-blue-600">
                {paymentMethod === 'cash' ? '0đ' : `${depositAmount.toLocaleString('vi-VN')}đ`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Cash Payment Info */}
      {paymentMethod === 'cash' && (
        <div className="mt-4 text-sm bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <p className="font-semibold text-amber-800 mb-2">Lưu ý thanh toán tiền mặt:</p>
          <ul className="list-disc list-inside space-y-1 text-amber-700">
            <li>Vui lòng mang theo đủ tiền mặt khi đến phòng khám</li>
            <li>Phí khám: <strong>{consultationFee.toLocaleString('vi-VN')}đ</strong></li>
            <li>Có thể phát sinh thêm chi phí thuốc, xét nghiệm (nếu có)</li>
          </ul>
        </div>
      )}

      {/* Online Payment Info */}
      {paymentMethod && paymentMethod !== 'cash' && (
        <div className="mt-4 text-sm bg-green-50 border border-green-200 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-green-800">
              <p className="font-semibold mb-1">Thanh toán an toàn & bảo mật</p>
              <p className="text-green-700">
                Đây là thanh toán fake (mô phỏng). Lịch khám sẽ được xác nhận ngay sau khi hoàn tất.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===========================
   REASON INPUT
=========================== */
function ReasonInput({ reason, onChange }) {
  const handleChange = (e) => onChange(e.target.value);

  const handleBlur = () => {
    const booking = JSON.parse(localStorage.getItem('booking') || '{}');
    booking.reason = reason;
    localStorage.setItem('booking', JSON.stringify(booking));
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-lg text-gray-800">Lý do khám bệnh</h3>
        <span className="text-xs text-gray-500">(không bắt buộc)</span>
      </div>
      <textarea
        value={reason}
        onChange={handleChange}
        onBlur={handleBlur}
        rows="3"
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
        placeholder="Mô tả triệu chứng hoặc lý do khám bệnh (ví dụ: Đau đầu, sốt cao 3 ngày...)"
      />
      <p className="mt-2 text-sm text-gray-500">
        Thông tin này giúp bác sĩ nắm được tình trạng sức khỏe của bạn trước khi khám.
      </p>
    </div>
  );
}
