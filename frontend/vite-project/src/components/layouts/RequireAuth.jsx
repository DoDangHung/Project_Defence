import React from 'react';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RequireAuth = () => {
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const location = useLocation();
  const token = sessionStorage.getItem('token');
  const storedUserType = sessionStorage.getItem('userType');

  useEffect(() => {
    const fetchUser = () => {
      if (!token) {
        setLoading(false);
        return;
      }

      fetch('http://localhost:8080/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Invalid token');
          return res.json();
        })
        .then((data) => {
          sessionStorage.setItem('user', JSON.stringify(data.data));
          const roleName = data.data.role?.name?.toLowerCase();
          setUserType(roleName);
          sessionStorage.setItem('userType', data.data.role?.name);
        })
        .catch(() => {
          sessionStorage.clear();
          setUserType(null);
        })
        .finally(() => setLoading(false));
    };

    fetchUser();

    // Listen for storage changes (login/logout in another tab or component)
    const handleStorageChange = () => {
      const newToken = sessionStorage.getItem('token');
      if (!newToken) {
        sessionStorage.clear();
        setUserType(null);
        setLoading(false);
      } else {
        fetchUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (loading) return <p>Loading...</p>;

  // Nếu không có token
  if (!token) {
    // Check URL path để xác định nên redirect về login nào
    const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/doctor');
    const redirectPath = isAdminRoute ? '/admin/login' : '/login';
    return <Navigate to={redirectPath} replace />;
  }

  // Nếu có token nhưng userType không phù hợp với route
  const currentPath = location.pathname;
  const isAdminRoute = currentPath.startsWith('/admin');
  const isDoctorRoute = currentPath.startsWith('/doctor');
  const isPatientRoute = !isAdminRoute && !isDoctorRoute;

  if (storedUserType) {
    const roleName = storedUserType.toLowerCase();

    // Admin cố truy cập Doctor route → redirect về admin dashboard
    if (roleName === 'admin' && isDoctorRoute) {
      return <Navigate to="/admin/dashboard" replace />;
    }

    // Doctor cố truy cập Admin route → redirect về doctor dashboard
    if (roleName === 'doctor' && isAdminRoute) {
      return <Navigate to="/doctor/overview" replace />;
    }

    // Patient cố truy cập Admin/Doctor route → redirect về trang chủ
    if (roleName === 'patient' && (isAdminRoute || isDoctorRoute)) {
      sessionStorage.clear();
      return <Navigate to="/login" replace />;
    }
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
