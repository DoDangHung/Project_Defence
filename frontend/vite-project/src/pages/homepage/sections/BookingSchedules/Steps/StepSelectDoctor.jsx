import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Phone,
  Star,
  Briefcase,
  DollarSign,
  Building2,
} from 'lucide-react';
import StepSelectDate from './StepSelectDate';
import StepSelectTime from './StepSelectTime';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';

const StepSelectDoctor = () => {
  const [filters, setFilters] = useState({
    gender: 'all',
    experience: '5+',
    feeRange: [50, 200],
    availability: 'morning',
    consultType: 'on-site',
  });
  const [doctors, setDoctors] = useState([]);
  const [activeDoctorId, setActiveDoctorId] = useState(null);
  const [scheduleData, setScheduleData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const { specialtySlug, clinicId } = useParams();

  useEffect(() => {
    if (!clinicId) return;
    Promise.all([
      axios.get(`http://localhost:8080/api/clinics/${clinicId}`),
      axios.get(`http://localhost:8080/api/clinics/${clinicId}/doctors`),
    ])
      .then(([clinicRes, doctorsRes]) => {
        setSelectedClinic(clinicRes.data?.data || clinicRes.data);
        setDoctors(doctorsRes.data?.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Cannot load data:', err.message);
        setLoading(false);
      });
  }, [clinicId]);

  const handleSelectDoctor = async (doctor) => {
    setActiveDoctorId(doctor.id);

    // Lưu thông tin doctor vào localStorage
    const booking = JSON.parse(localStorage.getItem('booking')) || {};
    localStorage.setItem(
      'booking',
      JSON.stringify({
        ...booking,
        doctorId: doctor.id,
        doctorFirstName: doctor.user?.firstName,
        doctorLastName: doctor.user?.lastName,
        doctorName: `${doctor.user?.firstName} ${doctor.user?.lastName}`,
        doctorSpecialization: doctor.specialization,
        clinicId: doctor.clinic?.id,
        clinicName: doctor.clinic?.name,
        clinicAddress: doctor.clinic?.address,
        consultationFee: doctor.clinic?.latitude,
      }),
    );

    // Nếu đã load schedule rồi thì không cần fetch nữa
    if (scheduleData[doctor.id]) return;

    try {
      const res = await axios.get(
        `http://localhost:8080/api/schedules/doctor/${doctor.id}`,
      );
      setScheduleData((prev) => ({
        ...prev,
        [doctor.id]: res.data.data,
      }));
    } catch (err) {
      console.error('Cannot load schedule:', err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Đang tải danh sách bác sĩ...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Chọn bác sĩ</h2>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">{selectedClinic?.name}</span>{' '}
          {selectedClinic?.address}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-5 sticky top-4">
            <h3 className="font-bold text-gray-800 mb-4">Bộ lọc</h3>

            {/* Gender Filter */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Giới tính
              </label>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={filters.gender === 'all'}
                    onChange={() => setFilters({ ...filters, gender: 'all' })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Tất cả</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={filters.gender === 'male'}
                    onChange={() => setFilters({ ...filters, gender: 'male' })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Bác sĩ nam</span>
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
                  <span className="ml-2 text-sm text-gray-700">Bác sĩ nữ</span>
                </label>
              </div>
            </div>

            {/* Experience Filter */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kinh nghiệm
              </label>
              <select
                value={filters.experience}
                onChange={(e) =>
                  setFilters({ ...filters, experience: e.target.value })
                }
                className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none text-sm"
              >
                <option value="5+">5+ Năm</option>
                <option value="10+">10+ Năm</option>
                <option value="15+">15+ Năm</option>
              </select>
            </div>

            {/* Visiting Fees Filter */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phí khám: {filters.feeRange[0].toLocaleString('vi-VN')}đ -{' '}
                {filters.feeRange[1].toLocaleString('vi-VN')}đ
              </label>
              <input
                type="range"
                min="50000"
                max="500000"
                step="10000"
                value={filters.feeRange[1]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    feeRange: [50000, parseInt(e.target.value)],
                  })
                }
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Doctors List */}
        <div className="lg:col-span-3">
          <div className="mb-4">
            <p className="text-gray-600">
              Có <strong>{doctors.length}</strong> bác sĩ
            </p>
          </div>

          <div className="space-y-4">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className={`bg-white rounded-xl border-2 p-5 transition-all hover:shadow-lg ${
                  activeDoctorId === doc.id
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Doctor Info - Left Side */}
                  <div className="flex gap-4 flex-1">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 overflow-hidden">
                      {doc.user?.avatar ? (
                        <img
                          src={doc.user.avatar}
                          alt={doc.user.firstName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>
                          {doc.user?.firstName?.charAt(0)}
                          {doc.user?.lastName?.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        BS. {doc.user?.firstName} {doc.user?.lastName}
                      </h3>
                      <p className="text-sm text-cyan-600 font-medium mb-2">
                        {doc.specialization}
                      </p>

                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold">
                            {doc.rating || '5.0'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{doc.experience || '10'} năm</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <span>{doc.user.phone}</span>
                        </div>
                      </div>

                      {/* ✅ THÊM PHẦN HIỂN THỊ GIÁ VÀ PHÒNG KHÁM */}
                      {doc.clinic && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 w-fit">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="text-xs text-green-700">Phí khám</p>
                              <p className="text-lg font-bold text-green-600">
                                {doc.clinic?.latitude?.toLocaleString(
                                  'vi-VN',
                                ) || '200,000'}
                                đ
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <Building2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">
                                {doc.clinic?.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {doc.clinic?.address}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side - Actions */}
                  <div className="flex flex-col gap-3 min-w-[180px]">
                    <button
                      onClick={() => handleSelectDoctor(doc)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                        activeDoctorId === doc.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-orange-400 hover:bg-orange-500 text-white'
                      }`}
                    >
                      {activeDoctorId === doc.id ? 'Đã chọn' : 'Đặt lịch ngay'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Date and Time Selection - Show when doctor is selected */}
          {activeDoctorId && (
            <div className="mt-8 bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Chọn ngày và giờ khám
              </h3>
              <StepSelectTime
                doctorId={activeDoctorId}
                onSelectTime={(schedule) => {
                  setSelectedSchedule(schedule);
                }}
              />
            </div>
          )}

          {doctors.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-600">Không có bác sĩ nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepSelectDoctor;
