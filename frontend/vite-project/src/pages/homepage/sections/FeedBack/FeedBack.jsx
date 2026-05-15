import React from 'react';
import { Star, Users, Heart, Star as StarIcon } from 'lucide-react';

function FeedBack() {
  const stats = [
    { icon: <Users className="w-6 h-6" />, value: '4.0M+', label: 'Appointments' },
    { icon: <Heart className="w-6 h-6" />, value: '2500+', label: 'Doctors' },
    { icon: <StarIcon className="w-6 h-6" />, value: '1.0M+', label: 'Visits' },
  ];

  const reviews = [
    {
      name: 'Nguyen Thu Lan',
      initials: 'NL',
      specialty: 'Ophthalmology',
      rating: 5,
      text: '"Booking an appointment through the app was so fast, no queuing required. The doctor was very thorough. I am very satisfied!"',
    },
    {
      name: 'Tran Van Hung',
      initials: 'TH',
      specialty: 'Cardiology',
      rating: 5,
      text: '"The booking system is convenient, and the SMS reminder was very thoughtful. The nurses were lovely."',
    },
    {
      name: 'Pham Minh Chau',
      initials: 'PC',
      specialty: 'Pediatrics',
      rating: 5,
      text: '"My child was seen on time, no long waiting. The pediatrician was very gentle with children."',
    },
  ];

  return (
    <>
      {/* Testimonial Section - Dark */}
      <section className="bg-sky-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-2">
              What Our Patients Say
            </h2>
            <p className="text-sky-200 text-sm">
              Over 1 million people trust us with their appointments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur rounded-2xl p-6 text-white"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-sky-500 border-2 border-sky-300 flex items-center justify-center text-white font-bold text-sm">
                    {review.initials}
                  </div>
                  <div>
                    <h4 className="font-semibold">{review.name}</h4>
                    <p className="text-sky-300 text-xs">{review.specialty}</p>
                  </div>
                </div>

                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: review.rating }).map((_, si) => (
                    <Star key={si} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-sky-100 text-sm leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-sky-100 text-sky-600 rounded-full mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default FeedBack;
