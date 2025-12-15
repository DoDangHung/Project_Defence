import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, ChevronDown } from 'lucide-react';

const ScheduleCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 15)); // December 2025
  const [viewMode, setViewMode] = useState('month');
  const [showViewDropdown, setShowViewDropdown] = useState(false);

  // Mock events data
  const events = [
    {
      id: 1,
      title: 'Coffee with Ali',
      date: 8,
      time: '12:30 PM',
      color: 'purple',
    },
    {
      id: 2,
      title: 'Marketing sit...',
      date: 8,
      time: '3:30 PM',
      color: 'purple',
    },
    {
      id: 3,
      title: 'All-hands me...',
      date: 11,
      time: '5:00 PM',
      color: 'red',
    },
    {
      id: 4,
      title: 'Dinner with C...',
      date: 11,
      time: '7:30 PM',
      color: 'red',
    },
    {
      id: 5,
      title: 'Monday sta...',
      date: 15,
      time: '10:00 AM',
      color: 'blue',
    },
    {
      id: 6,
      title: 'Content plan...',
      date: 15,
      time: '12:00 PM',
      color: 'purple',
    },
    { id: 7, title: 'Product demo', date: 16, time: '11:30 AM', color: 'blue' },
    { id: 8, title: 'Catch up w/...', date: 16, time: '3:30 PM', color: 'red' },
    { id: 9, title: 'Deep work', date: 17, time: '10:00 AM', color: 'blue' },
    {
      id: 10,
      title: 'One-on-one ...',
      date: 17,
      time: '11:00 AM',
      color: 'red',
    },
    { id: 11, title: 'Design sync', date: 17, time: '11:30 AM', color: 'blue' },
    {
      id: 12,
      title: 'Lunch with Oli...',
      date: 18,
      time: '1:00 PM',
      color: 'red',
    },
    {
      id: 13,
      title: 'Friday stand...',
      date: 19,
      time: '10:00 AM',
      color: 'blue',
    },
    {
      id: 14,
      title: 'Olivia x Riley',
      date: 19,
      time: '11:00 AM',
      color: 'purple',
    },
    {
      id: 15,
      title: 'Product demo',
      date: 19,
      time: '2:30 PM',
      color: 'purple',
    },
    {
      id: 16,
      title: 'House inspe...',
      date: 20,
      time: '12:00 PM',
      color: 'red',
    },
    {
      id: 17,
      title: "Ava's enga...",
      date: 21,
      time: '2:00 PM',
      color: 'purple',
    },
    { id: 18, title: 'Team lunch', date: 22, time: '1:15 PM', color: 'red' },
    {
      id: 19,
      title: 'Product plan...',
      date: 24,
      time: '10:30 AM',
      color: 'blue',
    },
    {
      id: 20,
      title: "Amelie's first...",
      date: 25,
      time: '11:00 AM',
      color: 'red',
    },
    {
      id: 21,
      title: 'All-hands me...',
      date: 25,
      time: '5:00 PM',
      color: 'red',
    },
    {
      id: 22,
      title: 'Coffee w/ A...',
      date: 26,
      time: '10:30 AM',
      color: 'blue',
    },
    {
      id: 23,
      title: 'Design feedb...',
      date: 26,
      time: '3:30 PM',
      color: 'red',
    },
    {
      id: 24,
      title: 'Half marathon',
      date: 27,
      time: '8:00 AM',
      color: 'green',
    },
    { id: 25, title: 'Team offsite', date: 29, time: '', color: 'blue' },
    { id: 26, title: 'Deep work', date: 29, time: '10:25 AM', color: 'blue' },
    {
      id: 27,
      title: 'Quarterly re...',
      date: 30,
      time: '12:30 PM',
      color: 'red',
    },
    {
      id: 28,
      title: 'Lunch with Z...',
      date: 30,
      time: '2:00 PM',
      color: 'purple',
    },
    { id: 29, title: 'Deep work', date: 31, time: '10:00 AM', color: 'blue' },
    {
      id: 30,
      title: 'Design sync',
      date: 31,
      time: '3:30 PM',
      color: 'purple',
    },
    {
      id: 31,
      title: 'Amelie coffee',
      date: 1,
      time: '11:00 AM',
      color: 'red',
      nextMonth: true,
    },
    {
      id: 32,
      title: 'Dinner with C...',
      date: 1,
      time: '8:00 PM',
      color: 'red',
      nextMonth: true,
    },
    {
      id: 33,
      title: 'Accountant',
      date: 2,
      time: '2:45 PM',
      color: 'purple',
      nextMonth: true,
    },
    {
      id: 34,
      title: 'Marketing sit...',
      date: 2,
      time: '3:30 PM',
      color: 'purple',
      nextMonth: true,
    },
  ];

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

  const getEventsForDay = (day, isCurrentMonth, isPrevMonth) => {
    if (isPrevMonth) return [];
    if (!isCurrentMonth) {
      return events.filter((e) => e.date === day && e.nextMonth);
    }
    return events.filter((e) => e.date === day && !e.nextMonth);
  };

  const getEventColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      red: 'bg-red-100 text-red-700 border-red-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      green: 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[color] || colors.blue;
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

  const days = getDaysInMonth(currentDate);
  const weekNumber = 3;

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
                  DEC
                </div>
                <div className="text-3xl font-bold text-blue-600">15</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {monthNames[currentDate.getMonth()]}{' '}
                  {currentDate.getFullYear()}
                </div>
                <div className="text-sm text-gray-500">Week {weekNumber}</div>
                <div className="text-sm text-gray-400">
                  Dec 1, 2025 – Dec 31, 2025
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

              {/* Dropdown Menu */}
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
                {weekDays.map((day, index) => (
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
                    dayObj.isCurrentMonth,
                    dayObj.isPrevMonth
                  );
                  const isToday = dayObj.isCurrentMonth && dayObj.day === 15; // Hardcoded for demo
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
                              : isToday
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
                            className={`px-2 py-1 rounded text-xs font-medium border cursor-pointer hover:shadow-sm transition-shadow ${getEventColor(
                              event.color
                            )}`}
                          >
                            <div className="truncate">
                              {event.title}{' '}
                              {event.time && (
                                <span className="ml-1">{event.time}</span>
                              )}
                            </div>
                          </div>
                        ))}
                        {moreCount > 0 && (
                          <button className="text-xs text-gray-600 hover:text-gray-900 font-medium">
                            {moreCount} more...
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
              <p className="text-gray-600">
                Week view will show 7 days with hourly time slots
              </p>
              <div className="mt-4 text-sm text-gray-500">
                December 14 - December 20, 2025
              </div>
            </div>
          )}

          {viewMode === 'day' && (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">📆</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Day View
              </h3>
              <p className="text-gray-600">
                Day view will show hourly schedule for a single day
              </p>
              <div className="mt-4 text-sm text-gray-500">
                Monday, December 15, 2025
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
