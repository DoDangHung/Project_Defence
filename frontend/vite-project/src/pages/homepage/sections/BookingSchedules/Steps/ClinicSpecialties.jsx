import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Clock, 
  Loader2,
  Stethoscope,
  Users
} from 'lucide-react';
import axios from 'axios';

const ASSETS_URL = 'http://localhost:8080';

// Normalize image URL with cache busting
const normalizeImageUrl = (url, timestamp) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}_t=${timestamp}`;
  }
  const baseUrl = `${ASSETS_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}_t=${timestamp}`;
};

export default function ClinicSpecialties() {
  const { clinicSlug } = useParams();
  const navigate = useNavigate();
  
  const [clinic, setClinic] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  useEffect(() => {
    const fetchClinicSpecialties = async () => {
      if (!clinicSlug) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const res = await axios.get(
          `http://localhost:8080/api/specialties/clinic/slug/${clinicSlug}?_t=${Date.now()}`,
          { headers: { 'Cache-Control': 'no-cache' } }
        );
        
        if (res.data?.success) {
          const { clinic: clinicData, specialties: specsData } = res.data.data;
          setClinic(clinicData);
          setSpecialties(specsData);
          setRefreshKey(Date.now());
        } else {
          setError('Không tìm thấy thông tin cơ sở y tế');
        }
      } catch (err) {
        console.error('Error fetching clinic specialties:', err);
        setError(err.response?.data?.message || 'Không thể tải thông tin cơ sở y tế');
      } finally {
        setLoading(false);
      }
    };

    fetchClinicSpecialties();
    
    // Refresh data every 30 seconds to pick up changes from admin uploads
    const interval = setInterval(() => {
      fetchClinicSpecialties();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [clinicSlug]);

  const handleSpecialtyClick = (specialty) => {
    navigate(`/specialty/${specialty.slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <span className="ml-3 text-lg text-gray-600">Đang tải thông tin cơ sở y tế...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !clinic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-6xl mb-4">🏥</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Không tìm thấy cơ sở y tế
            </h2>
            <p className="text-gray-600 mb-6">{error || 'Vui lòng thử lại sau.'}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Quay về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header Section - Clinic Info */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-100 hover:text-white mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay về trang chủ
          </button>

          {/* Clinic Info Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex flex-col md:flex-row gap-6">
            {/* Logo */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white shadow-lg flex items-center justify-center overflow-hidden shrink-0 mx-auto md:mx-0">
              {clinic.logo ? (
                <img
                  src={normalizeImageUrl(clinic.logo, refreshKey)}
                  alt={clinic.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <span className={`text-4xl ${clinic.logo ? 'hidden' : ''}`} style={{ display: clinic.logo ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>🏥</span>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{clinic.name}</h1>
              
              <div className="space-y-2 mt-4">
                {clinic.address && (
                  <div className="flex items-center justify-center md:justify-start text-blue-100">
                    <MapPin className="w-5 h-5 mr-2 shrink-0" />
                    <span>
                      {[clinic.address, clinic.ward, clinic.district, clinic.city]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                )}
                
                {clinic.phone && (
                  <div className="flex items-center justify-center md:justify-start text-blue-100">
                    <Phone className="w-5 h-5 mr-2 shrink-0" />
                    <span>{clinic.phone}</span>
                  </div>
                )}
                
                {clinic.openingTime && clinic.closingTime && (
                  <div className="flex items-center justify-center md:justify-start text-blue-100">
                    <Clock className="w-5 h-5 mr-2 shrink-0" />
                    <span>
                      Giờ làm việc: {clinic.openingTime} - {clinic.closingTime}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specialties Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Chuyên khoa khám bệnh
          </h2>
          <p className="text-gray-600">
            {specialties.length} chuyên khoa có sẵn tại {clinic.name}
          </p>
        </div>

        {specialties.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Chưa có chuyên khoa nào
            </h3>
            <p className="text-gray-600">
              Cơ sở y tế này hiện chưa cập nhật danh sách chuyên khoa.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {specialties.map((specialty) => (
              <button
                key={specialty.id}
                onClick={() => handleSpecialtyClick(specialty)}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl p-5 flex flex-col items-center text-center transition-all hover:scale-105 group"
              >
                {/* Icon Circle - Show uploaded icon or fallback */}
                <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center mb-4 group-hover:bg-sky-200 transition-colors overflow-hidden">
                  {specialty.icon ? (
                    <img
                      src={normalizeImageUrl(specialty.icon, refreshKey)}
                      alt={specialty.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <span className={`text-3xl ${specialty.icon ? 'hidden' : ''}`} style={{ display: specialty.icon ? 'none' : 'flex' }}>⚕️</span>
                </div>

                {/* Name */}
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.5rem]">
                  {specialty.name}
                </h3>

                {/* Doctor Count */}
                {specialty.doctorCount > 0 && (
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{specialty.doctorCount} bác sĩ</span>
                  </div>
                )}

                {/* Arrow Icon */}
                <div className="mt-3 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Stethoscope className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
