import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import AdminLayout from '../components/layouts/AdminLayout';

import Dashboard from '../components/pages/admin/Dashboard';
import ManageUsers from '../components/pages/admin/ManageUsers';
import ManageDoctors from '../components/pages/admin/ManageDoctors';
import ManageAdmins from '../components/pages/admin/ManageAdmins';
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
import HomePage, { ServicesPage, DoctorsPage, AboutPage, ContactPage } from '../pages/homepage/HomePage';
import Booking from '../pages/homepage/sections/BookingSchedules/Booking';
import ClinicBooking from '../pages/homepage/sections/BookingSchedules/ClinicBooking';
import ManageSpecialty from '../components/pages/admin/ManageSpecialty';
import ManageClinic from '../components/pages/admin/ManageClinic';
import ManageDoctorClinic from '../components/pages/admin/ManageDoctorClinic';
import StepClinic from '../pages/homepage/sections/BookingSchedules/Steps/StepClinic';
import StepSpecialty from '../pages/homepage/sections/BookingSchedules/Steps/StepSpecialty';
import StepSelectDoctor from '../pages/homepage/sections/BookingSchedules/Steps/StepSelectDoctor';
import SpecialtyDetail from '../pages/homepage/sections/BookingSchedules/Steps/SpecialtyDetail';
import ClinicSpecialties from '../pages/homepage/sections/BookingSchedules/Steps/ClinicSpecialties';
// Clinic Booking - New Flow
import StepClinicSelect from '../pages/homepage/sections/BookingSchedules/Steps/StepClinicSelect';
import StepClinicSpecialties from '../pages/homepage/sections/BookingSchedules/Steps/StepClinicSpecialties';
import StepClinicSelectDoctor from '../pages/homepage/sections/BookingSchedules/Steps/StepClinicSelectDoctor';
import FormAuth from '../pages/homepage/sections/BookingSchedules/Steps/FormAuth';
import FormData from '../pages/homepage/sections/BookingSchedules/Steps/FormData';
import StepConfirmPayment from '../pages/homepage/sections/BookingSchedules/Steps/StepConfirmPayment';
import AppointmentSuccess from '../pages/homepage/sections/BookingSchedules/Steps/AppointmentSuccess';
import DoctorLayout from '../components/layouts/DoctorLayout';
import Profile from '../components/dashboard/Doctor/Profile/Profile';
import DoctorDashboard from '../components/dashboard/Doctor/DoctorDashboard/DoctorDashboard';
import DoctorAppointments from '../components/dashboard/Doctor/Appointments/DoctorAppointments';
import DoctorSchedules from '../components/dashboard/Doctor/Shedules/Schedules';
import PatientProfile from '../components/dashboard/Doctor/PatientProfile/PatientProfile';
import Rating from '../components/dashboard/Doctor/RatingAndFeedBack/Rating';
import Notifications from '../components/dashboard/Doctor/Notifications/Notifications';
import DoctorPrescription from '../components/dashboard/Doctor/DoctorPrescription/DoctorPrescription';
import PatientMedicalHistory from '../components/dashboard/Doctor/PatientProfile/PatientMedicalHistory';
import Auth from '../components/dashboard/Auth/Auth';
import RequireAuth from '../components/layouts/RequireAuth';
import PublicRoute from '../components/dashboard/Auth/PublicRoutes';
import PatientAuth from '../pages/homepage/sections/BookingSchedules/Steps/PatientAuth';
import PatientMessages from '../pages/homepage/sections/PatientFeature/PatientMessages';
import PatientAppointments from '../pages/homepage/sections/PatientFeature/PatientAppointments';
import PatientProfilePage from '../pages/homepage/sections/PatientFeature/PatientProfile';
import PatientPayments from '../pages/homepage/sections/PatientFeature/PatientPayments';
import DoctorDetail from '../pages/homepage/sections/DoctorDetail/DoctorDetail';
import ManageDoctorProfiles from '../components/pages/admin/ManageDoctorProfiles';
import ManageServiceCategories from '../components/pages/admin/ManageServiceCategories';
import ManageClinicSpecialties from '../components/pages/admin/ManageClinicSpecialties';
import ManageBookingCategories from '../components/pages/admin/ManageBookingCategories';
import ManageMessages from '../components/pages/admin/ManageMessages';
import StepServiceSpecialties from '../pages/homepage/sections/BookingSchedules/Steps/StepServiceSpecialties';
import DoctorMessages from '../components/dashboard/Doctor/Messages/DoctorMessages';
import FeedbackForm from '../pages/homepage/sections/PatientFeature/FeedbackForm';
export default function AppRouter() {
  const location = useLocation();
  return (
    <Routes>
      {/* PUBLIC ROUTES (chỉ cho user CHƯA login - Admin/Doctor) */}
      <Route element={<PublicRoute />}>
        <Route path="/admin/login" element={<Auth />} />
      </Route>

      {/* MAIN LAYOUT */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<PatientAuth />} />
        <Route path="/register" element={<PatientAuth />} />

        {/* Patient Feature Pages - Không có progress steps */}
        <Route path="/profile" element={<PatientProfilePage />} />
        <Route path="/appointments" element={<PatientAppointments />} />
        <Route path="/messages" element={<PatientMessages />} />
        <Route path="/payments" element={<PatientPayments />} />

        {/* Specialty Detail - inside MainLayout so header/footer are preserved */}
        <Route path="/specialty/:specialtySlug" element={<SpecialtyDetail />} />
        <Route path="/doctor/:id" element={<DoctorDetail />} />

        {/* Clinic Specialties - Chọn chuyên khoa theo bệnh viện */}
        <Route path="/clinic/:clinicSlug/specialties" element={<ClinicSpecialties />} />

        {/* Service Specialties - Chọn chuyên khoa theo dịch vụ */}
        <Route path="/booking/services/:categorySlug" element={<StepServiceSpecialties />} />

        {/* Booking Layout - Có progress steps */}
        <Route path="/booking" element={<Booking />}>
          <Route index element={<StepSpecialty />} />
          <Route
            path=":specialtySlug/clinics/:clinicId/doctors"
            element={<StepSelectDoctor key={location.pathname} />}
          />
          <Route path="formAuth" element={<FormAuth />} />
          <Route path="formData" element={<FormData />} />
          <Route
            path="formData/payments"
            element={<StepConfirmPayment />}
          />
          <Route
            path="appointment/success"
            element={<AppointmentSuccess />}
          />
        </Route>

        {/* Clinic Booking Layout - Flow mới: Chọn bệnh viện → Chuyên khoa → Bác sĩ */}
        <Route path="/clinic-booking" element={<ClinicBooking />}>
          <Route index element={<StepClinicSelect />} />
          <Route path=":clinicSlug/specialties" element={<StepClinicSpecialties />} />
          <Route path=":clinicSlug/:specialtySlug/doctors" element={<StepClinicSelectDoctor key={location.pathname} />} />
          <Route path="formAuth" element={<FormAuth />} />
          <Route path="formData" element={<FormData />} />
          <Route path="formData/payments" element={<StepConfirmPayment />} />
          <Route path="appointment/success" element={<AppointmentSuccess />} />
        </Route>
      </Route>

      {/* AUTH REQUIRED ROUTES */}
      <Route element={<RequireAuth />}>
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="admins" element={<ManageAdmins />} />
          <Route path="doctors" element={<ManageDoctors />} />
          <Route path="patients" element={<ManagePatient />} />
          <Route path="specialty" element={<ManageSpecialty />} />
          <Route path="clinic" element={<ManageClinic />} />
          <Route path="doctor-clinic" element={<ManageDoctorClinic />} />
          <Route path="appointments" element={<ManageAppointments />} />
          <Route path="departments" element={<ManageDeparments />} />
          <Route path="prescriptions" element={<ManagePrecriptions />} />
          <Route path="payments" element={<ManagePayments />} />
          <Route path="messages" element={<ManageMessages />} />
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
          <Route path="doctor-profiles" element={<ManageDoctorProfiles />} />
          <Route path="service-categories" element={<ManageServiceCategories />} />
          <Route path="clinic-specialties" element={<ManageClinicSpecialties />} />
          <Route path="booking-categories" element={<ManageBookingCategories />} />
        </Route>

        {/* Doctor routes */}
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route path="overview" element={<DoctorDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="patient-history" element={<PatientMedicalHistory />} />
          <Route path="appointment" element={<DoctorAppointments />} />
          <Route path="shedules" element={<DoctorSchedules />} />
          <Route path="patients" element={<PatientProfile />} />
          <Route path="prescription" element={<DoctorPrescription />} />
          <Route path="feedback" element={<Rating />} />
          <Route path="messages" element={<DoctorMessages />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Route>

      {/* FALLBACK — ALWAYS KEEP LAST */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
