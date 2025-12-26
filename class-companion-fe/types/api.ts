export interface User {
  id: number;
  name: string;
  email?: string;
  nim: string;
  role: "mahasiswa" | "dosen" | "admin";
  status?: "active" | "inactive" | "pending";
  is_active?: boolean;
}

export interface Material {
  id: number;
  title: string;
  description?: string;
  file_url?: string;
  link?: string;
  // Helper for frontend logic
  file_type?: "pdf" | "video" | "link" | "other";
  session_title?: string;
  created_at?: string; // Add created_at for sorting
}

export interface Session {
  id: number;
  week_name: string; // "Pertemuan 1"
  session_date: string; // "2023-12-25"
  material?: Material;
  attendance_open: boolean;
  attendance_open_at?: string | null;
  remaining_minutes?: number;
  created_at?: string;
  updated_at?: string;

  // Legacy/UI fields (optional or mapped)
  title?: string;
  start_time?: string;
  end_time?: string;
  room?: string;
  is_open_for_attendance?: boolean; // mapped from attendance_open
  week_number?: number; // mapped from week_name
  status?: "upcoming" | "ongoing" | "finished";
}

export interface Attendance {
  id: number;
  session: {
    id: number;
    week_name: string;
    date: string;
  };
  submitted_at: string;
  address: string;
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface LoginData {
  token: string;
  user: User;
}

export type LoginResponse = ApiResponse<LoginData>;
export type SessionsResponse = ApiResponse<Session[]>;
export type MaterialsResponse = ApiResponse<Material[]>;
export type AttendancesResponse = ApiResponse<Attendance[]>;
