import React, { useRef, useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
function SpecialtyServices() {
  const serviceSliderRef = useRef(null);
  const [currentServiceSlide, setCurrentServiceSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const nextServiceSlide = () => {
    setCurrentServiceSlide(
      (prev) => (prev + 1) % Math.ceil(services.length / 3)
    );
    setIsAutoPlay(false);
  };

  const prevServiceSlide = () => {
    setCurrentServiceSlide(
      (prev) =>
        (prev - 1 + Math.ceil(services.length / 3)) %
        Math.ceil(services.length / 3)
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
    <section
      id="services"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Chuyên khoa
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Cung cấp đa dạng các dịch vụ chăm sóc sức khỏe với đội ngũ bác sĩ
          chuyên môn cao
        </p>
      </div>
      <div className="flex justify-end mb-6">
        <button className="cursor-pointer bg-blue-100 text-blue-700 px-5 py-2 rounded-full text-sm font-medium">
          Xem thêm
        </button>
      </div>
      <div className="relative">
        {/* Slider Container */}

        <div className="overflow-hidden" ref={serviceSliderRef}>
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentServiceSlide * 100}%)`,
            }}
          >
            {Array.from({ length: Math.ceil(services.length / 3) }).map(
              (_, slideIndex) => (
                <div key={slideIndex} className="min-w-full">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
                    {services
                      .slice(slideIndex * 3, slideIndex * 3 + 3)
                      .map((service) => (
                        <div
                          key={service.id}
                          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition cursor-pointer border-2 border-transparent hover:border-blue-600"
                        >
                          <div className="text-5xl mb-4">{service.icon}</div>
                          <h3 className="text-xl font-bold mb-2">
                            {service.name}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Dịch vụ chăm sóc sức khỏe chuyên nghiệp
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-blue-600">
                              {service.price}
                            </span>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                              Đặt Lịch
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevServiceSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition z-10"
        >
          <ChevronLeft className="w-6 h-6 text-blue-600" />
        </button>
        <button
          onClick={nextServiceSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition z-10"
        >
          <ChevronRight className="w-6 h-6 text-blue-600" />
        </button>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: Math.ceil(services.length / 3) }).map(
            (_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentServiceSlide(index);
                  setIsAutoPlay(false);
                }}
                className={`h-3 rounded-full transition-all ${
                  currentServiceSlide === index
                    ? 'w-8 bg-blue-600'
                    : 'w-3 bg-gray-300'
                }`}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default SpecialtyServices;
