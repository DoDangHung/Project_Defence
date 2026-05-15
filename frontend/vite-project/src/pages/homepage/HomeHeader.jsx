/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  MessageSquare,
  LogOut,
  ChevronDown,
  Bell,
  Search,
  Menu,
  X,
  Settings,
  Heart,
  CreditCard,
  Phone,
} from "lucide-react";

const HomeHeader = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateUserFromStorage = () => {
      const storedUser = sessionStorage.getItem("user");
      const token = sessionStorage.getItem("token");

      if (storedUser && token) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (e) {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };

    updateUserFromStorage();

    window.addEventListener("storage", updateUserFromStorage);
    window.addEventListener("userLogin", updateUserFromStorage);
    const interval = setInterval(updateUserFromStorage, 1000);

    return () => {
      window.removeEventListener("storage", updateUserFromStorage);
      window.removeEventListener("userLogin", updateUserFromStorage);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
      // Clear sessionStorage
      sessionStorage.clear();
      // Clear localStorage (bao gồm booking data)
      localStorage.removeItem("booking");
      localStorage.removeItem("patientInfo");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userType");
      setCurrentUser(null);
      setShowDropdown(false);
      navigate("/");
    }
  };

  const dropdownItems = [
    {
      icon: User,
      label: "Hồ sơ cá nhân",
      path: "/profile",
      color: "text-blue-600",
    },
    {
      icon: Calendar,
      label: "Lịch hẹn",
      path: "/appointments",
      color: "text-green-600",
    },
    {
      icon: MessageSquare,
      label: "Tin nhắn",
      path: "/messages",
      color: "text-purple-600",
      badge: 2,
    },
    {
      icon: CreditCard,
      label: "Thanh toán",
      path: "/payments",
      color: "text-yellow-600",
    },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-xl">
                  H
                </span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-800 hidden sm:block">
                HealthCare
              </span>
            </div>

            {/* Navigation Links - Desktop */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
              <a
                href="/"
                className="text-sm xl:text-base text-gray-600 hover:text-blue-600 font-semibold transition"
              >
                Home
              </a>
              <a
                href="/services"
                className="text-sm xl:text-base text-gray-600 hover:text-blue-600 font-semibold transition"
              >
                Services
              </a>
              <a
                href="/doctors"
                className="text-sm xl:text-base text-gray-600 hover:text-blue-600 font-semibold transition"
              >
                Doctors
              </a>
              <a
                href="/about"
                className="text-sm xl:text-base text-gray-600 hover:text-blue-600 font-semibold transition"
              >
                About
              </a>
              <a
                href="/contact"
                className="text-sm xl:text-base text-gray-600 hover:text-blue-600 font-semibold transition"
              >
                Contact
              </a>
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Phone - Desktop */}
            <a
              href="tel:+48234567890"
              className="hidden md:flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 rounded-lg transition text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>+48 234 567 890</span>
            </a>

            {/* User Avatar Dropdown */}
            <div className="relative">
              {currentUser ? (
                <>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    {/* Avatar */}
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt="Avatar"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                        {currentUser.firstName?.charAt(0) || "U"}
                        {currentUser.lastName?.charAt(0) || ""}
                      </div>
                    )}

                    {/* Name - Tablet+ */}
                    <div className="hidden md:block text-left max-w-[120px] lg:max-w-[150px]">
                      <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                        {currentUser.firstName} {currentUser.lastName}
                      </p>
                    </div>

                    <ChevronDown
                      className={`w-4 h-4 text-gray-600 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                      />

                      {/* Dropdown Content */}
                      <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-20">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {currentUser.firstName} {currentUser.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {currentUser.email}
                          </p>
                          <p className="text-xs text-gray-500">
                            {currentUser.phone || currentUser.phoneNumber}
                          </p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          {dropdownItems.map((item, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                navigate(item.path);
                                setShowDropdown(false);
                              }}
                              className="w-full flex items-center justify-between px-4 py-2 sm:py-3 hover:bg-gray-50 transition group"
                            >
                              <div className="flex items-center gap-3">
                                <item.icon
                                  className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color}`}
                                />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                  {item.label}
                                </span>
                              </div>
                              {item.badge && (
                                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-100 pt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 sm:py-3 text-red-600 hover:bg-red-50 transition"
                          >
                            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-sm font-semibold">
                              Logout
                            </span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-2 sm:px-3 md:px-4 py-2 text-sky-600 hover:bg-sky-50 rounded-lg font-medium transition text-sm"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="hidden sm:block px-3 md:px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition text-sm"
                  >
                    Đăng ký
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-200 py-3 sm:py-4">
            <nav className="flex flex-col gap-1 sm:gap-2">
              <a
                href="/"
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Trang chủ
              </a>
              <a
                href="/services"
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Dịch vụ
              </a>
              <a
                href="/doctors"
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Bác sĩ
              </a>
              <a
                href="/about"
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Giới thiệu
              </a>
              <a
                href="/contact"
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Liên hệ
              </a>
              {!currentUser && (
                <a
                  href="/register"
                  className="mx-4 mt-2 px-4 py-2 bg-sky-500 text-white rounded-lg font-medium text-center"
                >
                  Đăng ký
                </a>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default HomeHeader;
