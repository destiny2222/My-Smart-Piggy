"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { PiggyBank, History, Settings, Menu, X, LogOut, ChevronDown, BarChart3, Users, Clock, Calendar, Layers, DollarSign, HandHeart, Globe, Building2, FileText, ShoppingBag, Wrench, Megaphone, Bell, Search } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "History", href: "/dashboard/history", icon: History },
    // { name: "Setting", href: "/dashboard/settings", icon: Settings },
  ];

  const bottomNavItems = [
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-56 bg-[#f5f6fa] border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-200">
          <div className="w-7 h-7 bg-[#4169E1] rounded flex items-center justify-center">
            <PiggyBank className="text-white" size={16} />
          </div>
          <span className="text-base font-semibold text-gray-900">My SmartyPiggy</span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="ml-auto lg:hidden text-gray-600 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="py-3 px-3 space-y-0.5 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition ${
                  isActive
                    ? "bg-[#4169E1] text-white font-medium"
                    : "text-gray-700 hover:bg-gray-200 font-normal"
                }`}
              >
                <Icon size={16} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-200 bg-[#f5f6fa] py-3 px-3 space-y-0.5 mt-auto">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition ${
                  isActive
                    ? "bg-[#4169E1] text-white font-medium"
                    : "text-gray-700 hover:bg-gray-200 font-normal"
                }`}
              >
                <Icon size={16} />
                {item.name}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded text-sm transition text-gray-700 hover:bg-gray-200 font-normal w-full"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-56">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shrink-0">
          <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-3 md:py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-lg md:text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg hidden sm:flex">
                <Bell size={18} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-orange-400 flex items-center justify-center overflow-hidden">
                  {user?.profile_picture ? (
                    <img 
                      src='/avatar.jpg' 
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-white">
                      {user ? getInitials(user.name) : 'U'}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-900">
                      {user?.name || 'User'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
    </ProtectedRoute>
  );
}
