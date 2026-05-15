/** @format */

import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Save,
  AlertCircle,
  CheckCircle,
  Trash2,
  Building2,
} from "lucide-react";
import axios from "axios";

export default function CreateSchedule() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [createdSchedules, setCreatedSchedules] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [selectedClinicId, setSelectedClinicId] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    const token = sessionStorage.getItem("token");
    const userData = JSON.parse(sessionStorage.getItem("user") || "{}");

    if (!userData.doctor?.id) {
      setMessage({ type: "error", text: "Khong tim thay thong tin bac si" });
      return;
    }

    setDoctorId(userData.doctor.id);

    try {
      const assignmentsRes = await axios.get(
        `http://localhost:8080/api/doctor-clinic/assignments/${userData.doctor.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setClinics(assignmentsRes.data.data || []);
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    }
  };

  useEffect(() => {
    if (doctorId) {
      loadSchedulesFromServer();
    }
  }, [doctorId]);

  const loadSchedulesFromServer = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8080/api/schedules/doctor/${doctorId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        setCreatedSchedules(res.data.data || []);
      }
    } catch (error) {
      console.error("Error loading schedules:", error);
    }
  };

  const deleteSchedule = async (id) => {
    if (!confirm("Ban co chac muon xoa lich nay?")) return;

    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/schedules/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadSchedulesFromServer();
      setMessage({ type: "success", text: "Da xoa lich lam viec!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 2000);
    } catch (error) {
      setMessage({ type: "error", text: "Khong the xoa lich!" });
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    slots.push("17:00");
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Lay cac khung gio da ban trong ngay (tru cac phong kham khac)
  const getUnavailableSlots = () => {
    const unavailable = new Set();

    createdSchedules.forEach((schedule) => {
      // Neu lich nay thuoc phong kham dang chon, bo qua
      if (schedule.clinicId === parseInt(selectedClinicId)) return;

      const scheduleDate = new Date(schedule.date).toISOString().split("T")[0];
      if (scheduleDate !== selectedDate) return;

      const startHour = new Date(schedule.startTime).getHours();
      const startMin = new Date(schedule.startTime).getMinutes();
      const endHour = new Date(schedule.endTime).getHours();
      const endMin = new Date(schedule.endTime).getMinutes();

      timeSlots.forEach((slot) => {
        const [slotHour, slotMin] = slot.split(":").map(Number);
        const slotTime = slotHour * 60 + slotMin;
        const startTime = startHour * 60 + startMin;
        const endTime = endHour * 60 + endMin;

        if (slotTime >= startTime && slotTime <= endTime) {
          unavailable.add(slot);
        }
      });
    });

    return unavailable;
  };

  const unavailableSlots = getUnavailableSlots();

  const handleSlotClick = (time) => {
    // Khong cho chon khung gio da ban
    if (unavailableSlots.has(time)) return;

    setMessage({ type: "", text: "" });
    if (selectedSlots.includes(time)) {
      setSelectedSlots(selectedSlots.filter((slot) => slot !== time));
    } else {
      setSelectedSlots([...selectedSlots, time].sort());
    }
  };

  const handleClearSelection = () => {
    setSelectedSlots([]);
    setMessage({ type: "", text: "" });
  };

  const validateSelection = () => {
    if (selectedSlots.length === 0) {
      setMessage({
        type: "error",
        text: "Please select at least one time slot!",
      });
      return false;
    }
    if (selectedSlots.length < 2) {
      setMessage({
        type: "error",
        text: "Please select at least two time slots!",
      });
      return false;
    }
    if (!selectedClinicId) {
      setMessage({ type: "error", text: "Please select a clinic!" });
      return false;
    }
    if (!selectedRoomId) {
      setMessage({ type: "error", text: "Please select a work room!" });
      return false;
    }
    return true;
  };

  const handleCreateSchedule = async () => {
    if (!validateSelection()) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = sessionStorage.getItem("token");
      const startTime = selectedSlots[0];
      const endTime = selectedSlots[selectedSlots.length - 1];

      const startTimeISO = new Date(
        `${selectedDate}T${startTime}`,
      ).toISOString();
      const endTimeISO = new Date(`${selectedDate}T${endTime}`).toISOString();

      const response = await axios.post(
        "http://localhost:8080/api/schedules",
        {
          doctorId,
          clinicId: selectedClinicId,
          roomId: selectedRoomId,
          date: selectedDate,
          startTime: startTimeISO,
          endTime: endTimeISO,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setMessage({ type: "success", text: "Create schedule successfully!" });
        loadSchedulesFromServer();
        setSelectedSlots([]);
        setSelectedClinicId("");
        setSelectedRoomId("");
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({
          type: "error",
          text: response.data.message || "Create schedule failed!",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Cannot connect to the server!",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const selectedClinic = clinics.find(
    (c) => c.clinic?.id === parseInt(selectedClinicId),
  );
  const rooms = selectedClinic?.room ? [selectedClinic.room] : [];

  // Chi hien thi phong kham co lich trong ngay (de nguoi dung biet phong kham nao da co lich)
  const getClinicScheduleInfo = (clinicId) => {
    return createdSchedules.filter((s) => {
      const scheduleDate = new Date(s.date).toISOString().split("T")[0];
      return s.clinicId === clinicId && scheduleDate === selectedDate;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Create schedule
          </h1>
          <p className="text-gray-600">
            Choose the days and time slots you want to work.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose the days you want to work
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedSlots([]);
                      setMessage({ type: "", text: "" });
                    }}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-lg font-medium"
                  />
                </div>
              </div>

              {/* Hien thi lich cac phong kham khac */}
              {selectedDate && (
                <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-sm font-medium text-amber-800 mb-2">
                    Schedules in other clinics on the same day:
                  </p>
                  <div className="space-y-2">
                    {clinics
                      .filter(
                        (c) => c.clinic?.id !== parseInt(selectedClinicId),
                      )
                      .map((c) => {
                        const clinicSchedules = getClinicScheduleInfo(
                          c.clinic?.id,
                        );
                        if (clinicSchedules.length === 0) return null;
                        return (
                          <div key={c.clinic?.id} className="text-sm">
                            <span className="font-medium text-amber-900">
                              {c.clinic?.name}:
                            </span>
                            <span className="text-amber-700 ml-2">
                              {clinicSchedules
                                .map(
                                  (s) =>
                                    `${new Date(s.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - ${new Date(s.endTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`,
                                )
                                .join(", ")}
                            </span>
                          </div>
                        );
                      })}
                    {clinics.every(
                      (c) => getClinicScheduleInfo(c.clinic?.id).length === 0,
                    ) && (
                      <p className="text-sm text-amber-600">
                        No schedules in other clinics on the same day
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose the clinic
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedClinicId}
                    onChange={(e) => {
                      setSelectedClinicId(e.target.value);
                      setSelectedRoomId("");
                      setSelectedSlots([]);
                    }}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-lg font-medium bg-white"
                  >
                    <option value="">-- Choose the clinic --</option>
                    {clinics.map((c) => (
                      <option key={c.clinic?.id} value={c.clinic?.id}>
                        {c.clinic?.name} {c.isPrimary && "(Chinh)"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedClinicId && rooms.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose the work room
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={selectedRoomId}
                      onChange={(e) => setSelectedRoomId(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-lg font-medium bg-white"
                    >
                      <option value="">-- Choose the work room --</option>
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          Phong {room.roomNumber} - {room.type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {selectedSlots.length > 0 && (
                <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold">
                      {formatDate(selectedDate)}
                    </span>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">
                    Choose a time slot (8:00 - 17:00)
                  </label>
                  {selectedSlots.length > 0 && (
                    <button
                      onClick={handleClearSelection}
                      className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Delete selection
                    </button>
                  )}
                </div>

                {/* Gioi thieu mau sac */}
                <div className="flex gap-4 mb-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <span>Unavailable (cannot be selected)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-50 border-2 border-gray-200 rounded"></div>
                    <span>Available</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {timeSlots.map((time) => {
                    const isSelected = selectedSlots.includes(time);
                    const isUnavailable = unavailableSlots.has(time);
                    return (
                      <button
                        key={time}
                        onClick={() => handleSlotClick(time)}
                        disabled={isUnavailable}
                        className={`p-3 rounded-lg font-medium text-sm transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-lg"
                            : isUnavailable
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed line-through"
                              : "bg-gray-50 text-gray-700 hover:bg-blue-100 border-2 border-gray-200"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedSlots.length > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Selected</p>
                      <p className="text-lg font-bold text-gray-800">
                        {selectedSlots[0]} -{" "}
                        {selectedSlots[selectedSlots.length - 1]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">
                        Number of time slots
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedSlots.length}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {message.text && (
                <div
                  className={`flex items-center gap-2 p-4 rounded-xl mb-6 ${
                    message.type === "success"
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <p
                    className={`text-sm font-medium ${message.type === "success" ? "text-green-700" : "text-red-700"}`}
                  >
                    {message.text}
                  </p>
                </div>
              )}

              <button
                onClick={handleCreateSchedule}
                disabled={
                  loading ||
                  selectedSlots.length === 0 ||
                  !selectedClinicId ||
                  !selectedRoomId
                }
                className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-medium text-white transition-all ${
                  loading ||
                  selectedSlots.length === 0 ||
                  !selectedClinicId ||
                  !selectedRoomId
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-lg"
                }`}
              >
                {loading ? (
                  "Dang tao lich..."
                ) : (
                  <>
                    <Save className="w-5 h-5" /> Create schedule
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" /> Created schedules
              </h2>

              {createdSchedules.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {createdSchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 mb-1">
                            {new Date(schedule.date).toLocaleDateString(
                              "vi-VN",
                            )}
                          </p>
                          <p className="font-semibold text-gray-800 text-sm">
                            {new Date(schedule.startTime).toLocaleTimeString(
                              "vi-VN",
                              { hour: "2-digit", minute: "2-digit" },
                            )}{" "}
                            -
                            {new Date(schedule.endTime).toLocaleTimeString(
                              "vi-VN",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            {schedule.clinic?.name}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteSchedule(schedule.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    No schedules created yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
