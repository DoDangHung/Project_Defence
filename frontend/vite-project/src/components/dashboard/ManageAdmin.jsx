import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

function ManageAdmin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const navigate = useNavigate();

  const handleView = (user) => {
    navigate(`/admin/admins/view/${user.id}`);
    console.log('handleView', user);
  };

  const handleEdit = (user) => {
    navigate(`/admin/admins/edit/${user.id}`);
  };

  const handleAdd = () => {
    navigate(`/admin/admins/add`);
  };

  const handleDelete = (user) => {
    console.log('Deleting admin: ', user);
  };

  const fetchAdmins = (page = 1, search = '') => {
    const token = sessionStorage.getItem('token');
    setLoading(true);

    axios
      .get('http://localhost:8080/api/users/admins', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: pagination.limit, search },
      })
      .then((res) => {
        const transformedData = res.data.data.map((admin) => ({
          id: admin.user?.id,
          firstName: admin.user?.firstName,
          lastName: admin.user?.lastName,
          email: admin.user?.email,
          gender: admin.user?.gender,
          phone: admin.user?.phone,
          streetAddress: admin.user?.streetAddress,
          city: admin.user?.city,
          state: admin.user?.state,
          postalCode: admin.user?.postalCode,
          role: admin.user?.role?.name,
          position: admin.position,
          status: admin.user?.status,
        }));

        setData(transformedData);
        setPagination({
          ...pagination,
          page: res.data.pagination.page,
          total: res.data.pagination.total,
          totalPages: res.data.pagination.totalPages,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAdmins(pagination.page, searchTerm);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAdmins(1, searchTerm);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchAdmins(newPage, searchTerm);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-600">Error: {error}</p>
    </div>
  );

  const getPageNumbers = () => {
    const pages = [];
    const { page, totalPages } = pagination;
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 lg:p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <h3 className="text-base lg:text-lg font-bold text-gray-900">
            Admins Management ({pagination.total} total)
          </h3>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors text-sm cursor-pointer"
          >
            <Plus size={18} />
            Add New Admin
          </button>
        </div>
        
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-3 lg:gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => { setSearchTerm(''); fetchAdmins(1, ''); }}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Clear
          </button>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                ID
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                First Name
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Last Name
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Email
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Phone
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                City
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Position
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  No admins found
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-700">
                    {row.id}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-700">
                    {row.firstName}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-700">
                    {row.lastName}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-700">
                    {row.email}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-700">
                    {row.phone}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-700">
                    {row.city}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-700">
                    {row.position || '-'}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-xs lg:text-sm">
                    <button
                      onClick={() => handleView(row)}
                      className="text-blue-600 hover:text-blue-800 mr-2 lg:mr-3 cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(row)}
                      className="text-green-600 hover:text-green-800 mr-2 lg:mr-3 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(row)}
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            {getPageNumbers().map((pageNum, idx) => (
              <button
                key={idx}
                onClick={() => pageNum !== '...' && handlePageChange(pageNum)}
                className={`w-10 h-10 rounded-lg transition-colors ${
                  pageNum === pagination.page
                    ? 'bg-blue-600 text-white'
                    : pageNum === '...'
                    ? 'cursor-default'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                disabled={pageNum === '...'}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageAdmin;
