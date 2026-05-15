/** @format */

import React, { useEffect, useState, useRef } from "react";
import {
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  DollarSign,
  ChevronRight,
  Calendar,
  MessageSquare,
  Search,
  Check,
  Eye,
  ArrowLeft,
  Building2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CITIES = [
  { value: "", label: "Toàn quốc" },
  { value: "TP. Hồ Chí Minh", label: "TP. Hồ Chí Minh" },
  { value: "Hà Nội", label: "Hà Nội" },
  { value: "Đà Nẵng", label: "Đà Nẵng" },
  { value: "Cần Thơ", label: "Cần Thơ" },
  { value: "Hải Phòng", label: "Hải Phòng" },
  { value: "Biên Hòa", label: "Biên Hòa" },
  { value: "Nha Trang", label: "Nha Trang" },
];

const ASSETS_BASE_URL = "http://localhost:8080";

const normalizeImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${ASSETS_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function SpecialtyDetail() {
  const { specialtySlug } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  // PHASE 1: Chọn phòng khám
  const [selectedClinic, setSelectedClinic] = useState(null);

  // PHASE 2: Chọn bác sĩ
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const requestIdRef = useRef(0);

  // Single useEffect - gọi API khi city hoặc date thay đổi
  useEffect(() => {
    let isCancelled = false;
    const currentRequestId = ++requestIdRef.current;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (city) params.append("city", city);
        params.append("date", selectedDate);

        const res = await axios.get(
          `http://localhost:8080/api/specialties/slug/${specialtySlug}/detail?${params}`,
        );

        if (isCancelled || currentRequestId !== requestIdRef.current) {
          return;
        }

        const apiData = res.data.data;
        setData(apiData);

        // Reset selection khi data thay đổi
        if (selectedClinic) {
          const stillExists = apiData.clinics.some(
            (c) => c.id === selectedClinic.id,
          );
          if (!stillExists) {
            setSelectedClinic(null);
            setSelectedDoctor(null);
            setSelectedSlot(null);
          }
        }
      } catch (err) {
        if (!isCancelled && currentRequestId === requestIdRef.current) {
          console.error("Failed to load specialty detail:", err);
        }
      } finally {
        if (!isCancelled && currentRequestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    };

    fetchDetail();

    return () => {
      isCancelled = true;
    };
  }, [specialtySlug, city, selectedDate]);

  // BACK: Từ bước chọn bác sĩ về bước chọn phòng khám
  const handleBackToClinicSelection = () => {
    setSelectedClinic(null);
    setSelectedDoctor(null);
    setSelectedSlot(null);
  };

  const handleSelectClinic = (clinic) => {
    setSelectedClinic(clinic);
    setSelectedDoctor(null);
    setSelectedSlot(null);
    document
      .getElementById("doctors-panel")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBookDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(null);
    document
      .getElementById("booking-panel")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleViewDoctorDetail = (e, doctorId) => {
    e.stopPropagation();
    navigate(`/doctor/${doctorId}`);
  };

  const handleProceedToBooking = () => {
    if (!selectedDoctor || !selectedSlot) return;
    const doctor = selectedDoctor;
    const clinic = selectedClinic;

    // Lấy room info từ slot hoặc clinic
    const roomInfo = selectedSlot.room || {};

    localStorage.setItem(
      "booking",
      JSON.stringify({
        specialtySlug,
        specialtyName: data.specialty.name,
        doctorId: doctor.id,
        doctorFirstName: doctor.user?.firstName,
        doctorLastName: doctor.user?.lastName,
        doctorName: `${doctor.user?.firstName} ${doctor.user?.lastName}`,
        clinicId: clinic?.id,
        clinicName: clinic?.name,
        clinicAddress: [
          clinic?.address,
          clinic?.ward,
          clinic?.district,
          clinic?.city,
        ]
          .filter(Boolean)
          .join(", "),
        roomId: roomInfo.id || selectedSlot.roomId,
        roomNumber: roomInfo.roomNumber || "—",
        scheduleDate: selectedDate,
        slotId: selectedSlot?.id || null,
        slotTime: selectedSlot?.time || selectedSlot?.startTime || null,
        appointmentDate: selectedDate,
        startTime: selectedSlot?.startTime || selectedSlot?.time,
        endTime: selectedSlot?.endTime,
        start: selectedSlot?.startTime || selectedSlot?.time,
        end: selectedSlot?.endTime,
      }),
    );

    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/booking/formData");
    } else {
      navigate("/login");
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return Number(amount).toLocaleString("vi-VN") + "đ";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "numeric",
    });
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Không tìm thấy chuyên khoa.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 underline"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const { specialty, doctors, clinics } = data;

  // Filter doctors by selected clinic
  const clinicDoctors = selectedClinic
    ? doctors.filter((doc) =>
        doc.clinics?.some((c) => c.id === selectedClinic.id),
      )
    : [];

  // Lọc bỏ các slot đã hết giờ (cho ngày hôm nay)
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const isToday = selectedDate === todayStr;
  const doctorSchedules = (selectedDoctor?.schedules || []).filter((slot) => {
    if (!isToday) return true;
    const slotEnd = new Date(slot.endTime);
    return slotEnd > now;
  });

  // PHASE 1: Chọn phòng khám
  if (!selectedClinic) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT COLUMN - Clinics */}
          <div className="lg:w-[60%]">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {specialty.name}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Step 1: Choose a clinic
                </p>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span className="text-sm font-medium text-blue-600">
                  Choose a clinic
                </span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="text-sm font-medium text-gray-400">
                  Choose a doctor
                </span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="text-sm font-medium text-gray-400">
                  Choose a time
                </span>
              </div>
            </div>

            {/* City filter */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Region
              </label>
              <div className="flex flex-wrap gap-2">
                {CITIES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setCity(c.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      city === c.value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clinics Grid */}
            {clinics.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-500">
                  No clinics available for this specialty
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clinics.map((clinic) => (
                  <div
                    key={clinic.id}
                    onClick={() => handleSelectClinic(clinic)}
                    className="bg-white rounded-2xl border-2 border-gray-200 p-5 cursor-pointer hover:border-blue-400 hover:shadow-lg transition-all"
                  >
                    <div className="flex gap-4">
                      {/* Logo */}
                      <div className="w-20 h-20 rounded-xl bg-blue-50 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                        {clinic.logo ? (
                          <img
                            src={normalizeImageUrl(clinic.logo)}
                            alt={clinic.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl">🏥</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-800">
                          {clinic.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {[
                            clinic.address,
                            clinic.ward,
                            clinic.district,
                            clinic.city,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>

                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                          {clinic.openingTime && clinic.closingTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span>
                                {clinic.openingTime} - {clinic.closingTime}
                              </span>
                            </div>
                          )}
                        </div>

                        {clinic.consultationFee && (
                          <div className="mt-2 font-semibold text-green-600">
                            {formatCurrency(clinic.consultationFee)}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center">
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Summary */}
          <div className="lg:w-[40%] lg:sticky lg:top-4 lg:self-start">
            <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-800 mb-4">
                Thông tin đặt khám
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Chuyên khoa</p>
                    <p className="font-semibold text-gray-800">
                      {specialty.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Clinic</p>
                    <p className="font-semibold text-gray-400">
                      Please select a clinic
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(selectedDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
                <p>
                  Please select <strong>clinic</strong> to continue
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PHASE 2: Chọn bác sĩ và giờ khám
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT COLUMN - Doctors */}
        <div className="lg:w-[60%]">
          {/* Header with Back */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleBackToClinicSelection}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {specialty.name}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {selectedClinic.name}
              </p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-green-600">Clinic</span>
            </div>
            <div className="flex-1 h-0.5 bg-green-500"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="text-sm font-medium text-blue-600">
                Choose a doctor
              </span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="text-sm font-medium text-gray-400">
                Choose a time
              </span>
            </div>
          </div>

          {/* Date picker */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date
            </label>
            <div className="relative max-w-xs">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot(null);
                }}
                min={todayStr}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Doctors List */}
          {clinicDoctors.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">
                No doctors available for this clinic
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {clinicDoctors.map((doctor) => {
                const isSelected = selectedDoctor?.id === doctor.id;
                return (
                  <div
                    key={doctor.id}
                    className={`bg-white rounded-2xl border-2 p-5 transition-all cursor-pointer ${
                      isSelected
                        ? "border-blue-500 shadow-lg ring-2 ring-blue-100"
                        : "border-gray-100 hover:border-blue-200 hover:shadow-md"
                    }`}
                    onClick={() => handleBookDoctor(doctor)}
                  >
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="w-20 h-20 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl shrink-0 overflow-hidden">
                        {doctor.user?.avatar ? (
                          <img
                            src={doctor.user.avatar}
                            alt={doctor.user?.firstName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>
                            {doctor.user?.firstName?.charAt(0)}
                            {doctor.user?.lastName?.charAt(0)}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800">
                              BS. {doctor.user?.firstName}{" "}
                              {doctor.user?.lastName}
                            </h3>
                            <p className="text-sm text-cyan-600 font-medium">
                              {doctor.specialization}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg shrink-0">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-bold text-yellow-600">
                              {doctor.rating ? doctor.rating.toFixed(1) : "5.0"}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {doctor.bio}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-600">
                          {doctor.experience && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span>{doctor.experience} năm kinh nghiệm</span>
                            </div>
                          )}
                          {selectedClinic && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span>
                                {selectedClinic.district}, {selectedClinic.city}
                              </span>
                            </div>
                          )}
                          {selectedClinic?.consultationFee && (
                            <div className="flex items-center gap-1 text-green-600 font-semibold">
                              <DollarSign className="w-4 h-4" />
                              <span>
                                {formatCurrency(selectedClinic.consultationFee)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Book button */}
                      <div className="flex flex-col items-center justify-center gap-2 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDoctorDetail(e, doctor.id);
                          }}
                          className="p-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all"
                          title="View doctor details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookDoctor(doctor);
                          }}
                          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-orange-400 hover:bg-orange-500 text-white"
                          }`}
                        >
                          {isSelected ? "Selected" : "Choose"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - Booking Panel */}
        <div
          id="booking-panel"
          className="lg:w-[40%] lg:sticky lg:top-4 lg:self-start"
        >
          <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 px-5 py-4">
              <h3 className="text-white font-bold text-lg">{specialty.name}</h3>
              <p className="text-blue-100 text-sm mt-0.5">
                {selectedClinic.name}
              </p>
            </div>

            <div className="p-5 space-y-5">
              {/* Selected Clinic */}
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-green-600 font-medium">
                    Selected clinic
                  </p>
                  <p className="font-semibold text-gray-800">
                    {selectedClinic.name}
                  </p>
                </div>
              </div>

              {/* Time slots */}
              {selectedDoctor && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time slot
                  </label>
                  {loading ? (
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="h-10 bg-gray-100 rounded-lg animate-pulse"
                        />
                      ))}
                    </div>
                  ) : doctorSchedules.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500">
                        Doctor has no schedule for this day
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {doctorSchedules.map((slot) => {
                        const isSlotSelected = selectedSlot?.id === slot.id;
                        const slotTime =
                          slot.time ||
                          (slot.startTime
                            ? new Date(slot.startTime).toLocaleTimeString(
                                "vi-VN",
                                { hour: "2-digit", minute: "2-digit" },
                              )
                            : "");
                        return (
                          <button
                            key={slot.id}
                            onClick={() =>
                              setSelectedSlot(isSlotSelected ? null : slot)
                            }
                            className={`py-2.5 px-3 rounded-lg text-sm font-medium border-2 transition-all flex items-center justify-center gap-1.5 ${
                              isSlotSelected
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                            }`}
                          >
                            {isSlotSelected && (
                              <Check className="w-3.5 h-3.5" />
                            )}
                            {slotTime}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {selectedSlot && (
                    <p className="text-xs text-green-600 mt-2 font-medium">
                      Selected:{" "}
                      {selectedSlot.time ||
                        (selectedSlot.startTime
                          ? new Date(selectedSlot.startTime).toLocaleTimeString(
                              "vi-VN",
                              { hour: "2-digit", minute: "2-digit" },
                            )
                          : "This time slot")}
                    </p>
                  )}
                </div>
              )}

              <div className="border-t border-gray-100" />

              {/* Selected doctor */}
              {selectedDoctor && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-xs font-semibold text-blue-600 mb-1">
                    Selected doctor
                  </p>
                  <p className="font-bold text-gray-800">
                    BS. {selectedDoctor.user?.firstName}{" "}
                    {selectedDoctor.user?.lastName}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {selectedDoctor.specialization}
                  </p>
                  {selectedClinic?.consultationFee && (
                    <p className="text-sm text-green-600 font-semibold mt-1">
                      {formatCurrency(selectedClinic.consultationFee)}
                    </p>
                  )}
                </div>
              )}

              {/* AI button */}
              <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-200">
                <MessageSquare className="w-5 h-5" />
                Consult AI before booking
              </button>

              {/* Proceed */}
              <button
                onClick={handleProceedToBooking}
                disabled={!selectedDoctor || !selectedSlot}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-blue-200"
              >
                Book appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
