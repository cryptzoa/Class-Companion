"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, BookOpen, Clock, MapPin } from "lucide-react";
import { Session } from "@/types/api";

interface SessionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | undefined;
}

export default function SessionDetailModal({
  isOpen,
  onClose,
  session,
}: SessionDetailModalProps) {
  if (!session) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden relative"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    {session.week_name}
                  </h2>
                  <p className="text-zinc-400 text-sm">Session Details</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Time & Status */}
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Date & Time</h3>
                    <p className="text-zinc-400 text-sm">
                      {new Date(session.session_date).toLocaleDateString(
                        "id-ID",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>

                {/* Material Section */}
                {session.material ? (
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Material</h3>
                      <p className="text-zinc-400 text-sm mb-2">
                        {session.material.title}
                      </p>
                      <a
                        href={
                          session.material.file_url || session.material.link
                        }
                        target="_blank"
                        className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors inline-block"
                      >
                        Open Material
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 opacity-50">
                    <div className="p-3 rounded-xl bg-zinc-800 text-zinc-500">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-500">
                        No Material
                      </h3>
                      <p className="text-zinc-600 text-sm">
                        This session has no content.
                      </p>
                    </div>
                  </div>
                )}

                {/* Room/Location - Mock if not in API yet */}
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-orange-500/20 text-orange-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Location</h3>
                    <p className="text-zinc-400 text-sm">
                      {session.room || "Hybrid / Online"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 pt-0">
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
