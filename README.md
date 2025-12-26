# Class Companion - Sistem Absensi Digital 🚀

**Class Companion** solusi modern untuk manajemen kehadiran di lingkungan kampus. Aplikasi ini menggantikan metode absensi manual dengan sistem digital yang praktis, cepat, dan terverifikasi.

Dikembangkan dengan integrasi **Next.js (Frontend)** pada sisi pengguna dan **Laravel (Backend)** yang handal di sisi server, serta dilengkapi **Panel Admin Filament** interaktif untuk mempermudah Dosen dalam mengelola kelas.

---

## ✨ Fitur Utama

### 🎓 Aplikasi Mahasiswa (Frontend)

- **Dashboard Informatif**: Interface modern dengan dark mode yang nyaman digunakan.
- **Sistem Absensi Cerdas**:
  - 📍 **Verifikasi Lokasi**: Memastikan mahasiswa berada di area kampus menggunakan Geolocation (Geofencing - Radius Checking).
  - 📸 **Bukti Kehadiran**: Validasi identitas melalui unggah foto selfie realtime.
  - ⚡ **Real-time Status**: Status kehadiran diperbarui secara instan.
- **Dukungan Koneksi Lambat**: Sistem fallback cerdas yang memungkinkan absensi tetap berjalan meskipun layanan map mengalami gangguan.
- **Akses Materi**: Unduh materi perkuliahan (PDF/PPT) secara langsung melalui dashboard.

### 🛡️ Panel Dosen (Backend)

- **Manajemen Kelas (FilamentPHP)**: Dashboard intuitif untuk kebutuhan Dosen:
  - Membuka atau menutup sesi absensi dengan satu klik.
  - Memantau daftar hadir mahasiswa secara real-time.
  - Mengunduh rekapitulasi absensi dalam format Excel/CSV.
- **Sistem Antrian (Queue)**: Menangani proses berat di latar belakang.
- **Keamanan Data**:
  - Proteksi privasi data satu sama lain (IDOR Protection).
  - Perlindungan terhadap spam dan penyalahgunaan.
  - Validasi ketat untuk setiap data yang masuk.

---

## 🛠️ Teknologi (Tech Stack)

| Komponen        | Spesifikasi                                                       |
| :-------------- | :---------------------------------------------------------------- |
| **Frontend**    | **Next.js 15** (App Router), Tailwind CSS, Shadcn UI, React Query |
| **Backend**     | **Laravel 12**, PHP 8.2+, MySQL 8.0                               |
| **Admin Panel** | **FilamentPHP v3**                                                |
| **Autentikasi** | **Laravel Sanctum** (SPA Authentication)                          |
| **Peta**        | **Leaflet / OpenStreetMap**                                       |
| **Queue**       | **Database Driver**                                               |

---

## ⚡ Panduan Instalasi (Lokal)

### Persiapan Sistem

Pastikan perangkat Anda telah terinstal:

- Node.js 18 atau lebih baru
- PHP 8.2 atau lebih baru
- Composer
- MySQL Server

### 1. Download Source Code

```bash
git clone https://github.com/cryptzoa/Class-Companion.git
cd Class-Companion
```

### 2. Konfigurasi Backend (Laravel)

Masuk ke direktori backend, instal dependensi, dan jalankan server.

```bash
cd backend

# Instal dependensi PHP
composer install

# Konfigurasi Environment
cp .env.example .env
# PENTING: Ubah DB_DATABASE, DB_USERNAME, DB_PASSWORD di .env

# Generate Application Key
php artisan key:generate

# Migrasi Database & Data Awal
php artisan migrate:fresh --seed

# Konfigurasi Penyimpanan File
php artisan storage:link

# Jalankan Server
php artisan serve
# Server akan berjalan di http://localhost:8000
```

### 3. Konfigurasi Frontend (Next.js)

Buka terminal baru, masuk ke direktori frontend, dan jalankan aplikasi.

```bash
cd class-companion-fe

# Instal dependensi JavaScript
npm install

# Konfigurasi Environment
cp .env.example .env.local
# Pastikan URL API mengarah ke backend: NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Jalankan Server Development
npm run dev
# Server akan berjalan di http://localhost:3000
```

---

## � Struktur Database

Aplikasi ini menggunakan basis data relasional (MySQL) dengan skema berikut:

### 1. Users (`users`)

Menyimpan data pengguna (Dosen dan Mahasiswa).

- `id` (PK): Primary Key.
- `name`: Nama lengkap.
- `email`: Email (Unique).
- `nim`: Nomor Induk Mahasiswa / NIP (Unique).
- `role`: Peran pengguna (`dosen` atau `mahasiswa`).
- `is_active`: Status aktivasi akun (Verifikasi admin).

### 2. Attendance Sessions (`attendance_sessions`)

Sesi perkuliahan yang dibuat oleh Dosen.

- `id` (PK)
- `week_name`: Nama pertemuan (misal: "Pertemuan 1").
- `session_date`: Tanggal sesi.
- `attendance_open_at`: Waktu absensi dibuka (Timestamp).

### 3. Attendances (`attendances`)

Rekaman absensi mahasiswa.

- `user_id` (FK -> users)
- `attendance_session_id` (FK -> attendance_sessions)
- `selfie_path`: Lokasi file foto selfie.
- `latitude` & `longitude`: Koordinat lokasi saat absen.
- `address`: Alamat hasil Reverse Geocoding.
- `face_detected`: Validasi apakah wajah terdeteksi AI.
- `submitted_at`: Waktu submit.

---

## 🔌 Dokumentasi API

Backend menyediakan RESTful API yang aman untuk konsumsi Frontend.

### Authentication

| Method | Endpoint        | Deskripsi                        |
| :----- | :-------------- | :------------------------------- |
| `POST` | `/api/login`    | Masuk aplikasi & dapatkan Token. |
| `POST` | `/api/register` | Pendaftaran akun baru.           |
| `POST` | `/api/logout`   | Hapus sesi token.                |
| `GET`  | `/api/me`       | Ambil data profile user login.   |

### Attendance (Absensi)

| Method | Endpoint                    | Deskripsi                              |
| :----- | :-------------------------- | :------------------------------------- |
| `GET`  | `/api/sessions`             | List sesi perkuliahan aktif.           |
| `POST` | `/api/sessions/{id}/attend` | Submit absensi (Upload Foto + Lokasi). |
| `GET`  | `/api/my-attendances`       | History kehadiran user login.          |
| `GET`  | `/api/materials`            | List materi perkuliahan.               |

---

## 👨‍💻 Pengembang

- **Rayhan Soeangkupon Lubis**

_Made with passion for UAS Pemrograman Dasar 2_ ✨
