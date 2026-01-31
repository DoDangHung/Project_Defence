import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router';
function HomeHeader() {
  const [openMenu, setOpenMenu] = useState(false);
  const [lang, setLang] = useState('VN');

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-sky-600">medpro</span>
          <span className="hidden md:block text-sm text-gray-500">
            Tư vấn / Đặt khám
          </span>
        </div>

        {/* Desktop menu */}
        <nav className="hidden lg:flex gap-6 text-sm">
          <a href="#">Cơ sở y tế</a>
          <a href="#">Dịch vụ y tế</a>
          <a href="#">Khám doanh nghiệp</a>
          <a href="#">Tin tức</a>
          <a href="#">Hướng dẫn</a>
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-4 text-sm">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="VN">🇻🇳 VN</option>
            <option value="EN">🇺🇸 EN</option>
          </select>

          <a href="#">Đăng nhập</a>
          <a className="bg-sky-600 text-white px-3 py-1 rounded" href="#">
            Đăng ký
          </a>

          <span className="text-orange-500 font-semibold">📞 1900 2115</span>
        </div>

        {/* Mobile button */}
        <button
          className="lg:hidden text-2xl"
          onClick={() => setOpenMenu(!openMenu)}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {openMenu && (
        <div className="lg:hidden bg-white border-t px-4 py-4 space-y-3 text-sm">
          <a className="block" href="#">
            Cơ sở y tế
          </a>
          <a className="block" href="#">
            Dịch vụ y tế
          </a>
          <a className="block" href="#">
            Khám doanh nghiệp
          </a>
          <a className="block" href="#">
            Tin tức
          </a>
          <a className="block" href="#">
            Hướng dẫn
          </a>

          <div className="pt-3 border-t flex justify-between items-center">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="VN">🇻🇳 VN</option>
              <option value="EN">🇺🇸 EN</option>
            </select>

            <div className="flex gap-3">
              <a href="#">Đăng nhập</a>
              <a className="text-sky-600 font-semibold" href="#">
                Đăng ký
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Notice */}
      <div className="bg-orange-400 text-white text-sm text-center py-1">
        Đặt Giúp Việc Cá Nhân – Hỗ trợ đi khám từ A–Z
      </div>
    </header>
  );
}

export default HomeHeader;
