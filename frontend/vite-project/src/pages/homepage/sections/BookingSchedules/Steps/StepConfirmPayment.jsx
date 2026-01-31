import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  Wallet,
  Banknote,
  ShieldCheck,
  Loader2,
  CheckCircle,
  AlertCircle,
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

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('booking'));
    console.log('🔍 Loaded booking from localStorage:', stored);

    // ✅ Kiểm tra các field quan trọng
    console.log('📋 Booking fields:', {
      appointmentDate: stored?.appointmentDate,
      startTime: stored?.startTime,
      endTime: stored?.endTime,
      doctorId: stored?.doctorId,
      clinicId: stored?.clinicId,
    });

    setBooking(stored);
  }, []);

  const handleConfirmBooking = async () => {
    if (!paymentMethod) {
      setError('Vui lòng chọn phương thức thanh toán');
      return;
    }

    // Validate payment form data for non-cash methods
    if (paymentMethod !== 'cash') {
      if (!paymentFormData) {
        setError('Vui lòng điền đầy đủ thông tin thanh toán');
        return;
      }

      // Validate card data
      if (paymentMethod === 'card') {
        const { cardNumber, cardName, expiryDate, cvv } = paymentFormData;
        if (!cardNumber || !cardName || !expiryDate || !cvv) {
          setError('Vui lòng điền đầy đủ thông tin thẻ');
          return;
        }
        if (cardNumber.replace(/\s/g, '').length !== 16) {
          setError('Số thẻ không hợp lệ');
          return;
        }
        if (cvv.length !== 3) {
          setError('CVV không hợp lệ');
          return;
        }
      }

      // Validate bank transfer
      if (paymentMethod === 'bank_transfer') {
        if (!paymentFormData.selectedBank) {
          setError('Vui lòng chọn ngân hàng');
          return;
        }
      }

      // Validate insurance
      if (paymentMethod === 'insurance') {
        const { insuranceNumber, expiryDate } = paymentFormData;
        if (!insuranceNumber || !expiryDate) {
          setError('Vui lòng điền đầy đủ thông tin bảo hiểm');
          return;
        }
      }
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Tạo appointment
      const bookingData = booking.bookingInfo || booking;
      console.log('📤 Booking data to send:', {
        doctorId: bookingData.doctorId,
        clinicId: bookingData.clinicId,
        date: bookingData.appointmentDate,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
      });
      const appointmentResponse = await appointmentService.createAppointment({
        patientId: bookingData.patientId || 1,
        doctorId: bookingData.doctorId,
        clinicId: bookingData.clinicId,
        scheduleId: bookingData.scheduleId,
        date: bookingData.appointmentDate, // ✅ Từ bookingInfo
        // ✅ Dùng start/end thay vì startTime/endTime
        startTime: bookingData.startTime || bookingData.start, // ✅ Fallback to start
        endTime: bookingData.endTime || bookingData.end, // ✅ Fallback to end

        slotIndex: bookingData.slotIndex,
        reason: booking.reason || bookingData.reason || '',
      });

      const appointmentId = appointmentResponse.data.id;

      // Step 2: Tạo payment
      const paymentResponse = await paymentService.createPayment({
        appointmentId,
        patientId: booking.patientId || 1,
        consultationFee: booking.consultationFee || 500000,
        depositPercentage: 30,
        paymentMethod,
      });

      const paymentId = paymentResponse.data.id;

      // Step 3: Xử lý thanh toán deposit theo method
      let depositResponse;

      switch (paymentMethod) {
        case 'cash':
          // Tiền mặt không cần thanh toán deposit ngay
          depositResponse = {
            success: true,
            message: 'Thanh toán tiền mặt tại phòng khám',
          };
          break;

        case 'card':
          depositResponse = await paymentService.processDepositCard(
            paymentId,
            paymentFormData,
          );
          break;

        case 'bank_transfer':
          depositResponse = await paymentService.processDepositBankTransfer(
            paymentId,
            paymentFormData,
          );
          break;

        case 'insurance':
          depositResponse = await paymentService.processDepositInsurance(
            paymentId,
            paymentFormData,
          );
          break;

        default:
          throw new Error('Phương thức thanh toán không hợp lệ');
      }

      // Success
      setSuccess(true);

      // Clear booking data
      localStorage.removeItem('booking');

      // Navigate to success page
      setTimeout(() => {
        navigate('/booking/appointment/success', {
          state: {
            appointmentId,
            paymentId,
            paymentMethod,
            depositAmount: paymentResponse.data.depositAmount,
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

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-center gap-3 animate-pulse">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-semibold text-green-800">Đặt lịch thành công!</p>
            <p className="text-sm text-green-700">
              Đang chuyển hướng đến trang xác nhận...
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
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
  // ISO -> HH:mm
  const toTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ISO -> DD/MM/YYYY
  const toDateDisplay = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN');
  };
  const bookingData = booking.bookingInfo || booking;
  return (
    <div className="bg-blue-50 rounded-xl p-6 mb-6 space-y-4">
      <h3 className="font-semibold text-lg text-gray-800">
        Thông tin đặt lịch
      </h3>

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <InfoItem label="Chuyên khoa" value={bookingData.specialtyName} />
        <InfoItem
          label="Phòng khám"
          value={`${bookingData.clinicName} - ${bookingData.roomNumber}`}
        />
        <InfoItem label="Địa chỉ" value={bookingData.clinicAddress} />
        <InfoItem
          label="Bác sĩ"
          value={`${bookingData.doctorFirstName}  ${
            bookingData.doctorLastName
          }`}
        />
        <InfoItem
          label="Ngày khám"
          value={toDateDisplay(bookingData.appointmentDate)}
        />
        <InfoItem
          label="Giờ khám"
          value={`${toTime(bookingData.startTime)} - ${toTime(
            bookingData.endTime,
          )}`}
        />
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
function PaymentSection({
  paymentMethod,
  setPaymentMethod,
  paymentFormData,
  setPaymentFormData,
  consultationFee,
}) {
  const depositAmount = (consultationFee * 30) / 100;

  const payments = [
    {
      key: 'cash',
      label: 'Tiền mặt tại phòng khám',
      desc: 'Thanh toán trực tiếp khi đến khám',
      icon: <Banknote className="w-6 h-6" />,
      note: 'Không cần đặt cọc trước. Thanh toán toàn bộ khi đến phòng khám.',
    },
    {
      key: 'card',
      label: 'Thẻ tín dụng / Ghi nợ',
      desc: 'Visa, MasterCard, JCB',
      icon: <CreditCard className="w-6 h-6" />,
      note: `Đặt cọc ${depositAmount.toLocaleString('vi-VN')}đ qua Stripe`,
    },
    {
      key: 'bank_transfer',
      label: 'Chuyển khoản ngân hàng',
      desc: 'Chuyển khoản trước khi khám',
      icon: <Wallet className="w-6 h-6" />,
      note: `Đặt cọc ${depositAmount.toLocaleString('vi-VN')}đ qua PayOS`,
    },
    {
      key: 'insurance',
      label: 'Bảo hiểm y tế',
      desc: 'Áp dụng theo quy định BHYT',
      icon: <ShieldCheck className="w-6 h-6" />,
      note: 'Miễn phí đặt cọc. Xuất trình thẻ BHYT khi khám.',
    },
  ];

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

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {payments.map((p) => (
          <button
            key={p.key}
            onClick={() => {
              setPaymentMethod(p.key);
              setPaymentFormData(null); // Reset form data when changing method
            }}
            className={`flex items-start gap-4 p-4 border-2 rounded-xl text-left transition
              ${
                paymentMethod === p.key
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
          >
            <div
              className={`p-2 rounded-lg ${
                paymentMethod === p.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {p.icon}
            </div>

            <div className="flex-1">
              <p className="font-semibold text-gray-800">{p.label}</p>
              <p className="text-sm text-gray-600">{p.desc}</p>
              {paymentMethod === p.key && (
                <p className="text-xs text-blue-600 mt-2">{p.note}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Payment Forms */}
      {paymentMethod === 'card' && (
        <CardPaymentForm
          depositAmount={depositAmount}
          formData={paymentFormData}
          setFormData={setPaymentFormData}
        />
      )}

      {paymentMethod === 'bank_transfer' && (
        <BankTransferForm
          depositAmount={depositAmount}
          formData={paymentFormData}
          setFormData={setPaymentFormData}
        />
      )}

      {paymentMethod === 'insurance' && (
        <InsuranceForm
          formData={paymentFormData}
          setFormData={setPaymentFormData}
        />
      )}

      {paymentMethod === 'cash' && (
        <div className="mt-4 text-sm bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="font-semibold text-yellow-800 mb-2">
            ℹ️ Lưu ý thanh toán tiền mặt:
          </p>
          <ul className="list-disc list-inside space-y-1 text-yellow-700">
            <li>Vui lòng mang theo tiền mặt khi đến phòng khám</li>
            <li>
              Phí khám:{' '}
              <strong>{consultationFee.toLocaleString('vi-VN')}đ</strong>
            </li>
            <li>Có thể phát sinh thêm chi phí thuốc, xét nghiệm (nếu có)</li>
          </ul>
        </div>
      )}
    </div>
  );
}

/* ===========================
   CARD PAYMENT FORM
=========================== */
function CardPaymentForm({ depositAmount, formData, setFormData }) {
  const [cardData, setCardData] = useState(
    formData || {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
    },
  );

  useEffect(() => {
    setFormData(cardData);
  }, [cardData, setFormData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      const formatted = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim();
      setCardData((prev) => ({ ...prev, [name]: formatted }));
      return;
    }

    if (name === 'expiryDate') {
      let formatted = value.replace(/\D/g, '');
      if (formatted.length >= 2) {
        formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
      }
      setCardData((prev) => ({ ...prev, [name]: formatted }));
      return;
    }

    if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '').slice(0, 3);
      setCardData((prev) => ({ ...prev, [name]: formatted }));
      return;
    }

    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mt-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-blue-600" />
        <h4 className="font-semibold text-gray-800">Thông tin thẻ</h4>
      </div>

      <div className="bg-white rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-600 mb-1">Số tiền đặt cọc</p>
        <p className="text-2xl font-bold text-blue-600">
          {depositAmount.toLocaleString('vi-VN')}đ
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số thẻ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="cardNumber"
            value={cardData.cardNumber}
            onChange={handleInputChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên trên thẻ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="cardName"
            value={cardData.cardName}
            onChange={handleInputChange}
            placeholder="NGUYEN VAN A"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none uppercase"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày hết hạn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="expiryDate"
              value={cardData.expiryDate}
              onChange={handleInputChange}
              placeholder="MM/YY"
              maxLength="5"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVV <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="cvv"
              value={cardData.cvv}
              onChange={handleInputChange}
              placeholder="123"
              maxLength="3"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-600 flex items-start gap-2 bg-white p-3 rounded-lg">
        <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
        <p>
          Thông tin thẻ của bạn được mã hóa và bảo mật bởi Stripe. Chúng tôi
          không lưu trữ thông tin thẻ trên hệ thống.
        </p>
      </div>
    </div>
  );
}

/* ===========================
   BANK TRANSFER FORM
=========================== */
function BankTransferForm({ depositAmount, formData, setFormData }) {
  const [selectedBank, setSelectedBank] = useState(
    formData?.selectedBank || '',
  );

  useEffect(() => {
    setFormData({ selectedBank });
  }, [selectedBank, setFormData]);

  const banks = [
    { code: 'VCB', name: 'Vietcombank', logo: '🏦' },
    { code: 'TCB', name: 'Techcombank', logo: '🏦' },
    { code: 'MB', name: 'MB Bank', logo: '🏦' },
    { code: 'ACB', name: 'ACB', logo: '🏦' },
    { code: 'VPB', name: 'VPBank', logo: '🏦' },
    { code: 'TPB', name: 'TPBank', logo: '🏦' },
  ];

  return (
    <div className="mt-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-5 h-5 text-green-600" />
        <h4 className="font-semibold text-gray-800">Chuyển khoản ngân hàng</h4>
      </div>

      <div className="bg-white rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-600 mb-1">Số tiền đặt cọc</p>
        <p className="text-2xl font-bold text-green-600">
          {depositAmount.toLocaleString('vi-VN')}đ
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chọn ngân hàng <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {banks.map((bank) => (
            <button
              key={bank.code}
              type="button"
              onClick={() => setSelectedBank(bank.code)}
              className={`flex items-center gap-3 p-3 border-2 rounded-lg transition
                ${
                  selectedBank === bank.code
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-green-400'
                }`}
            >
              <span className="text-2xl">{bank.logo}</span>
              <span className="font-medium text-gray-800">{bank.name}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedBank && (
        <div className="bg-white rounded-lg p-4 space-y-3">
          <h5 className="font-semibold text-gray-800">
            Thông tin chuyển khoản:
          </h5>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Ngân hàng:</span>
              <span className="font-semibold">
                {banks.find((b) => b.code === selectedBank)?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Số tài khoản:</span>
              <span className="font-semibold">1234567890</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Chủ tài khoản:</span>
              <span className="font-semibold">Phòng khám ABC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nội dung:</span>
              <span className="font-semibold text-blue-600">
                DATKHAM [SĐT] [Họ tên]
              </span>
            </div>
          </div>

          <div className="pt-3 border-t text-xs text-gray-600">
            ⚠️ Sau khi chuyển khoản, vui lòng giữ lại biên lai để đối chiếu.
            Lịch khám sẽ được xác nhận sau khi chúng tôi nhận được tiền (1-5
            phút).
          </div>
        </div>
      )}
    </div>
  );
}

/* ===========================
   INSURANCE FORM
=========================== */
function InsuranceForm({ formData, setFormData }) {
  const [insuranceData, setInsuranceData] = useState(
    formData || {
      insuranceNumber: '',
      insuranceType: 'bhyt',
      expiryDate: '',
    },
  );

  useEffect(() => {
    setFormData(insuranceData);
  }, [insuranceData, setFormData]);

  const handleChange = (field, value) => {
    setInsuranceData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mt-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-purple-600" />
        <h4 className="font-semibold text-gray-800">Thông tin bảo hiểm y tế</h4>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <p className="text-sm font-semibold text-green-800 mb-1">
          ✓ Miễn phí đặt cọc
        </p>
        <p className="text-xs text-green-700">
          Sử dụng bảo hiểm y tế không cần đặt cọc trước. Vui lòng mang theo thẻ
          BHYT khi đến khám.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loại bảo hiểm <span className="text-red-500">*</span>
          </label>
          <select
            value={insuranceData.insuranceType}
            onChange={(e) => handleChange('insuranceType', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
          >
            <option value="bhyt">BHYT (Bảo hiểm y tế)</option>
            <option value="private">Bảo hiểm tư nhân</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số thẻ bảo hiểm <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={insuranceData.insuranceNumber}
            onChange={(e) =>
              handleChange('insuranceNumber', e.target.value.toUpperCase())
            }
            placeholder="VD: DN1234567890123"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none uppercase"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngày hết hạn <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={insuranceData.expiryDate}
            onChange={(e) => handleChange('expiryDate', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-600 bg-white rounded-lg p-3">
        <p className="font-semibold mb-2">📋 Lưu ý:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Vui lòng mang theo thẻ BHYT gốc khi đến khám</li>
          <li>Chi phí được thanh toán theo quy định BHYT hiện hành</li>
          <li>Một số dịch vụ có thể không được BHYT chi trả</li>
        </ul>
      </div>
    </div>
  );
}
