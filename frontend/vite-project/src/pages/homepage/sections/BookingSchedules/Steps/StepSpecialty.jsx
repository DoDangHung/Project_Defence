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

  const [filters, setFilters] = useState({
    categories: [],
    rating: 0,
    availability: [],
    priceRange: [0, 2000000],
    searchTerm: '',
  });

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    rating: true,
    availability: true,
    price: true,
  });

  const categories = [
    { id: 'internal', name: 'Nội khoa', count: 12 },
    { id: 'surgery', name: 'Ngoại khoa', count: 8 },
    { id: 'pediatrics', name: 'Nhi khoa', count: 6 },
    { id: 'gynecology', name: 'Sản phụ khoa', count: 5 },
    { id: 'ent', name: 'Tai mũi họng', count: 7 },
    { id: 'dermatology', name: 'Da liễu', count: 4 },
    { id: 'ophthalmology', name: 'Mắt', count: 3 },
    { id: 'dental', name: 'Răng hàm mặt', count: 10 },
  ];

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

  const normalizeSlug = (slug) => slug?.toLowerCase().trim();

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((c) => c !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      rating: 0,
      availability: [],
      priceRange: [0, 2000000],
      searchTerm: '',
    });
  };

  const FilterSection = ({ title, section, children }) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-3 hover:text-blue-600 transition-colors"
      >
        <span>{title}</span>
        {expandedSections[section] ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {expandedSections[section] && <div>{children}</div>}
    </div>
  );

  const Sidebar = () => (
    <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Bộ lọc</h2>
        </div>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Xóa hết
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm chuyên khoa..."
            value={filters.searchTerm}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
            }
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      <FilterSection title="Danh mục" section="category">
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1 rounded"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">{category.name}</span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {category.count}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <button
        onClick={() => setSidebarOpen(false)}
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
      >
        Áp dụng bộ lọc
      </button>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg z-50 hover:bg-blue-700 transition-all hover:scale-110"
      >
        <Filter className="w-6 h-6" />
      </button>

      <div className="flex gap-6 relative">
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <Sidebar />
        </aside>

        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <Sidebar />
              </div>
            </div>
          </div>
        )}

        <div className="flex-1">
          {(filters.categories.length > 0 ||
            filters.availability.length > 0 ||
            filters.rating > 0 ||
            filters.searchTerm) && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">
                  Bộ lọc đang áp dụng:
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Xóa tất cả
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.searchTerm && (
                  <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow-sm">
                    🔍 "{filters.searchTerm}"
                    <button
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, searchTerm: '' }))
                      }
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.rating > 0 && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    ⭐ {filters.rating}+ sao
                    <button
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, rating: 0 }))
                      }
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

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
                onClick={() => navigate(`/booking/clinics/${selectedSlug}`)}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StepSpecialty;
