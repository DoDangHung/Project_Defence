import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  Phone,
  Mail,
  User,
  Heart,
  MoreVertical,
  X,
  ChevronRight,
} from 'lucide-react';

const ManagePatients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTab, setSelectedTab] = useState('patients');
  const searchRef = useRef(null);

  // Mock patient data
  const patients = [
    {
      id: 'P001',
      mrn: '8756321',
      ssn: '357-247-8745',
      name: 'Dia Hemphery',
      age: 28,
      gender: 'Female',
      email: 'dia.hemphery@email.com',
      phone: '+1 (987) 3398 387',
      avatar: null,
      recentProcedure: 'Fracture',
      doctor: 'Dr. Sarah Wilson',
      specialty: 'Orthopedics',
      bloodType: 'O+',
      lastVisit: '2024-12-10',
    },
    {
      id: 'P002',
      mrn: '3498712',
      ssn: '648-778-9145',
      name: 'Diana Robinson',
      age: 35,
      gender: 'Female',
      email: 'diana.rob@email.com',
      phone: '+1 (987) 3398 387',
      avatar: null,
      recentProcedure: 'Premium',
      doctor: 'Dr. James Brown',
      specialty: 'Cardiology',
      bloodType: 'A+',
      lastVisit: '2024-12-08',
    },
    {
      id: 'P003',
      mrn: '7877457',
      ssn: '784-574-587',
      name: 'Diane Kemp',
      age: 42,
      gender: 'Female',
      email: 'diane.k@email.com',
      phone: '+1 (478) 5587 338',
      avatar: null,
      recentProcedure: 'Premium',
      doctor: 'Dr. Emily Davis',
      specialty: 'Neurology',
      bloodType: 'B-',
      lastVisit: '2024-11-25',
    },
    {
      id: 'P004',
      mrn: '5455856',
      ssn: '878-745-124',
      name: 'Diandra Keith',
      age: 31,
      gender: 'Female',
      email: 'diandra.k@email.com',
      phone: '+1 (776) 3398 888',
      avatar: null,
      recentProcedure: 'CBT',
      doctor: 'Dr. Michael Lee',
      specialty: 'Psychology',
      bloodType: 'AB+',
      lastVisit: '2024-12-12',
    },
    {
      id: 'P005',
      mrn: '4578567',
      ssn: '954-786-138',
      name: 'Dianora Bean',
      age: 29,
      gender: 'Female',
      email: 'dianora.b@email.com',
      phone: '+1 (887) 8697 778',
      avatar: null,
      recentProcedure: 'Psychology',
      doctor: 'Dr. Lisa Chen',
      specialty: 'Psychology',
      bloodType: 'O-',
      lastVisit: '2024-12-05',
    },
    {
      id: 'P006',
      mrn: '1234567',
      ssn: '123-456-789',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      email: 'john.doe@email.com',
      phone: '+1 (234) 567 8900',
      avatar: null,
      recentProcedure: 'Cardiology',
      doctor: 'Dr. Sarah Wilson',
      specialty: 'Cardiology',
      bloodType: 'A+',
      lastVisit: '2024-12-01',
    },
  ];

  // Filter patients based on search
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.mrn.includes(searchTerm) ||
      patient.ssn.includes(searchTerm)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(e.target.value.length > 0);
  };

  const handleSelectPatient = (patient) => {
    setSearchTerm(patient.name);
    setShowDropdown(false);
    // Navigate to patient details or perform action
    console.log('Selected patient:', patient);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen -mt-12 bg-gray-50">
      <div className="p-6">
        {/* Search Section with Dropdown */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {/* Search Bar with Dropdown */}
          <div ref={searchRef} className="relative mb-4">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search Patient Name, MRN"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => searchTerm && setShowDropdown(true)}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Dropdown Results */}
            {showDropdown && filteredPatients.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">
                    Patients ({filteredPatients.length})
                  </div>
                  {filteredPatients.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => handleSelectPatient(patient)}
                      className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {patient.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>

                      {/* Patient Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900">
                          {patient.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          MRN: {patient.mrn} • SSN: {patient.ssn}
                        </div>
                      </div>

                      {/* Badge */}
                      <div className="flex-shrink-0">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                          {patient.recentProcedure}
                        </span>
                      </div>

                      {/* Arrow */}
                      <ChevronRight
                        size={16}
                        className="text-gray-400 flex-shrink-0"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {showDropdown && searchTerm && filteredPatients.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-8 text-center">
                <Search size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">
                  No patients found for "{searchTerm}"
                </p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-200">
            <button
              onClick={() => setSelectedTab('patients')}
              className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
                selectedTab === 'patients'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <User size={18} />
              <span className="font-medium">Patients</span>
            </button>
            <button
              onClick={() => setSelectedTab('conditions')}
              className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
                selectedTab === 'conditions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText size={18} />
              <span className="font-medium">Medical Conditions</span>
            </button>
            <button
              onClick={() => setSelectedTab('programs')}
              className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
                selectedTab === 'programs'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Heart size={18} />
              <span className="font-medium">Care Programs</span>
            </button>
          </div>
        </div>

        {/* Patient Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Patient List</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download size={18} />
              Download
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 px-6 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Patient Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Recent Procedure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {patients.slice(0, 10).map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {patient.avatar ? (
                          <img
                            src={patient.avatar}
                            alt=""
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {patient.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">
                            {patient.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {patient.age} Y, {patient.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {patient.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {patient.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">
                        {patient.recentProcedure}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {patient.doctor}
                      </div>
                      <div className="text-sm text-gray-500">
                        {patient.specialty}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye size={18} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical size={18} className="text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              Previous
            </button>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, '...', 9, 10].map((page, index) => (
                <button
                  key={index}
                  className={`w-10 h-10 rounded-lg transition-colors ${
                    page === 1
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePatients;
