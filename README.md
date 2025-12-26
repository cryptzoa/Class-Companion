# Class Companion - Sistem Absensi Digital 🚀

**Class Companion** solusi modern untuk manajemen kehadiran di lingkungan kampus. Aplikasi ini menggantikan metode absensi manual dengan sistem digital yang praktis, cepat, dan terverifikasi.

Dikembangkan dengan integrasi **Next.js** pada sisi pengguna dan **Laravel** yang handal di sisi server, serta dilengkapi Panel Admin interaktif untuk mempermudah Dosen dalam mengelola kelas.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Class+Companion+Dashboard+Preview)

---

## ✨ Fitur Utama

### 🎓 Aplikasi Mahasiswa (Frontend)

- **Dashboard Informatif**: Interface modern dengan dark mode yang nyaman digunakan.
- **Sistem Absensi Cerdas**:
  - 📍 **Verifikasi Lokasi**: Memastikan mahasiswa berada di area kampus menggunakan Geolocation (Geofencing).
  - 📸 **Bukti Kehadiran**: Validasi identitas melalui unggah foto selfie.
  - ⚡ **Real-time Status**: Status kehadiran diperbarui secara instan tanpa perlu memuat ulang halaman.
- **Dukungan Koneksi Lambat**: Sistem fallback cerdas yang memungkinkan absensi tetap berjalan meskipun layanan map mengalami gangguan.
- **Akses Materi**: Unduh materi perkuliahan secara langsung melalui dashboard.

### 🛡️ Panel Dosen (Backend)

- **Manajemen Kelas (Filament)**: Dashboard intuitif untuk kebutuhan Dosen:
  - Membuka atau menutup sesi absensi dengan satu klik.
  - Memantau daftar hadir mahasiswa secara real-time.
  - Mengunduh rekapitulasi absensi dalam format Excel/CSV.
- **Sistem Antrian (Queue)**: Menangani proses berat seperti validasi alamat di latar belakang untuk menjaga performa aplikasi tetap cepat.
- **Keamanan Data**:
  - Proteksi privasi data satu sama lain (IDOR Protection).
  - Perlindungan terhadap spam dan penyalahgunaan.
  - Validasi ketat untuk setiap data yang masuk.

---

## 🛠️ Teknologi (Tech Stack)

| Komponen        | Spesifikasi                                                         |
| :-------------- | :------------------------------------------------------------------ |
| **Frontend**    | **Next.js 15** (App Router), Tailwind CSS, Shadcn UI, React Query   |
| **Backend**     | **Laravel 11**, PHP 8.2+, MySQL 8.0                                 |
| **Admin Panel** | **FilamentPHP v3**                                                  |
| **Utilitas**    | `guzzlehttp` (API Client), `intervention/image` (Manipulasi Gambar) |

---

## ⚡ Panduan Instalasi

### Persiapan Sistem

Pastikan perangkat Anda telah terinstal:

- Node.js 18 atau lebih baru
- PHP 8.2 atau lebih baru
- Composer
- MySQL Server

### 1. Download Source Code

```bash
git clone https://github.com/ray/class-companion.git
cd class-companion
```

### 2. Konfigurasi Backend (Laravel)

Masuk ke direktori backend, instal dependensi, dan jalankan server.

```bash
cd backend

# Instal dependensi PHP
composer install

# Konfigurasi Environment
cp .env.example .env
# PENTING: Sesuaikan konfigurasi database (DB_DATABASE, dll) pada file .env

# Generate Application Key
php artisan key:generate

# Migrasi Database & Data Awal
php artisan migrate:fresh --seed

# Konfigurasi Penyimpanan File
php artisan storage:link

# Jalankan Server
php artisan serve

# (Opsional) Jalankan Worker Antrian
php artisan queue:work
```

> **Akun Demo Dosen**:
>
> - **Username**: `admin`
> - **Password**: `password`

### 3. Konfigurasi Frontend (Next.js)

Buka terminal baru, masuk ke direktori frontend, dan jalankan aplikasi.

```bash
cd frontend

# Instal dependensi JavaScript
npm install

# Konfigurasi Environment
cp .env.example .env.local
# Pastikan URL API mengarah ke backend: NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Jalankan Server Development
npm run dev
```

Akses aplikasi melalui browser:

- **Aplikasi Mahasiswa**: `http://localhost:3000`
- **Panel Admin**: `http://localhost:8000/admin`

---

## 🧪 Pengujian Sistem

Proyek ini telah melalui serangkaian automated testing untuk memastikan standar kualitas dan keamanan.

```bash
cd backend

# Jalankan seluruh rangkaian tes (Unit & Feature)
php artisan test

# Jalankan tes keamanan spesifik
php artisan test tests/Feature/SecurityTest.php
```

**Cakupan Pengujian:**

- ✅ Resistance terhadap serangan SQL Injection.
- ✅ Privasi Data (Mencegah akses data tanpa izin).
- ✅ Validasi File (Mencegah upload file berbahaya).
- ✅ Keamanan Autentikasi dan Otorisasi.

---

## 📂 Struktur Direktori

```
class-companion/
├── backend/                  # Sistem Backend (Laravel API & Admin)
│   ├── app/Filament/         # Modul Panel Admin
│   ├── app/Services/         # Logika Bisnis (misal: Geocoding)
│   └── ...
├── frontend/                 # Antarmuka Pengguna (Next.js)
│   ├── app/                  # Halaman Aplikasi
│   ├── components/           # Komponen UI
│   └── ...
└── README.md                 # Dokumentasi Proyek
```

---

## 👨‍💻 Pengembang

- **Rayhan Soeangkupon Lubis**

_Made by Ray with passion for UAS Pemrograman Dasar 2_ ✨
