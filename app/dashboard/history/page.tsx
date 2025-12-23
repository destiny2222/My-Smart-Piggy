"use client";
import { Calendar, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function HistoryPage() {
  const transactions = [
    { id: 1, type: "deposit", amount: 500, description: "Monthly Savings", date: "2025-12-20", category: "Savings" },
    { id: 2, type: "withdrawal", amount: 150, description: "Grocery Shopping", date: "2025-12-18", category: "Food" },
    { id: 3, type: "deposit", amount: 1000, description: "Salary", date: "2025-12-15", category: "Income" },
    { id: 4, type: "withdrawal", amount: 75, description: "Gas Station", date: "2025-12-12", category: "Transport" },
    { id: 5, type: "deposit", amount: 200, description: "Freelance Work", date: "2025-12-10", category: "Income" },
    { id: 6, type: "withdrawal", amount: 300, description: "Rent Payment", date: "2025-12-05", category: "Bills" },
  ];

  const stats = [
    { label: "Total Income", value: "$1,700", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Expenses", value: "$525", icon: TrendingDown, color: "text-red-600", bg: "bg-red-50" },
    { label: "Net Savings", value: "$1,175", icon: DollarSign, color: "text-[#1447E6]", bg: "bg-blue-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Transaction History</h1>
        <p className="text-gray-600">View all your financial transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      {transaction.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {transaction.type === "deposit" ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <TrendingUp size={16} />
                        Deposit
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600">
                        <TrendingDown size={16} />
                        Withdrawal
                      </span>
                    )}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
                    transaction.type === "deposit" ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.type === "deposit" ? "+" : "-"}${transaction.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
