import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Star, Briefcase } from 'lucide-react';
import StepSelectDate from './StepSelectDate';
import StepSelectTime from './StepSelectTime';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
const StepSelectDoctor = ({ selectedClinic }) => {
  // Filters state
  const [filters, setFilters] = useState({
    gender: 'all',
    experience: '5+',
    feeRange: [50, 200],
    availability: 'morning',
    consultType: 'on-site',
  });
  const [doctor, setDoctor] = useState([]);
  const [doctorSchedules, setDoctorSchedules] = useState({});
  const [activeDoctorId, setActiveDoctorId] = useState(null);
  const [scheduleData, setScheduleData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [error, setError] = useState(null);
  const { specialtySlug, clinicId } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/clinics/${clinicId}/doctors`)

      .then((res) => {
        console.log('data from Doctor', res.data);
        setDoctor(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log('Cant loading data', err.message);
      });
  }, [clinicId]);

  const navigate = useNavigate();

  const handleSelectDoctor = async (doctorId) => {
    setActiveDoctorId(doctorId);

    // Nếu đã load rồi thì không cần fetch nữa
    if (scheduleData[doctorId]) return;

    try {
      const res = await axios.get(
        `http://localhost:8080/api/schedules/doctor/${doctorId}`
      );
      console.log('data from booking schedule: ', res.data);
      setScheduleData((prev) => ({
        ...prev,
        [doctorId]: res.data.data,
      }));
    } catch (err) {
      console.log('Cant load schedule', err.message);
    }
  };

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
                    onChange={() => setFilters({ ...filters, gender: 'all' })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">All</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={filters.gender === 'male'}
                    onChange={() => setFilters({ ...filters, gender: 'male' })}
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
                Visiting Fees: ${filters.feeRange[0]} - ${filters.feeRange[1]}
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
                  <span className="ml-2 text-sm text-gray-700">Televisit</span>
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
                  <span className="ml-2 text-sm text-gray-700">On-Site</span>
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
                  <span className="ml-2 text-sm text-gray-700">Home Visit</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors List */}
        <div className="lg:col-span-3">
          <div className="mb-4">
            <p className="text-gray-600">Doctors Available</p>
          </div>

          <div className="space-y-4">
            <div
              className={`bg-white rounded-xl border-2 p-5 transition-all hover:shadow-lg `}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Doctor Info */}
                {doctor.map((doc) => (
                  <div key={doc.id} className="flex gap-4 flex-1">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                      <img src={doc.user.avatar} />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800"></h3>
                      <p className="text-sm text-gray-600 mb-2"></p>

                      <p className="text-sm font-medium text-gray-700 mb-3">
                        {`${doc.user.firstName} ${doc.user.lastName}`}
                      </p>

                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold">{doc.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          <span> {doc.experience} Years</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Right Side - Specialties & Actions */}
                {doctor.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col items-end gap-3 min-w-[200px]"
                  >
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Specialities:
                      </p>
                      <span className="inline-block bg-cyan-100 text-cyan-700 text-xs px-3 py-1 rounded-full font-medium">
                        {doc.specialization}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{doc.user.phone}</span>
                    </div>

                    <button
                      onClick={() => handleSelectDoctor(doc.id)}
                      className="cursor-pointer bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold transition-all w-full"
                    >
                      Booking Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Date and Time Selection - Show when doctor is selected */}

          <div className="mt-8 bg-blue-50 rounded-xl p-6 ">
            <StepSelectDate />

            <StepSelectTime
              doctorId={1} // hoặc doctorId từ state
              onSelectTime={(schedule) => {
                setSelectedSchedule(schedule);
                console.log('Selected:', schedule);
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate(-1)}
          className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
        >
          Quay lại
        </button>
        <button
          disabled={''}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default StepSelectDoctor;
