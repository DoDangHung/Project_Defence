/** @format */

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Heart,
} from "lucide-react";

const faqs = [
  {
    q: "How to book an appointment  ?",
    a: "You can book an appointment directly on our website or app. Choose a specialty, doctor and time that suits you, then fill in your personal information to complete the booking.",
  },
  {
    q: "Can I cancel an appointment?",
    a: "Yes, you can cancel an appointment at least 2 hours before the appointment time. Cancellation is free and you will be refunded if you have paid in advance.",
  },
  {
    q: "How to pay?",
    a: "You can pay directly at the medical facility after the consultation. Some services allow online payment through digital wallets or bank cards.",
  },
  {
    q: "Can doctors provide online consultation?",
    a: "Currently, you can book an appointment directly at the medical facility. The online consultation feature is being developed and will be released soon.",
  },
  {
    q: "Is the appointment accurate?",
    a: "We commit to accurate appointment times as per your booking. You will receive a reminder via SMS/email 30 minutes before your appointment.",
  },
];

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-sky-700 to-sky-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact</h1>
          <p className="text-sky-100 text-lg max-w-2xl mx-auto">
            Do you have any questions or need support? Our customer support team
            is always ready to help you.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Phone className="w-6 h-6" />,
                title: "Hotline",
                lines: ["1900 1234", "24/7 support"],
              },
              {
                icon: <Mail className="w-6 h-6" />,
                title: "Email",
                lines: ["hotro@healthcare.vn", "Response in 24h"],
              },
              {
                icon: <MapPin className="w-6 h-6" />,
                title: "Address",
                lines: ["123 Nguyễn Huệ, Q.1", "TP. Hồ Chí Minh"],
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Working hours",
                lines: ["Monday - Sunday: 7h-17h", "Sunday: off"],
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-sky-50/50 transition"
              >
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">
                    {item.title}
                  </h3>
                  {item.lines.map((line, j) => (
                    <p key={j} className="text-gray-500 text-sm">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form & FAQ */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Send a message to us
            </h2>
            <p className="text-gray-500 mb-8">
              Fill in the information below and we will contact you as soon as
              possible.
            </p>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  Thank you!
                </h3>
                <p className="text-gray-500">
                  Your message has been sent successfully. We will respond to
                  you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="0901 234 567"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) =>
                        setForm({ ...form, subject: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 text-gray-600"
                    >
                      <option value="">Select subject</option>
                      <option>Consultation for booking an appointment</option>
                      <option>Technical support</option>
                      <option>Collaboration with medical facilities</option>
                      <option>Suggestions / Feedback</option>
                      <option>Khác</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <textarea
                    required
                    rows="5"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Describe the issue or question in detail..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                >
                  <Send className="w-5 h-5" />
                  Send message
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 mb-8">Common questions from users</p>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 group"
                >
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none text-gray-900 font-medium text-sm hover:text-sky-600 transition">
                    {faq.q}
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="px-5 pb-4 text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-3">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>

            {/* Quick Contact */}
            <div className="mt-8 bg-sky-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    Online chat
                  </h3>
                  <p className="text-gray-500 text-xs">
                    Response in a few minutes
                  </p>
                </div>
              </div>
              <button className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl font-semibold transition">
                Start chat
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center text-gray-400">
          <MapPin className="w-8 h-8 mr-2" />
          Map - 123 Nguyễn Huệ, Q.1, TP. HCM
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
