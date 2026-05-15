/** @format */

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Save,
  X,
  Camera,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const PatientProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "male",
    address: "",
    avatar: null,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phone: userData.phone || userData.phoneNumber || "",
          dateOfBirth: userData.dateOfBirth || "",
          gender: userData.gender || "male",
          address: userData.address || "",
          avatar: userData.avatar || null,
        });
      }
    } catch (err) {
      setError("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = { ...user, ...formData };
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSuccess("Cập nhật thông tin thành công!");
        setIsEditing(false);
      } else {
        setError(data.message || "Cập nhật thất bại");
      }
    } catch (err) {
      setError("Không thể kết nối đến server");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || user.phoneNumber || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "male",
        address: user.address || "",
        avatar: user.avatar || null,
      });
    }
    setIsEditing(false);
    setError("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-4xl mx-auto px-3 md:px-4">
        {/* Header */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                Hồ sơ cá nhân
              </h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                Quản lý thông tin tài khoản
              </p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition"
              >
                <Edit className="w-4 h-4" />
                <span>Chỉnh sửa</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm"
                >
                  <X className="w-4 h-4" />
                  <span>Hủy</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition disabled:opacity-50 text-sm"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden">
          {/* Avatar Section */}
          <div className="bg-gradient-to-r from-sky-500 to-cyan-500 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 md:gap-6 text-center sm:text-left">
              <div className="relative">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Avatar"
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white"
                  />
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center border-4 border-white">
                    <span className="text-2xl md:text-3xl font-bold text-sky-600">
                      {formData.firstName?.charAt(0) || "U"}
                      {formData.lastName?.charAt(0) || ""}
                    </span>
                  </div>
                )}
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
              <div className="text-white">
                <h2 className="text-lg md:text-xl font-bold">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="opacity-80 text-sm md:text-base">{formData.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                  Bệnh nhân
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Họ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-10 md:pl-11 pr-4 py-2 md:py-3 border-2 rounded-xl text-sm md:text-base ${
                      isEditing
                        ? "border-gray-200 focus:border-sky-500 focus:outline-none"
                        : "border-transparent bg-gray-50"
                    }`}
                    placeholder="Họ của bạn"
                  />
                </div>
              </div>

              {/* Tên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-10 md:pl-11 pr-4 py-2 md:py-3 border-2 rounded-xl text-sm md:text-base ${
                      isEditing
                        ? "border-gray-200 focus:border-sky-500 focus:outline-none"
                        : "border-transparent bg-gray-50"
                    }`}
                    placeholder="Tên của bạn"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-10 md:pl-11 pr-4 py-2 md:py-3 border-2 rounded-xl text-sm md:text-base ${
                      isEditing
                        ? "border-gray-200 focus:border-sky-500 focus:outline-none"
                        : "border-transparent bg-gray-50"
                    }`}
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-10 md:pl-11 pr-4 py-2 md:py-3 border-2 rounded-xl text-sm md:text-base ${
                      isEditing
                        ? "border-gray-200 focus:border-sky-500 focus:outline-none"
                        : "border-transparent bg-gray-50"
                    }`}
                    placeholder="0909123456"
                  />
                </div>
              </div>

              {/* Ngày sinh */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-10 md:pl-11 pr-4 py-2 md:py-3 border-2 rounded-xl text-sm md:text-base ${
                      isEditing
                        ? "border-gray-200 focus:border-sky-500 focus:outline-none"
                        : "border-transparent bg-gray-50"
                    }`}
                  />
                </div>
              </div>

              {/* Giới tính */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border-2 rounded-xl ${
                    isEditing
                      ? "border-gray-200 focus:border-sky-500 focus:outline-none bg-white"
                      : "border-transparent bg-gray-50"
                  }`}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Địa chỉ */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl ${
                      isEditing
                        ? "border-gray-200 focus:border-sky-500 focus:outline-none"
                        : "border-transparent bg-gray-50"
                    }`}
                    placeholder="123 Đường ABC, Quận 1, TP.HCM"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => (window.location.href = "/booking/profile")}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-800">Appointments</p>
              <p className="text-sm text-gray-500">View appointment schedule</p>
            </div>
          </button>

          <button
            onClick={() => (window.location.href = "/booking/message")}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-800">Messages</p>
              <p className="text-sm text-gray-500">Send messages to doctor</p>
            </div>
          </button>

          <button
            onClick={() => (window.location.href = "/booking/profile")}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-800">Payments</p>
              <p className="text-sm text-gray-500">Payment history</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
