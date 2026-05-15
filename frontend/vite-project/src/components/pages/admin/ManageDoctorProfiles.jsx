/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Check,
  X,
  Eye,
  Clock,
  User,
  Mail,
  FileText,
  Award,
  GraduationCap,
  Stethoscope,
  Star,
  Globe,
} from "lucide-react";

export default function ManageDoctorProfiles() {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPendingProfiles = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:8080/api/doctors/pending-profiles",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setPendingDoctors(res.data.data || []);
    } catch (err) {
      console.error("Error fetching pending profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProfiles();
  }, []);

  const handleApprove = async (doctorId) => {
    if (!confirm("Confirm to approve doctor profile?")) return;

    setActionLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/doctors/approve-profile/${doctorId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Doctor profile approved!");
      fetchPendingProfiles();
      setSelectedDoctor(null);
    } catch (err) {
      console.error("Error approving profile:", err);
      alert("Error approving profile!");
    } finally {
      setActionLoading(false);
    }
  };

  const renderField = (label, value, Icon) => {
    if (!value) return null;
    return (
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
          {Icon}
          {label}
        </label>
        <div
          className="text-gray-600 bg-gray-50 p-3 rounded-lg [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Approve Doctor Profiles
        </h1>
        <p className="text-gray-600 mt-1">
          View and approve public information of doctor before displaying to
          patients
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-800">
                {pendingDoctors.length}
              </p>
              <p className="text-sm text-yellow-600">Pending approval</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : pendingDoctors.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">All approved!</h3>
          <p className="text-gray-600 mt-2">No profiles are pending approval</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doctor List */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-gray-800">
                Waiting list for approval ({pendingDoctors.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {pendingDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  onClick={() => setSelectedDoctor(doctor)}
                  className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors ${
                    selectedDoctor?.id === doctor.id
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {doctor.user?.firstName?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        BS. {doctor.user?.firstName} {doctor.user?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {doctor.specialization}
                      </p>
                    </div>
                    <Eye className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {selectedDoctor ? (
              <>
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800">
                    Profile details
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedDoctor(null)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                      title="Đóng"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 max-h-[500px] overflow-y-auto">
                  {/* Doctor Info */}
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                      {selectedDoctor.user?.firstName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-lg">
                        BS. {selectedDoctor.user?.firstName}{" "}
                        {selectedDoctor.user?.lastName}
                      </p>
                      <p className="text-blue-600">
                        {selectedDoctor.specialization}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <Mail className="w-4 h-4" />
                        {selectedDoctor.user?.email}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {selectedDoctor.bio && (
                    <div className="mb-4">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                        <FileText className="w-4 h-4" />
                        Biography (current)
                      </label>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {selectedDoctor.bio}
                      </p>
                    </div>
                  )}

                  {/* New Profile Info */}
                  <h3 className="font-semibold text-gray-800 mb-4 mt-6 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-blue-600" />
                    New public profile
                  </h3>

                  {renderField(
                    "Introduction",
                    selectedDoctor.about,
                    <Stethoscope className="w-4 h-4" />,
                  )}
                  {renderField(
                    "Education & Qualifications",
                    selectedDoctor.education,
                    <GraduationCap className="w-4 h-4" />,
                  )}
                  {renderField(
                    "Training",
                    selectedDoctor.training,
                    <Award className="w-4 h-4" />,
                  )}
                  {renderField(
                    "Achievements & Awards",
                    selectedDoctor.achievements,
                    <Star className="w-4 h-4" />,
                  )}
                  {renderField(
                    "Languages",
                    selectedDoctor.languages,
                    <Globe className="w-4 h-4" />,
                  )}
                  {renderField(
                    "Services",
                    selectedDoctor.services,
                    <Stethoscope className="w-4 h-4" />,
                  )}

                  {/* Actions */}
                  <div className="flex gap-4 mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleApprove(selectedDoctor.id)}
                      disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <Check className="w-5 h-5" />
                      {actionLoading ? "Processing..." : "Approve profile"}
                    </button>
                    <button
                      onClick={() => setSelectedDoctor(null)}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                    >
                      Skip
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-gray-500">
                <div className="text-center">
                  <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a doctor to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
