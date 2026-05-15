/** @format */

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  CreditCard,
  Wallet,
  Banknote,
  Smartphone,
  DollarSign,
  RefreshCw,
  Download,
  Search,
  Filter,
  Eye,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  UserX,
  Receipt,
  AlertTriangle,
} from "lucide-react";

const API_URL = "http://localhost:8080/api";

const getAuthHeader = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

// Payment method configuration
const paymentMethodConfig = {
  cash: { icon: Banknote, label: "Tiền mặt", color: "amber" },
  visa_mastercard: {
    icon: CreditCard,
    label: "Visa/Mastercard",
    color: "blue",
  },
  apple_google_pay: {
    icon: Smartphone,
    label: "Apple/Google Pay",
    color: "indigo",
  },
  bank_transfer: { icon: Wallet, label: "Chuyển khoản", color: "green" },
};

// Status configuration
const statusConfig = {
  pending: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    label: "Waiting for payment",
    icon: Clock,
  },
  partial: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    label: "Deposit paid",
    icon: DollarSign,
  },
  completed: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    label: "Completed",
    icon: CheckCircle,
  },
  refunded: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    label: "Refunded",
    icon: RefreshCw,
  },
  forfeited: {
    bg: "bg-red-100",
    text: "text-red-700",
    label: "Deposit forfeited",
    icon: AlertCircle,
  },
  no_show: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: "No show",
    icon: UserX,
  },
  not_required: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: "Payment at the counter",
    icon: Banknote,
  },
};

