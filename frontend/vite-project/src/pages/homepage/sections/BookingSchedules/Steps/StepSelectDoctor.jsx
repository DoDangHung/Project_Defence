import React, { useState } from 'react';
import { MapPin, Phone, Star, Briefcase } from 'lucide-react';
import StepSelectDate from './StepSelectDate';
import StepSelectTime from './StepSelectTime';
const StepSelectDoctor = ({
  step,
  setStep,
  selectedClinic,
  bookingData,
  handleInputChange,
}) => {
  // Filters state
  const [filters, setFilters] = useState({
    gender: 'all',
    experience: '5+',
    feeRange: [50, 200],
    availability: 'morning',
    consultType: 'on-site',
  });

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
  return (
    <div>
      {step === 3 && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Chọn bác sĩ
            </h2>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">{selectedClinic?.name}</span> •{' '}
              {selectedClinic?.address}
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
                      <span className="ml-2 text-sm text-gray-700">All</span>
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
                          onClick={() => handleInputChange('doctor', doc.name)}
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
                  <StepSelectDate
                    bookingData={bookingData}
                    handleInputChange={handleInputChange}
                  />

                  <StepSelectTime
                    timeSlots={timeSlots}
                    bookingData={bookingData}
                    handleInputChange={handleInputChange}
                  />
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
                !bookingData.doctor || !bookingData.date || !bookingData.time
              }
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            >
              Tiếp tục
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepSelectDoctor;
