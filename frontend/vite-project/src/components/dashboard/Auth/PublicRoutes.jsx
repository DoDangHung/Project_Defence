import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
const PublicRoute = () => {
  const token = sessionStorage.getItem('token');
  const userType = sessionStorage.getItem('userType');

  if (!token) return <Outlet />;

  if (userType === 'Admin') return <Navigate to="/admin/dashboard" replace />;
  if (userType === 'Doctor') return <Navigate to="/doctor" replace />;

  return <Navigate to="/" replace />;
};

export default PublicRoute;
