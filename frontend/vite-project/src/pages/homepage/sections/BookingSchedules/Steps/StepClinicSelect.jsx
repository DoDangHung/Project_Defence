import React, { useState, useEffect } from 'react';
import { Search, Building2, MapPin, Phone, Clock, Hospital, Stethoscope } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function StepClinicSelect() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'hospital', 'clinic'
  const [cityFilter, setCityFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/clinics?limit=50&isActive=true');
        if (res.data?.data) {
          setClinics(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load clinics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClinics();
  }, []);

  // Get unique cities from clinics
  const cities = ['all', ...new Set(clinics.map(c => c.city).filter(Boolean))];

  // Filter clinics
  const filteredClinics = clinics.filter(clinic => {
    const matchesSearch = clinic.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = cityFilter === 'all' || clinic.city === cityFilter;
    const matchesType = typeFilter === 'all' || clinic.type === typeFilter;
    return matchesSearch && matchesCity && matchesType;
  });

  const handleSelectClinic = (clinic) => {
    const booking = JSON.parse(localStorage.getItem('booking')) || {};
    localStorage.setItem(
      'booking',
      JSON.stringify({
        ...booking,
        clinicId: clinic.id,
        clinicName: clinic.name,
        clinicAddress: clinic.address,
        clinicCity: clinic.city,
      }),
    );
    navigate(`/clinic-booking/${clinic.slug}/specialties`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Đang tải danh sách cơ sở y tế...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Chọn cơ sở y tế</h2>
        <p className="text-gray-600">Chọn bệnh viện hoặc phòng khám bạn muốn đặt lịch khám</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm bệnh viện, phòng khám..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Type Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setTypeFilter('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              typeFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setTypeFilter('hospital')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              typeFilter === 'hospital'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Hospital className="w-4 h-4" />
            Bệnh viện
          </button>
          <button
            onClick={() => setTypeFilter('clinic')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              typeFilter === 'clinic'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            Phòng khám
          </button>
        </div>

        {/* City Filter */}
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setCityFilter(city)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                cityFilter === city
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {city === 'all' ? 'Tất cả' : city}
            </button>
          ))}
        </div>
      </div>

      {/* Clinics Grid */}
      {filteredClinics.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Không tìm thấy cơ sở y tế nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClinics.map((clinic) => (
            <button
              key={clinic.id}
              onClick={() => handleSelectClinic(clinic)}
              className="bg-white rounded-2xl border-2 border-gray-200 p-5 hover:border-blue-500 hover:shadow-lg transition-all text-left group"
            >
              {/* Logo */}
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 text-3xl ${
                clinic.type === 'hospital' ? 'bg-red-100' : 'bg-green-100'
              }`}>
                {clinic.type === 'hospital' ? '🏥' : '🏨'}
              </div>

              {/* Type Badge */}
              <div className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 ${
                clinic.type === 'hospital' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`}>
                {clinic.type === 'hospital' ? 'Bệnh viện' : 'Phòng khám'}
              </div>

              {/* Info */}
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                {clinic.name}
              </h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                {clinic.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{[clinic.address, clinic.ward, clinic.district, clinic.city].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                
                {clinic.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>{clinic.phone}</span>
                  </div>
                )}
                
                {clinic.openingTime && clinic.closingTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{clinic.openingTime} - {clinic.closingTime}</span>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-blue-600 font-semibold text-sm group-hover:underline">
                  Chọn cơ sở y tế →
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Count */}
      <p className="text-center text-gray-500 mt-6">
        Hiển thị {filteredClinics.length} / {clinics.length} cơ sở y tế
      </p>
    </div>
  );
}
