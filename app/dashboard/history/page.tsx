"use client";
import { useEffect, useState } from "react";
import { Calendar, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { userApi, PaymentHistory } from "@/app/lib/api";

export default function HistoryPage() {
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await userApi.getPaymentHistory();
        setPayments(response.data);
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

  const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amount_paid), 0);

  const stats = [
    { label: "Total Payments", value: formatCurrency(totalPaid), icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="space-y-4 md:space-y-6 max-w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Transaction History</h1>
        <p className="text-sm md:text-base text-gray-600">View all your financial transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={stat.color} size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">Payment History</h2>
        </div>
        
        {loading ? (
          <div className="px-4 md:px-6 py-8 text-center text-gray-600">
            Loading payment history...
          </div>
        ) : error ? (
          <div className="px-4 md:px-6 py-8 text-center text-red-600">
            {error}
          </div>
        ) : payments.length === 0 ? (
          <div className="px-4 md:px-6 py-8 text-center text-gray-600">
            No payment history found
          </div>
        ) : (
          <div className="overflow-x-auto -mx-px">
            <table className="w-full text-center">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 md:px-6 py-2 md:py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3  text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Date
                  </th>
                  
                  <th className="px-3 md:px-6 py-2 md:py-3  text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition">
                    <td className="px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm text-gray-600">
                      <span className="font-semibold">#{payment.id}</span>
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-3 whitespace-nowrap text-xs md:text-sm font-semibold  text-green-600">
                      {formatCurrency(Number(payment.amount_paid))}
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm text-gray-600">
                      <span className="whitespace-nowrap">{formatDate(payment.paid_date)}</span>
                    </td>
                    
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm hidden lg:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
