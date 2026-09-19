"use client";
import { useEffect, useState, useMemo } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  ArrowDownLeft, 
  Wallet,
  CheckCircle2,
  Clock
} from "lucide-react";
import { userApi, PaymentHistory } from "@/app/lib/api";

export default function HistoryPage() {
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending">("all");

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await userApi.getPaymentHistory();
        const sortedPayments = (response.data || []).sort((a, b) => {
          const timeA = new Date(a.paid_date || a.created_at).getTime();
          const timeB = new Date(b.paid_date || b.created_at).getTime();
          if (isNaN(timeA) || isNaN(timeB)) return Number(b.id) - Number(a.id);
          return timeB - timeA;
        });
        setPayments(sortedPayments);
      } catch (err: any) {
        setError(err.message || "Failed to load payment history");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
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

  // Reset to first page when filtering
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

  const totalPaid = payments.reduce((sum, payment) => sum + (Number(payment.amount_paid) || 0), 0);
  const paidCount = payments.filter(p => p.status?.toLowerCase() === 'paid').length;
  const avgPaid = payments.length > 0 ? totalPaid / payments.length : 0;

  const stats = [
    { 
      label: "Total Payments", 
      value: formatCurrency(totalPaid), 
      subtext: `${payments.length} total entries`, 
      icon: TrendingUp, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50" 
    },
    { 
      label: "Settled Payments", 
      value: `${paidCount} Completed`, 
      subtext: `${payments.length - paidCount} pending settlement`, 
      icon: CheckCircle2, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      label: "Average Deposit", 
      value: formatCurrency(avgPaid), 
      subtext: "Per transaction average", 
      icon: DollarSign, 
      color: "text-purple-600", 
      bg: "bg-purple-50" 
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6 max-w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Transaction History</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Complete record of your financial transactions and payment ledger
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-200/80 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{stat.subtext}</p>
                </div>
                <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={stat.color} size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transactions Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden">
        {/* Header with Search and Filter */}
        <div className="px-4 md:px-6 py-4 border-b border-gray-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-bold text-gray-900">Payment Ledger</h2>
              <span className="text-xs bg-gray-100 text-gray-700 font-medium px-2 py-0.5 rounded-full">
                {filteredPayments.length} records
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Showing 10 records per page</p>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
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
        
        {loading ? (
          <div className="px-4 md:px-6 py-12 text-center text-gray-600">
            <div className="w-8 h-8 border-4 border-[#1447E6] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Loading payment history...</p>
          </div>
        ) : error ? (
          <div className="px-4 md:px-6 py-12 text-center text-red-600 text-sm">
            {error}
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="px-4 md:px-6 py-12 text-center text-gray-500">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
              <Search size={20} />
            </div>
            <p className="text-sm font-medium text-gray-800">No payment history found</p>
            <p className="text-xs text-gray-400 mt-1">Try resetting your search query or filter</p>
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
                            : 'bg-yellow-50 text-yellow-700 border border-yellow-200/60'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            payment.status?.toLowerCase() === 'paid' ? 'bg-emerald-500' : 'bg-yellow-500'
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

