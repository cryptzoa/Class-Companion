"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  FileText,
  Link as LinkIcon,
  PlayCircle,
  Search,
  Filter,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { MaterialsResponse, Material } from "@/types/api";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";

export default function MaterialsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<
    "all" | "pdf" | "video" | "link"
  >("all");

  const { data: materials, isLoading } = useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      const { data } = await api.get<MaterialsResponse>("/materials");
      return data.data;
    },
  });

  // Filter Data
  const filteredMaterials = materials?.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.session_title &&
        item.session_title.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesType = true;
    if (selectedType === "link") {
      matchesType = !!item.link;
    } else if (selectedType !== "all") {
      matchesType = item.file_type === selectedType;
    }

    return matchesSearch && matchesType;
  });

  const getIcon = (type: string | undefined) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-6 h-6 text-red-400" />;
      case "ppt":
        return <FileText className="w-6 h-6 text-orange-400" />;
      case "video":
        return <PlayCircle className="w-6 h-6 text-blue-400" />;
      case "link":
        return <LinkIcon className="w-6 h-6 text-green-400" />;
      default:
        return <FileText className="w-6 h-6 text-indigo-400" />; // Covers PPT/Other
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 pb-20">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-violet-400">
              Course Materials
            </h1>
            <p className="text-zinc-400 mt-1">
              Access all your learning resources in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="max-w-5xl mx-auto sticky top-4 z-20 mb-8">
        <div className="glass-card p-2 rounded-2xl flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search materials..."
              className="w-full bg-zinc-900/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {["all", "pdf", "ppt", "link"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type as any)}
                className={`px-4 py-3 rounded-xl font-medium capitalize whitespace-nowrap transition-colors ${
                  selectedType === type
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : "bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          // Skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-zinc-900/50 rounded-2xl animate-pulse"
            />
          ))
        ) : filteredMaterials && filteredMaterials.length > 0 ? (
          filteredMaterials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-5 rounded-2xl hover:bg-white/5 transition-colors group relative flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-zinc-900 rounded-xl border border-white/5">
                    {getIcon(item.file_type)}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:bg-green-600 hover:border-green-500 transition-all"
                        title="Open Link"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </a>
                    )}
                    {item.file_url && (
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all"
                        title="Download File"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-lg leading-tight mb-1 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-500 mb-3">
                  {item.session_title?.replace(/Pertemuan/i, "Week") ||
                    "General Resources"}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-600 border-t border-white/5 pt-3 mt-4">
                <span>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : "Unknown Date"}
                </span>
                <span className="capitalize px-2 py-0.5 rounded bg-zinc-900 border border-white/5">
                  {item.file_type || "Unknown"}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-zinc-400 mb-2">
              No materials found
            </h3>
            <p className="text-zinc-600">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
