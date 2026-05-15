/** @format */

import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
                HC
              </div>
              <span className="text-xl font-bold">HealthCare</span>
            </div>
            <p className="text-gray-400">
              The leading platform for booking medical appointments in Vietnam
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  General Checkup
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Dental
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Cardiology
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">About Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Introduction
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Team
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  News
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>1900 xxxx</li>
              <li>info@healthcare.vn</li>
              <li>123 ABC Street, Q.1, TP.HCM</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 HealthCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
