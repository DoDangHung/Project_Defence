import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Search } from 'lucide-react';

function StepSpecialty({
  step,
  setStep,
  specialties,
  handleInputChange,
  bookingData,
}) {
  // ==================== SIDEBAR STATE - THÊM MỚI ====================
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const availabilityOptions = [
    { id: 'today', label: 'Hôm nay' },
    { id: 'tomorrow', label: 'Ngày mai' },
    { id: 'thisWeek', label: 'Tuần này' },
    { id: 'nextWeek', label: 'Tuần sau' },
  ];

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

  const handleAvailabilityChange = (availId) => {
    setFilters((prev) => ({
      ...prev,
      availability: prev.availability.includes(availId)
        ? prev.availability.filter((a) => a !== availId)
        : [...prev.availability, availId],
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

  // ==================== SIDEBAR COMPONENT - THÊM MỚI ====================
  const Sidebar = () => (
    <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
      {/* Header */}
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

      {/* Tìm kiếm */}
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

      {/* Danh mục chuyên khoa */}
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

      {/* Lịch khám */}
      <FilterSection title="Lịch khám" section="availability">
        <div className="space-y-2">
          {availabilityOptions.map((option) => (
            <label
              key={option.id}
              className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
            >
              <input
                type="checkbox"
                checked={filters.availability.includes(option.id)}
                onChange={() => handleAvailabilityChange(option.id)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Đánh giá */}
      <FilterSection title="Đánh giá" section="rating">
        <div className="space-y-2">
          {[5, 4, 3, 2].map((rating) => (
            <label
              key={rating}
              className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.rating === rating}
                onChange={() => setFilters((prev) => ({ ...prev, rating }))}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 flex items-center">
                {rating} sao trở lên
                <span className="ml-1 text-yellow-400">
                  {'★'.repeat(rating)}
                  {'☆'.repeat(5 - rating)}
                </span>
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Giá khám */}
      <FilterSection title="Giá khám" section="price">
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="2000000"
            step="50000"
            value={filters.priceRange[1]}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                priceRange: [0, parseInt(e.target.value)],
              }))
            }
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">0đ</span>
            <span className="font-semibold text-blue-600">
              {filters.priceRange[1].toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>
      </FilterSection>

      {/* Apply Button */}
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
      {step === 1 && (
        <>
          {/* Mobile Filter Button - THÊM MỚI */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg z-50 hover:bg-blue-700 transition-all hover:scale-110"
          >
            <Filter className="w-6 h-6" />
          </button>

          {/* Layout với Sidebar - THÊM MỚI */}
          <div className="flex gap-6 relative">
            {/* Sidebar Desktop - THÊM MỚI */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <Sidebar />
            </aside>

            {/* Sidebar Mobile Overlay - THÊM MỚI */}
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

            {/* Main Content - NỘI DUNG GỐC */}
            <div className="flex-1">
              {/* Active Filters - THÊM MỚI */}
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

              {/* CODE GỐC CỦA BẠN - KHÔNG THAY ĐỔI */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Chọn chuyên khoa
                </h2>
                <div className="grid grid-flow-col grid-rows-4 gap-4">
                  {specialties.map((spec) => (
                    <button
                      key={spec.id}
                      onClick={() => handleInputChange('specialty', spec.id)}
                      className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                        bookingData.specialty === spec.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{spec.icon}</div>
                      <div className="text-sm font-semibold text-gray-700">
                        {spec.name}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => bookingData.specialty && setStep(2)}
                    disabled={!bookingData.specialty}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                  >
                    Tiếp tục
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default StepSpecialty;
