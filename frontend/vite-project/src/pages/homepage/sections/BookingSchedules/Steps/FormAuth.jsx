import React, { useState, useCallback, useEffect } from 'react';
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Calendar,
  Users,
  ChevronDown,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

const StepIndicator = ({ mode }) => (
  <div className="flex items-center justify-center gap-2 mb-8 px-4">
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-500 text-white">
      <User size={20} />
    </div>
    <div className="flex-1 h-1 bg-sky-500 max-w-[100px] md:max-w-[150px]"></div>
    <div
      className={`flex items-center justify-center w-10 h-10 rounded-full ${mode === 'register' ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-500'}`}
    >
      <Users size={20} />
    </div>
    <div className="flex-1 h-1 bg-gray-200 max-w-[100px] md:max-w-[150px]"></div>
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-500">
      <Calendar size={20} />
    </div>
  </div>
);

const ChooseScreen = ({ onChooseRegister, onChooseLogin }) => (
  <div className="text-center py-8">
    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-sky-100 to-sky-50 rounded-2xl flex items-center justify-center">
      <User size={48} className="text-sky-500" />
    </div>
    <p className="text-gray-600 mb-2">Bạn được phép tạo tối đa 10 hồ sơ</p>
    <p className="text-gray-500 mb-8 text-sm">
      (cá nhân và người thân trong gia đình)
    </p>

    <button
      onClick={onChooseRegister}
      className="w-full max-w-sm mx-auto bg-sky-500 hover:bg-sky-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 mb-6"
    >
      Chưa từng khám, đăng ký mới
    </button>

    <div className="flex items-center gap-4 max-w-sm mx-auto mb-4">
      <div className="flex-1 border-t border-dashed border-gray-300"></div>
      <span className="text-gray-500 text-sm">Hoặc</span>
      <div className="flex-1 border-t border-dashed border-gray-300"></div>
    </div>

    <button
      onClick={onChooseLogin}
      className="text-sky-500 hover:text-sky-600 font-medium transition-colors"
    >
      Đăng nhập để lấy danh sách hồ sơ của bạn
    </button>
  </div>
);

const LoginForm = ({ formData, handleChange, onBack, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onLogin} className="space-y-6 py-4">
      <h3 className="text-xl font-semibold text-center text-gray-800 mb-6">
        Đăng nhập
      </h3>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Mật khẩu <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu..."
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all"
        >
          Quay lại
        </button>
        <button
          type="submit"
          className="flex-1 py-3 px-6 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-all"
        >
          Đăng nhập
        </button>
      </div>
    </form>
  );
};

const RegisterForm = ({ formData, handleChange, onBack, onRegister }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onRegister} className="py-4">
      <h3 className="text-xl font-semibold text-center text-gray-800 mb-6">
        Đăng ký tài khoản mới
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Họ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Nhập họ..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Nhập tên..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Mật khẩu <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu..."
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Giới tính <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                required
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={20}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Ngày sinh <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Địa chỉ <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              placeholder="Nhập địa chỉ..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Thành phố <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Thành phố..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tỉnh/Quận
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Tỉnh/Quận..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Mã bưu điện
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Mã bưu điện..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all"
        >
          Quay lại
        </button>
        <button
          type="submit"
          className="flex-1 py-3 px-6 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-all"
        >
          Đăng ký
        </button>
      </div>
    </form>
  );
};

const FormAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegisterPage = location.pathname === '/register';

  // Check if user is already logged in
  const token = sessionStorage.getItem('token');

  const [mode, setMode] = useState(isRegisterPage ? 'register' : 'choose');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    roleId: 3,
    roleName: 'Patient',
  });

  // If already logged in, skip to payment step
  useEffect(() => {
    if (token) {
      navigate('/booking/formData/payments', { replace: true });
    }
  }, [token, navigate]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log('data from register', data);
      if (!res.ok || !data.success) {
        alert(data.message || 'Đăng ký thất bại');
        return;
      }

      alert('Đăng ký thành công! Vui lòng đăng nhập');
      setMode('login');
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối server');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || 'Đăng nhập thất bại');
        return;
      }

      sessionStorage.setItem('token', data.data.token);
      sessionStorage.setItem('user', JSON.stringify(data.data.user));
      sessionStorage.setItem('userType', data.data.user.role.name);

      window.dispatchEvent(new Event('userLogin'));
      navigate('/booking/formData/payments');
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối server');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <aside className="lg:w-72 bg-sky-500 text-white p-6">
          <h2 className="font-semibold text-lg mb-4">Thông tin cơ sở y tế</h2>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-medium text-white/90 flex items-center gap-2">
              Phòng khám Đa khoa Thuận Mỹ Sài Gòn
              <span className="inline-block w-4 h-4 bg-white/20 rounded-full text-xs flex items-center justify-center">
                ✓
              </span>
            </h3>
            <p className="text-white/60 text-sm mt-2">
              (Thành viên Tập đoàn Y Khoa Hoàn Mỹ)
            </p>
            <p className="text-white/70 text-sm mt-3">
              4A Hoàng Việt, Phường Tân Sơn Nhất, TP. HCM (Địa chỉ cũ: 4A Hoàng
              Việt, Phường 4, Quận Tân Bình, TPHCM)
            </p>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
              Chọn hồ sơ
            </h1>

            <StepIndicator mode={mode} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              {mode === 'choose' && (
                <ChooseScreen
                  onChooseRegister={() => setMode('register')}
                  onChooseLogin={() => setMode('login')}
                />
              )}
              {mode === 'login' && (
                <LoginForm
                  formData={formData}
                  handleChange={handleChange}
                  onBack={() => setMode('choose')}
                  onLogin={handleLogin}
                />
              )}
              {mode === 'register' && (
                <RegisterForm
                  formData={formData}
                  handleChange={handleChange}
                  onBack={() => setMode('choose')}
                  onRegister={handleRegister}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FormAuth;
