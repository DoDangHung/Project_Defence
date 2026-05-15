/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Phone,
  Mail,
  FileText,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [doctorId, setDoctorId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Filters
  const [filters, setFilters] = useState({
    status: "", // empty = all
    date: "",
    searchQuery: "",
  });

  // Get doctorId from storage (read fresh on each call)
  const getDoctorId = () => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.doctorId || user.id;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  // Initial fetch on mount
  useEffect(() => {
    const currentDoctorId = getDoctorId();
    if (currentDoctorId) {
      setDoctorId(currentDoctorId);
      fetchAppointments(currentDoctorId);
    }
  }, []); // Run once on mount

  // Re-fetch when filters or page changes
  useEffect(() => {
    if (doctorId) {
      fetchAppointments(doctorId);
    }
  }, [currentPage, filters.status, filters.date]);

  useEffect(() => {
    // Watch for storage changes (logout/login in same browser)
    const interval = setInterval(() => {
      const currentDoctorId = getDoctorId();
      if (currentDoctorId && currentDoctorId !== doctorId) {
        setDoctorId(currentDoctorId);
        fetchAppointments(currentDoctorId);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [doctorId]);

  const fetchAppointments = async (doctorIdParam) => {
    const doctorIdToUse = doctorIdParam || doctorId;
    if (!doctorIdToUse) return;

    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
      });

      if (filters.status) params.append("status", filters.status);
      if (filters.date) params.append("date", filters.date);

      const response = await axios.get(
        `http://localhost:8080/api/appointments/doctor/${doctorIdToUse}?${params}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = response.data;
      setAppointments(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalItems(data.pagination?.total || 0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAppointments();
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.patch(
        `http://localhost:8080/api/appointments/${id}/confirm`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Status update successful!");
      fetchAppointments();
      setShowActionMenu(null);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status!");
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to delete this appointment?"))
      return;

    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(
        `http://localhost:8080/api/appointments/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert("Appointment deleted successfully!");
      fetchAppointments();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Error deleting appointment!");
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
    return new Date(isoString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Stats - tính từ appointments hiện tại (đã paginated)
  const stats = {
    total: totalItems,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Manage appointments
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage all appointments of patients
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatCard label="Total" value={stats.total} color="blue" />
          <StatCard label="Pending" value={stats.pending} color="yellow" />
          <StatCard label="Confirmed" value={stats.confirmed} color="blue" />
          <StatCard label="Completed" value={stats.completed} color="green" />
          <StatCard label="Cancelled" value={stats.cancelled} color="red" />
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone, reason..."
                  value={filters.searchQuery}
                  onChange={(e) =>
                    setFilters({ ...filters, searchQuery: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <select
                value={filters.dateRange}
                onChange={(e) =>
                  setFilters({ ...filters, dateRange: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All time</option>
                <option value="today">Today</option>
                <option value="week">This week</option>
                <option value="month">This month</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">
              Display <strong>{appointments.length}</strong> out of{" "}
              <strong>{totalItems}</strong> appointments
            </p>
            <button
              onClick={fetchAppointments}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition"
            >
              <RefreshCw className="w-4 h-4" />
              Làm mới
            </button>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : appointments.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                        ID
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                        Queue Number
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                        Patient
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                        Date & Time
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                        Reason
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="py-4 px-6">
                          <span className="font-mono text-sm text-gray-600">
                            #{appointment.id.toString().padStart(4, "0")}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 font-bold text-sm rounded-full">
                              {appointment.queueNumber || "-"}
                            </span>
                            <span className="text-xs text-gray-500">
                              /{appointment.schedule?.maxPatientsPerSlot || 3}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {appointment.patient?.user?.firstName?.charAt(0)}
                              {appointment.patient?.user?.lastName?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {appointment.patient?.user?.firstName}{" "}
                                {appointment.patient?.user?.lastName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {appointment.patient?.user?.phone}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            <p className="font-semibold text-gray-800">
                              {formatDate(appointment.date)}
                            </p>
                            <p className="text-gray-600">
                              {formatTime(appointment.startTime)} -{" "}
                              {formatTime(appointment.endTime)}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm text-gray-700 max-w-xs truncate">
                            {appointment.reason || "No reason"}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          {getStatusBadge(appointment.status)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setShowDetailModal(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {appointment.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(
                                      appointment.id,
                                      "confirmed",
                                    )
                                  }
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                  title="Xác nhận"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(
                                      appointment.id,
                                      "cancelled",
                                    )
                                  }
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                  title="Hủy"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}

                            {appointment.status === "confirmed" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(
                                    appointment.id,
                                    "completed",
                                  )
                                }
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                title="Completed"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() =>
                                handleDeleteAppointment(appointment.id)
                              }
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600">
                  Page {currentPage} / {totalPages} • Total: {totalItems}{" "}
                  appointments
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-semibold transition ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "border-2 border-gray-200 hover:bg-white"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-semibold mb-2">
                No appointments found
              </p>
              <p className="text-gray-400">
                Try changing the filters or search
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          onClose={() => setShowDetailModal(false)}
          onUpdate={() => {
            fetchAppointments();
            setShowDetailModal(false);
          }}
        />
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, color }) => {
  const colors = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    yellow: "border-yellow-200 bg-yellow-50 text-yellow-700",
    green: "border-green-200 bg-green-50 text-green-700",
    red: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <div className={`p-4 rounded-xl border-2 ${colors[color]}`}>
      <p className="text-xs font-semibold mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

// Appointment Detail Modal
const AppointmentDetailModal = ({ appointment, onClose, onUpdate }) => {
  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Appointment details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <XCircle className="w-6 h-6 text-gray-600" />
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
                <span className="text-gray-600">Appointment ID:</span>
                <span className="font-semibold">
                  #{appointment.id.toString().padStart(4, "0")}
                </span>
              </div>
              {/* Queue Number */}
              {appointment.queueNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Queue Number:</span>
                  <span className="font-semibold flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-700 font-bold text-xs rounded-full">
                      {appointment.queueNumber}
                    </span>
                    / {appointment.schedule?.maxPatientsPerSlot || 3}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold">
                  {formatDate(appointment.date)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-semibold">
                  {formatTime(appointment.startTime)} -{" "}
                  {formatTime(appointment.endTime)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold">{appointment.status}</span>
              </div>
            </div>
          </div>

          {/* Patient Info */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              Patient information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Full Name:</span>
                <span className="font-semibold">
                  {appointment.patient?.user?.firstName}{" "}
                  {appointment.patient?.user?.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-semibold">
                  {appointment.patient?.user?.phone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-semibold">
                  {appointment.patient?.user?.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Age:</span>
                <span className="font-semibold">
                  {appointment.patient?.age} years
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gender:</span>
                <span className="font-semibold">
                  {appointment.patient?.gender === "male" ? "Nam" : "Nữ"}
                </span>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Reason</h3>
            <p className="text-gray-700">{appointment.reason || "No reason"}</p>
          </div>

          {/* Clinic Info */}
          {appointment.clinic && (
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Clinic</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold">
                    {appointment.clinic.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-semibold">
                    {appointment.clinic.address}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t-2 border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
