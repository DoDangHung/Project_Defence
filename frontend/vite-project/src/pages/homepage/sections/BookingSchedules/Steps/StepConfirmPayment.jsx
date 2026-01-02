import React from 'react';

import { CreditCard, Wallet, Banknote, ShieldCheck } from 'lucide-react';

/* ===========================
   STEP 5: CONFIRM + PAYMENT
=========================== */
export default function StepConfirmPayment({
  step,
  setStep,
  bookingData,
  selectedSpecialty,
  selectedClinic,
  paymentMethod,
  setPaymentMethod,
}) {
  if (step !== 5) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Xác nhận thông tin & Thanh toán
      </h2>

      <ConfirmBookingInfo
        bookingData={bookingData}
        selectedSpecialty={selectedSpecialty}
        selectedClinic={selectedClinic}
      />

      <PaymentSection
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />

      <div className="flex justify-between mt-8">
        <button
          onClick={() => setStep(4)}
          className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
        >
          Quay lại
        </button>

        <button
          disabled={!paymentMethod}
          onClick={() => {
            console.log('CONFIRM CLICKED');
            setStep(6);
          }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold
          hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition"
        >
          Xác nhận đặt lịch
        </button>
      </div>
    </div>
  );
}

/* ===========================
   CONFIRM BOOKING INFO
=========================== */
function ConfirmBookingInfo({
  bookingData,
  selectedSpecialty,
  selectedClinic,
}) {
  return (
    <div className="bg-blue-50 rounded-xl p-6 mb-6 space-y-4">
      <h3 className="font-semibold text-lg text-gray-800">
        Thông tin đặt lịch
      </h3>

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <InfoItem label="Chuyên khoa" value={selectedSpecialty?.name} />
        <InfoItem label="Phòng khám" value={selectedClinic?.name} />
        <InfoItem label="Địa chỉ" value={selectedClinic?.address} />
        <InfoItem label="Bác sĩ" value={bookingData.doctor} />
        <InfoItem label="Ngày khám" value={bookingData.date} />
        <InfoItem label="Giờ khám" value={bookingData.time} />
        <InfoItem label="Bệnh nhân" value={bookingData.patientName} />
        <InfoItem label="Số điện thoại" value={bookingData.phone} />
      </div>

      {bookingData.reason && (
        <div className="text-sm">
          <p className="text-gray-600">Lý do khám</p>
          <p className="font-medium text-gray-800">{bookingData.reason}</p>
        </div>
      )}
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
function PaymentSection({ paymentMethod, setPaymentMethod }) {
  const payments = [
    {
      key: 'cash',
      label: 'Tiền mặt tại phòng khám',
      desc: 'Thanh toán trực tiếp khi đến khám',
      icon: <Banknote className="w-6 h-6" />,
    },
    {
      key: 'card',
      label: 'Thẻ tín dụng / Ghi nợ',
      desc: 'Visa, MasterCard, JCB',
      icon: <CreditCard className="w-6 h-6" />,
    },
    {
      key: 'bank',
      label: 'Chuyển khoản ngân hàng',
      desc: 'Chuyển khoản trước khi khám',
      icon: <Wallet className="w-6 h-6" />,
    },
    {
      key: 'insurance',
      label: 'Bảo hiểm y tế',
      desc: 'Áp dụng theo quy định BHYT',
      icon: <ShieldCheck className="w-6 h-6" />,
    },
  ];

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
      <h3 className="font-semibold text-lg text-gray-800 mb-4">
        Phương thức thanh toán
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        {payments.map((p) => (
          <button
            key={p.key}
            onClick={() => setPaymentMethod(p.key)}
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

            <div>
              <p className="font-semibold text-gray-800">{p.label}</p>
              <p className="text-sm text-gray-600">{p.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {paymentMethod && (
        <div className="mt-4 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
          ✔ Bạn đã chọn phương thức thanh toán:{' '}
          <strong>
            {payments.find((p) => p.key === paymentMethod)?.label}
          </strong>
        </div>
      )}
    </div>
  );
}
