/** @format */

import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  Heart,
  Plus,
  Search,
  ChevronRight,
  Edit,
  Eye,
  Settings,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080/api";

export default function ManageBookingCategories() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [generalSpecialties, setGeneralSpecialties] = useState([]);
  const [specialistSpecialties, setSpecialistSpecialties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, specRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/service-categories`),
        axios.get(`${API_BASE_URL}/specialties?isActive=true`),
      ]);

      const allCategories = catRes.data?.data || [];
      const allSpecialties = specRes.data?.data || [];

      setCategories(allCategories);

      const generalCat = allCategories.find((c) => c.slug === "kham-tong-quat");
      const specialistCat = allCategories.find(
        (c) => c.slug === "kham-chuyen-khoa",
      );

      setGeneralSpecialties(
        allSpecialties.filter((s) => s.categoryId === generalCat?.id),
      );
      setSpecialistSpecialties(
        allSpecialties.filter((s) => s.categoryId === specialistCat?.id),
      );
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewGeneral = () => {
    navigate("/booking");
  };

  const handlePreviewSpecialist = () => {
    navigate("/booking");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Booking Categories
          </h1>
          <p className="text-gray-600 mt-2">
            Display settings for "General Check-up" and "Specialist Check-up" on
            the appointment booking page.
          </p>
        </div>

        {/* Flow Description */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <h3 className="font-semibold text-blue-800 mb-2">Booking Flow</h3>
          <div className="flex items-center gap-4 text-sm text-blue-700">
            <span className="flex items-center gap-1">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </span>
              Choose service/specialty
            </span>
            <ArrowRight className="w-4 h-4" />
            <span className="flex items-center gap-1">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </span>
              Choose doctor
            </span>
            <ArrowRight className="w-4 h-4" />
            <span className="flex items-center gap-1">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </span>
              Choose clinic
            </span>
            <ArrowRight className="w-4 h-4" />
            <span className="flex items-center gap-1">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                4
              </span>
              Book appointment
            </span>
          </div>
        </div>

        {/* 2 Main Groups */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Khám Tổng Quát */}
          <div className="bg-white rounded-2xl border-2 border-blue-200 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-5 text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">General Check-up</h2>
                  <p className="text-blue-100 mt-1">
                    {generalSpecialties.length} services
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <p className="text-gray-600 text-sm mb-4">
                Users select the <strong>general check-up service</strong> (eye
                exam, dental check-up, vaccinations, etc.) first, and then
                choose the clinic and doctor.
              </p>

              {/* Danh sách dịch vụ */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Services within the group:
                </h4>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {generalSpecialties.map((spec) => (
                    <button
                      key={spec.id}
                      onClick={() => navigate("/admin/specialty")}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition"
                    >
                      {spec.name}
                    </button>
                  ))}
                  {generalSpecialties.length === 0 && (
                    <span className="text-gray-400 text-sm">No services</span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => navigate("/admin/specialty")}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  <Edit className="w-4 h-4" />
                  Manage services
                </button>
                <button
                  onClick={handlePreviewGeneral}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              </div>
            </div>
          </div>

          {/* Khám Chuyên Khoa */}
          <div className="bg-white rounded-2xl border-2 border-orange-200 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5 text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Heart className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Specialist Check-up</h2>
                  <p className="text-orange-100 mt-1">
                    {specialistSpecialties.length} specialties
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <p className="text-gray-600 text-sm mb-4">
                Users select the <strong>specialist check-up</strong> (heart,
                nervous system, dermatology, etc.) first, and then choose the
                clinic and doctor.
              </p>

              {/* Danh sách chuyên khoa */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Specialties in the group:
                </h4>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {specialistSpecialties.map((spec) => (
                    <button
                      key={spec.id}
                      onClick={() => navigate("/admin/specialty")}
                      className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm hover:bg-orange-100 transition"
                    >
                      {spec.name}
                    </button>
                  ))}
                  {specialistSpecialties.length === 0 && (
                    <span className="text-gray-400 text-sm">
                      No specialties
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => navigate("/admin/specialty")}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  <Edit className="w-4 h-4" />
                  Manage specialties
                </button>
                <button
                  onClick={handlePreviewSpecialist}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/admin/specialty")}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition"
            >
              <Stethoscope className="w-8 h-8 text-blue-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-800">Specialties</p>
                <p className="text-xs text-gray-500">Manage all</p>
              </div>
            </button>
            <button
              onClick={() => navigate("/admin/service-categories")}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition"
            >
              <Settings className="w-8 h-8 text-green-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-800">
                  Service Categories
                </p>
                <p className="text-xs text-gray-500">Categories</p>
              </div>
            </button>
            <button
              onClick={() => navigate("/admin/clinic")}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition"
            >
              <Eye className="w-8 h-8 text-purple-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-800">Clinics</p>
                <p className="text-xs text-gray-500">Facility Management</p>
              </div>
            </button>
            <button
              onClick={() => navigate("/admin/doctor-clinic")}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition"
            >
              <ChevronRight className="w-8 h-8 text-red-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-800">
                  Assign Doctor-Specialty
                </p>
                <p className="text-xs text-gray-500">Assign</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
