/** @format */

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  CheckCircle,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  User,
  Phone,
  FileText,
  Download,
  ArrowLeft,
  Mail,
  Stethoscope,
  Building2,
  DoorOpen,
  Hash,
  Users,
} from "lucide-react";
import { appointmentService, paymentService } from "../../Services/Payment.js";

export default function AppointmentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  const { appointmentId, paymentId } = location.state || {};

  const toTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const toDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (!appointmentId || !paymentId) {
      navigate("/");
      return;
    }

    fetchData();
  }, [appointmentId, paymentId]);

  const fetchData = async () => {
    try {
      const [appointmentRes, paymentRes] = await Promise.all([
        appointmentService.getAppointmentById(appointmentId),
        paymentService.getPaymentById(paymentId),
      ]);

      console.log("Appointment data:", appointmentRes.data);
      console.log("Payment data:", paymentRes.data);

      setAppointment(appointmentRes.data);
      setPayment(paymentRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      cash: "Tiền mặt tại phòng khám",
      card: "Thẻ tín dụng/ghi nợ",
      bank_transfer: "Chuyển khoản ngân hàng",
      insurance: "Bảo hiểm y tế",
    };
    return labels[method] || method;
  };

  const getPaymentStatusBadge = (status) => {
    const badges = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Chờ thanh toán",
      },
      partial: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Đã đặt cọc",
      },
      completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Hoàn thành",
      },
      refunded: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: "Đã hoàn tiền",
      },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}
      >
        {badge.label}
      </span>
    );
  };

  const getAppointmentStatusBadge = (status) => {
    const badges = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Chờ xác nhận",
      },
      confirmed: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Đã xác nhận",
      },
      completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Hoàn thành",
      },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Đã hủy" },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}
      >
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!appointment || !payment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Không tìm thấy thông tin đặt lịch
          </p>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline font-semibold"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 text-center border-2 border-green-200">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Đặt lịch thành công!
          </h1>

          <p className="text-gray-600 mb-6 text-lg">
            Lịch khám của bạn đã được xác nhận. Chúng tôi đã gửi thông tin chi
            tiết qua email/SMS.
          </p>

          <div className="inline-flex items-center gap-6 bg-gradient-to-r from-blue-50 to-blue-100 px-8 py-4 rounded-xl border-2 border-blue-200">
            <div>
              <p className="text-sm text-gray-600 mb-1">Mã đặt lịch</p>
              <p className="text-3xl font-bold text-blue-600">
                #{appointment.id.toString().padStart(6, "0")}
              </p>
            </div>
            <div className="h-12 w-px bg-blue-300"></div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
              {getAppointmentStatusBadge(appointment.status)}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Patient Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
              <User className="w-6 h-6 mr-2 text-blue-600" />
              Thông tin bệnh nhân
            </h2>

            <div className="space-y-4">
              <InfoRow
                label="Họ và tên"
                value={`${appointment.patient?.user?.firstName || ""} ${appointment.patient?.user?.lastName || ""}`}
              />
              <InfoRow
                label="Số điện thoại"
                value={appointment.patient?.user?.phone || "Chưa có thông tin"}
                icon={<Phone className="w-4 h-4" />}
              />
              <InfoRow
                label="Email"
                value={appointment.patient?.user?.email || "Chưa có thông tin"}
                icon={<Mail className="w-4 h-4" />}
              />
              <InfoRow
                label="Tuổi"
                value={`${appointment.patient?.age || "N/A"} tuổi`}
              />
              <InfoRow
                label="Giới tính"
                value={appointment.patient?.gender === "male" ? "Nam" : "Nữ"}
              />
            </div>
          </div>

          {/* Doctor Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
              <Stethoscope className="w-6 h-6 mr-2 text-green-600" />
              Thông tin bác sĩ
            </h2>

            <div className="space-y-4">
              <InfoRow
                label="Bác sĩ"
                value={`BS. ${appointment.doctor?.user?.firstName || ""} ${appointment.doctor?.user?.lastName || ""}`}
              />
              <InfoRow
                label="Chuyên khoa"
                value={
                  appointment.doctor?.specialization || "Chưa có thông tin"
                }
                icon={<Stethoscope className="w-4 h-4" />}
              />
              <InfoRow
                label="Email"
                value={appointment.doctor?.user?.email || "Chưa có thông tin"}
                icon={<Mail className="w-4 h-4" />}
              />
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                💡 <strong>Ghi chú:</strong> Bác sĩ sẽ liên hệ trước nếu có thay
                đổi lịch khám
              </p>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-600" />
            Chi tiết lịch khám
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <DetailCard
              icon={<Calendar className="w-6 h-6" />}
              label="Ngày khám"
              value={toDate(appointment.date)}
              color="blue"
            />

            <DetailCard
              icon={<Clock className="w-6 h-6" />}
              label="Khung giờ"
              value={`${toTime(appointment.startTime)} - ${toTime(appointment.endTime)}`}
              color="blue"
            />

            {/* Số thứ tự - Queue Number */}
            {appointment.queueNumber && (
              <div className="md:col-span-2">
                <div className="bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-300 rounded-xl p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="w-6 h-6 text-green-600" />
                    <span className="text-green-700 font-semibold">
                      Số thứ tự đăng ký
                    </span>
                  </div>
                  <p className="text-5xl font-bold text-green-700">
                    {appointment.queueNumber}/
                    {appointment.schedule?.maxPatientsPerSlot || 3}
                  </p>
                  <p className="text-sm text-green-600 mt-2">
                    Vui lòng có mặt đúng giờ hẹn
                  </p>
                </div>
              </div>
            )}

            <DetailCard
              icon={<Building2 className="w-6 h-6" />}
              label="Phòng khám"
              value={appointment.clinic?.name || "Chưa có thông tin"}
              color="green"
            />

            <DetailCard
              icon={<MapPin className="w-6 h-6" />}
              label="Địa chỉ"
              value={appointment.clinic?.address || "Chưa có thông tin"}
              color="green"
            />

            <DetailCard
              icon={<DoorOpen className="w-6 h-6" />}
              label="Phòng số"
              value={`Phòng ${appointment.scheduleId || "TBA"}`}
              color="purple"
            />

            <DetailCard
              icon={<FileText className="w-6 h-6" />}
              label="Lý do khám"
              value={appointment.reason || "General check-up"}
              color="purple"
            />
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between">
            <span className="flex items-center">
              <CreditCard className="w-6 h-6 mr-2 text-blue-600" />
              Payment information
            </span>
            {getPaymentStatusBadge(payment.paymentStatus)}
          </h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center pb-4 border-b-2 border-gray-100">
              <span className="text-gray-600 font-medium">Payment method</span>
              <span className="font-semibold text-gray-800">
                {getPaymentMethodLabel(payment.paymentMethod)}
              </span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b-2 border-gray-100">
              <span className="text-gray-600 font-medium">
                Consultation fee
              </span>
              <span className="font-semibold text-gray-800 text-lg">
                {payment.consultationFee.toLocaleString("vi-VN")}đ
              </span>
            </div>

            {payment.depositAmount > 0 && (
              <div className="flex justify-between items-center pb-4 border-b-2 border-gray-100">
                <span className="text-gray-600 font-medium">
                  Deposit {payment.depositStatus === "paid" ? "✓" : "⏳"}
                </span>
                <span
                  className={`font-semibold text-lg ${
                    payment.depositStatus === "paid"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {payment.depositAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>
            )}

            <div className="flex justify-between items-center pb-4 border-b-2 border-gray-100">
              <span className="text-gray-600 font-medium">
                Remaining amount
              </span>
              <span className="font-semibold text-blue-600 text-lg">
                {payment.remainingAmount.toLocaleString("vi-VN")}đ
              </span>
            </div>

            <div className="flex justify-between items-center pt-4 bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 rounded-xl">
              <span className="text-lg font-bold text-gray-800">
                Total paid
              </span>
              <span className="text-3xl font-bold text-blue-600">
                {payment.totalPaid.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>

          {/* Payment Instructions */}
          {payment.paymentMethod === "cash" && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5">
              <p className="text-sm font-bold text-yellow-800 mb-3 flex items-center">
                💵 Lưu ý thanh toán tiền mặt:
              </p>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Please bring cash when you arrive at the clinic</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Pay directly at the reception</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    There may be additional costs for medications, tests
                  </span>
                </li>
              </ul>
            </div>
          )}

          {payment.paymentMethod === "bank_transfer" &&
            payment.depositStatus !== "paid" && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                <p className="text-sm font-bold text-blue-800 mb-3 flex items-center">
                  🏦 Complete bank transfer:
                </p>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Amount:{" "}
                      <strong>
                        {payment.depositAmount.toLocaleString("vi-VN")}đ
                      </strong>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Content: <strong>DATKHAM {appointment.id}</strong>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Appointment will be confirmed after receiving the money
                      (1-5 phút)
                    </span>
                  </li>
                </ul>
              </div>
            )}

          {payment.paymentMethod === "insurance" && (
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
              <p className="text-sm font-bold text-purple-800 mb-3 flex items-center">
                🏥 Important note for health insurance:
              </p>
              <ul className="text-sm text-purple-700 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Please bring the original health insurance card</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Present the card at the reception</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Expenses are paid according to the health insurance
                    regulations
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Important Notes */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
            📌 Lưu ý quan trọng:
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start bg-white p-3 rounded-lg">
              <span className="text-orange-600 font-bold mr-3 text-lg">1.</span>
              <span>
                Please arrive at the appointment time{" "}
                <strong className="text-orange-600">15 minutes</strong> before
                the appointment to complete the procedure
              </span>
            </li>
            <li className="flex items-start bg-white p-3 rounded-lg">
              <span className="text-orange-600 font-bold mr-3 text-lg">2.</span>
              <span>
                Bring your ID card and health insurance card (if applicable)
              </span>
            </li>
            <li className="flex items-start bg-white p-3 rounded-lg">
              <span className="text-orange-600 font-bold mr-3 text-lg">3.</span>
              <span>
                If you need to cancel/change the appointment, please notify{" "}
                <strong className="text-orange-600">24 hours</strong> before the
                appointment
              </span>
            </li>
            <li className="flex items-start bg-white p-3 rounded-lg">
              <span className="text-orange-600 font-bold mr-3 text-lg">4.</span>
              <span>
                Hotline support 24/7:{" "}
                <strong className="text-blue-600">1900-xxxx</strong>
              </span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all shadow-md"
          >
            <Download className="w-5 h-5" />
            Download
          </button>

          <button
            onClick={() => navigate("/appointments")}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Calendar className="w-5 h-5" />
            My appointments
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg shadow-cyan-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
}

// Component hiển thị thông tin chi tiết
function DetailCard({ icon, label, value, color = "blue" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-100">
      <div className={`inline-flex p-2 rounded-lg mb-3 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="font-semibold text-gray-800 text-base">{value}</p>
    </div>
  );
}

// Component hiển thị thông tin dạng row
function InfoRow({ label, value, icon }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600 flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span className="font-semibold text-gray-800 text-sm text-right max-w-[60%]">
        {value}
      </span>
    </div>
  );
}
