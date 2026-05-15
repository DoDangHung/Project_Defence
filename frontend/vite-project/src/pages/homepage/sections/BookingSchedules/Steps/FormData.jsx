/** @format */

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User, Phone, Mail, FileText } from "lucide-react";

const FormData = () => {
  const [bookingInfo, setBookingInfo] = useState(null);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    reason: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadBooking = () => {
      const userStr =
        sessionStorage.getItem("user") || localStorage.getItem("user");
      if (!userStr) {
        navigate("/login");
        return;
      }

      try {
        const user = JSON.parse(userStr);
        setUserData(user);

        const bookingString = localStorage.getItem("booking");
        if (!bookingString) {
          navigate("/");
          return;
        }

        const booking = JSON.parse(bookingString);
        setBookingInfo(booking);

        setFormData((prev) => ({
          ...prev,
          fullName:
            user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : prev.fullName,
          phoneNumber: user.phone || prev.phoneNumber,
          email: user.email || prev.email,
        }));

        console.log("Booking info:", booking);
      } catch (e) {
        console.error("Error loading booking:", e);
      }
    };

    loadBooking();
  }, [navigate]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      if (prev[name]) {
        return { ...prev, [name]: "" };
      }
      return prev;
    });
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{9,11}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ (09-11 số)";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const existingBooking = JSON.parse(localStorage.getItem("booking") || "{}");

    // ✅ Cập nhật booking với thông tin patient
    const updatedBooking = {
      ...existingBooking,
      fullName: formData.fullName,
      phone: formData.phoneNumber,
      email: formData.email,
      reason: formData.reason,
    };

    // ✅ Lưu lại booking đầy đủ
    localStorage.setItem("booking", JSON.stringify(updatedBooking));

    // ✅ Cũng lưu patientInfo riêng nếu cần
    localStorage.setItem("patientInfo", JSON.stringify(formData));

    console.log("✅ Updated booking:", updatedBooking);

    navigate("/booking/formData/payments");
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (!bookingInfo) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Đang tải thông tin...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-2">Thông tin đặt lịch khám</h2>
      <p className="text-gray-600 mb-8">
        Vui lòng điền đầy đủ thông tin bên dưới
      </p>

      {/* Thông tin lịch đã chọn */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          Lịch khám đã chọn
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <Calendar className="w-5 h-5 mr-3 text-blue-600 mt-1" />
            <div>
              <p className="text-sm text-gray-600">Ngày khám</p>
              <p className="font-semibold text-gray-900">
                {formatDate(bookingInfo.appointmentDate)}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <Clock className="w-5 h-5 mr-3 text-blue-600 mt-1" />
            <div>
              <p className="text-sm text-gray-600">Giờ khám</p>
              <p className="font-semibold text-gray-900">
                {formatTime(bookingInfo.start)} - {formatTime(bookingInfo.end)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form thông tin bệnh nhân */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Thông tin bệnh nhân</h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Họ và tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline w-4 h-4 mr-1" />
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                errors.fullName
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-blue-500"
              }`}
              placeholder="Nguyễn Văn A"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline w-4 h-4 mr-1" />
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                errors.phoneNumber
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-blue-500"
              }`}
              placeholder="0123456789"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline w-4 h-4 mr-1" />
              Email{" "}
              <span className="text-gray-400 text-xs">(không bắt buộc)</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                errors.email
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-blue-500"
              }`}
              placeholder="example@gmail.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Lý do khám */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline w-4 h-4 mr-1" />
              Lý do khám{" "}
              <span className="text-gray-400 text-xs">(không bắt buộc)</span>
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Mô tả triệu chứng hoặc lý do khám bệnh..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Quay lại
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Tiếp tục
            </button>
          </div>
        </form>
      </div>

      {/* Ghi chú */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Lưu ý:</strong> Sau khi điền thông tin, bạn sẽ cần đăng nhập
          hoặc đăng ký để hoàn tất đặt lịch.
        </p>
      </div>
    </div>
  );
};

export default FormData;
