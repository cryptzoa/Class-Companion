"use client";

import { motion } from "framer-motion";
import { Clock, RefreshCcw } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WaitingPage() {
  const { user, isLoading } = useUser({ redirect: false });
  const router = useRouter();

  useEffect(() => {
    if (user && user.is_active) {
      router.push("/");
    }
  }, [user, router]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 p-6 text-center">
      {/* Background Pulse */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card max-w-md w-full p-10 rounded-3xl flex flex-col items-center relative z-10"
      >
        <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Clock className="w-10 h-10 text-orange-500" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Review in Progress</h1>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          Your account is currently being reviewed by the admin. You will be
          notified once your registration is approved.
        </p>

        <div className="w-full bg-zinc-900/50 p-4 rounded-xl border border-white/5 mb-6">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-2">
            Status
          </p>
          <div className="flex items-center justify-center gap-2 text-orange-400 font-medium bg-orange-400/10 py-2 rounded-lg">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            Pending Approval
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-colors"
        >
          <RefreshCcw className="w-4 h-4" /> Check Status
        </button>
      </motion.div>

      <p className="fixed bottom-8 text-xs text-zinc-600">
        Need help?{" "}
        <a href="#" className="underline hover:text-zinc-400">
          Contact Support
        </a>
      </p>
    </div>
  );
}
