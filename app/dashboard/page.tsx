"use client";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, Wallet, CreditCard, PiggyBank, Calendar } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from "@/app/context/AuthContext";
import { userApi, Analytics, PaymentHistory } from "@/app/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentsLoading, setPaymentsLoading] = useState(true);

  useEffect(() => {
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
        const recentPayments = response.data.slice(0, 6);
        setPayments(recentPayments);
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

  const stats = [
    { 
      label: "Total Amount Paid", 
      value: loading ? "Loading..." : formatCurrency(analytics?.total_amount_paid || 0), 
      change: loading ? "Loading" : formatCurrency(analytics ? analytics.total_amount_paid * 0.05 : 0), 
      trend: "up", 
      icon: Wallet,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    // { 
    //   label: "Income", 
    //   value: "$8,250", 
    //   change: "+8.3%", 
    //   trend: "up", 
    //   icon: TrendingUp,
    //   color: "bg-green-500",
    //   lightColor: "bg-green-50",
    //   textColor: "text-green-600"
    // },
    // { 
    //   label: "Expenses", 
    //   value: "$3,125", 
    //   change: "-4.2%", 
    //   trend: "down", 
    //   icon: TrendingDown,
    //   color: "bg-red-500",
    //   lightColor: "bg-red-50",
    //   textColor: "text-red-600"
    // },
    // { 
    //   label: "Savings", 
    //   value: "$5,125", 
    //   change: "+18.7%", 
    //   trend: "up", 
    //   icon: PiggyBank,
    //   color: "bg-purple-500",
    //   lightColor: "bg-purple-50",
    //   textColor: "text-purple-600"
    // },
  ];



  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div>
                  <p className="text-xs md:text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.lightColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={stat.textColor} size={24} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {stat.trend === "up" ? (
                  <TrendingUp className="text-green-600" size={16} />
                ) : (
                  <TrendingDown className="text-red-600" size={16} />
                )}
                <span className={`text-xs md:text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {stat.change}
                </span>
                <span className="text-xs md:text-sm text-gray-500 hidden sm:inline">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base md:text-lg font-bold text-gray-800">Recent Transactions</h2>
          <a 
            href="/dashboard/history" 
            className="text-xs md:text-sm text-[#1447E6] hover:text-[#0F35B8] font-medium transition flex items-center gap-1"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        
        {paymentsLoading ? (
          <div className="px-4 md:px-6 py-8 text-center text-gray-600">
            <div className="w-8 h-8 border-4 border-[#1447E6] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Loading transactions...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="px-4 md:px-6 py-8 text-center text-gray-600">
            <p className="text-sm">No transactions found</p>
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
