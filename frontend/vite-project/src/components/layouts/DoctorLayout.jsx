import React from 'react';
import { useState } from 'react';
import AdminHeader from './AdminHeader';
import { Outlet } from 'react-router-dom';
import DoctorSidebar from '../dashboard/Doctor/DoctorDashboard/SideBar.jsx';

export default function DoctorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <DoctorSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {/* ⭐ VERY IMPORTANT: Render route children here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
