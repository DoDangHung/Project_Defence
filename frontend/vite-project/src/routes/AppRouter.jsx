import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../components/layouts/AdminLayout';

import Dashboard from '../components/pages/admin/Dashboard';
import ManageUsers from '../components/pages/admin/ManageUsers';
import ManageDoctors from '../components/pages/admin/ManageDoctors';
import EditUsers from '../components/pages/admin/EditUsers';
import ViewUsers from '../components/pages/admin/ViewUsers';

export default function AppRouter() {
  return (
    <Routes>
      {/* Admin Layout Wrapper */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="users/edit/:id" element={<EditUsers />} />
        <Route path="users/view/:id" element={<ViewUsers />} />
        <Route path="doctors" element={<ManageDoctors />} />
      </Route>
    </Routes>
  );
}
