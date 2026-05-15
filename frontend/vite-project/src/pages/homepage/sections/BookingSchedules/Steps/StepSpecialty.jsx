/** @format */

import React, { useEffect, useState } from "react";
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  Stethoscope,
  Heart,
} from "lucide-react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";

const API_URL = "http://localhost:8080/api";
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

function StepSpecialty() {
  const { handleInputChange, bookingData } = useOutletContext();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [viewMode, setViewMode] = useState("all");
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await axios.get(
          `${API_URL}/service-categories?withSpecialties=true&isActive=true&_t=${Date.now()}`,
          {
            headers: { "Cache-Control": "no-cache" },
          },
        );
        const data = categoryRes.data.data || [];
        setCategories(data);
        setRefreshKey(Date.now());
      } catch (err) {
        console.error("Can't load data", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const allSpecialties = categories.flatMap((cat) => cat.specialties || []);

  const generalCategory = categories.find((c) => c.slug === "kham-tong-quat");
  const specialistCategory = categories.find(
    (c) => c.slug === "kham-chuyen-khoa",
  );

  const generalSpecialties = allSpecialties.filter(
    (s) => s.categoryId === generalCategory?.id,
  );
  const specialistSpecialties = allSpecialties.filter(
    (s) => s.categoryId === specialistCategory?.id,
  );
  const otherSpecialties = allSpecialties.filter(
    (s) =>
      s.categoryId !== generalCategory?.id &&
      s.categoryId !== specialistCategory?.id,
  );

  const displayedSpecialties =
    viewMode === "general"
      ? generalSpecialties
      : viewMode === "specialist"
        ? specialistSpecialties
        : viewMode === "other"
          ? otherSpecialties
          : allSpecialties;

  const handleSelectSpecialty = () => {
    if (!selectedSlug) {
      alert("Please select a specialty.");
      return;
    }

    const selectedSpecialty = allSpecialties.find(
      (spec) => spec.slug === selectedSlug,
    );

    if (!selectedSpecialty) {
      alert("Cannot find specialty information.");
      return;
    }

    const booking = JSON.parse(localStorage.getItem("booking")) || {};
    localStorage.setItem(
      "booking",
      JSON.stringify({
        ...booking,
        specialtyId: selectedSpecialty.id,
        specialtyName: selectedSpecialty.name,
        specialtySlug: selectedSpecialty.slug,
        categoryId: selectedSpecialty.categoryId,
      }),
    );

    navigate(`/specialty/${selectedSlug}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  const renderSpecialtyIcon = (spec, baseClassName) => {
    if (spec.icon) {
      return (
        <img
          src={normalizeImageUrl(spec.icon, refreshKey)}
          alt={spec.name}
          className={`${baseClassName} object-cover`}
          onError={(e) => {
            e.target.style.display = "none";
            const fallback = e.target.nextSibling;
            if (fallback) fallback.style.display = "flex";
          }}
        />
      );
    }
    return null;
  };

  const renderFallbackIcon = (emoji) => (
    <span style={{ display: "flex" }}>{emoji}</span>
  );

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-center text-xl font-semibold mb-8">
          SELECT BOOKING METHOD
        </h2>

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode("all")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                viewMode === "all"
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setViewMode("general")}
              className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                viewMode === "general"
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              General Checkup
            </button>
            <button
              onClick={() => setViewMode("specialist")}
              className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                viewMode === "specialist"
                  ? "bg-orange-500 text-white shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Heart className="w-4 h-4" />
              Specialist Checkup
            </button>
            {otherSpecialties.length > 0 && (
              <button
                onClick={() => setViewMode("other")}
                className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  viewMode === "other"
                    ? "bg-purple-600 text-white shadow"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                📋 Other Services
              </button>
            )}
          </div>
        </div>

        {/* General Checkup Section */}
        {(viewMode === "general" || viewMode === "all") &&
          generalSpecialties.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  General Checkup
                </h3>
                <span className="text-sm text-gray-500">
                  ({generalSpecialties.length} specialties)
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
                {generalSpecialties.map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => setSelectedSlug(spec.slug)}
                    className={`flex flex-col items-center text-center group transition-all ${
                      selectedSlug === spec.slug
                        ? "scale-110"
                        : "hover:scale-105"
                    }`}
                  >
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                        selectedSlug === spec.slug
                          ? "bg-blue-600 text-white ring-4 ring-blue-200"
                          : "bg-blue-100 group-hover:bg-blue-200 text-blue-600"
                      }`}
                    >
                      {renderSpecialtyIcon(spec, "w-full h-full rounded-full")}
                      {!spec.icon && renderFallbackIcon("⚕️")}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium transition-colors ${
                        selectedSlug === spec.slug
                          ? "text-blue-600"
                          : "text-gray-800 group-hover:text-blue-600"
                      }`}
                    >
                      {spec.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Divider */}
        {viewMode === "all" &&
          generalSpecialties.length > 0 &&
          specialistSpecialties.length > 0 && (
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
          )}

        {/* Specialist Checkup Section */}
        {(viewMode === "specialist" || viewMode === "all") &&
          specialistSpecialties.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Specialist Checkup
                </h3>
                <span className="text-sm text-gray-500">
                  ({specialistSpecialties.length} specialties)
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
                {specialistSpecialties.map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => setSelectedSlug(spec.slug)}
                    className={`flex flex-col items-center text-center group transition-all ${
                      selectedSlug === spec.slug
                        ? "scale-110"
                        : "hover:scale-105"
                    }`}
                  >
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                        selectedSlug === spec.slug
                          ? "bg-orange-500 text-white ring-4 ring-orange-200"
                          : "bg-orange-100 group-hover:bg-orange-200 text-orange-600"
                      }`}
                    >
                      {renderSpecialtyIcon(spec, "w-full h-full rounded-full")}
                      {!spec.icon && renderFallbackIcon("🏥")}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium transition-colors ${
                        selectedSlug === spec.slug
                          ? "text-orange-600"
                          : "text-gray-800 group-hover:text-orange-600"
                      }`}
                    >
                      {spec.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Other Services */}
        {viewMode === "all" && otherSpecialties.length > 0 && (
          <>
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-400 text-sm">Other Services</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
              {otherSpecialties.map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => setSelectedSlug(spec.slug)}
                  className={`flex flex-col items-center text-center group transition-all ${
                    selectedSlug === spec.slug ? "scale-110" : "hover:scale-105"
                  }`}
                >
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                      selectedSlug === spec.slug
                        ? "bg-purple-600 text-white ring-4 ring-purple-200"
                        : "bg-purple-100 group-hover:bg-purple-200 text-purple-600"
                    }`}
                  >
                    {renderSpecialtyIcon(spec, "w-full h-full rounded-full")}
                    {!spec.icon && renderFallbackIcon("📋")}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium transition-colors ${
                      selectedSlug === spec.slug
                        ? "text-purple-600"
                        : "text-gray-800 group-hover:text-purple-600"
                    }`}
                  >
                    {spec.name}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        <div className="mt-8 flex justify-end">
          <button
            disabled={!selectedSlug}
            onClick={handleSelectSpecialty}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
          >
            Continue
          </button>
        </div>
      </section>
    </>
  );
}

export default StepSpecialty;
