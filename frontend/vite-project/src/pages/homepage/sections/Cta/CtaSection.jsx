import React from 'react';
import { useNavigate } from 'react-router';
import { Calendar, ArrowRight } from 'lucide-react';

function CtaSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-sky-900 text-white py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          Ready When You Are
        </h2>
        <p className="text-sky-200 text-lg mb-10 max-w-xl mx-auto">
          Book an appointment today and experience the best healthcare service.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/booking')}
            className="px-8 py-4 bg-white text-sky-700 rounded-xl font-bold text-base hover:bg-sky-50 transition flex items-center justify-center gap-2 shadow-lg"
          >
            <Calendar className="w-5 h-5" />
            Book appointment
          </button>
          <button
            onClick={() => navigate('/doctors')}
            className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-base hover:bg-white/10 transition flex items-center justify-center gap-2"
          >
            Find a doctor
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
