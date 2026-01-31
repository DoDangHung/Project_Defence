import React, { useEffect, useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useOutletContext } from 'react-router-dom';

function StepSpecialty() {
  // Nhận data từ parent Booking component
  const { specialties, handleInputChange, bookingData } = useOutletContext();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [specialty, SetSpecialty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/specialty')
      .then((res) => {
        console.log('data from specialty: ', res.data);
        SetSpecialty(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Can't load data from specialty", err.message);
      });
  }, []);

  const handleSelectSpecialty = () => {
    if (!selectedSlug) {
      alert('Vui lòng chọn chuyên khoa');
      return;
    }

    // Tìm specialty object từ selectedSlug
    const selectedSpecialty = specialty.find(
      (spec) => spec.slug === selectedSlug,
    );

    if (!selectedSpecialty) {
      alert('Không tìm thấy thông tin chuyên khoa');
      return;
    }

    const booking = JSON.parse(localStorage.getItem('booking')) || {};
    localStorage.setItem(
      'booking',
      JSON.stringify({
        ...booking,
        specialtyId: selectedSpecialty.id,
        specialtyName: selectedSpecialty.name,
        specialtySlug: selectedSpecialty.slug,
      }),
    );

    console.log('✅ Saved specialty:', selectedSpecialty); // Debug
    navigate(`/booking/clinics/${selectedSlug}`);
  };
  const normalizeSlug = (slug) => slug?.toLowerCase().trim();
  const DEFAULT_SPECIALTY_IMAGE =
    'https://cdn-pkh.longvan.net/medpro-production/default/avatar/ChuyenKhoa.png';
  return (
    <>
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-center text-xl font-semibold mb-10">CHUYÊN KHOA</h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
          {specialty.map((spec) => (
            <button
              key={spec.id}
              onClick={() => setSelectedSlug(spec.slug)}
              className="flex flex-col items-center text-center group"
            >
              {/* ICON CIRCLE */}
              <div
                className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center 
                      group-hover:bg-sky-200 transition"
              >
                <img
                  src={spec.image || DEFAULT_SPECIALTY_IMAGE}
                  alt={spec.name}
                  className="w-15 h-15 object-contain"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_SPECIALTY_IMAGE;
                  }}
                />
              </div>

              {/* LABEL */}
              <span className="mt-2 text-sm text-gray-800 group-hover:text-sky-600">
                {spec.name}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <button
            disabled={!selectedSlug}
            onClick={handleSelectSpecialty}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
          >
            Tiếp tục
          </button>
        </div>
      </section>

      {/* <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg z-50 hover:bg-blue-700 transition-all hover:scale-110"
      >
        <Filter className="w-6 h-6" />
      </button>

      <div className="flex gap-6 relative">
        <aside className="hidden lg:block w-80 flex-shrink-0"></aside>

        <div className="flex-1">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Chọn chuyên khoa
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {specialty.map((spec) => {
                const icon =
                  specialties.find((s) => s.id === normalizeSlug(spec.slug))
                    ?.icon || '🏥';
                return (
                  <button
                    key={spec.id}
                    onClick={() => setSelectedSlug(spec.slug)}
                    className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                      selectedSlug === spec.slug
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{icon}</div>
                    <div className="font-medium text-gray-800">{spec.name}</div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                disabled={!selectedSlug}
                onClick={handleSelectSpecialty}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}

export default StepSpecialty;
