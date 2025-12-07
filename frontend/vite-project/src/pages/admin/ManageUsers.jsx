import { React, useEffect, useState } from 'react';
import { userApi } from './userApi';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userApi
      .getAllUsers()
      .then((res) => {
        console.log('Users:', res.data);
        setUsers(res.data.data); // Nếu backend trả { success, data }
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
      });
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">User List</h1>

      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="p-2 border">{u.id}</td>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.role?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
