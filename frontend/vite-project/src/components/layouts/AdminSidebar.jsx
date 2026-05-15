/** @format */

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Stethoscope,
  UserCircle,
  Calendar,
  Building2,
  CreditCard,
  Star,
  Bell,
  FileText,
  Settings,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FolderHeart,
  Link2,
  MessageCircle,
  Globe,
} from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";

export default function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: t("sidebar.dashboard") },
    { id: "users", icon: Users, label: t("sidebar.manageUsers") },
    { id: "admins", icon: UserCog, label: t("sidebar.manageAdmins") },
    { id: "doctors", icon: Stethoscope, label: t("sidebar.manageDoctors") },
    {
      id: "doctor-profiles",
      icon: ShieldCheck,
      label: t("sidebar.approveDoctorProfiles"),
    },
    { id: "patients", icon: UserCircle, label: t("sidebar.managePatients") },
    {
      id: "booking-categories",
      icon: FolderHeart,
      label: t("sidebar.bookingCategories"),
    },
    {
      id: "specialty",
      icon: Stethoscope,
      label: t("sidebar.manageSpecialties"),
    },
    {
      id: "service-categories",
      icon: FolderHeart,
      label: t("sidebar.serviceCategories"),
    },
    {
      id: "clinic-specialties",
      icon: Link2,
      label: t("sidebar.clinicSpecialties"),
    },
    { id: "clinic", icon: Building2, label: t("sidebar.manageClinics") },
    {
      id: "doctor-clinic",
      icon: Stethoscope,
      label: t("sidebar.doctorClinic"),
    },
    {
      id: "appointments",
      icon: Calendar,
      label: t("sidebar.manageAppointments"),
    },
    { id: "payments", icon: CreditCard, label: t("sidebar.managePayments") },
    { id: "messages", icon: MessageCircle, label: t("sidebar.manageMessages") },
  ];

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.dispatchEvent(new Event("storage"));
    navigate("/admin/login");
  };

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
      <div className="p-6 border-b border-blue-600">
        {sidebarOpen ? (
          <>
            <h1 className="font-bold text-xl">🏥 Admin Panel</h1>
            <p className="text-blue-200 text-sm mt-1">Hospital Management</p>
          </>
        ) : (
          <div className="text-2xl text-center">🏥</div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 py-6 overflow-y-auto">
        {menuItems.map((item) => {
          const menuPath = `/admin/${item.id}`;
          const isActive = location.pathname.startsWith(menuPath);

          return (
            <Link
              key={item.id}
              to={menuPath}
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-all ${
                isActive
                  ? "bg-blue-600 border-l-4 border-white"
                  : "hover:bg-blue-600/50"
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Language Switcher */}
      <div className="px-6 py-3 border-t border-blue-600">
        {sidebarOpen ? (
          <LanguageSwitcher />
        ) : (
          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-6 py-4 border-t border-blue-600 hover:bg-blue-600/50 transition-colors cursor-pointer w-full"
      >
        <LogOut size={20} />
        {sidebarOpen && (
          <span className="text-sm font-medium">{t("auth.logout")}</span>
        )}
      </button>
    </div>
  );
}
