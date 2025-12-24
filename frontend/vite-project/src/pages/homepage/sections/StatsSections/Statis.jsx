import React from 'react';
import { Star, Award, Users, Heart } from 'lucide-react';
function Statis() {
  const Statis = [
    { icon: <Users className="w-8 h-8" />, value: '4.0M+', label: 'Lượt khám' },
    { icon: <Award className="w-8 h-8" />, value: '100+', label: 'Bệnh viện' },
    { icon: <Heart className="w-8 h-8" />, value: '2500+', label: 'Bác sĩ' },
    {
      icon: <Star className="w-8 h-8" />,
      value: '1.0M+',
      label: 'Lượt truy cập tháng',
    },
  ];
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {Statis.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Statis;
