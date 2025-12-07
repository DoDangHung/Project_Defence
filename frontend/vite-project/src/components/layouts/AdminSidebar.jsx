import React from 'react';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  UserCircle,
  Calendar,
  Building2,
  Pill,
  CreditCard,
  Star,
  Bell,
  FileText,
  Settings,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'doctors', icon: Stethoscope, label: 'Doctors' },
    { id: 'patients', icon: UserCircle, label: 'Patients' },
    { id: 'appointments', icon: Calendar, label: 'Appointments' },
    { id: 'departments', icon: Building2, label: 'Departments' },
    { id: 'prescriptions', icon: Pill, label: 'Prescriptions' },
    { id: 'payments', icon: CreditCard, label: 'Payments' },
    { id: 'reviews', icon: Star, label: 'Reviews' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'logs', icon: Settings, label: 'System Logs' },
  ];

  return (
    <div
      className={`
        ${sidebarOpen ? 'w-64' : 'w-20'} 
        bg-gradient-to-b from-blue-700 to-blue-900 text-white 
        transition-all duration-300 flex flex-col
        fixed lg:relative h-full z-50
        ${
          mobileMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }
      `}
    >
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="hidden lg:flex absolute -right-3 top-6 bg-blue-600 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-10"
      >
        {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <button
        onClick={() => setMobileMenuOpen(false)}
        className="lg:hidden absolute right-4 top-4 p-2 hover:bg-blue-600 rounded-lg transition-colors"
      >
        <X size={20} />
      </button>

      <div className="p-6 border-b border-blue-600">
        <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>
          🏥 Admin Panel
        </h1>
        <p className={`text-blue-200 text-sm mt-1 ${!sidebarOpen && 'hidden'}`}>
          Hospital Management
        </p>
        {!sidebarOpen && <div className="text-2xl text-center">🏥</div>}
      </div>

      <nav className="flex-1 py-6 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-6 py-3 transition-all ${
              activeTab === item.id
                ? 'bg-blue-600 border-l-4 border-white'
                : 'hover:bg-blue-600/50'
            }`}
          >
            <item.icon size={20} />
            {sidebarOpen && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      <button className="flex items-center gap-3 px-6 py-4 border-t border-blue-600 hover:bg-blue-600/50 transition-colors">
        <LogOut size={20} />
        {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
      </button>
    </div>
  );
};

export default AdminSidebar;
