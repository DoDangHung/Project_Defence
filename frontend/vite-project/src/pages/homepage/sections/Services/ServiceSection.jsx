import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
function ServiceSections() {
  const serviceSliderRef = useRef(null);
  const [currentServiceSlide, setCurrentServiceSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [currentDoctorSlide, setCurrentDoctorSlide] = useState(0);

  const services = [
    { id: 1, name: 'Khám Tổng Quát', icon: '🏥', price: '500.000đ' },
    { id: 2, name: 'Nha Khoa', icon: '🦷', price: '300.000đ' },
    { id: 3, name: 'Tim Mạch', icon: '❤️', price: '800.000đ' },
    { id: 4, name: 'Da Liễu', icon: '✨', price: '400.000đ' },
    { id: 5, name: 'Tai Mũi Họng', icon: '👂', price: '350.000đ' },
    { id: 6, name: 'Mắt', icon: '👁️', price: '450.000đ' },
  ];

  const doctors = [
    {
      id: 1,
      name: 'BS. Nguyễn Văn A',
      specialty: 'Tim Mạch',
      rating: 4.9,
      patients: 1250,
      image:
        'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Fe4549b5e-15d0-4656-8157-ad47e269f42b-bs_ngaa_trung_nam.jpg&w=384&q=75',
    },
    {
      id: 2,
      name: 'BS. Trần Thị B',
      specialty: 'Nha Khoa',
      rating: 4.8,
      patients: 980,
      image:
        'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F82fa2843-dba3-48d1-ae5f-4600238afcec-sa.jpg&w=384&q=75',
    },
    {
      id: 3,
      name: 'BS. Lê Văn C',
      specialty: 'Da Liễu',
      rating: 4.7,
      patients: 850,
      image:
        'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Fb7d5a8fb-c628-4a40-94a2-91def4bfcb17-thiaaoat_kaaoa_chaaa_caa_taaan_(2).png&w=384&q=75',
    },
    {
      id: 4,
      name: 'BS. Phạm Thị D',
      specialty: 'Tai Mũi Họng',
      rating: 4.9,
      patients: 1100,
      image:
        'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F20af7575-df2e-4224-b40d-36055b476ba6-do-dang-khoa.webp&w=384&q=75',
    },
  ];
  // Auto play slider
  useEffect(() => {
    if (!isAutoPlay) return;

    const serviceInterval = setInterval(() => {
      setCurrentServiceSlide(
        (prev) => (prev + 1) % Math.ceil(services.length / 3),
      );
    }, 3000);

    const doctorInterval = setInterval(() => {
      setCurrentDoctorSlide((prev) => (prev + 1) % doctors.length);
    }, 4000);

    return () => {
      clearInterval(serviceInterval);
      clearInterval(doctorInterval);
    };
  }, [isAutoPlay, services.length, doctors.length]);

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
  return (
    <>
      <section
        id="services"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Dịch Vụ Của Chúng Tôi
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
                ),
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
              ),
            )}
          </div>
        </div>
      </section>

      {/* ================= VIDEO DOCTORS ================= */}
      <section className="max-w-7xl mx-auto px-4 py-14 bg-sky-50 rounded-3xl">
        <h2 className="text-center text-xl font-semibold mb-10">
          BÁC SĨ TƯ VẤN KHÁM BỆNH QUA VIDEO
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            'BS CKII Ngô Trung Nam',
            'BS CKI Vũ Thị Hà',
            'ThS.BS Lê Hoàng Thiên',
            'BS CKI Đỗ Đăng Khoa',
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow hover:shadow-lg p-4 text-center"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 mb-3">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-sm">{item}</h3>
              <p className="text-xs text-gray-500">Bác sĩ chuyên khoa</p>
              <p className="text-sm text-orange-500 my-2">★★★★☆</p>
              <button className="w-full bg-sky-600 text-white py-2 rounded">
                Tư vấn ngay
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <a href="#" className="text-sky-600 text-sm">
            Xem tất cả →
          </a>
        </div>
      </section>

      {/* ================= HEALTH CARE PACKAGES ================= */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-center text-xl font-semibold mb-10">
          CHĂM SÓC SỨC KHỎE TOÀN DIỆN
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            'Gói khám mắt tổng quát',
            'Gói khám tiểu đường',
            'Gói khám sức khỏe lao động',
            'Bệnh lây qua đường tình dục',
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5"
                alt=""
                className="h-32 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-sm">{item}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Phòng khám chuyên khoa
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default ServiceSections;
