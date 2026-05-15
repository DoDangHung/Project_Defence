import React, { useState, useEffect } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';

function DoctorSections() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/doctors?limit=3');
        const data = await res.json();

        let items = [];
        if (data.success && data.data) {
          items = Array.isArray(data.data) ? data.data : (data.data.items || []);
        }

        setDoctors(items.slice(0, 3));
      } catch (err) {
        console.error('Failed to load doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const getRating = (doctor) => {
    if (doctor.avgRating) return doctor.avgRating;
    if (doctor.feedbacks?.length > 0) {
      const sum = doctor.feedbacks.reduce((acc, f) => acc + f.rating, 0);
      return (sum / doctor.feedbacks.length).toFixed(1);
    }
    return '4.5';
  };

  const getFullName = (doctor) => {
    if (doctor.user) {
      return `${doctor.user.firstName || ''} ${doctor.user.lastName || ''}`.trim();
    }
    return doctor.name || 'Doctor';
  };

  const getSpecialty = (doctor) => {
    if (doctor.specialties?.length > 0) return doctor.specialties[0].name;
    if (doctor.specialization) return doctor.specialization;
    return 'Specialist';
  };

  const getClinic = (doctor) => {
    if (doctor.clinics?.length > 0) return doctor.clinics[0].name;
    if (doctor.clinic) return doctor.clinic.name;
    return '';
  };

  const getAvatar = (doctor) => {
    if (doctor.user?.avatar) return doctor.user.avatar;
    return null;
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Doctors Ready to Serve You
          </h2>
          <p className="text-gray-500 text-sm">
            Experienced and dedicated medical professionals
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No doctors available
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-6 flex flex-col items-center text-center"
              >
                <div className="relative mb-4">
                  {getAvatar(doctor) ? (
                    <img
                      src={getAvatar(doctor)}
                      alt={getFullName(doctor)}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-sky-100 border-4 border-white shadow flex items-center justify-center text-sky-500 text-3xl font-bold">
                      {getFullName(doctor).charAt(0)}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-sky-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-current" />
                    {getRating(doctor)}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {getFullName(doctor)}
                </h3>
                <p className="text-sky-600 font-medium text-sm mb-1">
                  {getSpecialty(doctor)}
                </p>
                {getClinic(doctor) && (
                  <p className="text-gray-500 text-xs mb-4">{getClinic(doctor)}</p>
                )}

                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => navigate(`/doctor/${doctor.id}`)}
                    className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg text-sm font-medium transition"
                  >
                    View profile
                  </button>
                  <button
                    onClick={() => navigate('/booking')}
                    className="flex-1 border border-sky-500 text-sky-600 hover:bg-sky-50 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Book now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <a href="/doctors" className="inline-flex items-center gap-2 text-sky-600 font-medium hover:text-sky-700 transition">
            View all doctors →
          </a>
        </div>
      </div>
    </section>
  );
}

export default DoctorSections;
