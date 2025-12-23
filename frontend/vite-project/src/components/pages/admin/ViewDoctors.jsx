import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'appointments', label: 'Appointments' },
  { key: 'patients', label: 'Patients' },
  { key: 'activity', label: 'Medical Activity' },
  { key: 'feedback', label: 'Feedback' },
];
export default function ViewDoctors() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/doctors/${id}`)
      .then((res) => {
        console.log('data', res.data);
        console.log('data from View Doctor: ', res.data.data);
        console.log('User: ', res.data.data.user.firstName);
        setUser(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading user:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading user...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <>
      <div className="w-full">
        {/* Tabs header */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-3 text-sm font-medium border-b-2 transition-colors
                    ${
                      activeTab === tab.key
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }
                    `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tabs content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div>
              <h1 className="text-xl font-bold">View Doctor #{id}</h1>
              <form>
                <div className="space-y-12">
                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900">
                      Profile
                    </h2>
                    <p className="mt-1 text-sm/6 text-gray-600">
                      This information will be displayed publicly so be careful
                      what you share.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="col-span-full">
                        <label
                          htmlFor="about"
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          About
                        </label>
                        <div className="mt-2">
                          <textarea
                            value={user.bio}
                            rows={3}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            defaultValue={''}
                          />
                        </div>
                        <p className="mt-3 text-sm/6 text-gray-600">
                          Write a few sentences about yourself.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900">
                      Personal Information
                    </h2>
                    <p className="mt-1 text-sm/6 text-gray-600">
                      Use a permanent address where you can receive mail.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="first-name"
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          First name
                        </label>
                        <div className="mt-2">
                          <input
                            value={user?.user?.firstName || ''}
                            readOnly
                            disabled
                            type="text"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="last-name"
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          Last name
                        </label>
                        <div className="mt-2">
                          <input
                            value={user?.user?.lastName}
                            readOnly
                            disabled
                            type="text"
                            autoComplete="family-name"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label
                          htmlFor="email"
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          Email address
                        </label>
                        <div className="mt-2">
                          <input
                            value={user?.user?.email}
                            type="email"
                            readOnly
                            disabled
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label
                          htmlFor="street-address"
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          Street address
                        </label>
                        <div className="mt-2">
                          <input
                            value={user?.user?.streetAddress}
                            readOnly
                            disabled
                            type="text"
                            autoComplete="street-address"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2 sm:col-start-1">
                        <label
                          htmlFor="city"
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          City
                        </label>
                        <div className="mt-2">
                          <input
                            value={user?.user?.city}
                            readOnly
                            disabled
                            type="text"
                            autoComplete="address-level2"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="region"
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          State / Province
                        </label>
                        <div className="mt-2">
                          <input
                            value={user?.user?.state}
                            readOnly
                            disabled
                            type="text"
                            autoComplete="address-level1"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="postal-code"
                          className="block text-sm/6 font-medium text-gray-900"
                        >
                          ZIP / Postal code
                        </label>
                        <div className="mt-2">
                          <input
                            value={user?.user?.postalCode}
                            readOnly
                            disabled
                            type="text"
                            autoComplete="postal-code"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                      <Link
                        to="/admin/doctors"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        ← Back to Doctor
                      </Link>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">
                Schedule & Availability
              </h2>
              <p className="text-gray-600">Weekly schedule goes here...</p>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Appointments</h2>
              <p className="text-gray-600">List of appointments...</p>
            </div>
          )}

          {activeTab === 'patients' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Patients</h2>
              <p className="text-gray-600">
                Patients treated by this doctor...
              </p>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Medical Activity</h2>
              <p className="text-gray-600">
                Medical records & prescriptions...
              </p>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Feedback & Rating</h2>
              <p className="text-gray-600">Patient feedback and ratings...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
