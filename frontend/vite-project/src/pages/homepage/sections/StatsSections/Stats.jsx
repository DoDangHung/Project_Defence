import React from 'react';
import { Star, Award, Users, Heart } from 'lucide-react';
function Stats() {
  const stats = [
    { icon: <Users className="w-8 h-8" />, value: '50K+', label: 'Bệnh Nhân' },
    { icon: <Award className="w-8 h-8" />, value: '100+', label: 'Bác Sĩ' },
    { icon: <Heart className="w-8 h-8" />, value: '98%', label: 'Hài Lòng' },
    { icon: <Star className="w-8 h-8" />, value: '4.9', label: 'Đánh Giá' },
  ];
  return (
    <>
      {/* ================= FEATURED HOSPITALS ================= */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-center text-xl font-semibold mb-10">
          CƠ SỞ Y TẾ NỔI BẬT TRONG THÁNG
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            'Bệnh viện Da Liễu TP.HCM',
            'Bệnh viện Quận Bình Thạnh',
            'Bệnh viện Trưng Vương',
            'BV Chấn Thương Chỉnh Hình',
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4"
            >
              <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                🏥
              </div>
              <h3 className="font-semibold text-center text-sm">{item}</h3>
              <p className="text-xs text-gray-500 text-center mt-1">
                Quận TP.HCM
              </p>

              <div className="flex justify-center text-orange-400 text-sm my-2">
                ★★★★☆
              </div>

              <button className="w-full bg-sky-600 text-white py-2 rounded mt-2">
                Đặt khám ngay
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
    </>
  );
}

export default Stats;
