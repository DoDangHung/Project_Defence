/** @format */

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  UserCircle,
  Calendar,
  Building2,
  Pill,
  CreditCard,
  Star,
  Bell,
  FileText,
  Settings,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

export default function DoctorSidebar({
  sidebarOpen,
  setSidebarOpen,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.dispatchEvent(new Event("storage"));
    navigate("/admin/login");
  };

  const menuItems = [
    { id: "overview", icon: LayoutDashboard, label: "Overview" },
    { id: "profile", icon: Users, label: "Profile" },
    { id: "appointment", icon: Calendar, label: "Appointments" },
    { id: "shedules", icon: Stethoscope, label: "Schedules" },
    { id: "patients", icon: UserCircle, label: "Patients" },
    { id: "messages", icon: MessageCircle, label: "Messages" },
    { id: "feedBack", icon: Star, label: "FeedBack" },
  ];

  return (
    <div
      className={`
        ${sidebarOpen ? "w-64" : "w-20"} 
        bg-gradient-to-b from-blue-700 to-blue-900 text-white 
        transition-all duration-300 flex flex-col
        fixed lg:relative h-full z-50
        ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
    >
      {/* Toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="hidden lg:flex absolute -right-3 top-6 bg-blue-600 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-10"
      >
        {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Mobile close button */}
      <button
        onClick={() => setMobileMenuOpen(false)}
        className="lg:hidden absolute right-4 top-4 p-2 hover:bg-blue-600 rounded-lg transition-colors"
      >
        <X size={20} />
      </button>

      {/* Logo */}
      <div className="p-4 md:p-6 border-b border-blue-600">
        {sidebarOpen ? (
          <>
            <h1 className="font-bold text-lg md:text-xl">🏥 Doctor</h1>
            <p className="text-blue-200 text-xs md:text-sm mt-1">
              Manage clinic
            </p>
          </>
        ) : (
          <div className="text-2xl text-center">🏥</div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 md:py-6 overflow-y-auto">
        {menuItems.map((item) => {
          const menuPath = `/doctor/${item.id}`;
          const isActive = location.pathname.startsWith(menuPath);

          return (
            <Link
              key={item.id}
              to={menuPath}
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full flex items-center gap-3 px-4 md:px-6 py-2.5 md:py-3 transition-all ${
                isActive
                  ? "bg-blue-600 border-l-4 border-white"
                  : "hover:bg-blue-600/50"
              }`}
            >
              <item.icon size={18} md:size={20} />
              {sidebarOpen && (
                <span className="text-xs md:text-sm font-medium">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 border-t border-blue-600 hover:bg-blue-600/50 transition-colors cursor-pointer w-full"
      >
        <LogOut size={18} md:size={20} />
        {sidebarOpen && (
          <span className="text-xs md:text-sm font-medium">Đăng xuất</span>
        )}
      </button>
    </div>
  );
}
