"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";
import { clsx } from "clsx";
import api from "@/lib/axios";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/forgot-password", { email });
      setSuccess(
        "Reset link sent! Please check your email inbox (or log file)."
      );
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || "Failed to send reset link.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-2 relative z-10">
        {/* Left Side: Hero */}
        <div className="hidden lg:flex flex-col justify-center items-center p-12 relative">
          <div className="absolute inset-0 bg-zinc-900/30 backdrop-blur-3xl" />
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-lg text-center"
          >
            <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-tr from-sky-500 to-blue-500 shadow-2xl shadow-sky-500/20">
              <KeyRound className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Forgot Password?</h1>
            <p className="text-zinc-400 text-lg leading-relaxed">
              No worries! Just enter your email and we'll send you a link to
              reset your password.
            </p>
          </motion.div>
        </div>

        {/* Right Side: Form */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12 lg:bg-zinc-900/20 lg:backdrop-blur-sm border-l border-white/5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md space-y-8"
          >
            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </button>

            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold">Reset Password</h2>
              <p className="text-zinc-400 mt-2">
                Enter your registered email address
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 transition-colors group-focus-within:text-sky-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 text-white placeholder:text-zinc-600 transition-all font-medium"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-green-400 text-sm text-center bg-green-500/10 py-3 rounded-xl border border-green-500/20">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={clsx(
                  "w-full py-4 rounded-xl font-bold shadow-xl shadow-sky-500/20 transition-all relative overflow-hidden group",
                  "bg-white text-black hover:bg-zinc-200",
                  "disabled:opacity-70 disabled:cursor-not-allowed"
                )}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? "Sending Link..." : "Send Reset Link"}
                </span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
