/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Search,
  Filter,
  Download,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Star,
  AlertTriangle,
  Info,
} from "lucide-react";
import { paymentService } from "../Services/Payment.js";

const PatientAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    searchQuery: "",
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [token, setToken] = useState(null);

  // Cancel modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [refundInfo, setRefundInfo] = useState(null);

  // Get user from storage
  const getUser = () => {
    const userStr =
      sessionStorage.getItem("user") || localStorage.getItem("user");
    const storedToken =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return { patientId: user.patientId || user.id, token: storedToken };
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const userData = getUser();
    if (userData) {
      setPatientId(userData.patientId);
      setToken(userData.token);
    } else {
      setPatientId(null);
      setToken(null);
    }

    // Watch for storage changes
    const interval = setInterval(() => {
      const userData = getUser();
      if (userData) {
        setPatientId(userData.patientId);
        setToken(userData.token);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (patientId && token) {
      fetchAppointments();
    }
  }, [patientId, token]);

  const fetchAppointments = async () => {
    if (!patientId || !token) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8080/api/appointments/patient/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      };

      const mappedAppointments = (res.data.data || []).map((apt) => ({
        id: apt.id,
        appointmentCode: `APT${apt.id.toString().padStart(3, "0")}`,
        doctorName: apt.doctor
          ? `BS. ${apt.doctor.user.firstName} ${apt.doctor.user.lastName}`
          : "Chưa có bác sĩ",
        doctorSpecialty: apt.doctor?.specialization || "—",
        doctorAvatar: apt.doctor?.user?.avatar,
        clinicName: apt.clinic?.name || "—",
        clinicAddress: apt.clinic?.address || "—",
        date: apt.date,
        startTime: formatTime(apt.startTime),
        endTime: formatTime(apt.endTime),
        status: apt.status,
        reason: apt.reason || "—",
        fee: apt.payment?.consultationFee || 0,
        roomNumber:
          apt.room?.roomNumber || apt.schedule?.room?.roomNumber || "—",
        rating: apt.feedback?.rating,
      }));

      setAppointments(mappedAppointments);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending",
        icon: Clock,
      },
      confirmed: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Confirmed",
        icon: CheckCircle,
      },
      completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Completed",
        icon: CheckCircle,
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Cancelled",
        icon: XCircle,
      },
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
      >
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  // Calculate refund info based on appointment time
  const calculateRefundInfo = (appointmentDate) => {
    const now = new Date();
    const appointmentTime = new Date(appointmentDate);
    const hoursUntilAppointment = (appointmentTime - now) / (1000 * 60 * 60);

    if (hoursUntilAppointment > 24) {
      return {
        percentage: 100,
        amount: "full",
        message: "Bạn sẽ được hoàn 100% tiền đặt cọc trong 3-5 ngày làm việc.",
      };
    } else if (hoursUntilAppointment > 12) {
      return {
        percentage: 50,
        amount: "partial",
        message: "Bạn sẽ được hoàn 50% tiền đặt cọc trong 3-5 ngày làm việc.",
      };
    } else {
      return {
        percentage: 0,
        amount: "none",
        message:
          "Tiền đặt cọc sẽ không được hoàn do hủy lịch trong vòng 12 giờ.",
      };
    }
  };

  // Handle cancel button click
  const handleCancelClick = async (appointment) => {
    const refund = calculateRefundInfo(appointment.date);
    setRefundInfo(refund);
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
    setCancelReason("");
  };

  // Submit cancel request
  const handleConfirmCancel = async () => {
    if (!selectedAppointment || !token) return;

    setCancelLoading(true);
    try {
      // Get payment for this appointment
      const paymentRes = await paymentService.getPaymentByAppointment(
        selectedAppointment.id,
      );

      if (paymentRes.success && paymentRes.data) {
        // Cancel with refund
        await paymentService.cancelWithRefund(paymentRes.data.id, cancelReason);
      }

      // Update appointment status locally
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === selectedAppointment.id
            ? { ...apt, status: "cancelled" }
            : apt,
        ),
      );

      setShowCancelModal(false);
      setSelectedAppointment(null);
      alert("Lịch hẹn đã được hủy thành công!");
    } catch (err) {
      console.error("Cancel error:", err);
      alert(err.response?.data?.message || "Có lỗi xảy ra khi hủy lịch");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải lịch hẹn...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!patientId) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto text-center py-20">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Vui lòng đăng nhập để xem lịch hẹn
          </p>
        </div>
      </div>
    );
  }

  const filteredAppointments = appointments.filter((apt) => {
    if (filters.status !== "all" && apt.status !== filters.status) return false;
    if (
      filters.searchQuery &&
      !apt.doctorName
        .toLowerCase()
        .includes(filters.searchQuery.toLowerCase()) &&
      !apt.clinicName.toLowerCase().includes(filters.searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(
      (a) => a.status === "confirmed" || a.status === "pending",
    ).length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Lịch hẹn của tôi</h1>
          <p className="text-gray-600 mt-1">
            Xem và quản lý lịch hẹn khám bệnh
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white rounded-xl p-3 md:p-4 border-2 border-blue-100">
            <p className="text-xs md:text-sm text-gray-600 mb-1">Tổng</p>
            <p className="text-xl md:text-2xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-3 md:p-4 border-2 border-purple-100">
            <p className="text-xs md:text-sm text-gray-600 mb-1">Sắp tới</p>
            <p className="text-xl md:text-2xl font-bold text-purple-600">
              {stats.upcoming}
            </p>
          </div>
          <div className="bg-white rounded-xl p-3 md:p-4 border-2 border-green-100">
            <p className="text-xs md:text-sm text-gray-600 mb-1">Hoàn thành</p>
            <p className="text-xl md:text-2xl font-bold text-green-600">
              {stats.completed}
            </p>
          </div>
          <div className="bg-white rounded-xl p-3 md:p-4 border-2 border-red-100">
            <p className="text-xs md:text-sm text-gray-600 mb-1">Đã hủy</p>
            <p className="text-xl md:text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-4 md:mb-6 border-2 border-gray-100">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên bác sĩ, phòng khám..."
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters({ ...filters, searchQuery: e.target.value })
                }
                className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full px-4 py-2 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="all">Tất cả</option>
              <option value="pending">Đang chờ</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-3 md:space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 border-2 border-gray-100 hover:border-blue-200 transition"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Left Side */}
                <div className="flex sm:flex-row gap-3 sm:gap-4 flex-1">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl flex-shrink-0">
                    {appointment.doctorName.split(" ").pop().charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-2">
                      <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">
                        {appointment.doctorName}
                      </h3>
                      {getStatusBadge(appointment.status)}
                    </div>

                    <p className="text-sm text-blue-600 font-semibold mb-2 sm:mb-3">
                      {appointment.doctorSpecialty}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">
                          {new Date(appointment.date).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>{appointment.startTime} - {appointment.endTime}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{appointment.clinicName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>Phòng {appointment.roomNumber}</span>
                      </div>
                    </div>

                    {appointment.rating && (
                      <div className="mt-2 sm:mt-3 flex items-center gap-2">
                        <span className="text-sm text-gray-600">Đánh giá:</span>
                        {renderStars(appointment.rating)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex sm:flex-col gap-2 sm:min-w-[140px] sm:items-end border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="sm:text-right">
                    <p className="text-xs sm:text-sm text-gray-600">Mã lịch hẹn</p>
                    <p className="text-base sm:text-lg font-bold text-gray-800">
                      {appointment.appointmentCode}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs sm:text-sm text-gray-600">Phí khám</p>
                    <p className="text-lg sm:text-xl font-bold text-green-600">
                      {appointment.fee.toLocaleString("vi-VN")}đ
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedAppointment(appointment)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
                  >
                    Chi tiết
                  </button>

                  {appointment.status === "confirmed" && (
                    <button
                      onClick={() => handleCancelClick(appointment)}
                      className="flex-1 sm:flex-none px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition text-sm"
                    >
                      Hủy lịch
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredAppointments.length === 0 && (
            <div className="text-center py-12 sm:py-20 bg-white rounded-xl md:rounded-2xl shadow-lg">
              <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-base sm:text-lg font-semibold mb-2">
                Không có lịch hẹn nào
              </p>
              <p className="text-gray-400 text-sm">Thử thay đổi bộ lọc</p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Appointment details
                </h2>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Appointment Info */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Appointment information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Appointment Code:</span>
                      <span className="font-semibold">
                        {selectedAppointment.appointmentCode}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-semibold">
                        {new Date(selectedAppointment.date).toLocaleDateString(
                          "vi-VN",
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-semibold">
                        {selectedAppointment.startTime} -{" "}
                        {selectedAppointment.endTime}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      {getStatusBadge(selectedAppointment.status)}
                    </div>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Doctor information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Doctor:</span>
                      <span className="font-semibold">
                        {selectedAppointment.doctorName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Specialty:</span>
                      <span className="font-semibold">
                        {selectedAppointment.doctorSpecialty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Clinic Info */}
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Clinic information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Clinic:</span>
                      <span className="font-semibold">
                        {selectedAppointment.clinicName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-semibold text-right">
                        {selectedAppointment.clinicAddress}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room:</span>
                      <span className="font-semibold">
                        {selectedAppointment.roomNumber}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Reason</h3>
                  <p className="text-gray-700">{selectedAppointment.reason}</p>
                </div>

                {/* Fee */}
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Consultation Fee
                  </h3>
                  <p className="text-2xl font-bold text-yellow-700">
                    {selectedAppointment.fee.toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>

              <div className="border-t-2 border-gray-200 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Close
                </button>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                  <Download className="w-5 h-5 inline mr-2" />
                  Download
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Appointment Modal */}
        {showCancelModal && selectedAppointment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
              {/* Header */}
              <div className="bg-red-600 text-white px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6" />
                    <h3 className="text-xl font-bold">
                      Confirm cancel appointment
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="p-1 hover:bg-red-500 rounded-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Appointment Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600">Appointment:</p>
                  <p className="font-semibold text-gray-800">
                    {selectedAppointment.doctorName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedAppointment.date).toLocaleDateString(
                      "vi-VN",
                    )}{" "}
                    lúc {selectedAppointment.startTime}
                  </p>
                </div>

                {/* Refund Info */}
                <div
                  className={`rounded-lg p-4 mb-4 ${
                    refundInfo?.percentage === 100
                      ? "bg-green-50 border border-green-300"
                      : refundInfo?.percentage === 50
                        ? "bg-yellow-50 border border-yellow-300"
                        : "bg-red-50 border border-red-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Info
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        refundInfo?.percentage === 100
                          ? "text-green-600"
                          : refundInfo?.percentage === 50
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    />
                    <div>
                      <p
                        className={`font-semibold ${
                          refundInfo?.percentage === 100
                            ? "text-green-800"
                            : refundInfo?.percentage === 50
                              ? "text-yellow-800"
                              : "text-red-800"
                        }`}
                      >
                        Refund: {refundInfo?.percentage}%
                      </p>
                      <p
                        className={`text-sm mt-1 ${
                          refundInfo?.percentage === 100
                            ? "text-green-700"
                            : refundInfo?.percentage === 50
                              ? "text-yellow-700"
                              : "text-red-700"
                        }`}
                      >
                        {refundInfo?.message}
                      </p>
                      {refundInfo?.percentage === 0 && (
                        <p className="text-xs text-red-600 mt-2">
                          If you agree, please confirm the cancellation.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Refund Policy Summary */}
                <div className="text-sm text-gray-600 mb-4">
                  <p className="font-semibold text-gray-800 mb-2">
                    Cancellation policy:
                  </p>
                  <ul className="space-y-1">
                    <li>
                      • Cancel before 24 hours: Refund 100% of the deposit
                    </li>
                    <li>• Cancel before 12 hours: Refund 50% of the deposit</li>
                    <li>• Cancel within 2 hours: No refund</li>
                  </ul>
                </div>

                {/* Reason Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for cancellation (optional):
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Example: Busy, change of plans..."
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="border-t px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelLoading}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={cancelLoading}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {cancelLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    "Confirm cancellation"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAppointments;
