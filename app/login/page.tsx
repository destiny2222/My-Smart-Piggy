"use client";
import { useState } from "react";
import Link from "next/link";
import { PiggyBank, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add authentication logic here
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A1628] to-[#142136] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-[#1447E6] rounded-lg flex items-center justify-center">
              <PiggyBank className="text-white" size={28} />
            </div>
            <span className="text-2xl font-bold text-white">My Smart Piggy</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mt-6 mb-2">Welcome Back</h1>
          <p className="text-[#A3B1C6]">Sign in to continue to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#101D2E] rounded-2xl p-8 shadow-xl border border-[#2D3D54]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3B1C6]" size={20} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#0A1628] border border-[#2D3D54] rounded-lg text-white placeholder-[#A3B1C6] focus:outline-none focus:border-[#1447E6] transition"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3B1C6]" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-[#0A1628] border border-[#2D3D54] rounded-lg text-white placeholder-[#A3B1C6] focus:outline-none focus:border-[#1447E6] transition"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3B1C6] hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#2D3D54] bg-[#0A1628] text-[#1447E6] focus:ring-[#1447E6] focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-[#A3B1C6]">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-[#1447E6] hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#1447E6] text-white font-semibold rounded-lg hover:bg-[#0F35B8] transition duration-300 shadow-lg"
            >
              Sign In
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-[#A3B1C6] mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#1447E6] font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-[#A3B1C6] hover:text-white transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
