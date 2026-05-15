/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  Calendar,
  Users,
  DollarSign,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Phone,
  Mail,
  Building2,
} from "lucide-react";

const DoctorDashboard = () => {
  const location = useLocation();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    monthlyRevenue: 0,
    averageRating: 0,
  });
  const [clinics, setClinics] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [location.pathname]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const userData = JSON.parse(sessionStorage.getItem("user") || "{}");

      if (!token || !userData.id) {
        window.location.href = "/login";
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // 1. Get doctor info and assignments
      const doctorRes = await axios.get(
        `http://localhost:8080/api/doctor-clinic/assignments/${userData.doctor?.id || userData.id}`,
        { headers },
      );
      const doctorClinics = doctorRes.data.data || [];
      setClinics(doctorClinics.map((a) => a.clinic));

      // 2. Get appointments for this doctor
      const appointmentsRes = await axios.get(
        `http://localhost:8080/api/appointments/doctor/${userData.doctor?.id || userData.id}`,
        { headers },
      );
      const appointments = appointmentsRes.data.data || [];

      // 3. Get feedback/rating for this doctor
      let rating = 0;
      try {
        const feedbackRes = await axios.get(
          `http://localhost:8080/api/doctors/${userData.doctor?.id || userData.id}`,
          { headers },
        );
        rating = feedbackRes.data.data?.rating || 0;
      } catch (e) {
        console.log("No feedback data");
      }

      // 4. Calculate stats
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      const todayAppointments = appointments.filter((apt) => {
        const aptDate = new Date(apt.date).toISOString().split("T")[0];
        return aptDate === todayStr;
      });

      const patientsMap = new Map();
      appointments.forEach((apt) => {
        if (apt.patient?.id && !patientsMap.has(apt.patient.id)) {
          patientsMap.set(apt.patient.id, apt.patient);
        }
      });

      setDoctorData(userData);
      setStats({
        todayAppointments: todayAppointments.length,
        totalPatients: patientsMap.size,
        monthlyRevenue: 0,
        averageRating: rating,
      });

      setTodaySchedule(todayAppointments.slice(0, 5));
      setUpcomingAppointments(
        appointments.filter((apt) => new Date(apt.date) > today).slice(0, 5),
      );
      setRecentPatients(Array.from(patientsMap.values()).slice(0, 5));

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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

  const formatTime = (isoString) => {
    if (!isoString) return "--:--";

    return new Date(isoString).toLocaleTimeString("vi-VN", {
      timeZone: "Europe/Warsaw",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (isoString) => {
    if (!isoString) return "";

    return new Date(isoString).toLocaleDateString("vi-VN", {
      timeZone: "Europe/Warsaw",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Welcome back! This is your work overview.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-4 md:mb-6 lg:mb-8">
          <StatCard
            icon={Calendar}
            title="Today's Schedule"
            value={stats.todayAppointments || todaySchedule.length}
            subtitle="appointments"
            color="blue"
            trend="+12%"
          />
          <StatCard
            icon={Users}
            title="Total Patients"
            value={stats.totalPatients || 245}
            subtitle="this month"
            color="green"
            trend="+8%"
          />
          <StatCard
            icon={DollarSign}
            title="Monthly Revenue"
            value={`${((stats.monthlyRevenue || 15000000) / 1000000).toFixed(1)}M`}
            subtitle="USD"
            color="purple"
            trend="+15%"
          />
          <StatCard
            icon={Star}
            title="Rating"
            value={stats.averageRating || 4.8}
            subtitle="⭐⭐⭐⭐⭐"
            color="yellow"
            trend="+0.2"
          />
        </div>

        {/* Clinics Assigned */}
        {clinics.length > 0 && (
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 border-2 border-gray-100 mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              Assigned Clinics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {clinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className="p-3 md:p-4 bg-blue-50 rounded-lg md:rounded-xl border border-blue-100"
                >
                  <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                    {clinic.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    {clinic.address}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                Today's Schedule
              </h2>
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {todaySchedule.length > 0 ? (
                todaySchedule.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-200"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex flex-col items-center justify-center bg-blue-100 rounded-lg p-3 min-w-[70px]">
                        <span className="text-xs text-blue-600 font-semibold">
                          {formatTime(appointment.startTime)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(appointment.endTime)}
                        </span>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {appointment.patient?.user?.firstName}{" "}
                          {appointment.patient?.user?.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {appointment.reason || "General check-up"}
                        </p>
                      </div>

                      {getStatusBadge(appointment.status)}
                    </div>

                    <div className="flex gap-2 ml-4">
                      {appointment.status === "pending" && (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                          Confirm
                        </button>
                      )}
                      {appointment.status === "confirmed" && (
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition">
                          Start
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No appointments today</p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-purple-600" />
              Upcoming Appointments
            </h2>

            <div className="space-y-3">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 bg-purple-50 rounded-xl border border-purple-100 hover:bg-purple-100 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-purple-700">
                        {formatDate(appointment.date)}
                      </span>
                      <span className="text-xs text-purple-600">
                        {formatTime(appointment.startTime)}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {appointment.patient?.user?.firstName}{" "}
                      {appointment.patient?.user?.lastName}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {appointment.reason || "General check-up"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">
                    No upcoming appointments
                  </p>
                </div>
              )}
            </div>

            <button className="w-full mt-4 py-2 text-purple-600 font-semibold text-sm hover:bg-purple-50 rounded-lg transition">
              View all →
            </button>
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-green-600" />
            Recent Patients
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Patient
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Last Visit
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.length > 0 ? (
                  recentPatients.map((patient) => (
                    <tr
                      key={patient.patientId}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {patient.user?.firstName?.charAt(0)}
                            {patient.user?.lastName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {patient.user?.firstName} {patient.user?.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: #{patient.patientId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center gap-2 mb-1">
                            <Phone className="w-3 h-3" />
                            {patient.user?.phone || "N/A"}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            {patient.user?.email || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {patient.lastVisit
                          ? formatDate(patient.lastVisit)
                          : "No visit"}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          Active
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                          View details →
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-500">
                      No patients yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Statistics Card Component
const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    yellow: "from-yellow-500 to-yellow-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl transition-all">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} text-white`}
        >
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className="flex items-center text-green-600 text-sm font-semibold">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
};

export default DoctorDashboard;
