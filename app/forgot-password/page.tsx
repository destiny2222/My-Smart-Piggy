"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PiggyBank, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { authApi } from "@/app/lib/api";
import PublicRoute from "@/app/components/PublicRoute";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.forgotPassword(email);
      setSuccess(response.message || "OTP sent successfully. Please check your email.");
      setStep("reset");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.resetPassword(email, otp, password, passwordConfirmation);
      setSuccess(response.message || "Password reset successful! Redirecting to login...");
      
      // Redirect to login after a delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to reset password. Please check your OTP and try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicRoute>
      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
          <div className="w-full max-w-md">
            {/* Navigation */}
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#1447E6] transition mb-8"
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-3">
                {step === "email" ? "Reset Password" : "Enter New Password"}
              </h1>
              <p className="text-gray-600">
                {step === "email" 
                  ? "Enter your email address and we'll send you an OTP to reset your password."
                  : "We've sent an OTP to your email. Enter it below along with your new password."}
              </p>
            </div>

            {/* Error & Success Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="text-green-600 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-green-700 font-medium">{success}</p>
              </div>
            )}

            {/* Form */}
            {step === "email" ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1447E6] focus:border-transparent transition"
                      placeholder="e.g. user@example.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#1447E6] text-white font-semibold rounded-xl hover:bg-[#0F35B8] transition duration-300 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                  {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-5">
                {/* OTP Input */}
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter 6-Digit OTP
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      id="otp"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1447E6] focus:border-transparent transition tracking-[0.5em] font-mono text-lg"
                      placeholder="000000"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1447E6] focus:border-transparent transition"
                      placeholder="At least 8 characters"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="passwordConfirmation"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1447E6] focus:border-transparent transition"
                      placeholder="Re-enter your password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#1447E6] text-white font-semibold rounded-xl hover:bg-[#0F35B8] transition duration-300 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                  {!loading && <CheckCircle2 size={20} />}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Didn't receive the email?{" "}
                  <button 
                    type="button" 
                    onClick={() => setStep("email")}
                    className="text-[#1447E6] font-semibold hover:underline"
                  >
                    Try again
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Right Side - Illustration (Synced with Login) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1447E6] to-[#0F35B8] items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
          <div className="relative z-10 text-center">
            <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20">
              <ShieldCheck className="text-white" size={64} />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Secure Your Account
            </h2>
            <p className="text-xl text-blue-100 max-w-md mx-auto">
              Follow the steps to reset your password and keep your financial data protected.
            </p>
            
            {/* Decorative circles */}
            <div className="absolute top-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}
