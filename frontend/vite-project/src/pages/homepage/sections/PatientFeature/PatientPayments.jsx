/** @format */

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Calendar,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Receipt,
  Eye,
} from "lucide-react";

const PatientPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/payment/my-payments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('PatientPayments - Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('PatientPayments - API Response:', data);
        console.log('PatientPayments - Payments data:', data.data);
        setPayments(data.data || []);
      } else {
        const errorText = await response.text();
        console.error('PatientPayments - API Error:', errorText);
        setPayments(mockPayments);
      }
    } catch (err) {
      console.error('PatientPayments - Fetch error:', err);
      setPayments(mockPayments);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "failed":
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "paid":
      case "completed":
        return "Đã thanh toán";
      case "pending":
        return "Đang chờ";
      case "failed":
        return "Thất bại";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const searchLower = searchTerm.toLowerCase();
    const hasSearchTerm = searchTerm.trim() !== "";
    
    const matchesSearch = !hasSearchTerm || 
      (payment.code?.toLowerCase().includes(searchLower)) ||
      (payment.description?.toLowerCase().includes(searchLower)) ||
      (payment.appointmentCode?.toLowerCase().includes(searchLower)) ||
      (String(payment.id).includes(searchLower)) ||
      (String(payment.appointmentId).includes(searchLower));

    const matchesFilter =
      filterStatus === "all" || payment.paymentStatus === filterStatus || payment.depositStatus === filterStatus;

    return matchesSearch && matchesFilter;
  });

  console.log('DEBUG - payments length:', payments.length);

  const totalPaid = payments
    .filter((p) => p.paymentStatus === "completed" || p.paymentStatus === "paid")
    .reduce((sum, p) => sum + (p.totalPaid || 0), 0);

  const totalPending = payments
    .filter((p) => p.paymentStatus === "pending")
    .reduce((sum, p) => sum + (p.remainingAmount || 0), 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                Lịch sử thanh toán
              </h1>
              <p className="text-gray-600 mt-1">Quản lý thanh toán của bạn</p>
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Tải xuống</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã thanh toán</p>
                <p className="text-lg md:text-xl font-bold text-gray-800">
                  {formatCurrency(totalPaid)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đang chờ</p>
                <p className="text-lg md:text-xl font-bold text-gray-800">
                  {formatCurrency(totalPending)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Receipt className="w-5 h-5 md:w-6 md:h-6 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng giao dịch</p>
                <p className="text-lg md:text-xl font-bold text-gray-800">
                  {payments.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã giao dịch, mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sky-500 focus:outline-none"
              />
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sky-500 focus:outline-none bg-white"
              >
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments List */}
        {filteredPayments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No transactions found
            </h3>
            <p className="text-gray-600">You have no payment history.</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white rounded-xl shadow-sm p-4 md:p-6 hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedPayment(payment)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        payment.paymentStatus === "completed" ||
                        payment.paymentStatus === "paid"
                          ? "bg-green-100"
                          : payment.paymentStatus === "pending"
                            ? "bg-yellow-100"
                            : "bg-red-100"
                      }`}
                    >
                      <CreditCard
                        className={`w-5 h-5 md:w-6 md:h-6 ${
                          payment.paymentStatus === "completed" ||
                          payment.paymentStatus === "paid"
                            ? "text-green-600"
                            : payment.paymentStatus === "pending"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-800 text-sm md:text-base truncate">
                          Thanh toán khám bệnh
                        </h3>
                        <span className="hidden sm:inline">
                          {getStatusIcon(payment.paymentStatus)}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">
                        Mã giao dịch: {payment.id}
                      </p>
                      {payment.appointmentId && (
                        <p className="text-xs md:text-sm text-gray-500">
                          Mã lịch hẹn: {payment.appointmentId}
                        </p>
                      )}
                      <p className="text-xs md:text-sm text-gray-500 mt-1">
                        {formatDate(payment.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-base md:text-xl font-bold text-gray-800">
                      {formatCurrency(payment.consultationFee)}
                    </p>
                    <span
                      className={`inline-block mt-2 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(payment.paymentStatus)}`}
                    >
                      {getStatusText(payment.paymentStatus)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payment Detail Modal */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                  Chi tiết thanh toán
                </h2>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Mã giao dịch</span>
                  <span className="font-medium">
                    {selectedPayment.id}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Mã lịch hẹn</span>
                  <span className="font-medium">
                    {selectedPayment.appointmentId}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Ngày thanh toán</span>
                  <span className="font-medium">
                    {formatDate(selectedPayment.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Phương thức</span>
                  <span className="font-medium">
                    {selectedPayment.paymentMethod || "Chưa xác định"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Trạng thái</span>
                  <span
                    className={`font-medium ${getStatusColor(selectedPayment.paymentStatus)} px-2 py-1 rounded`}
                  >
                    {getStatusText(selectedPayment.paymentStatus)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 font-semibold">Phí khám</span>
                  <span className="text-xl font-bold text-sky-600">
                    {formatCurrency(selectedPayment.consultationFee)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Đã thanh toán</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(selectedPayment.totalPaid)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Còn lại</span>
                  <span className="font-bold text-orange-600">
                    {formatCurrency(selectedPayment.remainingAmount)}
                  </span>
                </div>
                
                {/* Transactions History */}
                {selectedPayment.transactions && selectedPayment.transactions.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold text-gray-800 mb-2">Lịch sử giao dịch</h4>
                    <div className="space-y-2">
                      {selectedPayment.transactions.map((tx, index) => (
                        <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                          <div>
                            <span className={`font-medium ${
                              tx.type === 'deposit' ? 'text-blue-600' : 
                              tx.type === 'refund' ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {tx.type === 'deposit' ? 'Đặt cọc' : 
                               tx.type === 'refund' ? 'Hoàn tiền' : 
                               tx.type === 'final' ? 'Thanh toán cuối' : tx.type}
                            </span>
                            <span className="text-gray-500 ml-2">- {formatDate(tx.createdAt)}</span>
                          </div>
                          <span className={`font-bold ${
                            tx.type === 'refund' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {tx.type === 'refund' ? '-' : '+'}{formatCurrency(tx.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedPayment(null)}
                className="w-full mt-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Mock data
const mockPayments = [
  {
    id: 1,
    code: "PAY001",
    appointmentCode: "APT001",
    description: "Payment for consultation",
    amount: 200000,
    status: "paid",
    method: "VNPay",
    createdAt: "2026-02-25",
  },
  {
    id: 2,
    code: "PAY002",
    appointmentCode: "APT002",
    description: "Dermatology consultation payment",
    amount: 150000,
    status: "paid",
    method: "VNPay",
    createdAt: "2026-02-20",
  },
  {
    id: 3,
    code: "PAY003",
    appointmentCode: "APT003",
    description: "General consultation payment",
    amount: 100000,
    status: "pending",
    method: "VNPay",
    createdAt: "2026-03-01",
  },
];

export default PatientPayments;
