import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  FileText,
  Pill,
  Activity,
  TrendingUp,
  Download,
  X,
  ChevronDown,
  ChevronUp,
  Heart,
  Thermometer,
  Weight,
  Droplet,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Stethoscope,
  Building2,
  ArrowLeft,
} from 'lucide-react';

// Mock data
const mockMedicalHistory = {
  patient: {
    id: 1,
    name: 'Nguyễn Thị Lan',
    age: 28,
    gender: 'Female',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  stats: {
    totalVisits: 12,
    firstVisit: '2024-05-10',
    lastVisit: '2026-01-20',
    totalCost: 5500000,
    commonDiagnosis: 'Cảm cúm',
  },
  appointments: [
    {
      id: 1,
      date: '2026-01-20',
      startTime: '09:00',
      endTime: '10:00',
      status: 'completed',
      clinic: 'Phòng khám Đa khoa ABC',
      room: 'P.205',
      reason: 'Đau họng, sốt nhẹ',
      vitals: {
        bloodPressure: '120/80',
        heartRate: 75,
        temperature: 37.8,
        weight: 55,
      },
      diagnosis: 'Viêm họng cấp',
      symptoms: ['Đau họng', 'Sốt nhẹ', 'Ho khan'],
      prescription: [
        {
          name: 'Amoxicillin 500mg',
          dosage: '1 viên x 3 lần/ngày',
          duration: '7 ngày',
        },
        {
          name: 'Paracetamol 500mg',
          dosage: '1 viên khi sốt',
          duration: '5 ngày',
        },
        {
          name: 'Strepsils',
          dosage: '1 viên x 4 lần/ngày',
          duration: '5 ngày',
        },
      ],
      tests: [
        { name: 'Xét nghiệm máu', result: 'Bình thường', date: '2026-01-20' },
      ],
      followUp: '2026-01-27',
      notes:
        'Nghỉ ngơi nhiều, uống nhiều nước. Tái khám sau 7 ngày nếu không đỡ.',
      images: [],
      cost: {
        consultation: 200000,
        medicine: 150000,
        tests: 100000,
        total: 450000,
        paid: true,
      },
    },
    {
      id: 2,
      date: '2025-12-15',
      startTime: '14:00',
      endTime: '15:00',
      status: 'completed',
      clinic: 'Phòng khám Đa khoa ABC',
      room: 'P.203',
      reason: 'Tái khám theo hẹn',
      vitals: {
        bloodPressure: '118/78',
        heartRate: 72,
        temperature: 36.8,
        weight: 54,
      },
      diagnosis: 'Đã khỏi bệnh',
      symptoms: [],
      prescription: [],
      tests: [],
      followUp: null,
      notes: 'Bệnh nhân đã hồi phục hoàn toàn. Không cần tái khám.',
      images: [],
      cost: {
        consultation: 150000,
        medicine: 0,
        tests: 0,
        total: 150000,
        paid: true,
      },
    },
    {
      id: 3,
      date: '2025-12-10',
      startTime: '10:00',
      endTime: '11:00',
      status: 'completed',
      clinic: 'Phòng khám Đa khoa ABC',
      room: 'P.201',
      reason: 'Đau đầu, chóng mặt',
      vitals: {
        bloodPressure: '125/85',
        heartRate: 78,
        temperature: 37.2,
        weight: 54,
      },
      diagnosis: 'Căng thẳng, stress',
      symptoms: ['Đau đầu', 'Chóng mặt', 'Mệt mỏi'],
      prescription: [
        {
          name: 'Vitamin B complex',
          dosage: '1 viên/ngày',
          duration: '30 ngày',
        },
        {
          name: 'Paracetamol 500mg',
          dosage: '1 viên khi đau đầu',
          duration: '10 ngày',
        },
      ],
      tests: [],
      followUp: '2025-12-15',
      notes: 'Khuyên nghỉ ngơi nhiều, tránh stress. Tập thể dục nhẹ nhàng.',
      images: [],
      cost: {
        consultation: 200000,
        medicine: 120000,
        tests: 0,
        total: 320000,
        paid: true,
      },
    },
    {
      id: 4,
      date: '2025-11-20',
      startTime: '15:30',
      endTime: '16:30',
      status: 'cancelled',
      clinic: 'Phòng khám Đa khoa ABC',
      room: 'P.204',
      reason: 'Khám định kỳ',
      vitals: null,
      diagnosis: null,
      symptoms: [],
      prescription: [],
      tests: [],
      followUp: null,
      notes: 'Bệnh nhân hủy lịch trước 24h.',
      images: [],
      cost: {
        consultation: 0,
        medicine: 0,
        tests: 0,
        total: 0,
        paid: false,
      },
    },
  ],
};

export default function PatientMedicalHistory({
  patientId = 1,
  onClose = () => {},
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  useEffect(() => {
    loadMedicalHistory();
  }, [patientId]);

  const loadMedicalHistory = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setData(mockMedicalHistory);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading medical history:', error);
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const getFilteredAppointments = () => {
    if (!data) return [];

    let filtered = data.appointments;

    if (filterStatus !== 'all') {
      filtered = filtered.filter((apt) => apt.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.reason?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (dateRange.from) {
      filtered = filtered.filter((apt) => apt.date >= dateRange.from);
    }
    if (dateRange.to) {
      filtered = filtered.filter((apt) => apt.date <= dateRange.to);
    }

    return filtered;
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: CheckCircle,
        label: 'Hoàn thành',
      },
      cancelled: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: XCircle,
        label: 'Đã hủy',
      },
      'no-show': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        icon: AlertCircle,
        label: 'Không đến',
      },
    };

    const badge = badges[status] || badges.completed;
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 ${badge.bg} ${badge.text} px-3 py-1 rounded-full text-sm font-medium`}
      >
        <Icon className="w-4 h-4" />
        {badge.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải lịch sử khám bệnh...</p>
        </div>
      </div>
    );
  }

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4">
              <img
                src={data.patient.avatar}
                alt={data.patient.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Lịch sử khám bệnh
                </h1>
                <p className="text-gray-600">
                  {data.patient.name} • {data.patient.age} tuổi •{' '}
                  {data.patient.gender === 'Female' ? 'Nữ' : 'Nam'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            label="Tổng số lần khám"
            value={data.stats.totalVisits}
            color="blue"
          />
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            label="Lần đầu tiên"
            value={new Date(data.stats.firstVisit).toLocaleDateString('vi-VN')}
            color="green"
          />
          <StatCard
            icon={<Stethoscope className="w-6 h-6" />}
            label="Bệnh thường gặp"
            value={data.stats.commonDiagnosis}
            color="purple"
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            label="Tổng chi phí"
            value={formatCurrency(data.stats.totalCost)}
            color="orange"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm chẩn đoán, triệu chứng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
              <option value="no-show">Không đến</option>
            </select>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Từ ngày"
            />
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Đến ngày"
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <div className="space-y-6">
            {filteredAppointments.map((appointment, index) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                expanded={expandedCards.has(appointment.id)}
                onToggleExpand={() => toggleExpand(appointment.id)}
                formatDate={formatDate}
                formatCurrency={formatCurrency}
                getStatusBadge={getStatusBadge}
                isLast={index === filteredAppointments.length - 1}
              />
            ))}
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Không tìm thấy lịch sử khám
              </h3>
              <p className="text-gray-600">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div
        className={`${colors[color]} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}
      >
        {icon}
      </div>
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function AppointmentCard({
  appointment,
  expanded,
  onToggleExpand,
  formatDate,
  formatCurrency,
  getStatusBadge,
}) {
  return (
    <div className="relative pl-16">
      <div
        className={`absolute left-6 top-6 w-4 h-4 rounded-full border-4 border-white ${
          appointment.status === 'completed'
            ? 'bg-green-500'
            : appointment.status === 'cancelled'
              ? 'bg-red-500'
              : 'bg-yellow-500'
        } shadow-lg z-10`}
      ></div>

      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-gray-900">
                  {formatDate(appointment.date)}
                </h3>
                {getStatusBadge(appointment.status)}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {appointment.startTime} - {appointment.endTime}
                </div>
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {appointment.clinic}
                </div>
                {appointment.room && (
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                    {appointment.room}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onToggleExpand}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {expanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Lý do khám</p>
              <p className="font-semibold text-gray-900">
                {appointment.reason}
              </p>
            </div>
            {appointment.diagnosis && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Chẩn đoán</p>
                <p className="font-semibold text-gray-900">
                  {appointment.diagnosis}
                </p>
              </div>
            )}
          </div>
        </div>

        {expanded && appointment.status === 'completed' && (
          <div className="p-6 space-y-6">
            {appointment.vitals && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Chỉ số sinh tồn
                </h4>
                <div className="grid grid-cols-4 gap-4">
                  <VitalCard
                    icon={<Heart className="w-5 h-5" />}
                    label="Huyết áp"
                    value={appointment.vitals.bloodPressure}
                    unit="mmHg"
                    color="red"
                  />
                  <VitalCard
                    icon={<Activity className="w-5 h-5" />}
                    label="Nhịp tim"
                    value={appointment.vitals.heartRate}
                    unit="bpm"
                    color="blue"
                  />
                  <VitalCard
                    icon={<Thermometer className="w-5 h-5" />}
                    label="Nhiệt độ"
                    value={appointment.vitals.temperature}
                    unit="°C"
                    color="orange"
                  />
                  <VitalCard
                    icon={<Weight className="w-5 h-5" />}
                    label="Cân nặng"
                    value={appointment.vitals.weight}
                    unit="kg"
                    color="green"
                  />
                </div>
              </div>
            )}

            {appointment.symptoms.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Triệu chứng
                </h4>
                <div className="flex flex-wrap gap-2">
                  {appointment.symptoms.map((symptom, idx) => (
                    <span
                      key={idx}
                      className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {appointment.prescription.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-blue-600" />
                  Đơn thuốc ({appointment.prescription.length} loại)
                </h4>
                <div className="space-y-3">
                  {appointment.prescription.map((med, idx) => (
                    <div key={idx} className="bg-blue-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-gray-900">
                          {med.name}
                        </p>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {med.duration}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{med.dosage}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {appointment.tests.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-blue-600" />
                  Xét nghiệm
                </h4>
                <div className="space-y-2">
                  {appointment.tests.map((test, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-gray-50 rounded-lg p-3"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{test.name}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(test.date)}
                        </p>
                      </div>
                      <span className="text-green-600 font-semibold">
                        {test.result}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {appointment.notes && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Ghi chú</h4>
                <p className="text-gray-700 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  {appointment.notes}
                </p>
              </div>
            )}

            {appointment.followUp && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-700">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">
                    Lịch tái khám: {formatDate(appointment.followUp)}
                  </span>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Chi phí
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí khám</span>
                  <span className="font-medium">
                    {formatCurrency(appointment.cost.consultation)}
                  </span>
                </div>
                {appointment.cost.medicine > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tiền thuốc</span>
                    <span className="font-medium">
                      {formatCurrency(appointment.cost.medicine)}
                    </span>
                  </div>
                )}
                {appointment.cost.tests > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Xét nghiệm</span>
                    <span className="font-medium">
                      {formatCurrency(appointment.cost.tests)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold text-gray-900">Tổng cộng</span>
                  <span className="font-bold text-blue-600 text-lg">
                    {formatCurrency(appointment.cost.total)}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2 text-sm">
                  {appointment.cost.paid ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Đã thanh toán
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      Chưa thanh toán
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Tải đơn thuốc
              </button>
              <button className="flex-1 border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Xem phiếu khám
              </button>
            </div>
          </div>
        )}

        {expanded && appointment.status === 'cancelled' && (
          <div className="p-6">
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-700">{appointment.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function VitalCard({ icon, label, value, unit, color }) {
  const colors = {
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className={`${colors[color]} mb-2`}>{icon}</div>
      <p className="text-xs text-gray-600 mb-1">{label}</p>
      <p className="text-lg font-bold text-gray-900">
        {value}{' '}
        <span className="text-sm font-normal text-gray-600">{unit}</span>
      </p>
    </div>
  );
}
