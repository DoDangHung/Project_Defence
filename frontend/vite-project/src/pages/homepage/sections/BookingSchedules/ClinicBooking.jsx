import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BookingHomePage from './Steps/BookingHomePage';

export default function ClinicBooking() {
  const location = useLocation();
  const [bookingData, setBookingData] = useState({
    specialty: '',
    clinic: null,
    doctor: null,
    date: '',
    time: '',
    fullName: '',
    phone: '',
    email: '',
    dob: '',
    gender: '',
    reason: '',
    medicalHistory: '',
    bookingFor: 'self',
    consultType: 'offline',
    payment: 'cash',
  });
  const [paymentMethod, setPaymentMethod] = useState(null);

  const resetBooking = () => {
    setBookingData({
      specialty: '',
      clinic: '',
      doctor: '',
      date: '',
      time: '',
      fullName: '',
      phone: '',
      email: '',
      reason: '',
      address: '',
    });
  };

  // Calculate current step from URL
  const getCurrentStep = () => {
    const path = location.pathname;
    if (path === '/clinic-booking' || path === '/clinic-booking/') return 1;
    if (path.includes('/specialties')) return 2;
    if (path.includes('/doctors')) return 3;
    if (path.includes('/formAuth')) return 4;
    if (path.includes('/formData')) return 5;
    if (path.includes('/payments')) return 6;
    if (path.includes('/success')) return 7;
    return 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with progress bar */}
        <BookingHomePage step={getCurrentStep()} />

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <Outlet
            context={{
              bookingData,
              paymentMethod,
              setPaymentMethod,
              resetBooking,
            }}
          />
        </div>
      </div>
    </div>
  );
}
