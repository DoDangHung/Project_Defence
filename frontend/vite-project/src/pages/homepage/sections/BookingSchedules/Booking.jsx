import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  ChevronRight,
  Check,
  Building2,
  Navigation,
  Star,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import FormData from './Steps/FormData';

export default function Booking() {
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

  // Filters state
  const [filters, setFilters] = useState({
    gender: 'all',
    experience: '5+',
    feeRange: [50, 200],
    availability: 'morning',
    consultType: 'on-site',
  });

  const specialties = [
    { id: 'noi-khoa', name: 'Nội khoa', icon: '🏥' },
    { id: 'nhi-khoa', name: 'Nhi khoa', icon: '👶' },
    { id: 'san-phu-khoa', name: 'Sản phụ khoa', icon: '🤰' },
    { id: 'rang-ham-mat', name: 'Răng hàm mặt', icon: '🦷' },
    { id: 'mat', name: 'Mắt', icon: '👁️' },
    { id: 'tai-mui-hong', name: 'Tai mũi họng', icon: '👂' },
    { id: 'da-lieu', name: 'Da liễu', icon: '💆' },
    { id: 'tim-mach', name: 'Tim mạch', icon: '❤️' },
  ];

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

  const doctors = {
    clinic1: [
      {
        id: 'bs1',
        name: 'Dr. Nguyễn Văn An',
        degree: 'BDS, MDS',
        fee: 58,
        rating: 4.7,
        experience: '15+',
        location: 'Quận 1',
        gender: 'male',
        phone: '+1 (658) 738 1100',
        specialty: 'Orthodontist & Dentofacial Orthopedist',
        image: '👨‍⚕️',
      },
      {
        id: 'bs2',
        name: 'Dr. Trần Thị Bích',
        degree: 'BDS, MDS',
        fee: 100,
        rating: 4.8,
        experience: '12+',
        location: 'Quận 1',
        gender: 'female',
        phone: '+1 (876) 977 1103',
        specialty: 'Orthodontist & Dentofacial Orthopedist',
        image: '👩‍⚕️',
      },
      {
        id: 'bs3',
        name: 'Dr. Lê Minh Châu',
        degree: 'BDS, MDS',
        fee: 40,
        rating: 4.5,
        experience: '8+',
        location: 'Quận 1',
        gender: 'female',
        phone: '+1 (764) 875 4368',
        specialty: 'Pediatric Specialist',
        image: '👩‍⚕️',
      },
    ],
    clinic2: [
      {
        id: 'bs4',
        name: 'Dr. Phạm Văn Đức',
        degree: 'MD, PhD',
        fee: 80,
        rating: 4.9,
        experience: '18+',
        location: 'Quận 3',
        gender: 'male',
        phone: '+1 (658) 738 1100',
        specialty: 'Internal Medicine Specialist',
        image: '👨‍⚕️',
      },
      {
        id: 'bs5',
        name: 'Dr. Hoàng Thị Hương',
        degree: 'MD, OBGYN',
        fee: 120,
        rating: 4.8,
        experience: '14+',
        location: 'Quận 3',
        gender: 'female',
        phone: '+1 (876) 977 1103',
        specialty: 'Obstetrician & Gynecologist',
        image: '👩‍⚕️',
      },
    ],
    clinic3: [
      {
        id: 'bs6',
        name: 'Dr. Võ Minh Khoa',
        degree: 'BDS, MDS',
        fee: 65,
        rating: 4.6,
        experience: '11+',
        location: 'Bình Thạnh',
        gender: 'male',
        phone: '+1 (764) 875 4368',
        specialty: 'Orthodontist & Dentofacial Orthopedist',
        image: '👨‍⚕️',
      },
      {
        id: 'bs7',
        name: 'Dr. Đặng Thị Lan',
        degree: 'MD, Ophth',
        fee: 90,
        rating: 4.7,
        experience: '9+',
        location: 'Bình Thạnh',
        gender: 'female',
        phone: '+1 (658) 738 1100',
        specialty: 'Ophthalmologist',
        image: '👩‍⚕️',
      },
    ],
    clinic4: [
      {
        id: 'bs8',
        name: 'Dr. Bùi Văn Minh',
        degree: 'MD, Cardio',
        fee: 110,
        rating: 4.9,
        experience: '16+',
        location: 'Tân Bình',
        gender: 'male',
        phone: '+1 (876) 977 1103',
        specialty: 'Cardiologist',
        image: '👨‍⚕️',
      },
      {
        id: 'bs9',
        name: 'Dr. Ngô Thị Nga',
        degree: 'MD, ENT',
        fee: 75,
        rating: 4.6,
        experience: '13+',
        location: 'Tân Bình',
        gender: 'female',
        phone: '+1 (764) 875 4368',
        specialty: 'ENT Specialist',
        image: '👩‍⚕️',
      },
    ],
    clinic5: [
      {
        id: 'bs10',
        name: 'Dr. Trương Văn Phong',
        degree: 'MD, OBGYN',
        fee: 95,
        rating: 4.8,
        experience: '12+',
        location: 'Phú Nhuận',
        gender: 'male',
        phone: '+1 (658) 738 1100',
        specialty: 'Obstetrician & Gynecologist',
        image: '👨‍⚕️',
      },
      {
        id: 'bs11',
        name: 'Dr. Lý Thị Quỳnh',
        degree: 'MD, Peds',
        fee: 70,
        rating: 4.7,
        experience: '10+',
        location: 'Phú Nhuận',
        gender: 'female',
        phone: '+1 (876) 977 1103',
        specialty: 'Pediatric Specialist',
        image: '👩‍⚕️',
      },
    ],
  };

  const timeSlots = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
  ];

  const handleInputChange = (field, value) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setShowConfirmation(true);
  };

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

  const filteredClinics = clinics.filter((clinic) =>
    clinic.specialties.includes(bookingData.specialty)
  );

  const selectedClinic = clinics.find((c) => c.id === bookingData.clinic);
  const selectedSpecialty = specialties.find(
    (s) => s.id === bookingData.specialty
  );

  // Filter doctors based on filters
  const availableDoctors = doctors[bookingData.clinic] || [];
  const filteredDoctors = availableDoctors.filter((doc) => {
    if (filters.gender !== 'all' && doc.gender !== filters.gender) return false;
    if (filters.experience !== '5+') {
      const exp = parseInt(doc.experience);
      const reqExp = parseInt(filters.experience);
      if (exp < reqExp) return false;
    }
    if (doc.fee < filters.feeRange[0] || doc.fee > filters.feeRange[1])
      return false;
    return true;
  });

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full animate-fade-in">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Đặt lịch thành công!
            </h2>
            <p className="text-gray-600">
              Chúng tôi đã nhận được yêu cầu đặt lịch của bạn
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 mb-6 space-y-3">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">
              Thông tin đặt lịch
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Chuyên khoa</p>
                <p className="font-semibold text-gray-800">
                  {selectedSpecialty?.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phòng khám</p>
                <p className="font-semibold text-gray-800">
                  {selectedClinic?.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedClinic?.address}
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Bác sĩ</p>
                  <p className="font-semibold text-gray-800">
                    {bookingData.doctor}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày khám</p>
                  <p className="font-semibold text-gray-800">
                    {bookingData.date}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Giờ khám</p>
                  <p className="font-semibold text-gray-800">
                    {bookingData.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Họ tên</p>
                  <p className="font-semibold text-gray-800">
                    {bookingData.fullName}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Số điện thoại</p>
                <p className="font-semibold text-gray-800">
                  {bookingData.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Lưu ý:</strong> Vui lòng đến trước giờ hẹn 15 phút để làm
              thủ tục. Chúng tôi sẽ gửi tin nhắn xác nhận đến số điện thoại của
              bạn.
            </p>
          </div>

          <button
            onClick={resetBooking}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all"
          >
            Đặt lịch mới
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            MedPro Booking
          </h1>
          <p className="text-gray-600">Đặt lịch khám bệnh trực tuyến</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto pb-2">
            {[
              { num: 1, label: 'Chuyên khoa' },
              { num: 2, label: 'Phòng khám' },
              { num: 3, label: 'Bác sĩ & lịch' },
              { num: 4, label: 'Thông tin' },
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= s.num
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {s.num}
                  </div>
                  <span className="text-xs mt-1 text-gray-600 whitespace-nowrap">
                    {s.label}
                  </span>
                </div>
                {idx < 3 && (
                  <ChevronRight className="text-gray-400 mt-2 hidden md:block" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Step 1: Chọn chuyên khoa */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Chọn chuyên khoa
              </h2>
              <div className="grid grid-flow-col grid-rows-4 gap-4">
                {specialties.map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => handleInputChange('specialty', spec.id)}
                    className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                      bookingData.specialty === spec.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{spec.icon}</div>
                    <div className="text-sm font-semibold text-gray-700">
                      {spec.name}
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => bookingData.specialty && setStep(2)}
                  disabled={!bookingData.specialty}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Chọn phòng khám */}
          {step === 2 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Chọn phòng khám
                </h2>
                <p className="text-gray-600 mt-1">
                  Chuyên khoa:{' '}
                  <span className="font-semibold text-blue-600">
                    {selectedSpecialty?.name}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {filteredClinics.map((clinic) => (
                  <button
                    key={clinic.id}
                    onClick={() => handleInputChange('clinic', clinic.id)}
                    className={`w-full p-5 rounded-xl border-2 text-left transition-all hover:shadow-lg ${
                      bookingData.clinic === clinic.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-800 text-lg">
                              {clinic.name}
                            </h3>
                            <div className="flex items-center mt-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-1" />
                              {clinic.address}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="flex items-center text-yellow-500 text-sm">
                              <span className="font-semibold">
                                ★ {clinic.rating}
                              </span>
                            </div>
                            <div className="flex items-center mt-1 text-sm text-gray-600">
                              <Navigation className="w-4 h-4 mr-1" />
                              {clinic.distance}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Quay lại
                </button>
                <button
                  onClick={() => bookingData.clinic && setStep(3)}
                  disabled={!bookingData.clinic}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Chọn bác sĩ và lịch */}
          {step === 3 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  Chọn bác sĩ
                </h2>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">{selectedClinic?.name}</span>{' '}
                  • {selectedClinic?.address}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-xl p-5 sticky top-4">
                    <h3 className="font-bold text-gray-800 mb-4">Filters</h3>

                    {/* Gender Filter */}
                    <div className="mb-5">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gender
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            checked={filters.gender === 'all'}
                            onChange={() =>
                              setFilters({ ...filters, gender: 'all' })
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            All
                          </span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            checked={filters.gender === 'male'}
                            onChange={() =>
                              setFilters({ ...filters, gender: 'male' })
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Male Doctor
                          </span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            checked={filters.gender === 'female'}
                            onChange={() =>
                              setFilters({ ...filters, gender: 'female' })
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Female Doctor
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Experience Filter */}
                    <div className="mb-5">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Experience
                      </label>
                      <select
                        value={filters.experience}
                        onChange={(e) =>
                          setFilters({ ...filters, experience: e.target.value })
                        }
                        className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none text-sm"
                      >
                        <option value="5+">5+ Years</option>
                        <option value="10+">10+ Years</option>
                        <option value="15+">15+ Years</option>
                      </select>
                    </div>

                    {/* Visiting Fees Filter */}
                    <div className="mb-5">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Visiting Fees: ${filters.feeRange[0]} - $
                        {filters.feeRange[1]}
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        value={filters.feeRange[1]}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            feeRange: [50, parseInt(e.target.value)],
                          })
                        }
                        className="w-full"
                      />
                    </div>

                    {/* Availability Filter */}
                    <div className="mb-5">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Availability
                      </label>
                      <select
                        value={filters.availability}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            availability: e.target.value,
                          })
                        }
                        className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none text-sm"
                      >
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                        <option value="evening">Evening</option>
                      </select>
                    </div>

                    {/* Consult Type Filter */}
                    <div className="mb-5">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Consult Type
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="consultType"
                            checked={filters.consultType === 'televisit'}
                            onChange={() =>
                              setFilters({
                                ...filters,
                                consultType: 'televisit',
                              })
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Televisit
                          </span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="consultType"
                            checked={filters.consultType === 'on-site'}
                            onChange={() =>
                              setFilters({ ...filters, consultType: 'on-site' })
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            On-Site
                          </span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="consultType"
                            checked={filters.consultType === 'home-visit'}
                            onChange={() =>
                              setFilters({
                                ...filters,
                                consultType: 'home-visit',
                              })
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Home Visit
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Doctors List */}
                <div className="lg:col-span-3">
                  <div className="mb-4">
                    <p className="text-gray-600">
                      {filteredDoctors.length} Doctors Available
                    </p>
                  </div>

                  <div className="space-y-4">
                    {filteredDoctors.map((doc) => (
                      <div
                        key={doc.id}
                        className={`bg-white rounded-xl border-2 p-5 transition-all hover:shadow-lg ${
                          bookingData.doctor === doc.name
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          {/* Doctor Info */}
                          <div className="flex gap-4 flex-1">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                              {doc.image}
                            </div>

                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-800">
                                {doc.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {doc.degree}
                              </p>
                              <p className="text-sm font-medium text-gray-700 mb-3">
                                ${doc.fee} Consultation Fee at clinic
                              </p>

                              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                  <span className="font-semibold">
                                    {doc.rating}/5
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Briefcase className="w-4 h-4" />
                                  <span>{doc.experience} Years</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{doc.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Side - Specialties & Actions */}
                          <div className="flex flex-col items-end gap-3 min-w-[200px]">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">
                                Specialities:
                              </p>
                              <span className="inline-block bg-cyan-100 text-cyan-700 text-xs px-3 py-1 rounded-full font-medium">
                                {doc.specialty}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{doc.phone}</span>
                            </div>

                            <button
                              onClick={() =>
                                handleInputChange('doctor', doc.name)
                              }
                              className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold transition-all w-full"
                            >
                              {bookingData.doctor === doc.name
                                ? 'Selected'
                                : 'Book Appointment'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Date and Time Selection - Show when doctor is selected */}
                  {bookingData.doctor && (
                    <div className="mt-8 bg-blue-50 rounded-xl p-6">
                      <h3 className="font-bold text-gray-800 mb-4">
                        Chọn ngày và giờ khám
                      </h3>

                      <div className="!flex !flex-col grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Calendar className="inline w-4 h-4 mr-1" /> Chọn
                            ngày
                          </label>
                          <input
                            type="date"
                            value={bookingData.date}
                            onChange={(e) =>
                              handleInputChange('date', e.target.value)
                            }
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Clock className="inline w-4 h-4 mr-1" /> Chọn giờ
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {timeSlots.slice(0, 6).map((time) => (
                              <button
                                key={time}
                                onClick={() => handleInputChange('time', time)}
                                className={`p-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                                  bookingData.time === time
                                    ? 'border-blue-600 bg-blue-600 text-white'
                                    : 'border-gray-200 hover:border-blue-300 bg-white'
                                }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Khung giờ chiều
                        </label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                          {timeSlots.slice(6).map((time) => (
                            <button
                              key={time}
                              onClick={() => handleInputChange('time', time)}
                              className={`p-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                                bookingData.time === time
                                  ? 'border-blue-600 bg-blue-600 text-white'
                                  : 'border-gray-200 hover:border-blue-300 bg-white'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Quay lại
                </button>
                <button
                  onClick={() =>
                    bookingData.doctor &&
                    bookingData.date &&
                    bookingData.time &&
                    setStep(4)
                  }
                  disabled={
                    !bookingData.doctor ||
                    !bookingData.date ||
                    !bookingData.time
                  }
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Thông tin cá nhân */}
          <FormData
            step={step}
            setStep={setStep}
            bookingData={bookingData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
