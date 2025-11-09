import React, { useState } from 'react';
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
  Search,
  Filter,
  Download,
  Plus,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock data for charts
  const appointmentsByDept = [
    { name: 'Cardiology', value: 145 },
    { name: 'Neurology', value: 98 },
    { name: 'Pediatrics', value: 156 },
    { name: 'Orthopedics', value: 87 },
    { name: 'Dermatology', value: 72 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
  ];

  const userDistribution = [
    { name: 'Patients', value: 450 },
    { name: 'Doctors', value: 45 },
    { name: 'Admins', value: 5 },
  ];

  const COLORS = ['#0F6CBD', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

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

  const StatCard = ({ icon: Icon, title, value, change, positive }) => (
    <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <div className="bg-blue-50 p-2 lg:p-3 rounded-lg">
          <Icon className="text-blue-600" size={20} />
        </div>
        <div
          className={`flex items-center gap-1 text-xs lg:text-sm ${
            positive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{change}</span>
        </div>
      </div>
      <h3 className="text-gray-500 text-xs lg:text-sm font-medium">{title}</h3>
      <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-1">
        {value}
      </p>
    </div>
  );

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Users"
          value="500"
          change="+12%"
          positive
        />
        <StatCard
          icon={Calendar}
          title="Today's Appointments"
          value="28"
          change="+5%"
          positive
        />
        <StatCard
          icon={DollarSign}
          title="Monthly Revenue"
          value="$67,000"
          change="+18%"
          positive
        />
        <StatCard
          icon={Activity}
          title="Cancellation Rate"
          value="3.2%"
          change="-1.5%"
          positive
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
          <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4">
            Revenue Over Time
          </h3>
          <ResponsiveContainer
            width="100%"
            height={200}
            className="lg:h-[250px]"
          >
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0F6CBD"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Appointments by Department */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
          <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4">
            Appointments by Department
          </h3>
          <ResponsiveContainer
            width="100%"
            height={200}
            className="lg:h-[250px]"
          >
            <BarChart data={appointmentsByDept}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#0F6CBD" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
        <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4">
          User Distribution
        </h3>
        <div className="flex items-center justify-center">
          <ResponsiveContainer
            width="100%"
            height={250}
            className="lg:h-[300px]"
          >
            <PieChart>
              <Pie
                data={userDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const TableContent = ({ title, columns, data, actions }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 lg:p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <h3 className="text-base lg:text-lg font-bold text-gray-900">
            {title}
          </h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors text-sm">
            <Plus size={18} />
            Add New
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              <Filter size={18} />
              <span className="hidden sm:inline">Filter</span>
            </button>
            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              <Download size={18} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
              <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                {Object.values(row).map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="px-4 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-700"
                  >
                    {cell}
                  </td>
                ))}
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-xs lg:text-sm">
                  <button className="text-blue-600 hover:text-blue-800 mr-2 lg:mr-3">
                    View
                  </button>
                  <button className="text-green-600 hover:text-green-800 mr-2 lg:mr-3">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'users':
        return (
          <TableContent
            title="Users Management"
            columns={['ID', 'Name', 'Email', 'Role', 'Status', 'Created At']}
            data={[
              {
                id: '001',
                name: 'John Doe',
                email: 'john@example.com',
                role: 'Doctor',
                status: 'Active',
                created: '2024-01-15',
              },
              {
                id: '002',
                name: 'Jane Smith',
                email: 'jane@example.com',
                role: 'Patient',
                status: 'Active',
                created: '2024-02-20',
              },
              {
                id: '003',
                name: 'Mike Johnson',
                email: 'mike@example.com',
                role: 'Admin',
                status: 'Active',
                created: '2024-01-10',
              },
            ]}
          />
        );
      case 'doctors':
        return (
          <TableContent
            title="Doctors Management"
            columns={[
              'ID',
              'Name',
              'Department',
              'Patients',
              'Rating',
              'Status',
            ]}
            data={[
              {
                id: 'D001',
                name: 'Dr. Sarah Wilson',
                dept: 'Cardiology',
                patients: '145',
                rating: '4.8⭐',
                status: 'Active',
              },
              {
                id: 'D002',
                name: 'Dr. James Brown',
                dept: 'Neurology',
                patients: '98',
                rating: '4.9⭐',
                status: 'Active',
              },
              {
                id: 'D003',
                name: 'Dr. Emily Davis',
                dept: 'Pediatrics',
                patients: '156',
                rating: '4.7⭐',
                status: 'Active',
              },
            ]}
          />
        );
      case 'appointments':
        return (
          <TableContent
            title="Appointments Management"
            columns={['ID', 'Patient', 'Doctor', 'Date', 'Time', 'Status']}
            data={[
              {
                id: 'A001',
                patient: 'John Doe',
                doctor: 'Dr. Sarah Wilson',
                date: '2024-11-10',
                time: '10:00 AM',
                status: 'Confirmed',
              },
              {
                id: 'A002',
                patient: 'Jane Smith',
                doctor: 'Dr. James Brown',
                date: '2024-11-10',
                time: '11:30 AM',
                status: 'Pending',
              },
              {
                id: 'A003',
                patient: 'Mike Johnson',
                doctor: 'Dr. Emily Davis',
                date: '2024-11-11',
                time: '02:00 PM',
                status: 'Completed',
              },
            ]}
          />
        );
      case 'payments':
        return (
          <TableContent
            title="Payments Management"
            columns={['ID', 'Patient', 'Amount', 'Method', 'Date', 'Status']}
            data={[
              {
                id: 'P001',
                patient: 'John Doe',
                amount: '$150',
                method: 'Credit Card',
                date: '2024-11-09',
                status: 'Paid',
              },
              {
                id: 'P002',
                patient: 'Jane Smith',
                amount: '$200',
                method: 'Insurance',
                date: '2024-11-08',
                status: 'Paid',
              },
              {
                id: 'P003',
                patient: 'Mike Johnson',
                amount: '$180',
                method: 'Cash',
                date: '2024-11-07',
                status: 'Pending',
              },
            ]}
          />
        );
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
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
        {/* Toggle Button - Desktop */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-6 bg-blue-600 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-10"
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Close Button - Mobile */}
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
          <p
            className={`text-blue-200 text-sm mt-1 ${!sidebarOpen && 'hidden'}`}
          >
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={20} className="text-gray-600" />
              </button>

              {/* Desktop Toggle (hidden on mobile) */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings size={20} className="text-gray-600" />
              </button>

              {/* Page Title - Mobile */}
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
                  <p className="text-sm font-semibold text-gray-900">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500">admin@hospital.com</p>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
              </div>
              {/* Mobile Avatar Only */}
              <div className="md:hidden w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
