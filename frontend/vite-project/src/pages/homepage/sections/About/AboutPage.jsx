/** @format */

import React from "react";
import {
  Heart,
  Users,
  Award,
  Clock,
  Star,
  ShieldCheck,
  Activity,
} from "lucide-react";

const stats = [
  {
    icon: <Users className="w-6 h-6" />,
    value: "1M+",
    label: "Trusted patients",
  },
  {
    icon: <Award className="w-6 h-6" />,
    value: "300+",
    label: "Specialist doctors",
  },
  {
    icon: <Activity className="w-6 h-6" />,
    value: "50+",
    label: "Medical facilities",
  },
  {
    icon: <Star className="w-6 h-6" />,
    value: "4.8/5",
    label: "Average rating",
  },
];

const team = [
  { name: "BS. Nguyễn Văn Minh", role: "CEO", initials: "NM" },
  { name: "TS. Trần Thị Lan", role: "Head of Pediatrics", initials: "TL" },
  { name: "BS. Lê Hoàng Nam", role: "Head of Cardiology", initials: "LN" },
  {
    name: "BS. Phạm Minh Châu",
    role: "Head of Obstetrics and Gynecology",
    initials: "PC",
  },
];

const milestones = [
  {
    year: "2018",
    title: "Founded",
    desc: "It began with a mission to connect people with quality healthcare services.",
  },
  {
    year: "2020",
    title: "Expansion",
    desc: "Development of online appointment scheduling system, serving more than 100,000 patients.",
  },
  {
    year: "2022",
    title: "Strategic partnership",
    desc: "Strategic partnership with more than 30 leading medical facilities in Vietnam.",
  },
  {
    year: "2024",
    title: "Strong development",
    desc: "Serving more than 1 million patients with 300+ specialist doctors.",
  },
];

function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-sky-700 to-sky-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About HealthCare</h1>
          <p className="text-sky-100 text-lg max-w-2xl mx-auto">
            The leading online appointment scheduling platform in Vietnam,
            connecting patients with trusted medical facilities and specialist
            doctors.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 mx-auto mb-3">
                  {item.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {item.value}
                </div>
                <div className="text-gray-500 text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 mb-6">
              <Heart className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              HealthCare was founded with the mission of simplifying access to
              healthcare services for everyone. We believe that everyone
              deserves the best care, regardless of where they are.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Through our online appointment scheduling platform, patients can
              easily find a suitable doctor, book an appointment quickly and
              receive personalized advice from a team of leading medical
              professionals.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become the leading healthcare platform in Southeast Asia, where
              everyone can access high-quality healthcare services with just a
              few clicks on their phone.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              We continuously improve our technology, expand our network of
              partner medical facilities, and enhance user experience to make
              healthcare more convenient.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Leadership team
            </h2>
            <p className="text-gray-500">
              A team of experienced and passionate medical professionals
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i} className="text-center">
                <div className="w-24 h-24 rounded-full bg-sky-100 border-4 border-sky-200 flex items-center justify-center text-sky-600 text-3xl font-bold mx-auto mb-4">
                  {member.initials}
                </div>
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-sky-600 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Development journey
          </h2>
          <p className="text-gray-500">
            Important milestones in the journey of HealthCare
          </p>
        </div>
        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-sky-200 -translate-y-1/2" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((m, i) => (
              <div key={i} className="relative text-center">
                <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto mb-4 relative z-10 shadow">
                  {m.year}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{m.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sky-600 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to book an appointment?
          </h2>
          <p className="text-sky-100 mb-8 text-lg">
            Register an account and book an appointment today to experience
            convenient healthcare services.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-sky-700 rounded-xl font-bold hover:bg-sky-50 transition shadow">
              Book an appointment
            </button>
            <button className="px-8 py-3 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition">
              Contact us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
