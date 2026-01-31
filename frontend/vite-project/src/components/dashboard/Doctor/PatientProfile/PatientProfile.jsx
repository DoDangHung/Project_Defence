import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  RefreshCw,
  Calendar,
  Clock,
  Phone,
  Mail,
  FileText,
  Search,
  Activity,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function PatientProfile() {
  const [activeTab, setActiveTab] = useState('all');
  const [allPatients, setAllPatients] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    oldPatients: 0,
    newPatients: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [sortBy, setSortBy] = useState('lastVisit');
  const [expandedRows, setExpandedRows] = useState(new Set());

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = sessionStorage.getItem('token');

        const res = await fetch(
          'http://localhost:8080/api/doctors/patients/dashboard',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();

        if (data.success) {
          setStats(data.data.stats);
          setAllPatients(data.data.patients || []);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getFilteredPatients = () => {
    // Lấy danh sách theo tab
    let filtered = [];
    if (activeTab === 'all') {
      filtered = allPatients;
    } else if (activeTab === 'oldPatients') {
      filtered = allPatients.filter((p) => p.status === 'old');
    } else if (activeTab === 'newPatients') {
      filtered = allPatients.filter((p) => p.status === 'new');
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((item) => {
        const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      });
    }

    // Filter by gender
    if (filterGender !== 'all') {
      filtered = filtered.filter(
        (item) => item.gender.toLowerCase() === filterGender.toLowerCase(),
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'lastVisit') {
        return new Date(b.lastVisit) - new Date(a.lastVisit);
      } else if (sortBy === 'name') {
        const nameA = `${a.firstName} ${a.lastName}`;
        const nameB = `${b.firstName} ${b.lastName}`;
        return nameA.localeCompare(nameB);
      } else if (sortBy === 'visits') {
        return (b.totalVisits || 0) - (a.totalVisits || 0);
      }
      return 0;
    });

    return filtered;
  };

  const filteredPatients = getFilteredPatients();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleViewProfile = (patientId) => {
    window.location.href = `/doctor/patient-history/${patientId}`;
  };

  const handleViewActivity = (patientId) => {
    console.log('View activity for patient:', patientId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách bệnh nhân...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý Bệnh nhân
          </h1>
          <p className="text-gray-600">
            Danh sách bệnh nhân đã và đang khám với bạn
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Tổng bệnh nhân"
            value={stats.totalPatients || 0}
            icon={<Users className="w-8 h-8" />}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
            trend="+12% so với tháng trước"
          />
          <StatCard
            title="Bệnh nhân cũ"
            value={stats.oldPatients || 0}
            icon={<RefreshCw className="w-8 h-8" />}
            bgColor="bg-green-50"
            iconColor="text-green-600"
            trend={`${stats.totalPatients > 0 ? Math.round((stats.oldPatients / stats.totalPatients) * 100) : 0}% tổng số`}
          />
          <StatCard
            title="Bệnh nhân mới"
            value={stats.newPatients || 0}
            icon={<UserPlus className="w-8 h-8" />}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
            trend="Tháng này"
          />
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm bệnh nhân..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">Tất cả giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="lastVisit">Khám gần nhất</option>
              <option value="name">Tên A-Z</option>
              <option value="visits">Số lần khám</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-2 rounded-lg shadow-sm">
          <TabButton
            active={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
            count={stats.totalPatients || 0}
          >
            Tất cả
          </TabButton>
          <TabButton
            active={activeTab === 'oldPatients'}
            onClick={() => setActiveTab('oldPatients')}
            count={stats.oldPatients || 0}
          >
            Bệnh nhân cũ
          </TabButton>
          <TabButton
            active={activeTab === 'newPatients'}
            onClick={() => setActiveTab('newPatients')}
            count={stats.newPatients || 0}
          >
            Bệnh nhân mới
          </TabButton>
        </div>

        {/* Table or Empty State */}
        {filteredPatients.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy bệnh nhân
            </h3>
            <p className="text-gray-600">
              Thử thay đổi bộ lọc hoặc tìm kiếm khác
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Bệnh nhân
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Thông tin liên hệ
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Số lần khám
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Lần gần nhất
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPatients.map((p) => (
                    <React.Fragment key={p.patientId}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                                {p.firstName?.charAt(0)}
                                {p.lastName?.charAt(0)}
                              </div>
                              {p.upcomingVisits > 0 && (
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                  {p.upcomingVisits}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {p.firstName} {p.lastName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {p.age} tuổi •{' '}
                                {p.gender === 'male' ? 'Nam' : 'Nữ'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{p.phone || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span className="truncate max-w-xs">
                                {p.email || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-center">
                          {p.status === 'new' ? (
                            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                              <UserPlus className="w-4 h-4" />
                              Mới
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                              <RefreshCw className="w-4 h-4" />
                              Cũ
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {p.totalVisits || 0}
                            </p>
                            <p className="text-xs text-gray-500">
                              {p.completedVisits || 0} hoàn thành
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">
                              {formatDate(p.lastVisit)}
                            </span>
                          </div>
                          {p.upcomingVisits > 0 && (
                            <div className="flex items-center gap-2 text-sm mt-1">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span className="text-blue-600 font-medium">
                                {p.upcomingVisits} lịch sắp tới
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewProfile(p.patientId)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Xem hồ sơ"
                            >
                              <FileText className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleViewActivity(p.patientId)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Lịch sử khám"
                            >
                              <Activity className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => toggleExpand(p.patientId)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Xem chi tiết"
                            >
                              {expandedRows.has(p.patientId) ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {expandedRows.has(p.patientId) && (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">
                                  Tổng số lần khám
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                  {p.totalVisits || 0}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">
                                  Lần đầu khám
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                  {formatDate(p.firstVisit)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">
                                  Đã hoàn thành
                                </p>
                                <p className="text-lg font-semibold text-green-600">
                                  {p.completedVisits || 0} lần
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">
                                  Sắp tới
                                </p>
                                <p className="text-lg font-semibold text-blue-600">
                                  {p.upcomingVisits || 0} lần
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bgColor, iconColor, trend }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`${bgColor} ${iconColor} p-3 rounded-lg`}>{icon}</div>
        <TrendingUp className="w-5 h-5 text-green-500" />
      </div>
      <div>
        <p className="text-gray-600 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-2">{trend}</p>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
        active
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children} ({count})
    </button>
  );
}