// ─── STATUS BADGE ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.pending;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 ${cfg.bg} ${cfg.text} text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap`}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ─── METHOD BADGE ────────────────────────────────────────────────────────────
function MethodBadge({ method }) {
  const cfg = paymentMethodConfig[method] || paymentMethodConfig.cash;
  const Icon = cfg.icon;
  const colorMap = {
    amber: "text-amber-600",
    blue: "text-blue-600",
    indigo: "text-indigo-600",
    green: "text-green-600",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs ${colorMap[cfg.color]}`}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ─── COUNTDOWN TIMER ─────────────────────────────────────────────────────────
function CountdownTimer({ appointmentDate, onExpire, paymentId }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const appointment = new Date(appointmentDate);
      const diff = appointment - now;

      if (diff <= 0) {
        setTimeLeft("Time expired");
        if (onExpire) onExpire();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}p`);
      } else {
        setTimeLeft(`${minutes}p`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [appointmentDate, onExpire]);

  const isUrgent =
    timeLeft && !timeLeft.includes("h") && parseInt(timeLeft) <= 30;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        isUrgent ? "text-red-600" : "text-amber-600"
      }`}
    >
      <Clock className="w-3 h-3" />
      {timeLeft}
    </span>
  );
}

// ─── SUMMARY CARDS ───────────────────────────────────────────────────────────
function SummaryCards({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 animate-pulse"
          >
            <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
            <div className="h-8 bg-slate-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Tổng thu",
      value: `${(stats?.totalRevenue || 0).toLocaleString("vi-VN")}đ`,
      sub: `${stats?.byStatus?.completed || 0} completed`,
      color: "text-emerald-600",
    },
    {
      label: "Pending deposit",
      value: stats?.pendingDeposits || 0,
      sub: "Need to process",
      color: "text-amber-600",
    },
    {
      label: "Refunded",
      value: `${(stats?.refundedAmount || 0).toLocaleString("vi-VN")}đ`,
      sub: "Cancel appointment",
      color: "text-purple-600",
    },
    {
      label: "Transactions",
      value: stats?.totalPayments || 0,
      sub: `${stats?.byStatus?.pending || 0} pending`,
      color: "text-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      {cards.map((c, i) => (
        <div
          key={i}
          className="bg-white rounded-lg border border-slate-200 shadow-sm p-4"
        >
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
            {c.label}
          </p>
          <p className={`text-xl font-bold ${c.color}`}>{c.value}</p>
          <p className="text-xs text-slate-400 mt-0.5">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ─── FILTER BAR ──────────────────────────────────────────────────────────────
const filterBtns = [
  { key: "all", label: "All" },
  { key: "pending", label: "Waiting for payment" },
  { key: "partial", label: "Deposit paid" },
  { key: "completed", label: "Completed" },
  { key: "no_show", label: "No show" },
];

function FilterBar({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-3">
      {filterBtns.map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
            active === f.key
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-500 hover:border-indigo-300"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

// ─── PAYMENT DETAIL MODAL ────────────────────────────────────────────────────
function PaymentDetailModal({
  payment,
  onClose,
  onConfirmPayment,
  onMarkNoShow,
  processing,
}) {
  if (!payment) return null;

  const appointmentDate =
    payment.appointment?.appointmentDate || payment.appointment?.date;
  const isPastAppointment =
    appointmentDate && new Date(appointmentDate) < new Date();
  const canMarkNoShow =
    isPastAppointment && ["partial", "pending"].includes(payment.paymentStatus);
  const canConfirmPayment = ["partial", "pending"].includes(
    payment.paymentStatus,
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Payment details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Payment Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Thông tin thanh toán
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">ID Payment</p>
                <p className="font-semibold text-gray-800">#{payment.id}</p>
              </div>
              <div>
                <p className="text-gray-500">ID Appointment</p>
                <p className="font-semibold text-gray-800">
                  #{payment.appointmentId}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <StatusBadge status={payment.paymentStatus} />
              </div>
              <div>
                <p className="text-gray-500">Payment method</p>
                <MethodBadge method={payment.paymentMethod} />
              </div>
              {appointmentDate && (
                <div>
                  <p className="text-gray-500">Appointment time</p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {new Date(appointmentDate).toLocaleString("vi-VN")}
                    </span>
                    {isPastAppointment && (
                      <span className="text-xs text-red-500">(Expired)</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Appointment Countdown */}
          {appointmentDate && !isPastAppointment && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                Appointment time
              </h3>
              <p className="text-sm text-gray-600">
                The patient needs to arrive before the appointment time. If the
                patient does not arrive within 2 hours, the deposit will be
                forfeited automatically.
              </p>
              <CountdownTimer appointmentDate={appointmentDate} />
            </div>
          )}

          {/* Amount Details */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-gray-600" />
              Chi tiết số tiền
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Examination fee:</span>
                <span className="font-medium">
                  {payment.consultationFee?.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <div className="flex justify-between text-blue-600">
                <span>Deposit (25%):</span>
                <span className="font-medium">
                  {payment.depositAmount?.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <div className="flex justify-between text-amber-600">
                <span>Remaining:</span>
                <span className="font-medium">
                  {payment.remainingAmount?.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                <span>Paid:</span>
                <span className="text-emerald-600">
                  {payment.totalPaid?.toLocaleString("vi-VN")}đ
                </span>
              </div>
              {payment.refundAmount > 0 && (
                <div className="flex justify-between text-purple-600">
                  <span>Refunded:</span>
                  <span className="font-medium">
                    -{payment.refundAmount?.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Refund Policy */}
          {payment.depositStatus !== "not_required" && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                Cancellation policy
              </h3>
              <div className="text-sm space-y-1">
                <p className="text-green-700">
                  • Cancel before 24h: Refund 100%
                </p>
                <p className="text-yellow-700">
                  • Cancel before 12h: Refund 50%
                </p>
                <p className="text-red-700">
                  • No show within 2h: Forfeit 100% deposit
                </p>
              </div>
            </div>
          )}

          {/* Transaction History */}
          {payment.transactions && payment.transactions.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                Transaction history
              </h3>
              <div className="space-y-2">
                {payment.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between text-sm bg-white p-2 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {tx.type === "deposit"
                          ? "Đặt cọc"
                          : tx.type === "final"
                            ? "Thanh toán cuối"
                            : tx.type === "refund"
                              ? "Hoàn tiền"
                              : tx.type === "forfeit"
                                ? "Mất đặt cọc"
                                : tx.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${tx.type === "refund" || tx.type === "forfeit" ? "text-red-600" : "text-emerald-600"}`}
                      >
                        {tx.type === "refund" || tx.type === "forfeit"
                          ? "-"
                          : "+"}
                        {tx.amount?.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap justify-end gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Close
            </button>

            {canMarkNoShow && (
              <button
                onClick={onMarkNoShow}
                disabled={processing}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                {processing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserX className="w-4 h-4" />
                )}
                No show
              </button>
            )}

            {canConfirmPayment && (
              <button
                onClick={onConfirmPayment}
                disabled={processing}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                {processing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Receipt className="w-4 h-4" />
                )}
                Confirm payment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAYMENT TABLE ───────────────────────────────────────────────────────────
function PaymentTable({ payments, loading, onViewDetail }) {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = payments.filter((p) => {
    if (filter !== "all" && p.paymentStatus !== filter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const patientName = (
        p.patient?.user?.firstName + " " + p.patient?.user?.lastName || ""
      ).toLowerCase();
      const appointmentId = String(p.appointmentId);
      if (!patientName.includes(query) && !appointmentId.includes(query))
        return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="animate-pulse p-8">
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-slate-100 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <FilterBar active={filter} onChange={setFilter} />
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase px-4 py-2.5">
                  #ID
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase px-4 py-2.5">
                  Patient
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase px-4 py-2.5">
                  Appointment
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase px-4 py-2.5">
                  Examination fee
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase px-4 py-2.5">
                  Deposit
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase px-4 py-2.5">
                  Paid
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase px-4 py-2.5">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase px-4 py-2.5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const aptDate =
                  p.appointment?.appointmentDate || p.appointment?.date;
                const isPast = aptDate && new Date(aptDate) < new Date();
                return (
                  <tr
                    key={p.id}
                    className={`border-b border-slate-100 hover:bg-indigo-50 transition-colors ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}
                  >
                    <td className="px-4 py-2.5">
                      <span className="font-semibold text-indigo-600">
                        #{p.id}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-medium text-slate-700">
                        {p.patient?.user
                          ? `${p.patient.user.firstName} ${p.patient.user.lastName}`
                          : `Patient #${p.patientId}`}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="text-slate-500 text-xs">
                        {aptDate
                          ? new Date(aptDate).toLocaleDateString("vi-VN")
                          : "-"}
                      </div>
                      {aptDate &&
                        !isPast &&
                        ["partial", "pending"].includes(p.paymentStatus) && (
                          <CountdownTimer appointmentDate={aptDate} />
                        )}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">
                      {p.consultationFee?.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">
                      {p.depositAmount?.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-semibold text-emerald-600">
                        {p.totalPaid?.toLocaleString("vi-VN")}$
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={p.paymentStatus} />
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => onViewDetail(p)}
                        className="p-1.5 hover:bg-indigo-100 rounded-lg transition text-indigo-600"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    <div className="flex flex-col items-center">
                      <DollarSign className="w-12 h-12 text-slate-300 mb-2" />
                      <p>No transactions found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function ManagePayments() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [processing, setProcessing] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/payment?limit=100`,
        getAuthHeader(),
      );
      setPayments(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/payment/stats`,
        getAuthHeader(),
      );
      setStats(response.data?.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, []);

  const handleViewDetail = async (payment) => {
    try {
      const response = await axios.get(
        `${API_URL}/payment/${payment.id}`,
        getAuthHeader(),
      );
      setSelectedPayment(response.data?.data);
    } catch (err) {
      console.error("Error fetching payment detail:", err);
      setSelectedPayment(payment);
    }
  };

  const handleConfirmPayment = async () => {
    if (
      !confirm("Confirm payment for the remaining amount for this appointment?")
    )
      return;
    setProcessing(true);
    try {
      await axios.post(
        `${API_URL}/payment/${selectedPayment.id}/confirm-payment`,
        {},
        getAuthHeader(),
      );
      alert("Confirm payment successfully!");
      setSelectedPayment(null);
      fetchPayments();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred");
    } finally {
      setProcessing(false);
    }
  };

  const handleMarkNoShow = async () => {
    if (
      !confirm(
        "Mark patient as no show? Deposit will be forfeited into revenue.",
      )
    )
      return;
    setProcessing(true);
    try {
      const response = await axios.post(
        `${API_URL}/payment/${selectedPayment.id}/no-show`,
        { reason: "No show" },
        getAuthHeader(),
      );
      alert(response.data?.message || "Marked as no show successfully!");
      setSelectedPayment(null);
      fetchPayments();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred");
    } finally {
      setProcessing(false);
    }
  };

  const handleRefresh = () => {
    fetchPayments();
    fetchStats();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Manage Payments</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track appointment and payment transactions of patients
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
            title="Refresh"
          >
            <RefreshCw
              className={`w-4 h-4 text-slate-600 ${loading ? "animate-spin" : ""}`}
            />
          </button>
          <button className="bg-indigo-600 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-1.5">
            <Download className="w-4 h-4" />
            Export report
          </button>
        </div>
      </div>

      <SummaryCards stats={stats} loading={loading} />
      <PaymentTable
        payments={payments}
        loading={loading}
        onViewDetail={handleViewDetail}
      />

      {selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          onConfirmPayment={handleConfirmPayment}
          onMarkNoShow={handleMarkNoShow}
          processing={processing}
        />
      )}
    </div>
  );
}
