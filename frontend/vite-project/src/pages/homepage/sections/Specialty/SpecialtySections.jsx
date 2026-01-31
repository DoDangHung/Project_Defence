import React, { useRef, useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
function SpecialtyServices() {
  const serviceSliderRef = useRef(null);
  const [currentServiceSlide, setCurrentServiceSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const nextServiceSlide = () => {
    setCurrentServiceSlide(
      (prev) => (prev + 1) % Math.ceil(services.length / 3),
    );
    setIsAutoPlay(false);
  };

  const prevServiceSlide = () => {
    setCurrentServiceSlide(
      (prev) =>
        (prev - 1 + Math.ceil(services.length / 3)) %
        Math.ceil(services.length / 3),
    );
    setIsAutoPlay(false);
  };
  const services = [
    { id: 1, name: 'Khám Tổng Quát', icon: '🏥', price: '500.000đ' },
    { id: 2, name: 'Nha Khoa', icon: '🦷', price: '300.000đ' },
    { id: 3, name: 'Tim Mạch', icon: '❤️', price: '800.000đ' },
    { id: 4, name: 'Da Liễu', icon: '✨', price: '400.000đ' },
    { id: 5, name: 'Tai Mũi Họng', icon: '👂', price: '350.000đ' },
    { id: 6, name: 'Mắt', icon: '👁️', price: '450.000đ' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-center text-xl font-semibold mb-10">CHUYÊN KHOA</h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
        {[
          'Gia đình',
          'Tiêu hóa',
          'Nội tổng quát',
          'Nội tiết',
          'Da liễu',
          'Tim mạch',
          'Thần kinh',
          'Xương khớp',
        ].map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center cursor-pointer hover:text-sky-600"
          >
            <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center mb-2">
              <img src="https://cdn-pkh.longvan.net/medpro-production/default/avatar/ChuyenKhoa.png" />
            </div>
            <p className="text-sm">{item}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <a href="#" className="text-sky-600 text-sm">
          Xem tất cả ↓
        </a>
      </div>
    </section>
  );
}

export default SpecialtyServices;
