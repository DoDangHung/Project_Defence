import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router';

const ASSETS_BASE_URL = 'http://localhost:8080';

const normalizeImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `${ASSETS_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default function CollabClinic() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerSlide = 6;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/clinics?limit=20&isActive=true');
        console.log('Clinics API response:', res.data);
        if (res.data?.data) {
          console.log('First clinic logo:', res.data.data[0]?.logo);
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

  const totalSlides = Math.ceil(clinics.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleClinicClick = (clinic) => {
    navigate(`/clinic/${clinic.slug}/specialties`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-6 ">
      <h2 className="text-center text-2xl lg:text-3xl font-bold text-blue-900 mb-12">
        TRUSTED & COLLABORATED PARTNERS
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading medical facilities...</span>
        </div>
      ) : clinics.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No medical facilities linked yet
        </div>
      ) : (
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="min-w-full">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                    {clinics
                      .slice(
                        slideIndex * itemsPerSlide,
                        slideIndex * itemsPerSlide + itemsPerSlide
                      )
                      .map((clinic) => (
                      <div
                        key={clinic.id}
                        onClick={() => handleClinicClick(clinic)}
                        className="flex flex-col items-center text-center cursor-pointer hover:scale-105 transition"
                      >
                        <div className="w-20 h-20 mb-4 rounded-full bg-blue-100 shadow flex items-center justify-center overflow-hidden">
                          {clinic.logo ? (
                            <>
                              <img
                                src={normalizeImageUrl(clinic.logo)}
                                alt={clinic.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.log('Logo load error, URL:', clinic.logo);
                                  e.target.style.display = 'none';
                                  e.target.nextSibling && (e.target.nextSibling.style.display = 'flex');
                                }}
                              />
                            </>
                          ) : null}
                          <span
                            className={`text-3xl w-full h-full flex items-center justify-center ${clinic.logo ? 'hidden' : ''}`}
                          >
                            🏥
                          </span>
                        </div>
                          <p className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[2.5rem]">
                            {clinic.name}
                          </p>
                          <CheckCircle className="w-4 h-4 text-blue-500 mt-1" />
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow hover:bg-gray-50 transition"
              >
                <ChevronLeft className="w-5 h-5 text-blue-600" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow hover:bg-gray-50 transition"
              >
                <ChevronRight className="w-5 h-5 text-blue-600" />
              </button>
            </>
          )}
        </div>
      )}

      {totalSlides > 1 && (
        <div className="flex justify-center mt-8">
          <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{
                width: `${((currentSlide + 1) / totalSlides) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
