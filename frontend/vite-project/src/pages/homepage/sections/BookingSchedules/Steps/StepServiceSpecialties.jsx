/** @format */

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Loader2,
  Stethoscope,
  ChevronRight,
  Building2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
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

export default function StepServiceSpecialties() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin category
        const categoryRes = await axios.get(
          `http://localhost:8080/api/service-categories?_t=${Date.now()}`,
          { headers: { "Cache-Control": "no-cache" } },
        );
        const allCategories = categoryRes.data?.data || [];
        const foundCategory = allCategories.find(
          (c) => c.slug === categorySlug,
        );
        setCategory(foundCategory);

        // Lấy specialties theo category
        const specialtyRes = await axios.get(
          `http://localhost:8080/api/specialties?categorySlug=${categorySlug}&isActive=true&_t=${Date.now()}`,
          { headers: { "Cache-Control": "no-cache" } },
        );
        setSpecialties(specialtyRes.data?.data || []);
        setRefreshKey(Date.now());
      } catch (err) {
        console.error("Failed to load data:", err);
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
  }, [categorySlug]);

  const handleSelectSpecialty = (specialty) => {
    const booking = JSON.parse(localStorage.getItem("booking")) || {};
    localStorage.setItem(
      "booking",
      JSON.stringify({
        ...booking,
        specialtyId: specialty.id,
        specialtyName: specialty.name,
        specialtySlug: specialty.slug,
        categoryId: specialty.categoryId,
      }),
    );
    // Navigate đến trang chọn phòng khám/bác sĩ
    navigate(`/specialty/${specialty.slug}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <span className="ml-3 text-lg text-gray-600 mt-4">
          Loading specialties...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to home
      </button>

      {/* Category Info */}
      {category && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">{category.name}</h2>
              <p className="text-blue-100">
                {specialties.length} Specialties/Services
              </p>
            </div>
          </div>
          {category.description && (
            <p className="text-blue-100 mt-3">{category.description}</p>
          )}
        </div>
      )}

      {/* Title */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Select specialty
        </h3>
        <p className="text-gray-600">
          Select a specialty or service you want to book
        </p>
      </div>

      {/* Specialties Grid */}
      {specialties.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No specialties in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {specialties.map((specialty) => (
            <button
              key={specialty.id}
              onClick={() => handleSelectSpecialty(specialty)}
              className="bg-white rounded-2xl border-2 border-gray-200 p-5 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col items-center text-center group"
            >
              {/* Icon - Show uploaded icon or fallback */}
              <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center mb-3 group-hover:bg-sky-200 transition-colors overflow-hidden">
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
                  className="text-3xl"
                  style={{ display: specialty.icon ? "none" : "flex" }}
                >
                  ⚕️
                </span>
              </div>
              <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                {specialty.name}
              </h4>
              {specialty._count?.doctors > 0 && (
                <p className="text-xs text-gray-500">
                  {specialty._count.doctors} doctors
                </p>
              )}
              <ChevronRight className="w-4 h-4 text-gray-400 mt-2 group-hover:text-blue-500 transition-colors" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
