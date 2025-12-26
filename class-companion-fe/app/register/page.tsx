"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  GraduationCap,
  ArrowLeft,
  BadgeCheck,
} from "lucide-react";
import { clsx } from "clsx";
import api from "@/lib/axios";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password !== passwordConfirmation) {
      setError("Password confirmation does not match.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/register", {
        name,
        email,
        nim,
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess("Account created! Please wait for admin verification.");

      // Delay redirect to login
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || "Registration failed");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white overflow-hidden relative">
      {/* Abstract Background Blobs - Keep consistent with login */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-2 relative z-10">
        {/* Left Side: Hero Section (Desktop) */}
        <div className="hidden lg:flex flex-col justify-center items-center p-12 relative">
          <div className="absolute inset-0 bg-zinc-900/30 backdrop-blur-3xl" />

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-lg"
          >
            <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-tr from-green-500 to-emerald-500 shadow-2xl shadow-green-500/20">
              <BadgeCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Join <br />
              <span className="bg-linear-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text">
                Class Companion
              </span>
            </h1>
            <p className="text-2xl font-semibold text-zinc-300 mb-6 -mt-4">
              Pemrograman Dasar
            </p>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              Create your account to start tracking your attendance and
              accessing learning materials.
            </p>
          </motion.div>
        </div>

        {/* Right Side: Register Form */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12 lg:bg-zinc-900/20 lg:backdrop-blur-sm border-l border-white/5 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md space-y-8 my-auto py-10"
          >
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-tr from-green-500 to-emerald-500 mb-4 shadow-lg shadow-green-500/20">
                <BadgeCheck className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Create Account</h1>
            </div>

            <div className="text-center lg:text-left flex items-center justify-between">
              <div>
                <button
                  onClick={() => router.push("/login")}
                  className="flex items-center gap-2 text-zinc-500 hover:text-white mb-4 transition-colors text-sm"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </button>
                <h2 className="text-3xl font-bold">Register</h2>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300 ml-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 transition-colors group-focus-within:text-green-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-white placeholder:text-zinc-600 transition-all font-medium"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                </div>

                {/* Email - New Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300 ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 transition-colors group-focus-within:text-green-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-white placeholder:text-zinc-600 transition-all font-medium"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>

                {/* NIM */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300 ml-1">
                    NIM
                  </label>
                  <div className="relative group">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 transition-colors group-focus-within:text-green-400" />
                    <input
                      type="number"
                      value={nim}
                      onChange={(e) => setNim(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-white placeholder:text-zinc-600 transition-all font-medium"
                      placeholder="NIM"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300 ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 transition-colors group-focus-within:text-green-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-white placeholder:text-zinc-600 transition-all font-medium"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Confirmation */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300 ml-1">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 transition-colors group-focus-within:text-green-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-white placeholder:text-zinc-600 transition-all font-medium"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-red-400 text-sm text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20 flex items-center justify-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-green-400 text-sm text-center bg-green-500/10 py-3 rounded-xl border border-green-500/20 flex items-center justify-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  {success}
                </motion.div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={clsx(
                    "w-full py-4 rounded-xl font-bold shadow-xl shadow-green-500/20 transition-all relative overflow-hidden group",
                    "bg-white text-black hover:bg-zinc-200",
                    "disabled:opacity-70 disabled:cursor-not-allowed"
                  )}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? "Creating Account..." : "Create Account"}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
