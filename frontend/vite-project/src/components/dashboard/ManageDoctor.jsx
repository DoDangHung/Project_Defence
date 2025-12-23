import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TableContent from '../table/TableContent';

function ManageDoctor() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleView = (user) => {
    navigate(`/admin/doctors/view/${user.id}`);
    console.log('handleView', user);
  };

  const handleEdit = (user) => {
    navigate(`/admin/doctors/edit/${user.id}`);
  };

  const handleAdd = () => {
    navigate(`/admin/doctors/add`);
  };

  const handleDelete = (user) => {
    console.log('Deleteing doctor: ', user);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/doctors`)
      .then((res) => {
        console.log('RAW response:', res.data);
        console.log('ITEM 0:', res.data.data.items[0]);
        console.log('ITEM 0 user:', res.data.data.items[0]?.user);
        console.log('DATA:', res.data.data);
        console.log('Bio:', res.data.data?.bio);
        // console.log('data from manage doctor', res.data);
        // console.log('Full response:', res.data);
        // console.log('Type of data:', typeof res.data.data);
        // console.log('Is array?', Array.isArray(res.data.data));
        // console.log('Has items?', res.data.data?.items);

        const transformedData = res.data.data.items.map((doctor) => ({
          id: doctor.id,
          firstName: doctor.user?.firstName,
          lastName: doctor.user?.lastName,
          email: doctor.user?.email,
          gender: doctor.user?.gender,
          phoneNumber: doctor.user?.phone,
          streetAddress: doctor.user?.streetAddress,
          city: doctor.user?.city,
          state: doctor.user?.state,
          postalCode: doctor.user?.postalCode,
          role: doctor.user?.role?.name,
          department: doctor.department?.name,
          specialization: doctor.specialization,
        }));
        setData(transformedData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <>
      <TableContent
        title="Doctors Management"
        columns={[
          'ID',
          'First Name',
          'Last Name',
          'Email',
          'Gender',
          'Phone Number',
          'Street Address',
          'City',
          'State',
          'Postal-Code',
          'Role',
          'specialization',
          'department',
        ]}
        data={data}
        onView={handleView}
        onAddUser={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  );
}

export default ManageDoctor;
