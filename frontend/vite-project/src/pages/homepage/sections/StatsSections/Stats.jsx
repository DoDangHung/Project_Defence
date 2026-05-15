import React, { useState, useEffect } from 'react';
import { ShieldCheck, CreditCard, CalendarCheck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';

const ASSETS_BASE_URL = 'http://localhost:8080';

const normalizeImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `${ASSETS_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

function Stats() {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/clinics?limit=4&isActive=true');
        const data = await res.json();
        if (data.success && data.data) {
          setClinics(data.data);
        }
      } catch (err) {
        console.error('Failed to load clinics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClinics();
  }, []);

  const handleClinicClick = (clinic) => {
    navigate(`/clinic/${clinic.slug}/specialties`);
  };

  const trustItems = [
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: 'Easy appointment booking',
      desc: 'Book medical appointments online quickly and easily from home.',
    },
    {
      icon: <CalendarCheck className="w-7 h-7" />,
      title: '300+ specialist doctors',
      desc: 'Experienced and dedicated medical professionals.',
    },
    {
      icon: <CreditCard className="w-7 h-7" />,
      title: 'Pay at the facility',
      desc: 'No hidden fees beyond the announced consultation fee.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      <h2 className="text-center text-xl font-semibold mb-10">
        FEATURED CLINICS THIS MONTH
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
          <span className="ml-2 text-gray-500">Loading facilities...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {clinics.map((clinic) => (
            <div
              key={clinic.id}
              onClick={() => handleClinicClick(clinic)}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col items-center text-center cursor-pointer"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-3 overflow-hidden">
                {clinic.logo ? (
                  <img
                    src={normalizeImageUrl(clinic.logo)}
                    alt={clinic.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <span
                  className={`text-3xl w-full h-full flex items-center justify-center ${clinic.logo ? 'hidden' : ''}`}
                >
                  🏥
                </span>
              </div>
              <h3 className="font-semibold text-sm text-gray-800">{clinic.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{clinic.address || clinic.district || ''}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-xs font-medium text-gray-600">
                  {clinic.avgRating ? clinic.avgRating.toFixed(1) : '4.5'}
                </span>
              </div>
              <button className="mt-3 w-full bg-sky-500 hover:bg-sky-600 text-white text-sm py-2 rounded-lg font-medium transition">
                Book now
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mb-14">
        <a href="/doctors" className="text-sky-600 text-sm font-medium">
          View all →
        </a>
      </div>

      <h2 className="text-center text-2xl font-bold text-gray-900 mb-10">
        Healthcare You Can Trust
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {trustItems.map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 mb-4">
              {item.icon}
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;
