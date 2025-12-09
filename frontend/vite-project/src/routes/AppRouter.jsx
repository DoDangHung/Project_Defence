import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import AdminLayout from '../components/layouts/AdminLayout';

import Dashboard from '../components/pages/admin/Dashboard';
import ManageUsers from '../components/pages/admin/ManageUsers';
import ManageDoctors from '../components/pages/admin/ManageDoctors';
import EditUsers from '../components/pages/admin/EditUsers';
import ViewUsers from '../components/pages/admin/ViewUsers';
import ManagePatient from '../components/pages/admin/ManagePatient';
import ManageAppointments from '../components/pages/admin/ManageAppointments';
import ManageDeparments from '../components/pages/admin/ManageDeparments';
import ManagePrecriptions from '../components/pages/admin/ManagePrecriptions';
import ManagePayments from '../components/pages/admin/ManagePayments';
import ManageReviews from '../components/pages/admin/ManageReviews';
import ManageNotifications from '../components/pages/admin/ManageNotifications';
import ManageReports from '../components/pages/admin/ManageReports';
import ManageSystemLogs from '../components/pages/admin/ManageSystemLogs';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      {/* Admin Layout Wrapper */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="doctors" element={<ManageDoctors />} />
        <Route path="patients" element={<ManagePatient />} />
        <Route path="appointments" element={<ManageAppointments />} />
        <Route path="departments" element={<ManageDeparments />} />
        <Route path="prescriptions" element={<ManagePrecriptions />} />
        <Route path="payments" element={<ManagePayments />} />
        <Route path="reviews" element={<ManageReviews />} />
        <Route path="notifications" element={<ManageNotifications />} />
        <Route path="reports" element={<ManageReports />} />
        <Route path="system" element={<ManageSystemLogs />} />
        <Route path="users/edit/:id" element={<EditUsers />} />
        <Route path="users/view/:id" element={<ViewUsers />} />
      </Route>
    </Routes>
  );
}
