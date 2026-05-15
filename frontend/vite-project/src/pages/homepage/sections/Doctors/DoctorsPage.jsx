/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Star,
  MapPin,
  Calendar,
  Loader2,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";

const ratingDoctors = [
  {
    id: 1,
    name: "BS. Nguyễn Văn Minh",
    specialty: "Tim mạch",
    clinic: "Phòng khám Đa khoa Quốc tế",
    rating: 4.9,
    reviews: 234,
    years: 15,
    avatar: null,
  },
  {
    id: 2,
    name: "BS. Trần Thị Lan",
    specialty: "Nhi khoa",
    clinic: "Bệnh viện Nhi Đồng 1",
    rating: 4.8,
    reviews: 189,
    years: 12,
    avatar: null,
  },
  {
    id: 3,
    name: "BS. Lê Hoàng Nam",
    specialty: "Ngoại thần kinh",
    clinic: "Bệnh viện Chợ Rẫy",
    rating: 4.9,
    reviews: 312,
    years: 20,
    avatar: null,
  },
  {
    id: 4,
    name: "BS. Phạm Minh Châu",
    specialty: "Sản phụ khoa",
    clinic: "Bệnh viện Từ Dũ",
    rating: 4.7,
    reviews: 156,
    years: 10,
    avatar: null,
  },
  {
    id: 5,
    name: "BS. Hoàng Đức Trung",
    specialty: "Ortopedic",
    clinic: "Bệnh viện Hùng Vương",
    rating: 4.8,
    reviews: 203,
    years: 18,
    avatar: null,
  },
  {
    id: 6,
    name: "BS. Đặng Thu Hà",
    specialty: "Da liễu",
    clinic: "Phòng khám Da liễu Trung Sơn",
    rating: 4.6,
    reviews: 98,
    years: 8,
    avatar: null,
  },
];

function DoctorsPage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/doctors?isActive=true",
        );
        const data = await res.json();
        let items = [];
        if (data.success && data.data) {
          items = Array.isArray(data.data) ? data.data : data.data.items || [];
        }
        setDoctors(items.slice(0, 12));
      } catch (err) {
        setDoctors(ratingDoctors);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const getName = (doctor) => {
    if (doctor.user)
      return `${doctor.user.firstName || ""} ${doctor.user.lastName || ""}`.trim();
    return doctor.name || "Bác sĩ";
  };

  const getSpecialty = (doctor) => {
    if (doctor.specialties?.length > 0) return doctor.specialties[0].name;
    if (doctor.specialization) return doctor.specialization;
    return doctor.specialty || "Chuyên khoa";
  };

  const getClinic = (doctor) => {
    if (doctor.clinics?.length > 0) return doctor.clinics[0].name;
    if (doctor.clinic) return doctor.clinic.name;
    return "Phòng khám";
  };

  const getRating = (doctor) => {
    if (doctor.avgRating) return parseFloat(doctor.avgRating).toFixed(1);
    return "4.8";
  };

  const getReviews = (doctor) => {
    if (doctor.totalFeedbacks) return doctor.totalFeedbacks;
    if (doctor.feedbacks?.length) return doctor.feedbacks.length;
    return Math.floor(Math.random() * 200) + 50;
  };

  const getAvatar = (doctor) => {
    if (doctor.user?.avatar) return doctor.user.avatar;
    return null;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-sky-700 to-sky-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our team of doctors</h1>
          <p className="text-sky-100 text-lg max-w-2xl mx-auto">
            More than 300 specialized doctors with rich experience from leading
            medical facilities, ready to serve you.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Find doctors by name, specialty, etc."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 text-sm"
              />
            </div>
            <div className="flex gap-3">
              <select className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 text-gray-600">
                <option>All specialties</option>
                <option>Cardiology</option>
                <option>Pediatrics</option>
                <option>Neurology</option>
                <option>Obstetrics and Gynecology</option>
              </select>
              <select className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 text-gray-600">
                <option>All locations</option>
                <option>Ho Chi Minh City</option>
                <option>Hanoi</option>
                <option>Da Nang</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900">
            {loading ? "Loading..." : `${doctors.length} doctors`}
          </h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium">
              Featured
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">
              Rating
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group"
              >
                <div className="p-6 flex gap-4">
                  <div className="flex-shrink-0">
                    {getAvatar(doctor) ? (
                      <img
                        src={getAvatar(doctor)}
                        alt={getName(doctor)}
                        className="w-20 h-20 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-500 text-2xl font-bold">
                        {getName(doctor).charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-base mb-1 truncate">
                      {getName(doctor)}
                    </h3>
                    <p className="text-sky-600 text-sm font-medium mb-1">
                      {getSpecialty(doctor)}
                    </p>
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-gray-800">
                        {getRating(doctor)}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({getReviews(doctor)} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{getClinic(doctor)}</span>
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-4 flex gap-2">
                  <button
                    onClick={() => navigate(`/doctor/${doctor.id}`)}
                    className="flex-1 py-2 border border-sky-500 text-sky-600 rounded-xl text-sm font-medium hover:bg-sky-50 transition"
                  >
                    View profile
                  </button>
                  <button
                    onClick={() => navigate(`/booking`)}
                    className="flex-1 py-2 bg-sky-500 text-white rounded-xl text-sm font-medium hover:bg-sky-600 transition flex items-center justify-center gap-1"
                  >
                    <Calendar className="w-4 h-4" />
                    Book appointment
                  </button>
                </div>
              </div>
            ))}
            {doctors.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-400">
                No doctors found
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default DoctorsPage;
