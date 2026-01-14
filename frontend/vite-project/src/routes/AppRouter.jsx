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
import AddUsers from '../components/pages/admin/AddUsers';
import AddDoctors from '../components/pages/admin/AddDoctors';
import EditDoctors from '../components/pages/admin/EditDoctors';
import ViewDoctors from '../components/pages/admin/ViewDoctors';
import MainLayout from '../components/layouts/MainLayout';
import HomePage from '../pages/homepage/HomePage';
import Booking from '../pages/homepage/sections/BookingSchedules/Booking';
import ManageSpecialty from '../components/pages/admin/ManageSpecialty';
import ManageClinic from '../components/pages/admin/ManageClinic';
import StepClinic from '../pages/homepage/sections/BookingSchedules/Steps/StepClinic';
import StepSpecialty from '../pages/homepage/sections/BookingSchedules/Steps/StepSpecialty';
import StepSelectDoctor from '../pages/homepage/sections/BookingSchedules/Steps/StepSelectDoctor';
import DoctorLayout from '../components/layouts/DoctorLayout';
import Profile from '../components/dashboard/Doctor/Profile/Profile';
import DoctorDashboard from '../components/dashboard/Doctor/DoctorDashboard/DoctorDashboard';
import DoctorAppointments from '../components/dashboard/Doctor/Appointments/DoctorAppointments';
import DoctorSchedules from '../components/dashboard/Doctor/Shedules/Schedules';
import PatientProfile from '../components/dashboard/Doctor/PatientProfile/PatientProfile';
import Rating from '../components/dashboard/Doctor/RatingAndFeedBack/Rating';
import Notifications from '../components/dashboard/Doctor/Notifications/Notifications';
import DoctorPrescription from '../components/dashboard/Doctor/DoctorPrescription/DoctorPrescription';
import Auth from '../components/dashboard/Auth/Auth';
import RequireAuth from '../components/layouts/RequireAuth';
import PublicRoute from '../components/dashboard/Auth/PublicRoutes';

export default function AppRouter() {
  return (
    <Routes>
      {/* PUBLIC ROUTES (chỉ cho user CHƯA login) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Auth />} />
      </Route>

      {/* MAIN LAYOUT */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />

        {/* Booking Layout */}
        <Route path="/booking" element={<Booking />}>
          <Route index element={<StepSpecialty />} />
          <Route path="clinics/:slug" element={<StepClinic />} />
          <Route
            path="/booking/:specialtySlug/clinics/:clinicId/doctors"
            element={<StepSelectDoctor />}
          />
        </Route>
      </Route>

      {/* AUTH REQUIRED ROUTES */}
      <Route element={<RequireAuth />}>
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="doctors" element={<ManageDoctors />} />
          <Route path="patients" element={<ManagePatient />} />
          <Route path="specialty" element={<ManageSpecialty />} />
          <Route path="clinic" element={<ManageClinic />} />
          <Route path="appointments" element={<ManageAppointments />} />
          <Route path="departments" element={<ManageDeparments />} />
          <Route path="prescriptions" element={<ManagePrecriptions />} />
          <Route path="payments" element={<ManagePayments />} />
          <Route path="reviews" element={<ManageReviews />} />
          <Route path="notifications" element={<ManageNotifications />} />
          <Route path="reports" element={<ManageReports />} />
          <Route path="system" element={<ManageSystemLogs />} />
          <Route path="users/add" element={<AddUsers />} />
          <Route path="users/edit/:id" element={<EditUsers />} />
          <Route path="users/view/:id" element={<ViewUsers />} />
          <Route path="doctors/add" element={<AddDoctors />} />
          <Route path="doctors/edit/:id" element={<EditDoctors />} />
          <Route path="doctors/view/:id" element={<ViewDoctors />} />
        </Route>

        {/* Doctor routes */}
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route path="overview" element={<DoctorDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="appointment" element={<DoctorAppointments />} />
          <Route path="shedules" element={<DoctorSchedules />} />
          <Route path="patients" element={<PatientProfile />} />
          <Route path="prescription" element={<DoctorPrescription />} />
          <Route path="feedback" element={<Rating />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Route>

      {/* FALLBACK — ALWAYS KEEP LAST */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
