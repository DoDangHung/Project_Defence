/** @format */

import React, { useState, useEffect } from "react";
import { ChevronRight, Stethoscope, Heart, Eye, Smile, Syringe, Brain, Bone, Baby, TestTube, BrainCircuit, Salad } from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";

function HeroSections() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [generalSpecialties, setGeneralSpecialties] = useState([]);
  const [specialistSpecialties, setSpecialistSpecialties] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, specialtyRes] = await Promise.all([
          axios.get('http://localhost:8080/api/service-categories?isActive=true'),
          axios.get('http://localhost:8080/api/specialties?isActive=true'),
        ]);
        const allCategories = categoryRes.data?.data || [];
        const allSpecialties = specialtyRes.data?.data || [];

        setCategories(allCategories);

        const generalCat = allCategories.find(c => c.slug === 'kham-tong-quat');
        const specialistCat = allCategories.find(c => c.slug === 'kham-chuyen-khoa');

        setGeneralSpecialties(
          allSpecialties.filter(s => s.categoryId === generalCat?.id)
        );
        setSpecialistSpecialties(
          allSpecialties.filter(s => s.categoryId === specialistCat?.id)
        );
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };
    fetchData();
  }, []);

  const handleSelectService = (category) => {
    const booking = JSON.parse(localStorage.getItem('booking')) || {};
    localStorage.setItem('booking', JSON.stringify({
      ...booking,
      categoryId: category.id,
      categoryName: category.name,
      categorySlug: category.slug,
    }));
    navigate(`/booking/services/${category.slug}`);
  };

  const handleSelectSpecialty = (spec) => {
    const booking = JSON.parse(localStorage.getItem('booking')) || {};
    localStorage.setItem('booking', JSON.stringify({
      ...booking,
      specialtyId: spec.id,
      specialtyName: spec.name,
      specialtySlug: spec.slug,
      categoryId: spec.categoryId,
    }));
    navigate(`/specialty/${spec.slug}`);
  };

  const getSpecialtyIcon = (name) => {
    const lowerName = (name || '').toLowerCase();
    if (lowerName.includes('mắt') || lowerName.includes('nhãn')) return <Eye className="w-4 h-4" />;
    if (lowerName.includes('răng') || lowerName.includes('nha')) return <Smile className="w-4 h-4" />;
    if (lowerName.includes('tiêm') || lowerName.includes('chủng')) return <Syringe className="w-4 h-4" />;
    if (lowerName.includes('tâm') || lowerName.includes('thần')) return <Brain className="w-4 h-4" />;
    if (lowerName.includes('xương') || lowerName.includes('khớp')) return <Bone className="w-4 h-4" />;
    if (lowerName.includes('nhi') || lowerName.includes('trẻ em')) return <Baby className="w-4 h-4" />;
    return <Stethoscope className="w-4 h-4" />;
  };

  const getCategoryIcon = (category) => {
    const lowerName = (category.name || '').toLowerCase();
    if (lowerName.includes('tổng quát')) return <Stethoscope className="w-6 h-6" />;
    if (lowerName.includes('chuyên khoa')) return <Heart className="w-6 h-6" />;
    if (lowerName.includes('mắt')) return <Eye className="w-6 h-6" />;
    if (lowerName.includes('nha')) return <Smile className="w-6 h-6" />;
    if (lowerName.includes('tiêm')) return <Syringe className="w-6 h-6" />;
    if (lowerName.includes('tâm')) return <Brain className="w-6 h-6" />;
    if (lowerName.includes('xương')) return <Bone className="w-6 h-6" />;
    if (lowerName.includes('xét nghiệm')) return <TestTube className="w-6 h-6" />;
    if (lowerName.includes('tinh thần')) return <BrainCircuit className="w-6 h-6" />;
    if (lowerName.includes('dinh dưỡng')) return <Salad className="w-6 h-6" />;
    return <Stethoscope className="w-6 h-6" />;
  };

  const getCategoryColor = (category) => {
    return category.color || '#3B82F6';
  };

  return (
    <>
      <section
        className="relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1586773860418-d37222d8fce3)",
        }}
      >
        <div className="absolute inset-0 bg-sky-900/40"></div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center text-white">
          <h1 className="text-2xl md:text-4xl font-bold">
            Connecting People with Top-Quality Healthcare Services
          </h1>

          {/* Search */}
          <div className="mt-8 max-w-3xl mx-auto bg-white rounded-full flex overflow-hidden shadow-lg">
            <input
              type="text"
              placeholder="Search for doctors, hospitals, specialties..."
              className="flex-1 px-5 py-3 text-gray-800 focus:outline-none"
            />
            <button className="bg-sky-600 px-6 text-white font-semibold">
              Search
            </button>
          </div>

          <p className="mt-4 text-green-300 text-sm">
            ✔ Refund available on cancellation – Exclusive offers available
          </p>
        </div>
      </section>

      {/* 2 MAIN BOOKING OPTIONS */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Khám Tổng Quát */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Book General Checkup</h3>
                  <p className="text-blue-100 text-sm mt-1">
                    {generalSpecialties.length} services
                  </p>
                </div>
              </div>
            </div>

            <p className="text-blue-100 text-sm mb-4">
              Choose a general checkup service first, then select clinic and doctor
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {generalSpecialties.slice(0, 4).map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => handleSelectSpecialty(spec)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-sm transition-colors"
                >
                  {getSpecialtyIcon(spec.name)}
                  {spec.name}
                </button>
              ))}
              {generalSpecialties.length > 4 && (
                <button
                  onClick={() => handleSelectService({ slug: 'kham-tong-quat' })}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
                >
                  +{generalSpecialties.length - 4} more
                </button>
              )}
              {generalSpecialties.length === 0 && (
                <span className="px-3 py-1.5 bg-white/10 rounded-full text-sm">
                  No services available
                </span>
              )}
            </div>

            <button
              onClick={() => handleSelectService({ slug: 'kham-tong-quat' })}
              className="w-full bg-white text-blue-600 px-4 py-3 rounded-xl font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2"
            >
              Choose general checkup
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Khám Chuyên Khoa */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Heart className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Book Specialist Visit</h3>
                  <p className="text-orange-100 text-sm mt-1">
                    {specialistSpecialties.length} specialties
                  </p>
                </div>
              </div>
            </div>

            <p className="text-orange-100 text-sm mb-4">
              Choose a specialty first, then select clinic and doctor
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {specialistSpecialties.slice(0, 4).map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => handleSelectSpecialty(spec)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-sm transition-colors"
                >
                  {getSpecialtyIcon(spec.name)}
                  {spec.name}
                </button>
              ))}
              {specialistSpecialties.length > 4 && (
                <button
                  onClick={() => handleSelectService({ slug: 'kham-chuyen-khoa' })}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
                >
                  +{specialistSpecialties.length - 4} more
                </button>
              )}
              {specialistSpecialties.length === 0 && (
                <span className="px-3 py-1.5 bg-white/10 rounded-full text-sm">
                  No specialties available
                </span>
              )}
            </div>

            <button
              onClick={() => handleSelectService({ slug: 'kham-chuyen-khoa' })}
              className="w-full bg-white text-orange-600 px-4 py-3 rounded-xl font-semibold hover:bg-orange-50 transition flex items-center justify-center gap-2"
            >
              Choose specialty
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* OTHER SERVICES */}
      <section className="max-w-7xl mx-auto px-4 mt-8 pb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical Services</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories
            .filter(cat => cat.slug !== 'kham-tong-quat' && cat.slug !== 'kham-chuyen-khoa')
            .map((category) => (
              <button
                key={category.id}
                onClick={() => handleSelectService(category)}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-center text-center cursor-pointer hover:ring-2 hover:ring-sky-300"
              >
                <div
                  className="w-14 h-14 mb-3 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: getCategoryColor(category) }}
                >
                  {getCategoryIcon(category)}
                </div>
                <p className="text-sm font-medium text-gray-800">{category.name}</p>
              </button>
            ))}
          {categories.filter(cat => cat.slug !== 'kham-tong-quat' && cat.slug !== 'kham-chuyen-khoa').length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              Loading services...
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default HeroSections;
