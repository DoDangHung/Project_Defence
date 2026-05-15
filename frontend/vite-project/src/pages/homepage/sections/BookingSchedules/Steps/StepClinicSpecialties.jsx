/** @format */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Stethoscope,
  Users,
  ChevronRight,
} from "lucide-react";
import axios from "axios";

const ASSETS_URL = "http://localhost:8080";

// Normalize image URL with cache busting
const normalizeImageUrl = (url, timestamp) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}_t=${timestamp}`;
  }
  const baseUrl = `${ASSETS_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}_t=${timestamp}`;
};

export default function StepClinicSpecialties() {
  const { clinicSlug } = useParams();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/specialties/clinic/slug/${clinicSlug}?_t=${Date.now()}`,
          { headers: { "Cache-Control": "no-cache" } },
        );
        if (res.data?.success) {
          setClinic(res.data.data.clinic);
          setSpecialties(res.data.data.specialties || []);
          setRefreshKey(Date.now());
        }
      } catch (err) {
        console.error("Failed to load specialties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Refresh data every 30 seconds to pick up changes from admin uploads
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, [clinicSlug]);

  const handleSelectSpecialty = (specialty) => {
    const booking = JSON.parse(localStorage.getItem("booking")) || {};
    localStorage.setItem(
      "booking",
      JSON.stringify({
        ...booking,
        specialtyId: specialty.id,
        specialtyName: specialty.name,
        specialtySlug: specialty.slug,
      }),
    );
    navigate(`/clinic-booking/${clinicSlug}/${specialty.slug}/doctors`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <span className="ml-3 text-lg text-gray-600">
          Loading specialties...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-3 md:px-0">
      {/* Header */}
      <button
        onClick={() => navigate("/clinic-booking")}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-4 md:mb-6 text-sm md:text-base"
      >
        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
        Quay về
      </button>

      {/* Clinic Info */}
      {clinic && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl md:rounded-2xl p-4 md:p-6 text-white mb-4 md:mb-8">
          <h2 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">{clinic.name}</h2>
          <p className="text-blue-100 text-sm md:text-base">
            {[clinic.address, clinic.ward, clinic.district, clinic.city]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      )}

      {/* Title */}
      <div className="text-center mb-4 md:mb-8">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">
          Chọn chuyên khoa
        </h3>
        <p className="text-sm md:text-base text-gray-600">
          Chọn chuyên khoa bạn muốn khám tại {clinic?.name}
        </p>
      </div>

      {/* Specialties Grid */}
      {specialties.length === 0 ? (
        <div className="text-center py-8 md:py-12 bg-gray-50 rounded-xl">
          <Stethoscope className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm md:text-base">Phòng khám chưa có chuyên khoa</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {specialties.map((specialty) => (
            <button
              key={specialty.id}
              onClick={() => handleSelectSpecialty(specialty)}
              className="bg-white rounded-xl md:rounded-2xl border-2 border-gray-200 p-3 md:p-5 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col items-center text-center group"
            >
              {/* Icon - Show uploaded icon or fallback */}
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-sky-100 flex items-center justify-center mb-2 md:mb-3 group-hover:bg-sky-200 transition-colors overflow-hidden">
                {specialty.icon ? (
                  <img
                    src={normalizeImageUrl(specialty.icon, refreshKey)}
                    alt={specialty.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <span
                  className={`text-2xl md:text-3xl ${specialty.icon ? "hidden" : ""}`}
                  style={{ display: specialty.icon ? "none" : "flex" }}
                >
                  ⚕️
                </span>
              </div>
              <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                {specialty.name}
              </h4>
              {specialty.doctorCount > 0 && (
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  {specialty.doctorCount} doctors
                </div>
              )}
              <ChevronRight className="w-5 h-5 text-blue-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      )}

      {/* Count */}
      <p className="text-center text-gray-500 mt-6">
        {specialties.length} specialties available
      </p>
    </div>
  );
}
