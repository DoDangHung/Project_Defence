import React, { useState, useEffect } from 'react';
import { Eye, Stethoscope, Heart, Brain, Bone, Baby, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';

const API_URL = 'http://localhost:8080/api';
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

function SpecialtySections() {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const getSpecialtyIcon = (name) => {
    const lower = (name || '').toLowerCase();
    if (lower.includes('mắt') || lower.includes('nhãn') || lower.includes('eye')) return <Eye className="w-7 h-7" />;
    if (lower.includes('răng') || lower.includes('nha') || lower.includes('dental')) return <Stethoscope className="w-7 h-7" />;
    if (lower.includes('tim') || lower.includes('mạch') || lower.includes('heart')) return <Heart className="w-7 h-7" />;
    if (lower.includes('tâm') || lower.includes('thần') || lower.includes('thần kinh') || lower.includes('neuro')) return <Brain className="w-7 h-7" />;
    if (lower.includes('xương') || lower.includes('khớp') || lower.includes('cơ') || lower.includes('bone')) return <Bone className="w-7 h-7" />;
    if (lower.includes('nhi') || lower.includes('trẻ') || lower.includes('child')) return <Baby className="w-7 h-7" />;
    return <Stethoscope className="w-7 h-7" />;
  };

  const getSpecialtyColor = (name) => {
    const lower = (name || '').toLowerCase();
    if (lower.includes('mắt') || lower.includes('nhãn') || lower.includes('eye')) return 'bg-blue-50 text-blue-500';
    if (lower.includes('răng') || lower.includes('nha') || lower.includes('dental')) return 'bg-green-50 text-green-500';
    if (lower.includes('tim') || lower.includes('mạch') || lower.includes('heart')) return 'bg-red-50 text-red-500';
    if (lower.includes('tâm') || lower.includes('thần') || lower.includes('thần kinh') || lower.includes('neuro')) return 'bg-purple-50 text-purple-500';
    if (lower.includes('xương') || lower.includes('khớp') || lower.includes('cơ') || lower.includes('bone')) return 'bg-orange-50 text-orange-500';
    if (lower.includes('nhi') || lower.includes('trẻ') || lower.includes('child')) return 'bg-pink-50 text-pink-500';
    return 'bg-sky-50 text-sky-500';
  };

  const getFallbackIconContainer = (spec) => {
    const iconUrl = spec.icon;
    if (iconUrl) {
      return (
        <>
          <img
            src={normalizeImageUrl(iconUrl, refreshKey)}
            alt={spec.name}
            className="w-10 h-10 rounded-lg object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const container = e.currentTarget.parentElement;
              if (container) {
                const fallback = container.querySelector('.fallback-icon');
                if (fallback) fallback.style.display = 'flex';
              }
            }}
          />
          <span className="fallback-icon" style={{ display: 'none' }}>
            {getSpecialtyIcon(spec.name)}
          </span>
        </>
      );
    }
    return getSpecialtyIcon(spec.name);
  };

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await fetch(`${API_URL}/specialties?isActive=true&_t=${Date.now()}`, {
          cache: 'no-store' // Disable cache for fresh data
        });
        const data = await res.json();
        if (data.success && data.data) {
          setSpecialties(data.data.slice(0, 6));
        } else if (Array.isArray(data.data?.items)) {
          setSpecialties(data.data.items.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load specialties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialties();
    
    // Refresh data every 30 seconds to pick up changes
    const interval = setInterval(() => {
      setRefreshKey(Date.now());
      fetchSpecialties();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSpecialtyClick = (spec) => {
    navigate(`/specialty/${spec.slug}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Specialties
        </h2>
        <p className="text-gray-500">
          Explore our top medical specialties
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {specialties.map((spec) => (
            <div
              key={spec.id}
              onClick={() => handleSpecialtyClick(spec)}
              className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col items-center text-center cursor-pointer hover:shadow-lg hover:border-sky-200 transition-all group"
            >
              <div
                className={`w-16 h-16 rounded-2xl ${getSpecialtyColor(spec.name)} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform overflow-hidden`}
              >
                {getFallbackIconContainer(spec)}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{spec.name}</h3>
              {spec.description && (
                <p className="text-xs text-gray-400 leading-tight line-clamp-2">{spec.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <a href="/services" className="inline-flex items-center gap-2 text-sky-600 font-medium hover:text-sky-700 transition">
          View all specialties
          <span>→</span>
        </a>
      </div>
    </section>
  );
}

export default SpecialtySections;
