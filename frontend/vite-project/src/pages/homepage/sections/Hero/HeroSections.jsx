import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
function HeroSections() {
  const navigate = useNavigate();

  return (
    <>
      <section
        className="relative bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1586773860418-d37222d8fce3)',
        }}
      >
        <div className="absolute inset-0 bg-sky-900/40"></div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center text-white">
          <h1 className="text-2xl md:text-4xl font-bold">
            Kết nối Người Dân với Cơ sở & Dịch vụ Y tế hàng đầu
          </h1>

          {/* Search */}
          <div className="mt-8 max-w-3xl mx-auto bg-white rounded-full flex overflow-hidden shadow-lg">
            <input
              type="text"
              placeholder="Tìm bác sĩ, bệnh viện, chuyên khoa..."
              className="flex-1 px-5 py-3 text-gray-800 focus:outline-none"
            />
            <button className="bg-sky-600 px-6 text-white font-semibold">
              Tìm kiếm
            </button>
          </div>

          <p className="mt-4 text-green-300 text-sm">
            ✔ Được hoàn tiền khi huỷ khám – Có cơ hội nhận ưu đãi
          </p>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { label: 'Đặt khám tại cơ sở', path: '/co-so-y-te' },
            { label: 'Đặt khám chuyên khoa', path: '/booking' },
            { label: 'Gọi video với bác sĩ', path: '/tu-van-video' },
            { label: 'Đặt lịch xét nghiệm', path: '/xet-nghiem' },
            { label: 'Mua thuốc tại An Khang', path: '/nha-thuoc' },
            { label: 'Giúp việc cá nhân', path: '/giup-viec' },
            { label: 'Khám doanh nghiệp', path: '/kham-doanh-nghiep' },
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => navigate(item.path)}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-center text-center cursor-pointer hover:ring-2 hover:ring-sky-300"
            >
              <div className="w-12 h-12 mb-2 rounded-full bg-sky-100 flex items-center justify-center text-xl">
                🏥
              </div>
              <p className="text-sm font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default HeroSections;
