import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
function Contact() {
  return (
    <section
      id="contact"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
    >
      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Liên Hệ Với Chúng Tôi
          </h2>
          <p className="text-gray-600 mb-8">
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone className="text-blue-600" />
              </div>
              <div>
                <div className="font-semibold">Điện Thoại</div>
                <div className="text-gray-600">1900 xxxx</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="text-blue-600" />
              </div>
              <div>
                <div className="font-semibold">Email</div>
                <div className="text-gray-600">info@healthcare.vn</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="text-blue-600" />
              </div>
              <div>
                <div className="font-semibold">Địa Chỉ</div>
                <div className="text-gray-600">
                  123 Đường ABC, Quận 1, TP.HCM
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8">
          <h3 className="text-2xl font-bold mb-6">Gửi Tin Nhắn</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Họ Tên</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tin Nhắn</label>
              <textarea
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              ></textarea>
            </div>
            <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
              Gửi Tin Nhắn
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
