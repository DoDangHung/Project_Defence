import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader,
} from 'lucide-react';

const StepSelectTime = ({ doctorId, onSelectTime }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    if (doctorId) {
      fetchSlots();
    }
  }, [doctorId]);

  const fetchSlots = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `http://localhost:8080/api/schedules/doctor/${doctorId}`
      );
      const data = await response.json();

      const scheduleArray =
        data?.data?.flatMap((s) => s.slots) ??
        data?.schedules?.flatMap((s) => s.slots) ??
        [];
      // 🔥 Remove duplicate slots by start+end
      const uniqueSlots = [
        ...new Map(
          scheduleArray.map((slot) => [`${slot.start}-${slot.end}`, slot])
        ).values(),
      ];

      const validSlots = uniqueSlots.filter(
        (slot) => !slot.isBooked && new Date(slot.end) > new Date()
      );

      setSlots(validSlots);

      const ds = [
        ...new Set(validSlots.map((s) => s.start.slice(0, 10))),
      ].sort();
      setDates(ds);

      if (ds.length > 0 && !selectedDate) setSelectedDate(ds[0]);
      if (validSlots.length === 0) setError('Không còn slot khả dụng');
    } catch (err) {
      setError('Không tải được lịch: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredSlots = slots.filter(
    (s) => s.start.slice(0, 10) === selectedDate
  );

  const morningSlots = filteredSlots.filter(
    (s) => Number(s.start.slice(11, 13)) < 12
  );
  const afternoonSlots = filteredSlots.filter(
    (s) => Number(s.start.slice(11, 13)) >= 12
  );

  const handleSelect = (slot) => {
    setSelectedSlot(slot);
    onSelectTime?.(slot);
  };

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    });

  const formatFullDate = (iso) =>
    new Date(iso).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Đang tải lịch khám...</span>
      </div>
    );

  if (error)
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-2">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <p className="text-red-700">{error}</p>
      </div>
    );

  if (slots.length === 0)
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Chưa có lịch khám</p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Date Picker */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          <Calendar className="inline w-4 h-4 mr-2" />
          Chọn ngày khám
        </label>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {dates.map((d) => (
            <button
              key={d}
              onClick={() => {
                setSelectedDate(d);
                setSelectedSlot(null);
              }}
              className={`p-3 rounded-xl border-2 text-center font-semibold transition-all ${
                selectedDate === d
                  ? 'bg-blue-600 text-white border-blue-600 shadow'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {formatDate(d)}
            </button>
          ))}
        </div>
      </div>

      {/* Slots */}
      {selectedDate && (
        <div className="space-y-6">
          {morningSlots.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Clock className="inline w-4 h-4 mr-2" />
                Khung giờ sáng
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {morningSlots.map((slot) => (
                  <button
                    key={slot.index}
                    onClick={() => handleSelect(slot)}
                    className={`p-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                      selectedSlot?.index === slot.index
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-green-50'
                    }`}
                  >
                    {formatTime(slot.start)} - {formatTime(slot.end)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {afternoonSlots.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Clock className="inline w-4 h-4 mr-2" />
                Khung giờ chiều
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {afternoonSlots.map((slot) => (
                  <button
                    key={slot.index}
                    onClick={() => handleSelect(slot)}
                    className={`p-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                      selectedSlot?.index === slot.index
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-green-50'
                    }`}
                  >
                    {formatTime(slot.start)} - {formatTime(slot.end)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {morningSlots.length === 0 && afternoonSlots.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Không có lịch khám trong ngày này</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StepSelectTime;
