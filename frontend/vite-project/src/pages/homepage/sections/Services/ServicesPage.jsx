/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Stethoscope,
  Heart,
  Eye,
  Smile,
  Syringe,
  Brain,
  Bone,
  Baby,
  TestTube,
  Pill,
  Activity,
  ShieldCheck,
  Clock,
  Star,
  Loader2,
  ChevronRight,
} from "lucide-react";

const iconMap = {
  mắt: Eye,
  nhãn: Eye,
  răng: Smile,
  nha: Smile,
  tim: Heart,
  mạch: Heart,
  tâm: Brain,
  thần: Brain,
  "thần kinh": Brain,
  xương: Bone,
  khớp: Bone,
  nhi: Baby,
  trẻ: Baby,
  "xét nghiệm": TestTube,
  "dinh dưỡng": Activity,
  tiêm: Syringe,
  "da liễu": Stethoscope,
};

const colorMap = [
  "bg-blue-500",
  "bg-red-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-indigo-500",
];

function ServicesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, specRes] = await Promise.all([
          fetch("http://localhost:8080/api/service-categories?isActive=true"),
          fetch("http://localhost:8080/api/specialties?isActive=true"),
        ]);
        const catData = await catRes.json();
        const specData = await specRes.json();
        if (catData.success) setCategories(catData.data || []);
        if (specData.success) setSpecialties(specData.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getIcon = (name) => {
    const lower = (name || "").toLowerCase();
    for (const [key, Icon] of Object.entries(iconMap)) {
      if (lower.includes(key)) return <Icon className="w-7 h-7" />;
    }
    return <Stethoscope className="w-7 h-7" />;
  };

  const getColor = (index) => colorMap[index % colorMap.length];

  const handleBook = (cat) => {
    navigate(`/booking/services/${cat.slug}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-sky-700 to-sky-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Services</h1>
          <p className="text-sky-100 text-lg max-w-2xl mx-auto">
            Discover a variety of high-quality medical services from reputable
            medical facilities.
          </p>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-x divide-gray-100">
            {[
              {
                icon: <ShieldCheck className="w-5 h-5 text-sky-600" />,
                text: "Trusted medical facilities",
              },
              {
                icon: <Clock className="w-5 h-5 text-sky-600" />,
                text: "Book appointments 24/7",
              },
              {
                icon: <Star className="w-5 h-5 text-sky-600" />,
                text: "Rating 4.8/5",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-6 py-4 hover:bg-sky-50/30 transition"
              >
                <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Service Categories
        </h2>
        <p className="text-gray-500 mb-10">
          Choose the category that suits your medical needs
        </p>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-sky-200 transition group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${getColor(i)} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                >
                  {getIcon(cat.name)}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                    {cat.description}
                  </p>
                )}
                <button
                  onClick={() => handleBook(cat)}
                  className="flex items-center gap-1 text-sky-600 font-medium text-sm hover:text-sky-700 transition"
                >
                  Book an appointment
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="col-span-full text-center py-16 text-gray-400">
                Loading data...
              </div>
            )}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Why choose our services?
            </h2>
            <p className="text-gray-500">
              Commit to quality and patient satisfaction
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Quick booking",
                desc: "Book an appointment in 3 simple steps",
              },
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                title: "Highly skilled doctors",
                desc: "A team of experienced doctors from top medical facilities",
              },
              {
                icon: <Activity className="w-6 h-6" />,
                title: "Modern equipment",
                desc: "Modern medical equipment and facilities",
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: "Compassionate care",
                desc: "A team of friendly medical staff",
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 bg-gray-50 rounded-2xl">
                <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServicesPage;
