import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router';
function HomeHeader() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className=" w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              HC
            </div>
            <span
              onClick={() => navigate('/')}
              className="cursor-pointer text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
            >
              HealthCare
            </span>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Trang Chủ
            </a>
            <a
              href="#services"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Dịch Vụ Y Te
            </a>
            <a
              href="#doctors"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Bác Sĩ
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Liên Hệ
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-blue-600 font-medium transition">
              Đăng Nhập
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition">
              Đăng Ký
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Trang Chủ
              </a>
              <a
                href="#services"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Dịch Vụ
              </a>
              <a
                href="#doctors"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Bác Sĩ
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Liên Hệ
              </a>
              <button className="text-left text-gray-700 hover:text-blue-600 font-medium">
                Đăng Nhập
              </button>
              <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-lg text-left">
                Đăng Ký
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default HomeHeader;
