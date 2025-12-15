import React, { useState } from 'react';
import {
  Plus,
  Users,
  Building,
  Calendar,
  User,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  ChevronRight,
} from 'lucide-react';

const DepartmentManagement = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock departments data
  const departments = [
    {
      id: 1,
      name: 'Cardiology',
      headDoctor: 'Dr. Sarah Wilson',
      status: 'Active',
      description: 'Specializing in heart and cardiovascular diseases',
      doctors: [
        {
          id: 1,
          name: 'Dr. Sarah Wilson',
          specialty: 'Cardiologist',
          patients: 45,
        },
        {
          id: 2,
          name: 'Dr. James Brown',
          specialty: 'Cardiologist',
          patients: 38,
        },
        {
          id: 3,
          name: 'Dr. Michael Chen',
          specialty: 'Cardiac Surgeon',
          patients: 32,
        },
      ],
      rooms: [
        { id: 1, number: '101', type: 'ICU', status: 'Occupied' },
        { id: 2, number: '102', type: 'General', status: 'Available' },
        { id: 3, number: '103', type: 'Surgery', status: 'Maintenance' },
      ],
      appointments: [
        { id: 1, time: '09:00', patient: 'John Doe', doctor: 'Dr. Wilson' },
        { id: 2, time: '09:30', patient: 'Jane Smith', doctor: 'Dr. Brown' },
        { id: 3, time: '10:00', patient: 'Mike Johnson', doctor: 'Dr. Chen' },
        { id: 4, time: '10:30', patient: 'Emily Davis', doctor: 'Dr. Wilson' },
      ],
      stats: {
        totalDoctors: 3,
        totalRooms: 3,
        todayAppointments: 4,
        activePatients: 115,
      },
    },
    {
      id: 2,
      name: 'Neurology',
      headDoctor: 'Dr. Emily Johnson',
      status: 'Active',
      description: 'Specializing in brain and nervous system disorders',
      doctors: [
        {
          id: 4,
          name: 'Dr. Emily Johnson',
          specialty: 'Neurologist',
          patients: 42,
        },
        {
          id: 5,
          name: 'Dr. Robert Lee',
          specialty: 'Neurosurgeon',
          patients: 35,
        },
      ],
      rooms: [
        { id: 4, number: '201', type: 'Consultation', status: 'Available' },
        { id: 5, number: '202', type: 'ICU', status: 'Occupied' },
      ],
      appointments: [
        { id: 5, time: '08:30', patient: 'Alice Brown', doctor: 'Dr. Johnson' },
        { id: 6, time: '11:00', patient: 'Bob Wilson', doctor: 'Dr. Lee' },
      ],
      stats: {
        totalDoctors: 2,
        totalRooms: 2,
        todayAppointments: 2,
        activePatients: 77,
      },
    },
    {
      id: 3,
      name: 'Pediatrics',
      headDoctor: 'Dr. Lisa Chen',
      status: 'Active',
      description: "Specializing in children's health and development",
      doctors: [
        {
          id: 6,
          name: 'Dr. Lisa Chen',
          specialty: 'Pediatrician',
          patients: 58,
        },
        {
          id: 7,
          name: 'Dr. Mark Taylor',
          specialty: 'Pediatrician',
          patients: 51,
        },
        {
          id: 8,
          name: 'Dr. Anna White',
          specialty: 'Pediatric Surgeon',
          patients: 29,
        },
      ],
      rooms: [
        { id: 6, number: '301', type: 'Consultation', status: 'Available' },
        { id: 7, number: '302', type: 'General', status: 'Available' },
        { id: 8, number: '303', type: 'Emergency', status: 'Occupied' },
      ],
      appointments: [
        { id: 7, time: '09:00', patient: 'Tommy Lee', doctor: 'Dr. Chen' },
        { id: 8, time: '10:00', patient: 'Sara Kim', doctor: 'Dr. Taylor' },
        { id: 9, time: '11:30', patient: 'Max Brown', doctor: 'Dr. White' },
      ],
      stats: {
        totalDoctors: 3,
        totalRooms: 3,
        todayAppointments: 3,
        activePatients: 138,
      },
    },
    {
      id: 4,
      name: 'Orthopedics',
      headDoctor: 'Dr. David Martinez',
      status: 'Active',
      description: 'Specializing in bone, joint, and muscle conditions',
      doctors: [
        {
          id: 9,
          name: 'Dr. David Martinez',
          specialty: 'Orthopedic Surgeon',
          patients: 48,
        },
        {
          id: 10,
          name: 'Dr. Sarah Lee',
          specialty: 'Orthopedist',
          patients: 41,
        },
      ],
      rooms: [
        { id: 9, number: '401', type: 'Surgery', status: 'Maintenance' },
        { id: 10, number: '402', type: 'Consultation', status: 'Available' },
      ],
      appointments: [
        {
          id: 10,
          time: '08:00',
          patient: 'James Wilson',
          doctor: 'Dr. Martinez',
        },
        { id: 11, time: '10:30', patient: 'Linda Davis', doctor: 'Dr. Lee' },
      ],
      stats: {
        totalDoctors: 2,
        totalRooms: 2,
        todayAppointments: 2,
        activePatients: 89,
      },
    },
    {
      id: 4,
      name: 'Orthopedics',
      headDoctor: 'Dr. David Martinez',
      status: 'Active',
      description: 'Specializing in bone, joint, and muscle conditions',
      doctors: [
        {
          id: 9,
          name: 'Dr. David Martinez',
          specialty: 'Orthopedic Surgeon',
          patients: 48,
        },
        {
          id: 10,
          name: 'Dr. Sarah Lee',
          specialty: 'Orthopedist',
          patients: 41,
        },
      ],
      rooms: [
        { id: 9, number: '401', type: 'Surgery', status: 'Maintenance' },
        { id: 10, number: '402', type: 'Consultation', status: 'Available' },
      ],
      appointments: [
        {
          id: 10,
          time: '08:00',
          patient: 'James Wilson',
          doctor: 'Dr. Martinez',
        },
        { id: 11, time: '10:30', patient: 'Linda Davis', doctor: 'Dr. Lee' },
      ],
      stats: {
        totalDoctors: 2,
        totalRooms: 2,
        todayAppointments: 2,
        activePatients: 89,
      },
    },
    {
      id: 4,
      name: 'Orthopedics',
      headDoctor: 'Dr. David Martinez',
      status: 'Active',
      description: 'Specializing in bone, joint, and muscle conditions',
      doctors: [
        {
          id: 9,
          name: 'Dr. David Martinez',
          specialty: 'Orthopedic Surgeon',
          patients: 48,
        },
        {
          id: 10,
          name: 'Dr. Sarah Lee',
          specialty: 'Orthopedist',
          patients: 41,
        },
      ],
      rooms: [
        { id: 9, number: '401', type: 'Surgery', status: 'Maintenance' },
        { id: 10, number: '402', type: 'Consultation', status: 'Available' },
      ],
      appointments: [
        {
          id: 10,
          time: '08:00',
          patient: 'James Wilson',
          doctor: 'Dr. Martinez',
        },
        { id: 11, time: '10:30', patient: 'Linda Davis', doctor: 'Dr. Lee' },
      ],
      stats: {
        totalDoctors: 2,
        totalRooms: 2,
        todayAppointments: 2,
        activePatients: 89,
      },
    },
    {
      id: 4,
      name: 'Orthopedics',
      headDoctor: 'Dr. David Martinez',
      status: 'Active',
      description: 'Specializing in bone, joint, and muscle conditions',
      doctors: [
        {
          id: 9,
          name: 'Dr. David Martinez',
          specialty: 'Orthopedic Surgeon',
          patients: 48,
        },
        {
          id: 10,
          name: 'Dr. Sarah Lee',
          specialty: 'Orthopedist',
          patients: 41,
        },
      ],
      rooms: [
        { id: 9, number: '401', type: 'Surgery', status: 'Maintenance' },
        { id: 10, number: '402', type: 'Consultation', status: 'Available' },
      ],
      appointments: [
        {
          id: 10,
          time: '08:00',
          patient: 'James Wilson',
          doctor: 'Dr. Martinez',
        },
        { id: 11, time: '10:30', patient: 'Linda Davis', doctor: 'Dr. Lee' },
      ],
      stats: {
        totalDoctors: 2,
        totalRooms: 2,
        todayAppointments: 2,
        activePatients: 89,
      },
    },
    {
      id: 4,
      name: 'Orthopedics',
      headDoctor: 'Dr. David Martinez',
      status: 'Active',
      description: 'Specializing in bone, joint, and muscle conditions',
      doctors: [
        {
          id: 9,
          name: 'Dr. David Martinez',
          specialty: 'Orthopedic Surgeon',
          patients: 48,
        },
        {
          id: 10,
          name: 'Dr. Sarah Lee',
          specialty: 'Orthopedist',
          patients: 41,
        },
      ],
      rooms: [
        { id: 9, number: '401', type: 'Surgery', status: 'Maintenance' },
        { id: 10, number: '402', type: 'Consultation', status: 'Available' },
      ],
      appointments: [
        {
          id: 10,
          time: '08:00',
          patient: 'James Wilson',
          doctor: 'Dr. Martinez',
        },
        { id: 11, time: '10:30', patient: 'Linda Davis', doctor: 'Dr. Lee' },
      ],
      stats: {
        totalDoctors: 2,
        totalRooms: 2,
        todayAppointments: 2,
        activePatients: 89,
      },
    },
    {
      id: 4,
      name: 'Orthopedics',
      headDoctor: 'Dr. David Martinez',
      status: 'Active',
      description: 'Specializing in bone, joint, and muscle conditions',
      doctors: [
        {
          id: 9,
          name: 'Dr. David Martinez',
          specialty: 'Orthopedic Surgeon',
          patients: 48,
        },
        {
          id: 10,
          name: 'Dr. Sarah Lee',
          specialty: 'Orthopedist',
          patients: 41,
        },
      ],
      rooms: [
        { id: 9, number: '401', type: 'Surgery', status: 'Maintenance' },
        { id: 10, number: '402', type: 'Consultation', status: 'Available' },
      ],
      appointments: [
        {
          id: 10,
          time: '08:00',
          patient: 'James Wilson',
          doctor: 'Dr. Martinez',
        },
        { id: 11, time: '10:30', patient: 'Linda Davis', doctor: 'Dr. Lee' },
      ],
      stats: {
        totalDoctors: 2,
        totalRooms: 2,
        todayAppointments: 2,
        activePatients: 89,
      },
    },
    {
      id: 4,
      name: 'Orthopedics',
      headDoctor: 'Dr. David Martinez',
      status: 'Active',
      description: 'Specializing in bone, joint, and muscle conditions',
      doctors: [
        {
          id: 9,
          name: 'Dr. David Martinez',
          specialty: 'Orthopedic Surgeon',
          patients: 48,
        },
        {
          id: 10,
          name: 'Dr. Sarah Lee',
          specialty: 'Orthopedist',
          patients: 41,
        },
      ],
      rooms: [
        { id: 9, number: '401', type: 'Surgery', status: 'Maintenance' },
        { id: 10, number: '402', type: 'Consultation', status: 'Available' },
      ],
      appointments: [
        {
          id: 10,
          time: '08:00',
          patient: 'James Wilson',
          doctor: 'Dr. Martinez',
        },
        { id: 11, time: '10:30', patient: 'Linda Davis', doctor: 'Dr. Lee' },
      ],
      stats: {
        totalDoctors: 2,
        totalRooms: 2,
        todayAppointments: 2,
        activePatients: 89,
      },
    },
  ];

  const getRoomStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Occupied':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen -mt-7 bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">
            Manage hospital departments and resources
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Department List */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Department List */}
              <div className="divide-y divide-gray-200">
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedDepartment?.id === dept.id
                        ? 'bg-blue-50 border-l-4 border-blue-600'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            selectedDepartment?.id === dept.id
                              ? 'bg-blue-100'
                              : 'bg-gray-100'
                          }`}
                        >
                          <Building
                            size={20}
                            className={
                              selectedDepartment?.id === dept.id
                                ? 'text-blue-600'
                                : 'text-gray-600'
                            }
                          />
                        </div>
                        <div>
                          <div
                            className={`font-semibold ${
                              selectedDepartment?.id === dept.id
                                ? 'text-blue-900'
                                : 'text-gray-900'
                            }`}
                          >
                            {dept.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {dept.stats.totalDoctors} doctors
                          </div>
                        </div>
                      </div>
                      {selectedDepartment?.id === dept.id && (
                        <ChevronRight size={18} className="text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Add Department Button */}
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Plus size={18} />
                Add Department
              </button>
            </div>
          </div>

          {/* Right Content - Department Details */}
          <div className="col-span-12 lg:col-span-9">
            {selectedDepartment ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Department Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        {selectedDepartment.name} Department
                      </h2>
                      <p className="text-blue-100">
                        {selectedDepartment.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                      <div className="text-2xl font-bold">
                        {selectedDepartment.stats.totalDoctors}
                      </div>
                      <div className="text-sm text-blue-100">Doctors</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                      <div className="text-2xl font-bold">
                        {selectedDepartment.stats.totalRooms}
                      </div>
                      <div className="text-sm text-blue-100">Rooms</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                      <div className="text-2xl font-bold">
                        {selectedDepartment.stats.todayAppointments}
                      </div>
                      <div className="text-sm text-blue-100">Today's Appts</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                      <div className="text-2xl font-bold">
                        {selectedDepartment.stats.activePatients}
                      </div>
                      <div className="text-sm text-blue-100">
                        Active Patients
                      </div>
                    </div>
                  </div>
                </div>

                {/* Department Info */}
                <div className="p-6 space-y-6">
                  {/* Head Doctor & Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <User size={20} className="text-blue-600" />
                      <div>
                        <div className="text-sm text-gray-500">Head Doctor</div>
                        <div className="font-semibold text-gray-900">
                          {selectedDepartment.headDoctor}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <CheckCircle size={20} className="text-green-600" />
                      <div>
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="font-semibold text-green-600">
                          {selectedDepartment.status}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Doctors Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users size={20} className="text-gray-700" />
                      <h3 className="text-lg font-bold text-gray-900">
                        Doctors
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {selectedDepartment.doctors.map((doctor) => (
                        <div
                          key={doctor.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {doctor.name.split(' ')[1][0]}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {doctor.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {doctor.specialty}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">
                              {doctor.patients}
                            </span>{' '}
                            patients
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rooms Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Building size={20} className="text-gray-700" />
                      <h3 className="text-lg font-bold text-gray-900">Rooms</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedDepartment.rooms.map((room) => (
                        <div
                          key={room.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <div className="font-semibold text-gray-900">
                              Room {room.number}
                            </div>
                            <div className="text-sm text-gray-500">
                              {room.type}
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoomStatusColor(
                              room.status
                            )}`}
                          >
                            {room.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Today's Appointments */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar size={20} className="text-gray-700" />
                      <h3 className="text-lg font-bold text-gray-900">
                        Today's Appointments
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {selectedDepartment.appointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-blue-600">
                              <Clock size={16} />
                              <span className="font-semibold">{apt.time}</span>
                            </div>
                            <div className="text-gray-400">•</div>
                            <div className="font-medium text-gray-900">
                              {apt.patient}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {apt.doctor}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Empty State
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a Department
                </h3>
                <p className="text-gray-600 mb-6">
                  Choose a department from the list to view details
                </p>
                <button
                  onClick={() => setSelectedDepartment(departments[0])}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  View Cardiology
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentManagement;
