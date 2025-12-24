import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
                HC
              </div>
              <span className="text-xl font-bold">HealthCare</span>
            </div>
            <p className="text-gray-400">
              Nền tảng đặt lịch khám chữa bệnh hàng đầu Việt Nam
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Dịch Vụ</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Khám Tổng Quát
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Nha Khoa
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Tim Mạch
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Về Chúng Tôi</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Giới Thiệu
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Đội Ngũ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Tin Tức
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Liên Hệ</h4>
            <ul className="space-y-2 text-gray-400">
              <li>1900 xxxx</li>
              <li>info@healthcare.vn</li>
              <li>123 Đường ABC, Q.1, TP.HCM</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 HealthCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
