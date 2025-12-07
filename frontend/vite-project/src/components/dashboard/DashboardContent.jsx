import React from 'react';
import StatsCards from './StatsCards';
import RecentPatientsTable from './RecentPatientsTable';
import CriticalPatientsCard from './CriticalPatientsCard';
import BedOccupancyChart from './BedOccupancyChart';
import PatientSatisfactionCard from './PatientSatisfactionCard';
import InOutPatientChart from './InOutPatientChart';

const DashboardContent = () => {
  return (
    <div className="space-y-6">
      <StatsCards />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <RecentPatientsTable />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CriticalPatientsCard />
            <BedOccupancyChart />
          </div>
        </div>

        <div className="space-y-4">
          <PatientSatisfactionCard />
          <InOutPatientChart />
        </div>
      </section>
    </div>
  );
};

export default DashboardContent;
