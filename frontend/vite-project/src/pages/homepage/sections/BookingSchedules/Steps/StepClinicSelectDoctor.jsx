import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Star, Clock, DollarSign, Calendar } from 'lucide-react';
import axios from 'axios';

export default function StepClinicSelectDoctor() {
  const { clinicSlug, specialtySlug } = useParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [clinic, setClinic] = useState(null);
  const [specialty, setSpecialty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch clinic and specialty info
        const clinicRes = await axios.get(`http://localhost:8080/api/clinics/slug/${clinicSlug}`);
        const specialtyRes = await axios.get(`http://localhost:8080/api/specialties/slug/${specialtySlug}`);
        
        if (clinicRes.data?.data) {
          setClinic(clinicRes.data.data);
        }
        if (specialtyRes.data?.data) {
          setSpecialty(specialtyRes.data.data);
        }
        
        // Fetch doctors for this clinic
        const doctorsRes = await axios.get(`http://localhost:8080/api/clinics/${clinicRes.data?.data?.id}/doctors`);
        if (doctorsRes.data?.data) {
          // Filter doctors by specialty
          const allDoctors = doctorsRes.data.data;
          const filtered = allDoctors.filter(doc => 
            doc.specialization?.toLowerCase().includes(specialtySlug.toLowerCase()) ||
            doc.specialtyId
          );
          setDoctors(filtered.length > 0 ? filtered : allDoctors);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [clinicSlug, specialtySlug]);

  const handleSelectDoctor = async (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(null);
    setSlots([]);
    
    // Fetch schedules for selected doctor
    setSlotsLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/schedules/doctor/${doctor.id}`);
      const schedules = res.data?.data || [];
      
      // Process schedules to get slots
      const allSlots = [];
      schedules.forEach(schedule => {
        if (schedule.slots && Array.isArray(schedule.slots)) {
          schedule.slots.forEach(slot => {
            allSlots.push({
              ...slot,
              scheduleId: schedule.id,
              date: schedule.date,
              roomId: schedule.roomId,
            });
          });
        }
      });
      
      setSlots(allSlots.filter(s => !s.isBooked && new Date(s.end) > new Date()));
    } catch (err) {
      console.error('Failed to load schedules:', err);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleBookDoctor = () => {
    if (!selectedDoctor || !selectedSlot) return;

    const booking = JSON.parse(localStorage.getItem('booking')) || {};
    localStorage.setItem(
      'booking',
      JSON.stringify({
        ...booking,
        doctorId: selectedDoctor.id,
        doctorFirstName: selectedDoctor.user?.firstName,
        doctorLastName: selectedDoctor.user?.lastName,
        doctorName: `${selectedDoctor.user?.firstName} ${selectedDoctor.user?.lastName}`,
        doctorSpecialization: selectedDoctor.specialization,
        clinicId: clinic?.id,
        clinicName: clinic?.name,
        clinicAddress: clinic?.address,
        specialtyId: specialty?.id,
        specialtyName: specialty?.name,
        scheduleId: selectedSlot.scheduleId,
        slotId: selectedSlot.id,
        appointmentDate: selectedSlot.start?.slice(0, 10),
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
      }),
    );

    navigate('/clinic-booking/formAuth');
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Get unique dates from slots
  const availableDates = [...new Set(slots.map(s => s.start?.slice(0, 10))).values()].sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Đang tải danh sách bác sĩ...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/clinic-booking/${clinicSlug}/specialties`)}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Quay lại
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-8">
        <h2 className="text-2xl font-bold mb-1">{clinic?.name}</h2>
        <p className="text-blue-100 mb-2">{specialty?.name}</p>
        <p className="text-blue-200 text-sm">
          {[clinic?.address, clinic?.ward, clinic?.district, clinic?.city].filter(Boolean).join(', ')}
        </p>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-800 mb-6">Chọn bác sĩ và thời gian</h3>

      {/* Doctors List */}
      {doctors.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">Không có bác sĩ nào cho chuyên khoa này</p>
        </div>
      ) : (
        <div className="space-y-4">
          {doctors.map((doctor) => {
            const isSelected = selectedDoctor?.id === doctor.id;
            return (
              <div
                key={doctor.id}
                className={`bg-white rounded-2xl border-2 p-5 transition-all cursor-pointer ${
                  isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
                onClick={() => handleSelectDoctor(doctor)}
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-xl bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600 shrink-0">
                    {doctor.user?.avatar ? (
                      <img src={doctor.user.avatar} alt="" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span>{doctor.user?.firstName?.charAt(0)}{doctor.user?.lastName?.charAt(0)}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">
                          BS. {doctor.user?.firstName} {doctor.user?.lastName}
                        </h4>
                        <p className="text-cyan-600 font-medium">{doctor.specialization}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-yellow-600">{doctor.rating || '5.0'}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                      {doctor.experience && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {doctor.experience} năm kinh nghiệm
                        </div>
                      )}
                      {doctor.user?.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {doctor.user.phone}
                        </div>
                      )}
                      {clinic?.consultationFee && (
                        <div className="flex items-center gap-1 text-green-600 font-semibold">
                          <DollarSign className="w-4 h-4" />
                          {Number(clinic.consultationFee).toLocaleString('vi-VN')}đ
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center">
                    <button
                      className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-orange-400 hover:bg-orange-500 text-white'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectDoctor(doctor);
                      }}
                    >
                      {isSelected ? 'Đã chọn' : 'Chọn'}
                    </button>
                  </div>
                </div>

                {/* Time Slots - Show when doctor is selected */}
                {isSelected && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    {slotsLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Đang tải lịch khám...</span>
                      </div>
                    ) : availableDates.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">Bác sĩ chưa có lịch khám</p>
                    ) : (
                      <>
                        {/* Date Selection */}
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Chọn ngày khám
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {availableDates.map((date) => (
                              <button
                                key={date}
                                onClick={() => {
                                  setSelectedDate(date);
                                  setSelectedSlot(null);
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  selectedDate === date
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {new Date(date).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' })}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Time Slots */}
                        {selectedDate && (
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Khung giờ khám</p>
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                              {slots
                                .filter(s => s.start?.slice(0, 10) === selectedDate)
                                .map((slot) => {
                                  const isSlotSelected = selectedSlot?.id === slot.id;
                                  return (
                                    <button
                                      key={slot.id || `${slot.scheduleId}-${slot.index}`}
                                      onClick={() => setSelectedSlot(slot)}
                                      className={`py-2 px-3 rounded-lg text-sm font-medium border-2 transition-all ${
                                        isSlotSelected
                                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                                          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                                      }`}
                                    >
                                      {formatTime(slot.start)}
                                    </button>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Book Button */}
      {selectedDoctor && selectedSlot && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleBookDoctor}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg"
          >
            Tiếp tục đặt lịch
          </button>
        </div>
      )}
    </div>
  );
}
