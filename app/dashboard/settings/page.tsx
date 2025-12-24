"use client";
import { useState, useEffect } from "react";
import { User, Mail, Lock, Bell, Shield, Smartphone, Camera } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { userApi } from "@/app/lib/api";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "security", name: "Security", icon: Shield },
    { id: "notifications", name: "Notifications", icon: Bell },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            <div className="flex lg:flex-col gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-[#1447E6] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  {tab.name}
                </button>
              );
            })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "security" && <SecuritySettings />}
            {activeTab === "notifications" && <NotificationSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await userApi.editProfile({
        ...formData,
        // profile_picture: profilePicture || undefined,
      });
      
      updateUser(response.data);
      setSuccess("Profile updated successfully!");
      setProfilePicture(null);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">Profile Information</h2>
      
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {user?.profile_picture ? (
                <img 
                  src={`http://localhost:8000/public/profile/${user.profile_picture}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="text-gray-400" size={32} />
              )}
            </div>
            <label className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition flex items-center gap-2">
              <Camera size={18} />
              <span className="text-sm">Change Photo</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {profilePicture && (
              <span className="text-sm text-green-600">New image selected</span>
            )}
          </div>
        </div> */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-[#1447E6]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 md:pl-11 pr-3 md:pr-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-[#1447E6]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <div className="relative">
            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full pl-10 md:pl-11 pr-3 md:pr-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-[#1447E6]"
              required
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#1447E6] text-white text-sm md:text-base font-semibold rounded-lg hover:bg-[#0F35B8] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

function SecuritySettings() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (passwords.new_password !== passwords.new_password_confirmation) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await userApi.changePassword(
        passwords.current_password,
        passwords.new_password,
        passwords.new_password_confirmation
      );
      
      setSuccess("Password changed successfully!");
      setPasswords({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">Security Settings</h2>
      
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              value={passwords.current_password}
              onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
              placeholder="Enter current password"
              className="w-full pl-10 md:pl-11 pr-3 md:pr-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-[#1447E6]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              value={passwords.new_password}
              onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
              placeholder="Enter new password"
              className="w-full pl-10 md:pl-11 pr-3 md:pr-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-[#1447E6]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              value={passwords.new_password_confirmation}
              onChange={(e) => setPasswords({ ...passwords, new_password_confirmation: e.target.value })}
              placeholder="Confirm new password"
              className="w-full pl-10 md:pl-11 pr-3 md:pr-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-[#1447E6]"
              required
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#1447E6] text-white text-sm md:text-base font-semibold rounded-lg hover:bg-[#0F35B8] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Two-Factor Authentication</h3>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm md:text-base font-medium text-gray-800">Enable 2FA</p>
              <p className="text-xs md:text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1447E6]"></div>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}

function NotificationSettings() {
  const notifications = [
    { id: 1, title: "Email Notifications", description: "Receive email about your account activity", enabled: true },
    { id: 2, title: "Transaction Alerts", description: "Get notified of every transaction", enabled: true },
    { id: 3, title: "Monthly Reports", description: "Receive monthly financial summary", enabled: false },
    { id: 4, title: "Savings Goals", description: "Updates on your savings progress", enabled: true },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">Notification Preferences</h2>
      
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-center justify-between gap-4 py-4 border-b border-gray-200 last:border-0">
            <div className="flex-1">
              <p className="text-sm md:text-base font-medium text-gray-800">{notification.title}</p>
              <p className="text-xs md:text-sm text-gray-600">{notification.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={notification.enabled} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1447E6]"></div>
            </label>
          </div>
        ))}
      </div>

      <button className="w-full sm:w-auto px-6 py-2.5 bg-[#1447E6] text-white text-sm md:text-base font-semibold rounded-lg hover:bg-[#0F35B8] transition">
        Save Preferences
      </button>
    </div>
  );
}
