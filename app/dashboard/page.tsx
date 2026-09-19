"use client";
import { useEffect, useState, useMemo } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Wallet, 
  CreditCard, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Search,
  BarChart3,
  ArrowDownLeft,
  History,
  CheckCircle2,
  Clock,
  Filter
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useAuth } from "@/app/context/AuthContext";
import { userApi, Analytics, PaymentHistory } from "@/app/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending">("all");
  const [chartType, setChartType] = useState<"area" | "bar">("area");
  const [isMounted, setIsMounted] = useState(false);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setIsMounted(true);

    const fetchAnalytics = async () => {
      try {
        const response = await userApi.getAnalytics();
        setAnalytics(response.data);
      } catch (error) {
        // console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentPayments = async () => {
      try {
        const response = await userApi.getPaymentHistory();
        const sortedPayments = (response.data || []).sort((a, b) => {
          const timeA = new Date(a.paid_date || a.created_at).getTime();
          const timeB = new Date(b.paid_date || b.created_at).getTime();
          if (isNaN(timeA) || isNaN(timeB)) {
            return Number(b.id) - Number(a.id);
          }
          return timeB - timeA;
        });
        setPayments(sortedPayments);
      } catch (error) {
        // console.error("Failed to fetch payment history:", error);
      } finally {
        setPaymentsLoading(false);
      }
    };

    fetchAnalytics();
    fetchRecentPayments();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Derived Analytics Computations
  const totalAmountPaid = analytics?.total_amount_paid 
    ? Number(analytics.total_amount_paid) 
    : payments.reduce((sum, p) => sum + (Number(p.amount_paid) || 0), 0);

  const totalTransactions = payments.length;
  const paidTransactions = payments.filter(p => p.status?.toLowerCase() === 'paid').length;
  const pendingTransactions = payments.filter(p => p.status?.toLowerCase() === 'pending').length;
  const latestPayment = payments.length > 0 ? payments[0] : null;
  const averageAmount = payments.length > 0 ? totalAmountPaid / payments.length : 0;
  const highestPayment = payments.length > 0 
    ? Math.max(...payments.map(p => Number(p.amount_paid) || 0)) 
    : 0;

  // Chart Data Processing (chronological for timeline display)
  const chartData = useMemo(() => {
    if (!payments || payments.length === 0) {
      return [];
    }

    const chronological = [...payments].sort((a, b) => {
      const timeA = new Date(a.paid_date || a.created_at).getTime();
      const timeB = new Date(b.paid_date || b.created_at).getTime();
      if (isNaN(timeA) || isNaN(timeB)) return a.id - b.id;
      return timeA - timeB;
    });

    const groupedMap = new Map<string, { name: string; amount: number; count: number }>();

    chronological.forEach((payment) => {
      const date = new Date(payment.paid_date || payment.created_at);
      const label = !isNaN(date.getTime())
        ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : `#${payment.id}`;

      const existing = groupedMap.get(label);
      if (existing) {
        existing.amount += Number(payment.amount_paid) || 0;
        existing.count += 1;
      } else {
        groupedMap.set(label, {
          name: label,
          amount: Number(payment.amount_paid) || 0,
          count: 1,
        });
      }
    });

    return Array.from(groupedMap.values());
  }, [payments]);

  // Filtered Payments based on Search and Status
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchLower = searchTerm.trim().toLowerCase();
      const matchesSearch =
        searchLower === "" ||
        payment.id.toString().includes(searchLower) ||
        payment.amount_paid.toString().includes(searchLower) ||
        (payment.paid_date && payment.paid_date.toLowerCase().includes(searchLower));

      const matchesStatus =
        statusFilter === "all" ||
        (payment.status && payment.status.toLowerCase() === statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [payments, searchTerm, statusFilter]);

  // Reset page to 1 whenever search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPayments = filteredPayments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-3 text-xs md:text-sm">
          <p className="font-semibold text-gray-800 mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1447E6]"></span>
            <span className="text-gray-500">Total:</span>
            <span className="font-bold text-gray-900">{formatCurrency(payload[0].value)}</span>
          </div>
          {payload[0].payload.count > 1 && (
            <p className="text-[11px] text-gray-400 mt-1">
              {payload[0].payload.count} transactions on this day
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const statCards = [
    {
      label: "Total Amount Paid",
      value: loading ? "Loading..." : formatCurrency(totalAmountPaid),
      subtext: "Cumulative deposits",
      icon: Wallet,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
      trend: "up"
    },
    {
      label: "Recent Payment",
      value: paymentsLoading ? "Loading..." : latestPayment ? formatCurrency(Number(latestPayment.amount_paid)) : "None",
      subtext: latestPayment ? formatDate(latestPayment.paid_date) : "No records yet",
      icon: TrendingUp,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      trend: "up"
    },
    {
      label: "Completed Payments",
      value: paymentsLoading ? "Loading..." : `${paidTransactions} Paid`,
      subtext: pendingTransactions > 0 ? `${pendingTransactions} Pending` : "All settled",
      icon: CreditCard,
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
      trend: "up"
    },
    {
      label: "Average Transaction",
      value: paymentsLoading ? "Loading..." : formatCurrency(averageAmount),
      subtext: "Per transaction average",
      icon: DollarSign,
      color: "bg-amber-500",
      lightColor: "bg-amber-50",
      textColor: "text-amber-600",
      trend: "up"
    }
  ];

  return (
    <div className="space-y-5 md:space-y-6">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d2a8a] via-[#1447E6] to-[#2563EB] text-white p-5 md:p-7 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium text-blue-100 mb-2 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active Account • SmartPiggy Member
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
              Welcome back, {user?.name || "User"} 👋
            </h1>
            <p className="text-blue-100 text-xs md:text-sm mt-1 max-w-xl">
              Track your deposit activity, analyze payment trends, and manage your recent transactions seamlessly.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <a
              href="/dashboard/history"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-[#1447E6] font-semibold text-xs md:text-sm shadow-sm hover:bg-blue-50 transition"
            >
              <History size={16} />
              View Full History
            </a>
          </div>
        </div>

        {/* Decorative background blurs */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-36 -top-10 w-32 h-32 bg-blue-300/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* 4-Card Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-200/80 hover:shadow-md hover:border-gray-300 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 md:w-11 md:h-11 ${stat.lightColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={stat.textColor} size={22} />
                </div>
              </div>
              <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100">
                <span className="text-xs font-medium text-gray-500">
                  {stat.subtext}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Analytics & Financial Highlights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Interactive Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200/80 p-4 md:p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-bold text-gray-900">Payment Analytics</h2>
                <span className="text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#1447E6] border border-blue-100">
                  Timeline
                </span>
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                Overview of payment volume and deposit trajectory over time
              </p>
            </div>
            
            {/* Chart Type Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg self-start sm:self-auto text-xs font-medium text-gray-600">
              <button
                type="button"
                onClick={() => setChartType('area')}
                className={`px-3 py-1 rounded-md transition ${chartType === 'area' ? 'bg-white text-gray-900 shadow-sm font-semibold' : 'hover:text-gray-900'}`}
              >
                Area Trend
              </button>
              <button
                type="button"
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 rounded-md transition ${chartType === 'bar' ? 'bg-white text-gray-900 shadow-sm' : 'hover:text-gray-900'}`}
              >
                Bar Volume
              </button>
            </div>
          </div>

          <div className="w-full h-64 md:h-72">
            {isMounted && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'area' ? (
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="paymentGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1447E6" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#1447E6" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      dy={6}
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      tickFormatter={(val) => `₦${(val >= 1000 ? `${(val/1000).toFixed(0)}k` : val)}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#1447E6" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill="url(#paymentGradient)" 
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      dy={6}
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      tickFormatter={(val) => `₦${(val >= 1000 ? `${(val/1000).toFixed(0)}k` : val)}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="amount" 
                      fill="#1447E6" 
                      radius={[4, 4, 0, 0]} 
                      maxBarSize={40}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            ) : paymentsLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <div className="w-7 h-7 border-3 border-[#1447E6] border-t-transparent rounded-full animate-spin mb-2" />
                <p className="text-xs">Loading analytics data...</p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <BarChart3 className="w-10 h-10 mb-2 stroke-[1.5] text-gray-300" />
                <p className="text-sm font-medium text-gray-600">No payment activity to display</p>
                <p className="text-xs text-gray-400 mt-0.5">Transactions will automatically be charted here</p>
              </div>
            )}
          </div>
        </div>

        {/* Financial Highlights Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-4 md:p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Financial Highlights</h3>
            <p className="text-xs text-gray-500 mb-4">Summary of transaction performance</p>

            <div className="space-y-3.5">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 font-medium">Highest Payment</span>
                  <p className="text-base md:text-lg font-bold text-gray-900 mt-0.5">
                    {formatCurrency(highestPayment)}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1447E6] flex items-center justify-center font-bold text-xs">
                  Peak
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 font-medium">Settlement Rate</span>
                  <p className="text-base md:text-lg font-bold text-emerald-600 mt-0.5">
                    {payments.length ? `${Math.round((paidTransactions / payments.length) * 100)}%` : '100%'}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={18} />
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <span className="text-gray-500 font-medium">Payment Health</span>
                  <span className="font-semibold text-gray-800">
                    {paidTransactions} of {totalTransactions} settled
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#1447E6] h-full rounded-full transition-all duration-500"
                    style={{ width: `${payments.length ? (paidTransactions / payments.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Currency: <strong>NGN (₦)</strong></span>
            <span className="text-emerald-600 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Ledger
            </span>
          </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden">
        {/* Table Header with Search & Filters */}
        <div className="px-4 md:px-6 py-4 border-b border-gray-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-bold text-gray-900">Recent Transactions</h2>
              <span className="text-xs bg-gray-100 text-gray-700 font-medium px-2 py-0.5 rounded-full">
                {filteredPayments.length} records
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Showing 10 records per page with interactive pagination</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Search ID or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-48 pl-9 pr-3 py-1.5 text-xs md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-2.5 py-1 rounded-md transition ${statusFilter === "all" ? "bg-white text-gray-900 shadow-sm font-semibold" : "text-gray-600 hover:text-gray-900"}`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("paid")}
                className={`px-2.5 py-1 rounded-md transition ${statusFilter === "paid" ? "bg-white text-emerald-700 shadow-sm font-semibold" : "text-gray-600 hover:text-gray-900"}`}
              >
                Paid
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("pending")}
                className={`px-2.5 py-1 rounded-md transition ${statusFilter === "pending" ? "bg-white text-yellow-700 shadow-sm font-semibold" : "text-gray-600 hover:text-gray-900"}`}
              >
                Pending
              </button>
            </div>
          </div>
        </div>
        
        {paymentsLoading ? (
          <div className="px-4 md:px-6 py-12 text-center text-gray-600">
            <div className="w-8 h-8 border-4 border-[#1447E6] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Loading transactions...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="px-4 md:px-6 py-12 text-center text-gray-500">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
              <Search size={20} />
            </div>
            <p className="text-sm font-medium text-gray-800">No transactions match your criteria</p>
            <p className="text-xs text-gray-400 mt-1">Try clearing your search query or status filter</p>
            {(searchTerm || statusFilter !== "all") && (
              <button
                onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}
                className="mt-3 text-xs font-medium text-[#1447E6] hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto -mx-px">
              <table className="w-full text-left">
                <thead className="bg-gray-50/75 border-b border-gray-200">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-4 md:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 md:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Payment Date
                    </th>
                    <th className="px-4 md:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {currentPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 md:px-6 py-3.5 text-xs md:text-sm text-gray-800">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <ArrowDownLeft size={16} />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 block">Payment #{payment.id}</span>
                            <span className="text-[11px] text-gray-400">Direct Deposit</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3.5 whitespace-nowrap text-xs md:text-sm font-semibold text-emerald-600">
                        +{formatCurrency(Number(payment.amount_paid))}
                      </td>
                      <td className="px-4 md:px-6 py-3.5 text-xs md:text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(payment.paid_date)}
                      </td>
                      <td className="px-4 md:px-6 py-3.5 text-sm hidden sm:table-cell whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          payment.status?.toLowerCase() === 'paid' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            payment.status?.toLowerCase() === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`} />
                          {payment.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : 'Paid'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-4 md:px-6 py-3.5 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs md:text-sm text-gray-600 bg-gray-50/40">
              <div>
                Showing <span className="font-semibold text-gray-900">{startIndex + 1}</span> to{" "}
                <span className="font-semibold text-gray-900">
                  {Math.min(startIndex + ITEMS_PER_PAGE, filteredPayments.length)}
                </span>{" "}
                of <span className="font-semibold text-gray-900">{filteredPayments.length}</span> results
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs font-medium shadow-sm"
                  >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, idx) =>
                      page === "..." ? (
                        <span key={`ellipsis-${idx}`} className="px-2 py-1 text-gray-400">
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(Number(page))}
                          className={`w-8 h-8 rounded-lg text-xs font-medium transition flex items-center justify-center ${
                            currentPage === page
                              ? "bg-[#1447E6] text-white shadow-sm font-bold"
                              : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs font-medium shadow-sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
