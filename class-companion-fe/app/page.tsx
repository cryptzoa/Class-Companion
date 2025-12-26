"use client";

import { useState } from "react";
import AttendanceDrawer from "@/components/attendance-drawer";
import SessionDetailModal from "@/components/session-detail-modal";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  LogOut,
  FileText,
  PlayCircle,
  LinkIcon,
  Download,
  CheckCircle2,
  Terminal,
  Code2,
  Cpu,
  Book,
  LogIn,
  User as UserIcon,
} from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  Session,
  SessionsResponse,
  MaterialsResponse,
  AttendancesResponse,
  User,
} from "@/types/api";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

// --- MOCK DATA FOR DEMO MODE ---
const MOCK_SESSIONS: Session[] = [
  {
    id: 1,
    week_name: "Week 1",
    session_date: new Date().toISOString(), // Today
    attendance_open: true,
    attendance_open_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    week_name: "Week 2",
    session_date: new Date(Date.now() + 86400000 * 7).toISOString(), // Next week
    attendance_open: false,
    attendance_open_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const MOCK_MATERIALS = [
  {
    id: 1,
    title: "Introduction to Algorithms.pdf",
    file_url: "#",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Data Structures 101.pptx",
    file_url: "#",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    title: "Lab Guide - Week 1.docx",
    file_url: "#",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const MOCK_ATTENDANCES = [
  {
    id: 1,
    session: {
      id: 1,
      week_name: "Week 1",
      date: new Date().toISOString(),
    },
    submitted_at: new Date().toISOString(),
    address: "Demo Location",
  },
];

export default function Dashboard() {
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Disable redirect for demo mode
  const { user, isLoading: isUserLoading } = useUser({ redirect: false });

  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      queryClient.clear();
      window.location.href = "/login";
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const isLoggedIn = !!user;

  // --- DATA FETCHING ---
  const { data: realSessions } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const { data } = await api.get<SessionsResponse>("/sessions");
      return data.data;
    },
    enabled: isLoggedIn, // Only fetch if logged in
  });

  const { data: realRecentMaterials } = useQuery({
    queryKey: ["recentMaterials"],
    queryFn: async () => {
      const { data } = await api.get<MaterialsResponse>("/materials");
      return data.data.slice(0, 4);
    },
    enabled: isLoggedIn,
  });

  const { data: realMyAttendances, isLoading: isLoadingAttendances } = useQuery(
    {
      queryKey: ["myAttendances"],
      queryFn: async () => {
        const { data } = await api.get<AttendancesResponse>("/my-attendances");
        return data.data;
      },
      enabled: isLoggedIn,
    }
  );

  // --- MERGE DATA LOGIC ---
  // Use MOCK data if not logged in, otherwise use REAL data
  const rawSessions = isLoggedIn ? realSessions : MOCK_SESSIONS;
  const rawMaterials = isLoggedIn ? realRecentMaterials : MOCK_MATERIALS;
  const rawAttendances = isLoggedIn ? realMyAttendances : isLoggedIn ? [] : []; // Guests don't show "checked in" initially to encourage them to try interaction or shows "demo checked in"

  // Process Sessions
  const sessions = (rawSessions || []).map((session) => {
    const weekNum = parseInt(session.week_name.replace(/\D/g, "") || "0");
    return {
      ...session,
      title: `Week ${weekNum}`, // Force English title
      start_time: session.session_date,
      end_time: "23:59",
      room: "Online/Hybrid",
      is_open_for_attendance: session.attendance_open === true,
      week_number: weekNum,
      status: session.attendance_open ? "ongoing" : "upcoming",
    } as Session & {
      title: string;
      start_time: string;
      end_time: string;
      room: string;
      is_open_for_attendance: boolean;
      week_number: number;
      status: string;
    };
  });

  const attendancesList = Array.isArray(rawAttendances) ? rawAttendances : [];

  // --- LOGIC ---
  const activeSession = sessions.find((s) => s.is_open_for_attendance === true);

  // For demo: if guest, simulate not attended yet to show the button
  const hasAttended = isLoggedIn
    ? attendancesList.some(
        (a) => activeSession && a.session.id === activeSession.id
      )
    : false;

  // Find next upcoming session
  const upcomingSession = sessions.find(
    (s) =>
      !s.is_open_for_attendance &&
      new Date(s.session_date) >= new Date(new Date().setHours(0, 0, 0, 0))
  );

  // Stats
  const pastSessionsCount =
    sessions.filter((s) => new Date(s.session_date) <= new Date()).length || 1;
  const attendedCount = attendancesList.length || 0;

  // Fake stats for demo if guest
  const displayPastSessions = isLoggedIn ? pastSessionsCount : 5;
  const displayAttended = isLoggedIn ? attendedCount : 4;

  const rawRate = (displayAttended / (displayPastSessions || 1)) * 100;
  const attendanceRate = Math.min(Math.round(rawRate), 100);

  // Semester Progress
  const currentWeek =
    activeSession?.week_number || upcomingSession?.week_number || 1;
  const totalWeeks = 14;
  const progressPercent = Math.min((currentWeek / totalWeeks) * 100, 100);

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Action Handlers for Demo
  const handleMarkAttendanceCheck = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setIsAttendanceOpen(true);
  };

  const handleViewDetails = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setIsDetailOpen(true);
  };

  // Prevent flash of demo content while checking auth
  if (isUserLoading) {
    return (
      <main className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-zinc-500 font-mono text-sm animate-pulse">
            Loading Dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500/30">
      {/* Decorative Background: Coding Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      {/* DEMO BANNER */}
      {!isLoggedIn && !isUserLoading && (
        <div className="bg-indigo-600/20 border-b border-indigo-500/30 text-indigo-300 px-4 py-2 text-center text-sm font-medium">
          Note: You are viewing a{" "}
          <span className="text-white font-bold">Demo Dashboard</span>. Log in
          to access your real account.
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6 md:p-8 relative z-10">
        {/* HEADER: Subject Identity */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-indigo-500/20 rounded border border-indigo-500/30">
                <Code2 className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-xs font-mono text-indigo-400 tracking-wider uppercase">
                Class Companion v2.1.0
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
              Basic Programming
            </h1>
            <p className="text-zinc-400">
              {isLoggedIn ? (
                <>
                  Welcome back,{" "}
                  <span className="text-white font-medium">{user?.name}</span>.
                  Ready to code today?
                </>
              ) : (
                <>
                  Welcome, <span className="text-white font-medium">Guest</span>
                  . View class schedules and materials.
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-xs text-zinc-500 font-mono">TODAY</p>
              <p
                className="text-sm font-medium text-zinc-300"
                suppressHydrationWarning
              >
                {todayDate}
              </p>
            </div>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all group font-medium text-sm"
              >
                <LogOut className="w-4 h-4 text-zinc-400 group-hover:text-red-400" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all shadow-lg shadow-indigo-500/10"
              >
                <LogIn className="w-4 h-4" />
                <span>
                  Login <span className="hidden sm:inline">to Access</span>
                </span>
              </button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: Main Status (Hero) */}
          <div className="lg:col-span-2 space-y-6">
            {/* ACTIVE SESSION CARD */}
            {activeSession ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-linear-to-br from-indigo-900/50 to-zinc-900 border border-indigo-500/30 p-1 overflow-hidden relative"
              >
                <div className="bg-[#0c0c0e] rounded-[22px] p-6 h-full relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-green-500" />{" "}
                      Live Session
                    </span>
                    <span className="text-zinc-500 text-sm">|</span>
                    <span className="text-zinc-400 text-sm font-mono">
                      Week {activeSession.week_number}
                    </span>
                  </div>

                  <h2 className="text-3xl font-bold text-white mb-2">
                    {activeSession.title}
                  </h2>
                  <p className="text-zinc-400 mb-8 max-w-lg">
                    Session is currently active. Ensure you check in before the
                    time runs out.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {isLoadingAttendances && isLoggedIn ? (
                      <div className="py-4 text-center rounded-xl bg-zinc-800/50 text-zinc-500 font-mono text-sm">
                        Loading attendance...
                      </div>
                    ) : hasAttended ? (
                      <div className="py-4 px-6 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 text-green-400 font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Checked In</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleMarkAttendanceCheck}
                        className="py-4 px-6 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                      >
                        {isLoggedIn ? "Mark Attendance" : "Login to Attend"}{" "}
                        <Terminal className="w-4 h-4 ml-1" />
                      </button>
                    )}

                    <button
                      onClick={handleViewDetails}
                      className="py-4 px-6 rounded-xl bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-colors border border-white/5"
                    >
                      Session Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* EMPTY STATE: "Next Class" Focus */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-zinc-900/50 border border-white/5 p-8 relative overflow-hidden min-h-[300px] flex flex-col justify-between group"
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-20 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-700" />
                <Cpu className="absolute bottom-8 right-8 w-24 h-24 text-white/5 rotate-12" />

                <div>
                  <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-widest mb-4">
                    <span className="w-2 h-2 bg-indigo-500 rounded-sm" /> Next
                    on Schedule
                  </div>

                  {upcomingSession ? (
                    <>
                      <h2 className="text-3xl font-bold text-white mb-2 max-w-md leading-tight">
                        {upcomingSession.title}
                      </h2>
                      <div className="flex items-center gap-4 text-zinc-400 mt-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5">
                          <Calendar className="w-4 h-4 text-zinc-500" />
                          <span className="text-sm">
                            {new Date(
                              upcomingSession.start_time || Date.now()
                            ).toLocaleDateString("id-ID", {
                              weekday: "long",
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        No Upcoming Classes
                      </h2>
                      <p className="text-zinc-500 mt-2">
                        You have completed all scheduled sessions.
                      </p>
                    </div>
                  )}
                </div>

                {/* Progress Bar (Decorative) */}
                <div className="mt-8">
                  <div className="flex justify-between text-xs font-mono text-zinc-500 mb-2">
                    <span>SEMESTER PROGRESS</span>
                    <span>
                      WEEK {currentWeek} / {totalWeeks}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* MATERIALS SECTION (Compact List) */}
            <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="flex items-center gap-2 font-bold text-zinc-200">
                  <Book className="w-5 h-5 text-zinc-500" />
                  Recent Resources
                </h3>
                <button
                  onClick={() =>
                    router.push(isLoggedIn ? "/materials" : "/login")
                  }
                  className="text-xs font-mono text-indigo-400 hover:text-indigo-300"
                >
                  VIEW_ALL_FILES()
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rawMaterials && rawMaterials.length > 0 ? (
                  rawMaterials.map((item) => (
                    <a
                      key={item.id}
                      href={isLoggedIn ? item.file_url : "/login"}
                      target={isLoggedIn ? "_blank" : "_self"}
                      className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-white/5 hover:border-indigo-500/30 hover:bg-zinc-800 transition-all group"
                    >
                      <div className="p-2 bg-black rounded-lg text-zinc-500 group-hover:text-indigo-400 transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-zinc-200 truncate group-hover:text-white transition-colors">
                          {item.title}
                        </p>
                        <p className="text-xs text-zinc-500 truncate font-mono">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString(
                                "id-ID"
                              )
                            : "Unknown Date"}
                        </p>
                      </div>
                      {!isLoggedIn && (
                        <div className="ml-auto">
                          <LogIn className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400" />
                        </div>
                      )}
                    </a>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-zinc-500 text-sm">
                    No resources uploaded yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Stats & Info */}
          <div className="space-y-6">
            {/* ATTENDANCE CARD */}
            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl">
              <h3 className="text-sm font-medium text-zinc-400 mb-6 uppercase tracking-wider font-mono">
                {isLoggedIn ? "Attendance Rate" : "Target Attendance"}
              </h3>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-4xl font-bold text-white block mb-1">
                    {isNaN(attendanceRate) ? 0 : attendanceRate}%
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded border ${
                      attendanceRate >= 80
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : attendanceRate >= 50
                        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}
                  >
                    {attendanceRate >= 80
                      ? "EXCELLENT"
                      : attendanceRate >= 50
                      ? "AVERAGE"
                      : "LOW"}
                  </span>
                </div>

                {/* Mini Circular Chart */}
                <div className="relative w-16 h-16">
                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#27272a"
                      strokeWidth="12"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={attendanceRate >= 80 ? "#22c55e" : "#eab308"}
                      strokeWidth="12"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * attendanceRate) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Total Sessions</span>
                  <span className="text-white font-mono">
                    {displayPastSessions}
                  </span>
                </div>
                {!isLoggedIn && (
                  <div className="text-xs text-center pt-2 text-zinc-500 italic">
                    *Sample data for demo
                  </div>
                )}
                {isLoggedIn && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Present</span>
                      <span className="text-white font-mono">
                        {displayAttended}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Missed</span>
                      <span className="text-red-400 font-mono">
                        {displayPastSessions - displayAttended}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* INFO CARD */}
            <div className="bg-linear-to-b from-indigo-900/20 to-zinc-900/50 border border-indigo-500/20 p-6 rounded-3xl relative overflow-hidden">
              <Terminal className="w-20 h-20 text-indigo-500/10 absolute -bottom-4 -right-4 rotate-12" />
              <h3 className="text-sm font-medium text-indigo-300 mb-2 font-mono">
                COURSE INFO
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed relative z-10">
                Stay consistent with your practice. Remember to check materials
                before every class.
              </p>
            </div>

            {/* LOGIN TEASER (Only for guests) */}
            {!isLoggedIn && (
              <div className="bg-zinc-800/50 border border-white/5 p-6 rounded-3xl text-center">
                <UserIcon className="w-10 h-10 text-white mx-auto mb-3" />
                <h3 className="text-white font-bold mb-2">Student Portal</h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Log in to access your real-time attendance, grades, and
                  exclusive learning materials.
                </p>
                <button
                  onClick={handleLogin}
                  className="w-full py-2.5 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors"
                >
                  Log In Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {isLoggedIn && (
        <AttendanceDrawer
          isOpen={isAttendanceOpen}
          onClose={() => setIsAttendanceOpen(false)}
          session={activeSession}
        />
      )}
      <SessionDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        session={activeSession}
      />
    </main>
  );
}
