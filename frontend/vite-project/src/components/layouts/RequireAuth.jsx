import React from 'react';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    if (!token) return setLoading(false);

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
        // Lưu lại user nếu cần cho Header sau refresh
        sessionStorage.setItem('user', JSON.stringify(data.data));
      })
      .catch(() => {
        sessionStorage.clear();
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
