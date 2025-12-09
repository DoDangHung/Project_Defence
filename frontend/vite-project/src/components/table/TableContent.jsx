import React from 'react';
import { Search, Filter, Download, Plus } from 'lucide-react';

const TableContent = ({ title, columns, data, onView, onEdit, onDelete }) => {
  // ✅ THÊM: Kiểm tra và đảm bảo data luôn là array
  const safeData = Array.isArray(data) ? data : [];
  console.log('TableContent received:', data);
  console.log('Type:', typeof data);
  console.log('Is Array:', Array.isArray(data));
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 lg:p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <h3 className="text-base lg:text-lg font-bold text-gray-900">
            {title}
          </h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors text-sm cursor-pointer">
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
            <button className="flex-1 cursor-pointer lg:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              <Filter size={18} />
              <span className="hidden sm:inline">Filter</span>
            </button>
            <button className="flex-1 cursor-pointer lg:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
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
            {/* ✅ THAY ĐỔI: Dùng safeData thay vì data */}
            {safeData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              safeData.map((row, idx) => (
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
                    <button
                      onClick={() => onView(row)}
                      className="text-blue-600 hover:text-blue-800 mr-2 lg:mr-3 cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(row)}
                      className="text-green-600 hover:text-green-800 mr-2 lg:mr-3 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(row)}
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
    </div>
  );
};

export default TableContent;
