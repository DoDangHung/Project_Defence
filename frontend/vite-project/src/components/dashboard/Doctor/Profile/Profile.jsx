/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  Building2,
  Edit2,
  Save,
  X,
  Upload,
  DollarSign,
  Clock,
  Star,
  GraduationCap,
  FileText,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Stethoscope,
  Check,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  AlignLeft,
  RotateCcw,
} from "lucide-react";

const Profile = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("personal"); // personal, professional, security, public-profile
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "Male",
    dateOfBirth: "",
    avatar: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",

    // Professional Info
    specialization: "",
    experience: 0,
    bio: "",
    education: "",
    certifications: [],
    consultationFee: 0,
    rating: 0,
    totalAppointments: 0,

    // Public Profile (hiển thị cho bệnh nhân)
    about: "",
    training: "",
    achievements: "",
    languages: "",
    services: "",
    isProfileApproved: false,

    // Clinics
    clinics: [],
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const getDoctorId = () => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    return user.doctorId || user.doctor?.id || user.id;
  };

  useEffect(() => {
    fetchDoctorProfile();
  }, [location.pathname]);

  const fetchDoctorProfile = async () => {
    const doctorId = getDoctorId();
    if (!doctorId) return;

    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/doctors/${doctorId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = response.data.data || response.data;
      setProfileData({
        firstName: data.user?.firstName || "",
        lastName: data.user?.lastName || "",
        email: data.user?.email || "",
        phone: data.user?.phone || "",
        gender: data.user?.gender || "Male",
        dateOfBirth: data.user?.dateOfBirth?.split("T")[0] || "",
        avatar: data.user?.avatar || "",
        address: data.user?.streetAddress || "",
        city: data.user?.city || "",
        state: data.user?.state || "",
        postalCode: data.user?.postalCode || "",
        specialization: data.specialization || "",
        experience: data.experience || 0,
        bio: data.bio || "",
        education: data.education || "",
        certifications: data.certifications || [],
        consultationFee: data.consultationFee || 0,
        rating: data.rating || 0,
        totalAppointments: data.totalAppointments || 0,
        // Public profile fields
        about: data.about || "",
        training: data.training || "",
        achievements: data.achievements || "",
        languages: data.languages || "",
        services: data.services || "",
        isProfileApproved: data.isProfileApproved || false,
        clinics: data.clinics || [],
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem("token");
      const doctorId = getDoctorId();

      // Update basic info
      await axios.put(
        `http://localhost:8080/api/doctors/${doctorId}`,
        {
          specialization: profileData.specialization,
          experience: profileData.experience,
          bio: profileData.bio,
          education: profileData.education,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Update public profile (needs admin approval)
      await axios.put(
        `http://localhost:8080/api/doctors/my-profile`,
        {
          about: profileData.about,
          training: profileData.training,
          achievements: profileData.achievements,
          languages: profileData.languages,
          services: profileData.services,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert(
        "Cập nhật thông tin thành công! Thông tin công khai sẽ được hiển thị sau khi admin duyệt.",
      );
      setIsEditing(false);
      fetchDoctorProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Có lỗi xảy ra khi cập nhật!");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `http://localhost:8080/api/auth/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Đổi mật khẩu thành công!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Mật khẩu hiện tại không đúng!");
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8080/api/upload/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setProfileData((prev) => ({ ...prev, avatar: response.data.url }));
      alert("Cập nhật ảnh đại diện thành công!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Có lỗi khi tải ảnh lên!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Personal profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your personal information and professional information
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
          {/* Cover & Avatar */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white text-4xl font-bold">
                      {profileData.firstName?.charAt(0)}
                      {profileData.lastName?.charAt(0)}
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 pb-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  BS. {profileData.firstName} {profileData.lastName}
                </h2>
                <p className="text-blue-600 font-semibold mt-1">
                  {profileData.specialization}
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {profileData.rating} Ratings
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {profileData.experience} years of experience
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {profileData.totalAppointments} appointments
                  </span>
                </div>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("personal")}
                className={`flex-1 px-6 py-4 font-semibold transition ${
                  activeTab === "personal"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <User className="w-5 h-5 inline mr-2" />
                Personal information
              </button>
              <button
                onClick={() => setActiveTab("professional")}
                className={`flex-1 px-6 py-4 font-semibold transition ${
                  activeTab === "professional"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Briefcase className="w-5 h-5 inline mr-2" />
                Professional information
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex-1 px-6 py-4 font-semibold transition ${
                  activeTab === "security"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Lock className="w-5 h-5 inline mr-2" />
                Security
              </button>
              <button
                onClick={() => setActiveTab("public-profile")}
                className={`flex-1 px-6 py-4 font-semibold transition ${
                  activeTab === "public-profile"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Eye className="w-5 h-5 inline mr-2" />
                Public profile
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* Personal Information Tab */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="First name"
                    icon={User}
                    value={profileData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                  <InputField
                    label="Last name"
                    icon={User}
                    value={profileData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                  <InputField
                    label="Email"
                    icon={Mail}
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                  />
                  <InputField
                    label="Phone number"
                    icon={Phone}
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                  />
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={profileData.gender}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <InputField
                    label="Date of birth"
                    icon={Calendar}
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                  <div className="md:col-span-2">
                    <InputField
                      label="Address"
                      icon={MapPin}
                      value={profileData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <InputField
                    label="City"
                    icon={Building2}
                    value={profileData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    disabled={!isEditing}
                  />
                  <InputField
                    label="District/County"
                    icon={MapPin}
                    value={profileData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            )}

            {/* Professional Information Tab */}
            {activeTab === "professional" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Specialization"
                    icon={Briefcase}
                    value={profileData.specialization}
                    onChange={(e) =>
                      handleInputChange("specialization", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                  <InputField
                    label="Experience (years)"
                    icon={Award}
                    type="number"
                    value={profileData.experience}
                    onChange={(e) =>
                      handleInputChange("experience", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                  <InputField
                    label="Consultation fee (VND)"
                    icon={DollarSign}
                    type="number"
                    value={profileData.consultationFee}
                    onChange={(e) =>
                      handleInputChange("consultationFee", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                  <InputField
                    label="Education"
                    icon={GraduationCap}
                    value={profileData.education}
                    onChange={(e) =>
                      handleInputChange("education", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Biography
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    disabled={!isEditing}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
                    placeholder="Mô tả ngắn về bản thân và chuyên môn..."
                  />
                </div>

                {/* Clinics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    <Building2 className="w-5 h-5 inline mr-2" />
                    Clinics I'm working in
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileData.clinics.map((clinic) => (
                      <div
                        key={clinic.id}
                        className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl"
                      >
                        <h4 className="font-semibold text-gray-800">
                          {clinic.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {clinic.address}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>
                            <Clock className="w-3 h-3 inline mr-1" />
                            {clinic.openingTime} - {clinic.closingTime}
                          </span>
                          <span>
                            <Phone className="w-3 h-3 inline mr-1" />
                            {clinic.phone}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="max-w-2xl space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Change password
                </h3>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm new password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                  {showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                </button>

                <button
                  onClick={handleChangePassword}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Change password
                </button>
              </div>
            )}

            {/* Public Profile Tab - Thông tin hiển thị cho bệnh nhân */}
            {activeTab === "public-profile" && (
              <div className="space-y-6">
                {/* Status banner */}
                <div
                  className={`p-4 rounded-xl ${profileData.isProfileApproved ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"}`}
                >
                  <div className="flex items-center gap-3">
                    {profileData.isProfileApproved ? (
                      <>
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-800">
                            Public profile is approved
                          </p>
                          <p className="text-sm text-green-600">
                            Your public profile is displayed to patients
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-yellow-800">
                            Public profile is pending approval
                          </p>
                          <p className="text-sm text-yellow-600">
                            Your public profile will be displayed to patients
                            after admin approval
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-gray-600">
                  Fill in the information below to create your public profile.
                  This information will be displayed to patients when they view
                  your details.
                </p>

                {/* Tiptap Editor Styles */}
                <style>{`
                  .tiptap-toolbar {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                    padding: 8px;
                    border: 2px solid #e5e7eb;
                    border-bottom: none;
                    border-radius: 8px 8px 0 0;
                    background: #f9fafb;
                  }
                  .tiptap-toolbar button {
                    padding: 6px 8px;
                    border: 1px solid #d1d5db;
                    border-radius: 4px;
                    background: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                  .tiptap-toolbar button:hover {
                    background: #e5e7eb;
                  }
                  .tiptap-toolbar button.is-active {
                    background: #dbeafe;
                    border-color: #3b82f6;
                    color: #3b82f6;
                  }
                  .tiptap-editor {
                    border: 2px solid #e5e7eb;
                    border-radius: 0 0 8px 8px;
                    min-height: 150px;
                  }
                  .tiptap-editor .ProseMirror {
                    padding: 12px;
                    min-height: 150px;
                    outline: none;
                  }
                  .tiptap-editor .ProseMirror p {
                    margin: 0 0 8px 0;
                  }
                  .tiptap-editor .ProseMirror ul,
                  .tiptap-editor .ProseMirror ol {
                    padding-left: 24px;
                    margin: 8px 0;
                  }
                  .tiptap-editor .ProseMirror h1,
                  .tiptap-editor .ProseMirror h2 {
                    margin: 16px 0 8px 0;
                    font-weight: bold;
                  }
                  .tiptap-editor .ProseMirror h1 {
                    font-size: 1.5em;
                  }
                  .tiptap-editor .ProseMirror h2 {
                    font-size: 1.25em;
                  }
                `}</style>

                <RichTextEditor
                  label="Introduction"
                  value={profileData.about}
                  onChange={(val) => handleInputChange("about", val)}
                  icon={<Stethoscope className="w-4 h-4 inline mr-2" />}
                  isEditing={isEditing}
                />

                <RichTextEditor
                  label="Education & Qualifications"
                  value={profileData.education}
                  onChange={(val) => handleInputChange("education", val)}
                  icon={<GraduationCap className="w-4 h-4 inline mr-2" />}
                  isEditing={isEditing}
                />

                <RichTextEditor
                  label="Training & Qualifications"
                  value={profileData.training}
                  onChange={(val) => handleInputChange("training", val)}
                  icon={<Award className="w-4 h-4 inline mr-2" />}
                  isEditing={isEditing}
                />

                <RichTextEditor
                  label="Achievements & Awards"
                  value={profileData.achievements}
                  onChange={(val) => handleInputChange("achievements", val)}
                  icon={<Star className="w-4 h-4 inline mr-2" />}
                  isEditing={isEditing}
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Ngôn ngữ
                  </label>
                  <input
                    type="text"
                    value={profileData.languages}
                    onChange={(e) =>
                      handleInputChange("languages", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
                    placeholder="Tiếng Việt, Tiếng Anh..."
                  />
                </div>

                <RichTextEditor
                  label="Services"
                  value={profileData.services}
                  onChange={(val) => handleInputChange("services", val)}
                  icon={<Stethoscope className="w-4 h-4 inline mr-2" />}
                  isEditing={isEditing}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Rich Text Editor Component using Tiptap
const RichTextEditor = ({ label, value, onChange, icon, isEditing }) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value || "",
    editable: isEditing,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editable state when isEditing changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing);
    }
  }, [isEditing, editor]);

  if (!isEditing) {
    return (
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          {icon}
          {label}
        </label>
        <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[120px]">
          {value ? (
            <div
              className="prose prose-sm max-w-none text-gray-700 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          ) : (
            <p className="text-gray-400 italic">No information</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
        {icon}
        {label}
      </label>
      <div>
        {/* Toolbar */}
        <div className="tiptap-toolbar">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={editor?.isActive("bold") ? "is-active" : ""}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={editor?.isActive("italic") ? "is-active" : ""}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className={editor?.isActive("underline") ? "is-active" : ""}
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <span className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor?.isActive("heading", { level: 1 }) ? "is-active" : ""
            }
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor?.isActive("heading", { level: 2 }) ? "is-active" : ""
            }
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <span className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={editor?.isActive("bulletList") ? "is-active" : ""}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={editor?.isActive("orderedList") ? "is-active" : ""}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <span className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
            className={
              editor?.isActive({ textAlign: "left" }) ? "is-active" : ""
            }
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              editor?.chain().focus().clearNodes().unsetAllMarks().run()
            }
            title="Clear Formatting"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        {/* Editor */}
        <div className="tiptap-editor">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

// Input Field Component
const InputField = ({
  label,
  icon: Icon,
  value,
  onChange,
  disabled,
  type = "text",
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {Icon && <Icon className="w-4 h-4 inline mr-2" />}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-600"
      />
    </div>
  );
};

export default Profile;
