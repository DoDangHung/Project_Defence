import React, { useState } from 'react';
import AdminSidebar from '../../components/layouts/AdminSidebar.jsx';
import AdminHeader from '../../components/layouts/AdminHeader.jsx';
import DashboardContent from '../../components/dashboard/DashboardContent.jsx';
import TableContent from '../../components/table/TableContent.jsx';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <AdminHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          activeTab={activeTab}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
