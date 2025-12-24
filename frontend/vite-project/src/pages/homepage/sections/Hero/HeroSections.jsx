import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
function HeroSections() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Đặt Lịch Khám{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Dễ Dàng
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Kết nối với các bác sĩ chuyên khoa hàng đầu. Đặt lịch nhanh chóng,
            tiện lợi và an toàn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/booking')}
              className="cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition flex items-center justify-center"
            >
              Đặt Lịch Ngay <ChevronRight className="ml-2" />
            </button>
            <button className="cursor-pointer border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition">
              Tìm Hiểu Thêm
            </button>
            <button className="cursor-pointer border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition">
              Dat Lich AI
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-8 shadow-2xl">
            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Đặt Lịch Nhanh</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Chọn Dịch Vụ
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                    <option>Khám Tổng Quát</option>
                    <option>Nha Khoa</option>
                    <option>Tim Mạch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Chọn Ngày
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
                  Tìm Kiếm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSections;
