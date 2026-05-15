/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Mail,
  Phone,
  Calendar,
  Eye,
  EyeOff,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Heart,
} from "lucide-react";

const PatientAuth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "male",
    address: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
          role: "patient",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("token", data.data.token);
        sessionStorage.setItem("user", JSON.stringify(data.data.user));
        sessionStorage.setItem("userType", data.data.user.role.name);
        window.dispatchEvent(new Event("userLogin"));

        const hasBookingData = localStorage.getItem("booking");
        if (hasBookingData) {
          navigate("/booking/formData");
        } else {
          navigate("/");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (registerData.password !== registerData.confirmPassword) {
      setError("Confirm password does not match");
      return;
    }

    if (registerData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          phone: registerData.phone,
          dateOfBirth: registerData.dateOfBirth,
          gender: registerData.gender,
          address: registerData.address,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Register successful! Please login.");
        setMode("login");
        setLoginData({ email: registerData.email, password: "" });
        setRegisterData({
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          phone: "",
          dateOfBirth: "",
          gender: "male",
          address: "",
        });
      } else {
        setError(data.message || "Register failed");
      }
    } catch (err) {
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="w-full max-w-md lg:max-w-lg">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-sky-500 rounded-xl md:rounded-2xl mb-3 md:mb-4 shadow-lg">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {mode === "login" ? "Chào mừng!" : "Đăng ký tài khoản"}
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            {mode === "login"
              ? "Đăng nhập để đặt lịch khám"
              : "Đăng ký tài khoản để sử dụng dịch vụ"}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-4 md:mb-6 bg-gray-100 p-1 rounded-lg md:rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2 px-3 md:px-4 rounded-lg font-medium transition-all text-sm md:text-base ${
                mode === "login"
                  ? "bg-white text-sky-600 shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-2 px-3 md:px-4 rounded-lg font-medium transition-all text-sm md:text-base ${
                mode === "register"
                  ? "bg-white text-sky-600 shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Đăng ký
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Login Form */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4 md:space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                    className="w-full pl-10 md:pl-11 pr-4 py-2 md:py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none text-sm md:text-base"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    className="w-full pl-10 md:pl-11 pr-12 py-2 md:py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none text-sm md:text-base"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 md:py-3 rounded-xl font-medium text-white transition-all text-sm md:text-base ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-200"
                }`}
              >
                {loading ? "Đang xử lý..." : "Đăng nhập"}
              </button>
            </form>
          )}

          {/* Register Form */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Họ
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={registerData.lastName}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-3 md:px-4 py-2 border-2 border-gray-200 rounded-lg md:rounded-xl focus:border-sky-500 focus:outline-none text-sm"
                    placeholder="Nguyễn"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Tên
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={registerData.firstName}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-3 md:px-4 py-2 border-2 border-gray-200 rounded-lg md:rounded-xl focus:border-sky-500 focus:outline-none text-sm"
                    placeholder="Văn A"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                    className="w-full pl-10 md:pl-11 pr-4 py-2 border-2 border-gray-200 rounded-lg md:rounded-xl focus:border-sky-500 focus:outline-none text-sm"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-3 md:px-4 py-2 border-2 border-gray-200 rounded-lg md:rounded-xl focus:border-sky-500 focus:outline-none text-sm"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Xác nhận
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-3 md:px-4 py-2 border-2 border-gray-200 rounded-lg md:rounded-xl focus:border-sky-500 focus:outline-none text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    required
                    className="w-full pl-10 md:pl-11 pr-4 py-2 border-2 border-gray-200 rounded-lg md:rounded-xl focus:border-sky-500 focus:outline-none text-sm"
                    placeholder="0909123456"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={registerData.dateOfBirth}
                    onChange={handleRegisterChange}
                    required
                    className="w-full px-3 md:px-4 py-2 border-2 border-gray-200 rounded-lg md:rounded-xl focus:border-sky-500 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Giới tính
                  </label>
                  <select
                    name="gender"
                    value={registerData.gender}
                    onChange={handleRegisterChange}
                    className="w-full px-3 md:px-4 py-2 border-2 border-gray-200 rounded-lg md:rounded-xl focus:border-sky-500 focus:outline-none bg-white text-sm"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  name="address"
                  value={registerData.address}
                  onChange={handleRegisterChange}
                  className="w-full px-3 md:px-4 py-2 border-2 border-gray-200 rounded-lg md:rounded-xl focus:border-sky-500 focus:outline-none text-sm"
                  placeholder="123 Đường ABC, Quận 1, TP.HCM"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 md:py-3 rounded-xl font-medium text-white transition-all text-sm md:text-base ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-200"
                }`}
              >
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </button>
            </form>
          )}

          {/* Back to Home */}
          <div className="mt-4 md:mt-6 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Quay về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAuth;
