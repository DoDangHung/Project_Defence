import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TableContent from '../table/TableContent.jsx';

const ManageUser = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleView = (user) => {
    navigate(`/admin/users/view/${user.id}`);
  };

  const handleEdit = (user) => {
    navigate(`/admin/users/edit/${user.id}`);
  };

  const handleDelete = (user) => {
    console.log('Deleting user:', user);
  };
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/users')
      .then((res) => {
        console.log('data', res.data);

        const transformedData = res.data.data.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          gender: user.gender,
          phoneNumber: user.phone,
          role: typeof user.role === 'object' ? user.role.name : user.role,
          status:
            typeof user.status === 'object' ? user.status.name : user.status,
          created: user.created || user.createdAt,
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
    <TableContent
      title="Users Management"
      columns={[
        'ID',
        'Name',
        'Email',
        'Gender',
        'PhoneNumber',
        'Role',
        'Status',
        'Created At',
      ]}
      data={data}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default ManageUser;
