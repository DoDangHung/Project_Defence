import React from 'react';

import TableContent from '../table/TableContent';

function ManageDoctor() {
  return (
    <TableContent
      title="Doctors Management"
      columns={['ID', 'Name', 'Department', 'Patients', 'Rating', 'Status']}
      data={[
        {
          id: 'D001',
          name: 'Dr. Sarah Wilson',
          dept: 'Cardiology',
          patients: '145',
          rating: '4.8⭐',
          status: 'Active',
        },
      ]}
    />
  );
}

export default ManageDoctor;
