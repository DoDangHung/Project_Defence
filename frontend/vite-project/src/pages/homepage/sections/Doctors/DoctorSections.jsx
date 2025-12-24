import React from 'react';
import { Star } from 'lucide-react';
function DoctorSections() {
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
  return (
    <section
      id="doctors"
      className="bg-gradient-to-br from-blue-600 to-cyan-600 py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Đội Ngũ Bác Sĩ
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Các bác sĩ giàu kinh nghiệm, tận tâm với nghề
          </p>
        </div>

        {/* Show all doctors in grid on larger screens */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6 mt-12">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-xl p-6 shadow-xl hover:scale-105 transition"
            >
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold text-center mb-2">
                {doctor.name}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {doctor.specialty}
              </p>
              <div className="flex justify-center items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold">{doctor.rating}</span>
                </div>
                <div className="text-gray-600 text-sm">
                  {doctor.patients} BN
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 rounded-lg hover:shadow-lg transition">
                Xem Hồ Sơ
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DoctorSections;
