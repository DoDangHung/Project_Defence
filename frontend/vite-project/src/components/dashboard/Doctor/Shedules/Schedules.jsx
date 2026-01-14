import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Save,
  AlertCircle,
  CheckCircle,
  Trash2,
} from 'lucide-react';

export default function CreateSchedule() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [createdSchedules, setCreatedSchedules] = useState([]);

  // Load schedules từ localStorage khi component mount
  React.useEffect(() => {
    loadSchedulesFromStorage();
  }, []);
  // Lưu schedules vào localStorage mỗi khi có thay đổi
  React.useEffect(() => {
    if (createdSchedules.length > 0) {
      saveSchedulesToStorage(createdSchedules);
    }
  }, [createdSchedules]);

  // Load và filter schedules từ localStorage
  const loadSchedulesFromStorage = () => {
    try {
      const stored = localStorage.getItem('doctorSchedules');
      if (stored) {
        const schedules = JSON.parse(stored);
        // Filter chỉ lấy lịch chưa qua (endTime > now)
        const upcomingSchedules = schedules.filter((schedule) => {
          const endDateTime = new Date(`${schedule.date}T${schedule.endTime}`);
          return endDateTime > new Date();
        });

        // Cập nhật lại localStorage với lịch còn hiệu lực
        if (upcomingSchedules.length !== schedules.length) {
          saveSchedulesToStorage(upcomingSchedules);
        }

        setCreatedSchedules(upcomingSchedules);
      }
    } catch (error) {
      console.error('Error loading schedules from localStorage:', error);
    }
  };

  // Lưu schedules vào localStorage
  const saveSchedulesToStorage = (schedules) => {
    try {
      localStorage.setItem('doctorSchedules', JSON.stringify(schedules));
    } catch (error) {
      console.error('Error saving schedules to localStorage:', error);
    }
  };

  // Xóa một schedule khỏi localStorage
  const deleteSchedule = (index) => {
    const newSchedules = createdSchedules.filter((_, i) => i !== index);
    setCreatedSchedules(newSchedules);
    saveSchedulesToStorage(newSchedules);
    setMessage({ type: 'success', text: 'Đã xóa lịch làm việc!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  };

  // Tạo danh sách giờ từ 8:00 đến 17:00 (30 phút/slot)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    slots.push('17:00');
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleSlotClick = (time) => {
    setMessage({ type: '', text: '' });
    if (selectedSlots.includes(time)) {
      setSelectedSlots(selectedSlots.filter((slot) => slot !== time));
    } else {
      setSelectedSlots([...selectedSlots, time].sort());
    }
  };

  const handleClearSelection = () => {
    setSelectedSlots([]);
    setMessage({ type: '', text: '' });
  };

  const validateSelection = () => {
    if (selectedSlots.length === 0) {
      setMessage({
        type: 'error',
        text: 'Vui lòng chọn ít nhất một khung giờ!',
      });
      return false;
    }

    if (selectedSlots.length < 2) {
      setMessage({
        type: 'error',
        text: 'Vui lòng chọn ít nhất 2 khung giờ (giờ bắt đầu và kết thúc)!',
      });
      return false;
    }

    const now = new Date();
    const selectedDateTime = new Date(`${selectedDate}T${selectedSlots[0]}`);

    if (selectedDateTime < now) {
      setMessage({ type: 'error', text: 'Không thể tạo lịch trong quá khứ!' });
      return false;
    }

    return true;
  };

  const handleCreateSchedule = async () => {
    if (!validateSelection()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = sessionStorage.getItem('token');

      // Lấy giờ đầu tiên và cuối cùng
      const startTime = selectedSlots[0];
      const endTime = selectedSlots[selectedSlots.length - 1];
      console.log(new Date(startTime));

      const dateISO = new Date(selectedDate).toISOString();
      const startTimeISO = new Date(
        `${selectedDate}T${startTime}`
      ).toISOString();
      const endTimeISO = new Date(`${selectedDate}T${endTime}`).toISOString();

      const response = await fetch(
        'http://localhost:8080/api/doctor/schedules',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date: dateISO,
            startTime: startTimeISO,
            endTime: endTimeISO,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'Tạo lịch làm việc thành công!' });

        // Tạo object schedule mới
        const newSchedule = {
          id: data.data?.id || Date.now(), // Dùng id từ API hoặc timestamp
          date: selectedDate,
          startTime,
          endTime,
          slots: selectedSlots.length,
          createdAt: new Date().toISOString(),
        };

        // Cập nhật state và localStorage
        const updatedSchedules = [newSchedule, ...createdSchedules];
        setCreatedSchedules(updatedSchedules);
        saveSchedulesToStorage(updatedSchedules);

        setSelectedSlots([]);

        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Tạo lịch thất bại!',
        });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Không thể kết nối đến server!' });
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Tạo lịch làm việc
          </h1>
          <p className="text-gray-600">
            Chọn ngày và các khung giờ bạn muốn làm việc
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Schedule Selector */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {/* Date Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Chọn ngày làm việc
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedSlots([]);
                      setMessage({ type: '', text: '' });
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-lg font-medium"
                  />
                </div>
              </div>

              {/* Selected Date Display */}
              <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 text-blue-700">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">
                    {formatDate(selectedDate)}
                  </span>
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">
                    Chọn khung giờ (8:00 - 17:00)
                  </label>
                  {selectedSlots.length > 0 && (
                    <button
                      onClick={handleClearSelection}
                      className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa chọn
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {timeSlots.map((time) => {
                    const isSelected = selectedSlots.includes(time);
                    const isFirst = selectedSlots[0] === time;
                    const isLast =
                      selectedSlots[selectedSlots.length - 1] === time;

                    return (
                      <button
                        key={time}
                        onClick={() => handleSlotClick(time)}
                        className={`
                          relative p-3 rounded-lg font-medium text-sm transition-all
                          ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
                              : 'bg-gray-50 text-gray-700 hover:bg-blue-100 hover:text-blue-600 border-2 border-gray-200'
                          }
                        `}
                      >
                        {time}
                        {isFirst && (
                          <span className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 text-white rounded-full text-xs flex items-center justify-center">
                            S
                          </span>
                        )}
                        {isLast && selectedSlots.length > 1 && (
                          <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                            E
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selection Info */}
              {selectedSlots.length > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Đã chọn</p>
                      <p className="text-lg font-bold text-gray-800">
                        {selectedSlots[0]} -{' '}
                        {selectedSlots[selectedSlots.length - 1]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Số khung giờ</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedSlots.length}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Message */}
              {message.text && (
                <div
                  className={`flex items-center gap-2 p-4 rounded-xl mb-6 ${
                    message.type === 'success'
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  {message.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                  <p
                    className={`text-sm font-medium ${
                      message.type === 'success'
                        ? 'text-green-700'
                        : 'text-red-700'
                    }`}
                  >
                    {message.text}
                  </p>
                </div>
              )}

              {/* Create Button */}
              <button
                onClick={handleCreateSchedule}
                disabled={loading || selectedSlots.length === 0}
                className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-medium text-white transition-all ${
                  loading || selectedSlots.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Đang tạo lịch...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Tạo lịch làm việc
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar - Created Schedules */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Lịch đã tạo
              </h2>

              {createdSchedules.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {createdSchedules.map((schedule, index) => (
                    <div
                      key={schedule.id || index}
                      className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100 group hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 mb-1">
                            {new Date(schedule.date).toLocaleDateString(
                              'vi-VN'
                            )}
                          </p>
                          <p className="font-semibold text-gray-800 text-sm">
                            {schedule.startTime} - {schedule.endTime}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            {schedule.slots} khung giờ
                          </p>
                        </div>
                        <button
                          onClick={() => deleteSchedule(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded text-red-600"
                          title="Xóa lịch"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">
                    Chưa có lịch nào được tạo
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-xl shadow p-4">
          <div className="flex items-center gap-6 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-50 border-2 border-gray-200 rounded"></div>
              <span className="text-gray-600">Chưa chọn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded"></div>
              <span className="text-gray-600">Đã chọn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 bg-blue-600 rounded">
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white rounded-full text-xs flex items-center justify-center">
                  S
                </span>
              </div>
              <span className="text-gray-600">Giờ bắt đầu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 bg-blue-600 rounded">
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                  E
                </span>
              </div>
              <span className="text-gray-600">Giờ kết thúc</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
