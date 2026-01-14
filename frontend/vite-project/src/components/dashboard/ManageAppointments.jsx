import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ChevronDown,
  Clock,
  User,
  Stethoscope,
  X,
} from 'lucide-react';

const ScheduleCalendar = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8080/api/appointments')
      .then((res) => res.json())
      .then((response) => {
        const events = response.data.map((apt) => ({
          id: apt.id,
          date: formatDate(apt.date),
          patientName: `${apt.patient.user.firstName} ${apt.patient.user.lastName}`,
          doctorName: `Dr. ${apt.doctor.user.firstName} ${apt.doctor.user.lastName}`,
          title: `${apt.patient.user.firstName} ${apt.patient.user.lastName}`,
          startTime: formatTime(apt.startTime),
          endTime: formatTime(apt.endTime),
          color:
            apt.status === 'pending'
              ? 'yellow'
              : apt.status === 'confirmed'
              ? 'green'
              : 'blue',
          reason: apt.reason,
          status: apt.status,
          clinicName: apt.clinic.name,
          clinicAddress: apt.clinic.address,
          specialization: apt.doctor.specialization,
          patientPhone: apt.patient.user.phone,
          patientEmail: apt.patient.user.email,
          patientAge: apt.patient.age,
          patientGender: apt.patient.gender,
        }));

        console.log('Calendar events:', events);
        setData(events);
        setLoading(false);
      })
      .catch((err) => {
        setError('Không thể tải danh sách lịch hẹn');
        console.error(err);
        setLoading(false);
      });
  }, []);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatDate = (isoString) => {
    return new Date(isoString).toISOString().split('T')[0];
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isPrevMonth: true,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        isPrevMonth: false,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        isPrevMonth: false,
      });
    }

    return days;
  };

  const getEventsForDay = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return [];

    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const dayString = `${year}-${String(month).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;

    return data.filter((event) => event.date === dayString);
  };

  const getEventColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      red: 'bg-red-100 text-red-700 border-red-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
    };
    return colors[color] || colors.blue;
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return badges[status] || badges.pending;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getViewLabel = () => {
    const labels = {
      month: 'Month view',
      week: 'Week view',
      day: 'Day view',
    };
    return labels[viewMode];
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
    setShowViewDropdown(false);
  };

  const isToday = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getWeekNumber = () => {
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const daysSinceFirstDay = Math.floor(
      (firstDayOfMonth - firstDayOfYear) / (24 * 60 * 60 * 1000)
    );
    return Math.ceil((daysSinceFirstDay + firstDayOfYear.getDay() + 1) / 7);
  };

  const days = getDaysInMonth(currentDate);
  const weekNumber = getWeekNumber();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải lịch hẹn...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen -mt-7 p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            {/* Date Display */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-500 uppercase tracking-wide">
                  {monthNames[currentDate.getMonth()].substring(0, 3)}
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {new Date().getDate()}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {monthNames[currentDate.getMonth()]}{' '}
                  {currentDate.getFullYear()}
                </div>
                <div className="text-sm text-gray-500">Week {weekNumber}</div>
                <div className="text-sm text-gray-400">
                  {data.length} appointments
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2 ml-6">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <button
                onClick={goToToday}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* View Mode Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowViewDropdown(!showViewDropdown)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-700">
                  {getViewLabel()}
                </span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {showViewDropdown && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={() => handleViewChange('month')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        viewMode === 'month'
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700'
                      }`}
                    >
                      Month view
                    </button>
                    <button
                      onClick={() => handleViewChange('week')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        viewMode === 'week'
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700'
                      }`}
                    >
                      Week view
                    </button>
                    <button
                      onClick={() => handleViewChange('day')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        viewMode === 'day'
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700'
                      }`}
                    >
                      Day view
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <Plus size={18} />
              Add event
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          {viewMode === 'month' && (
            <>
              {/* Week Day Headers */}
              <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="py-3 text-center text-sm font-semibold text-gray-600 border-r border-gray-200 last:border-r-0"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {days.map((dayObj, index) => {
                  const dayEvents = getEventsForDay(
                    dayObj.day,
                    dayObj.isCurrentMonth
                  );
                  const isTodayDate = isToday(
                    dayObj.day,
                    dayObj.isCurrentMonth
                  );
                  const displayedEvents = dayEvents.slice(0, 3);
                  const moreCount = dayEvents.length - 3;

                  return (
                    <div
                      key={index}
                      className={`min-h-32 border-r border-b border-gray-200 p-2 ${
                        index % 7 === 6 ? 'border-r-0' : ''
                      } ${Math.floor(index / 7) === 5 ? 'border-b-0' : ''} ${
                        !dayObj.isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                      } hover:bg-gray-50 transition-colors`}
                    >
                      {/* Day Number */}
                      <div className="flex items-start justify-between mb-1">
                        <span
                          className={`text-sm font-semibold ${
                            !dayObj.isCurrentMonth
                              ? 'text-gray-400'
                              : isTodayDate
                              ? 'bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center'
                              : 'text-gray-900'
                          }`}
                        >
                          {dayObj.day}
                        </span>
                      </div>

                      {/* Events */}
                      <div className="space-y-1">
                        {displayedEvents.map((event) => (
                          <div
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`px-2 py-1 rounded text-xs font-medium border cursor-pointer hover:shadow-md transition-all ${getEventColor(
                              event.color
                            )}`}
                          >
                            <div className="truncate font-semibold">
                              {event.patientName}
                            </div>
                            <div className="truncate text-xs opacity-75">
                              {event.doctorName}
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Clock size={10} />
                              <span>{event.startTime}</span>
                            </div>
                          </div>
                        ))}
                        {moreCount > 0 && (
                          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                            +{moreCount} more
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {viewMode === 'week' && (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Week View
              </h3>
              <p className="text-gray-600">Week view coming soon...</p>
            </div>
          )}

          {viewMode === 'day' && (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">📆</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Day View
              </h3>
              <p className="text-gray-600">Day view coming soon...</p>
            </div>
          )}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0  flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div
              className={`p-6 border-b ${getEventColor(
                selectedEvent.color
              )} border-transparent`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">
                      {selectedEvent.patientName}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                        selectedEvent.status
                      )}`}
                    >
                      {selectedEvent.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm opacity-75">Appointment Details</p>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Time & Date */}
              <div className="flex items-start gap-3">
                <Clock className="text-blue-600 mt-1" size={20} />
                <div>
                  <div className="font-semibold text-gray-900">Time & Date</div>
                  <div className="text-gray-600">{selectedEvent.date}</div>
                  <div className="text-gray-600">
                    {selectedEvent.startTime} - {selectedEvent.endTime}
                  </div>
                </div>
              </div>

              {/* Doctor */}
              <div className="flex items-start gap-3">
                <Stethoscope className="text-green-600 mt-1" size={20} />
                <div>
                  <div className="font-semibold text-gray-900">Doctor</div>
                  <div className="text-gray-600">
                    {selectedEvent.doctorName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedEvent.specialization}
                  </div>
                </div>
              </div>

              {/* Patient Info */}
              <div className="flex items-start gap-3">
                <User className="text-purple-600 mt-1" size={20} />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    Patient Information
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="text-gray-600">
                        {selectedEvent.patientEmail}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="text-gray-600">
                        {selectedEvent.patientPhone}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Age</div>
                      <div className="text-gray-600">
                        {selectedEvent.patientAge} years
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Gender</div>
                      <div className="text-gray-600 capitalize">
                        {selectedEvent.patientGender}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="font-semibold text-gray-900 mb-2">
                  Reason for Visit
                </div>
                <div className="text-gray-600">{selectedEvent.reason}</div>
              </div>

              {/* Clinic */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="font-semibold text-gray-900 mb-2">
                  Clinic Location
                </div>
                <div className="text-gray-600 font-medium">
                  {selectedEvent.clinicName}
                </div>
                <div className="text-sm text-gray-500">
                  {selectedEvent.clinicAddress}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Edit Appointment
              </button>
              <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleCalendar;
