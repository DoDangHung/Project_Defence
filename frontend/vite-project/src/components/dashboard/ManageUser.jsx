import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import TableContent from '../table/TableContent.jsx';

const ManageUser = () => {
  const { t } = useTranslation();
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

  const handleAddUser = () => {
    navigate(`/admin/users/add`);
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
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          gender: user.gender,
          streetAddress: user.streetAddress,
          city: user.city,
          state: user.state,
          postalCode: user.postalCode,
          phoneNumber: user.phone,
          role: typeof user.role === 'object' ? user.role.name : user.role,
          status:
            typeof user.status === 'object' ? user.status.name : user.status,
        }));
        setData(transformedData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  if (loading) return <div>{t('common.loading')}</div>;
  if (error) return <div>{t('common.error')}: {error}</div>;

  return (
    <TableContent
      title={t('users.title')}
      columns={[
        'ID',
        t('users.firstName'),
        t('users.lastName'),
        t('common.email'),
        t('users.gender'),
        t('users.streetAddress'),
        t('users.city'),
        t('users.state'),
        t('users.postalCode'),
        t('users.phone'),
        t('common.role'),
        t('common.status'),
      ]}
      data={data}
      onView={handleView}
      onAddUser={handleAddUser}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default ManageUser;
