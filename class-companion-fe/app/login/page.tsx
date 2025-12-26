"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff, GraduationCap } from "lucide-react";
import { clsx } from "clsx";
import api from "@/lib/axios";
import { LoginResponse } from "@/types/api";

export default function LoginPage() {
  const router = useRouter();
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: responseBody } = await api.post<LoginResponse>("/login", {
        nim,
        password,
      });

      const { token, user } = responseBody.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (!user.is_active) {
        router.push("/waiting");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || "Login failed");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white overflow-hidden relative">
      {/* Abstract Background Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-2 relative z-10">
        {/* Left Side: Hero Section (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col justify-center items-center p-12 relative">
          <div className="absolute inset-0 bg-zinc-900/30 backdrop-blur-3xl" />

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-lg"
          >
            <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-tr from-indigo-500 to-violet-500 shadow-2xl shadow-indigo-500/20">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Welcome to <br />
              <span className="bg-linear-to-r from-indigo-400 to-violet-400 text-transparent bg-clip-text">
                Class Companion
              </span>
            </h1>
            <p className="text-2xl font-semibold text-zinc-300 mb-6 -mt-4">
              Pemrograman Dasar
            </p>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              Manage your attendance, access class materials, and track your
              progress all in one modern platform.
            </p>

            <div className="flex items-center gap-4 text-sm text-zinc-500">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                System Online
              </div>
              <span>v2.1.0</span>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12 lg:bg-zinc-900/20 lg:backdrop-blur-sm border-l border-white/5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md space-y-8"
          >
            {/* Mobile Header (Visible only on mobile) */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-tr from-indigo-500 to-violet-500 mb-4 shadow-lg shadow-indigo-500/20">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Class Companion</h1>
              <p className="text-zinc-400 font-medium">Pemrograman Dasar</p>
            </div>

            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold">Sign In</h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300 ml-1">
                    NIM
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 transition-colors group-focus-within:text-indigo-400" />
                    <input
                      type="text"
                      value={nim}
                      onChange={(e) => setNim(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-white placeholder:text-zinc-600 transition-all font-medium"
                      placeholder="Your NIM"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-zinc-300 ml-1">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => router.push("/forgot-password")}
                      className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 transition-colors group-focus-within:text-indigo-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-white placeholder:text-zinc-600 transition-all font-medium"
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

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={clsx(
                    "w-full py-4 rounded-xl font-bold shadow-xl shadow-indigo-500/20 transition-all relative overflow-hidden group",
                    "bg-white text-black hover:bg-zinc-200",
                    "disabled:opacity-70 disabled:cursor-not-allowed"
                  )}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? "Verifying..." : "Sign In"}
                  </span>
                </button>
              </div>
            </form>

            <div className="text-center mt-8 space-y-2">
              <p className="text-zinc-500 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={() => router.push("/register")}
                  className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline transition-all"
                >
                  Register Here
                </button>
              </p>
              <p className="text-xs text-zinc-600">
                &copy; 2025 Class Companion. All rights reserved.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
