import React from 'react';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const partners = [
  {
    id: 1,
    name: 'Bệnh viện Da Liễu Cần Thơ',
    logo: 'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F566f02cc-65a3-4ae9-921d-1bc6a5635b68-images_(1).png&w=64&q=75',
  },
  {
    id: 2,
    name: 'Bệnh viện Nhi đồng TP Cần Thơ',
    logo: 'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn-pkh.longvan.net%2Fprod-partner%2Feb5f2829-0bbd-4fb5-9f62-7646a9f9dccc-logo_sgh_512x512_(2).png&w=64&q=75',
  },
  {
    id: 3,
    name: 'Singapore General Hospital',
    logo: 'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Fed9d18bb-8061-4386-bdca-1633d4d99875-logo_bv_quaaoan_1.jpg&w=64&q=75',
  },
  {
    id: 4,
    name: 'Bệnh viện Quận 1 - Cơ sở 2',
    logo: 'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Fbb19fb0b-8dc6-4646-8bd7-64d502c98842-logo.png&w=64&q=75',
  },
  {
    id: 5,
    name: 'Bệnh viện Lao & Phổi Cần Thơ',
    logo: 'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F54d32410-7a2c-47fd-9114-908cc438babf-logo_benhvien.png&w=64&q=75',
  },
  {
    id: 6,
    name: 'Bệnh viện Mắt - Răng Hàm Mặt',
    logo: 'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2F54752409-33d3-498f-a4ae-00fef667678e-logo-bv-nhan-dan-115-circle.jpg&w=64&q=75',
  },
  {
    id: 7,
    name: 'Bệnh viện Mắt - Răng Hàm Mặt',
    logo: 'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn-pkh.longvan.net%2Fprod-partner%2Ffaf1d42f-7e21-4afd-8331-6efefd7d0ff2-logo_tim_mach_can_tho.jpg&w=64&q=75',
  },
];

export default function CollabClinic() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 6;

  const totalSlides = Math.ceil(partners.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-6 ">
      {/* Title */}
      <h2 className="text-center text-2xl lg:text-3xl font-bold text-blue-900 mb-12">
        ĐƯỢC TIN TƯỞNG HỢP TÁC VÀ ĐỒNG HÀNH
      </h2>

      {/* Slider */}
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div key={slideIndex} className="min-w-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                  {partners
                    .slice(
                      slideIndex * itemsPerSlide,
                      slideIndex * itemsPerSlide + itemsPerSlide
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col items-center text-center cursor-pointer hover:scale-105 transition"
                      >
                        <div className="w-20 h-20 mb-4 rounded-full bg-white shadow flex items-center justify-center">
                          <img
                            src={item.logo}
                            alt={item.name}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <p className="text-sm font-medium text-gray-800">
                          {item.name}
                        </p>
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-1" />
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow"
        >
          <ChevronLeft className="w-5 h-5 text-blue-600" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow"
        >
          <ChevronRight className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      {/* Progress */}
      <div className="flex justify-center mt-8">
        <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{
              width: `${((currentSlide + 1) / totalSlides) * 100}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
