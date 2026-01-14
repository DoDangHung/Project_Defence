import React from 'react';
import { Bell, Menu, Settings } from 'lucide-react';

const AdminHeader = ({
  sidebarOpen,
  setSidebarOpen,
  mobileMenuOpen,
  setMobileMenuOpen,
  activeTab,
}) => {
  const user = JSON.parse(sessionStorage.getItem('user'));

  const fullName = `${user?.firstName} ${user?.lastName}`;
  const email = user?.email;
  const avatarLetter = user?.firstName?.charAt(0).toUpperCase();

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={20} className="text-gray-600" />
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings size={20} className="text-gray-600" />
          </button>

          <h2 className="lg:hidden text-lg font-bold text-gray-900 capitalize">
            {activeTab}
          </h2>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{fullName}</p>
              <p className="text-xs text-gray-500">{email}</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
          <div className="md:hidden w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
