import React, { useState } from 'react';

const clinics = [
  {
    id: 'clinic1',
    name: 'Phòng khám MedPro - Quận 1',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    distance: '2.5 km',
    rating: 4.8,
    specialties: ['noi-khoa', 'nhi-khoa', 'da-lieu', 'tim-mach'],
  },
  {
    id: 'clinic2',
    name: 'Phòng khám MedPro - Quận 3',
    address: '456 Võ Văn Tần, Quận 3, TP.HCM',
    distance: '3.2 km',
    rating: 4.7,
    specialties: ['noi-khoa', 'san-phu-khoa', 'tai-mui-hong'],
  },
  {
    id: 'clinic3',
    name: 'Phòng khám MedPro - Bình Thạnh',
    address: '789 Điện Biên Phủ, Bình Thạnh, TP.HCM',
    distance: '4.1 km',
    rating: 4.9,
    specialties: ['nhi-khoa', 'rang-ham-mat', 'mat', 'da-lieu'],
  },
  {
    id: 'clinic4',
    name: 'Phòng khám MedPro - Tân Bình',
    address: '321 Cộng Hòa, Tân Bình, TP.HCM',
    distance: '5.0 km',
    rating: 4.6,
    specialties: ['noi-khoa', 'tim-mach', 'tai-mui-hong', 'mat'],
  },
  {
    id: 'clinic5',
    name: 'Phòng khám MedPro - Phú Nhuận',
    address: '567 Phan Xích Long, Phú Nhuận, TP.HCM',
    distance: '3.8 km',
    rating: 4.8,
    specialties: ['san-phu-khoa', 'nhi-khoa', 'rang-ham-mat'],
  },
];

const StepClinic = ({ onNext, onBack }) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const filteredClinics = clinics.filter((clinic) =>
    clinic.specialties.includes(bookingData.specialty)
  );

  const selectedClinic = clinics.find((c) => c.id === bookingData.clinic);
  const selectedSpecialty = specialties.find(
    (s) => s.id === bookingData.specialty
  );

  const resetBooking = () => {
    setStep(1);
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
    setShowConfirmation(false);
  };
  return <></>;
};

export default StepClinic;
