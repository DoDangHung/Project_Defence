import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BookingHomePage from './Steps/BookingHomePage';
import SpecialtyDetail from './Steps/SpecialtyDetail';
import StepClinic from './Steps/StepClinic';

export default function Booking() {
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

  const specialties = [
    { id: 'noi-khoa', name: 'Nội khoa', icon: '🏥' },
    { id: 'khoa-nhi', name: 'Nhi khoa', icon: '👶' },
    { id: 'san-phu-khoa', name: 'Sản phụ khoa', icon: '🤰' },
    { id: 'rang-ham-mat', name: 'Răng hàm mặt', icon: '🦷' },
    { id: 'mat', name: 'Mắt', icon: '👁️' },
    { id: 'tai-mui-hong', name: 'Tai mũi họng', icon: '👂' },
    { id: 'da-lieu', name: 'Da liễu', icon: '💆' },
    { id: 'tim-mach', name: 'Tim mạch', icon: '❤️' },
  ];

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

  // Tính toán step hiện tại từ URL
  const getCurrentStep = () => {
    const path = location.pathname;
    if (path === '/booking' || path === '/booking/') return 1;
    if (path.includes('/clinics/') && !path.includes('/doctors/')) return 2;
    if (path.includes('/doctors/')) return 3;
    if (path.includes('/confirm')) return 4;
    if (path.includes('/payment')) return 5;
    if (path.includes('/success')) return 6;
    return 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header với progress bar */}
        <BookingHomePage step={getCurrentStep()} />

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/*
           */}
          <Outlet
            context={{
              bookingData,
              specialties,
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
