import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
} from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal'); // personal, professional, security
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: '',
    avatar: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',

    // Professional Info
    specialization: '',
    experience: 0,
    bio: '',
    education: '',
    certifications: [],
    consultationFee: 0,
    rating: 0,
    totalAppointments: 0,

    // Clinics
    clinics: [],
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const doctorId = 1; // Lấy từ auth

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8080/api/doctors/${doctorId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = response.data.data || response.data;
      setProfileData({
        firstName: data.user?.firstName || '',
        lastName: data.user?.lastName || '',
        email: data.user?.email || '',
        phone: data.user?.phone || '',
        gender: data.user?.gender || 'Male',
        dateOfBirth: data.user?.dateOfBirth?.split('T')[0] || '',
        avatar: data.user?.avatar || '',
        address: data.user?.streetAddress || '',
        city: data.user?.city || '',
        state: data.user?.state || '',
        postalCode: data.user?.postalCode || '',
        specialization: data.specialization || '',
        experience: data.experience || 0,
        bio: data.bio || '',
        education: data.education || '',
        certifications: data.certifications || [],
        consultationFee: data.consultationFee || 0,
        rating: data.rating || 0,
        totalAppointments: data.totalAppointments || 0,
        clinics: data.clinics || [],
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8080/api/doctors/${doctorId}`,
        profileData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert('Cập nhật thông tin thành công!');
      setIsEditing(false);
      fetchDoctorProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Có lỗi xảy ra khi cập nhật!');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu mới không khớp!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8080/api/auth/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert('Đổi mật khẩu thành công!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Mật khẩu hiện tại không đúng!');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:8080/api/upload/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      setProfileData((prev) => ({ ...prev, avatar: response.data.url }));
      alert('Cập nhật ảnh đại diện thành công!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Có lỗi khi tải ảnh lên!');
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
          <h1 className="text-3xl font-bold text-gray-800">Hồ sơ cá nhân</h1>
          <p className="text-gray-600 mt-1">
            Quản lý thông tin cá nhân và chuyên môn của bạn
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
                    {profileData.rating} Rating
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {profileData.experience} năm kinh nghiệm
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {profileData.totalAppointments} lượt khám
                  </span>
                </div>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  <Edit2 className="w-4 h-4" />
                  Chỉnh sửa
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Đang lưu...' : 'Lưu'}
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
                onClick={() => setActiveTab('personal')}
                className={`flex-1 px-6 py-4 font-semibold transition ${
                  activeTab === 'personal'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <User className="w-5 h-5 inline mr-2" />
                Thông tin cá nhân
              </button>
              <button
                onClick={() => setActiveTab('professional')}
                className={`flex-1 px-6 py-4 font-semibold transition ${
                  activeTab === 'professional'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Briefcase className="w-5 h-5 inline mr-2" />
                Thông tin chuyên môn
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex-1 px-6 py-4 font-semibold transition ${
                  activeTab === 'security'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Lock className="w-5 h-5 inline mr-2" />
                Bảo mật
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Họ"
                    icon={User}
                    value={profileData.firstName}
                    onChange={(e) =>
                      handleInputChange('firstName', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                  <InputField
                    label="Tên"
                    icon={User}
                    value={profileData.lastName}
                    onChange={(e) =>
                      handleInputChange('lastName', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                  <InputField
                    label="Email"
                    icon={Mail}
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                  />
                  <InputField
                    label="Số điện thoại"
                    icon={Phone}
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                  />
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Giới tính
                    </label>
                    <select
                      value={profileData.gender}
                      onChange={(e) =>
                        handleInputChange('gender', e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
                    >
                      <option value="Male">Nam</option>
                      <option value="Female">Nữ</option>
                      <option value="Other">Khác</option>
                    </select>
                  </div>
                  <InputField
                    label="Ngày sinh"
                    icon={Calendar}
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange('dateOfBirth', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                  <div className="md:col-span-2">
                    <InputField
                      label="Địa chỉ"
                      icon={MapPin}
                      value={profileData.address}
                      onChange={(e) =>
                        handleInputChange('address', e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <InputField
                    label="Thành phố"
                    icon={Building2}
                    value={profileData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    disabled={!isEditing}
                  />
                  <InputField
                    label="Quận/Huyện"
                    icon={MapPin}
                    value={profileData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            )}

            {/* Professional Information Tab */}
            {activeTab === 'professional' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Chuyên khoa"
                    icon={Briefcase}
                    value={profileData.specialization}
                    onChange={(e) =>
                      handleInputChange('specialization', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                  <InputField
                    label="Kinh nghiệm (năm)"
                    icon={Award}
                    type="number"
                    value={profileData.experience}
                    onChange={(e) =>
                      handleInputChange('experience', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                  <InputField
                    label="Phí khám (VND)"
                    icon={DollarSign}
                    type="number"
                    value={profileData.consultationFee}
                    onChange={(e) =>
                      handleInputChange('consultationFee', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                  <InputField
                    label="Học vấn"
                    icon={GraduationCap}
                    value={profileData.education}
                    onChange={(e) =>
                      handleInputChange('education', e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Tiểu sử
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
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
                    Phòng khám đang làm việc
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
            {activeTab === 'security' && (
              <div className="max-w-2xl space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Đổi mật khẩu
                </h3>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
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
                    type={showPassword ? 'text' : 'password'}
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
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
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
                  {showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                </button>

                <button
                  onClick={handleChangePassword}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Đổi mật khẩu
                </button>
              </div>
            )}
          </div>
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
  type = 'text',
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
