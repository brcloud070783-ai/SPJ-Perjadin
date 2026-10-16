# Rencana Desain Tab Bar & Alur Wizard Pengerjaan SPJ Bertahap

## Ringkasan Proyek
Mengimplementasikan desain **Tab Bar modern**, menyederhanakan **Halaman Utama (Beranda)** agar terfokus pada tombol aksi utama **"Buat SPJ Baru"**, serta mengintegrasikan **Alur Wizard Bertahap** otomatis dari pembuatan Kuitansi, berlanjut ke Foto Dokumentasi Kegiatan (GPS), lalu ke Lampiran Nota/Bukti Bayar, hingga siap cetak Paket SPJ.

---

## 1. Konsep & Keputusan Desain (Berdasarkan Jawaban Pengguna)
- **Tombol Utama Beranda**: **"Buat SPJ Baru"** (didesain sebagai hero action card yang elegan, berwibawa, dan menonjol di tengah halaman utama tanpa distraksi tombol berulang).
- **Gaya Tab Bar**: Modern Floating Pill Bar (bar navigasi mengambang dengan sudut melengkung halus, efek glassmorphism, dan penanda langkah aktif).
- **Alur Pengerjaan (Guided Step-by-Step Wizard)**:
  1. **Langkah 1: Kuitansi & SPPD** (Pengisian data dinas, pelaksana, rincian biaya). Di bagian bawah formulir terdapat tombol aksi jelas: **"Lanjut ke Foto Dokumentasi GPS →"**.
  2. **Langkah 2: Foto Dokumentasi GPS Kegiatan** (Pengambilan/unggah foto stempel waktu & lokasi GPS). Di bagian bawah terdapat navigasi: **"← Kembali ke Kuitansi"** dan **"Lanjut ke Nota & Bukti Bayar →"**.
  3. **Langkah 3: Nota & Bukti Pembayaran** (Unggah struk/nota hotel, tiket, dan transport riil). Di bagian bawah terdapat navigasi: **"← Kembali ke Foto GPS"** dan **"Selesai & Pratinjau Paket SPJ →"**.
  4. **Tahap Final: Pratinjau & Cetak Paket SPJ** (Semua dokumen tersusun rapi dalam format A4 siap cetak).

---

## 2. Rincian Perubahan File

### A. Halaman Beranda (`src/components/LandingPage.tsx`)
- Menyederhanakan tampilan beranda menjadi sangat bersih, elegan, dan fokus.
- Menghadirkan kartu aksi utama berukuran proporsional: **"Buat SPJ Baru"** dengan deskripsi alur 3 langkah mudah.
- Menampilkan ringkasan berkas SPJ yang sedang aktif secara tenang tanpa banyak tombol membingungkan.

### B. Tab Bar Navigasi Bawah (`src/components/BottomNav.tsx`)
- Mendesain ulang Tab Bar menjadi model **Floating Pill Bar**:
  - Tepi melengkung halus (`rounded-2xl` / `rounded-full`).
  - Efek bayangan halus dan kaca buram (*glassmorphism*).
  - Indikator nomor langkah (1: Kuitansi, 2: Foto GPS, 3: Nota Bayar) sehingga pengguna selalu tahu posisi pengerjaan saat ini.

### C. Alur Wizard di Formulir Kuitansi (`src/components/KuitansiForm.tsx`)
- Menambahkan bilah aksi navigasi di bagian bawah formulir kuitansi:
  - Tombol **"Pratinjau Kuitansi A4"**.
  - Tombol aksi utama **"Simpan & Lanjut ke Foto GPS →"** yang langsung mengarahkan ke tab Dokumentasi Foto.

### D. Alur Wizard di Formulir Foto Dokumentasi (`src/components/DokumentasiForm.tsx`)
- Menambahkan bilah aksi navigasi wizard di bagian bawah:
  - Tombol **"← Kembali ke Kuitansi"**.
  - Tombol aksi utama **"Lanjut ke Nota / Bukti Bayar →"**.

### E. Alur Wizard di Formulir Bukti Bayar (`src/components/BuktiBayarForm.tsx`)
- Menambahkan bilah aksi navigasi penyelesaian di bagian bawah:
  - Tombol **"← Kembali ke Foto GPS"**.
  - Tombol aksi utama **"Selesai & Buka Paket Cetak SPJ →"** (langsung membuka pratinjau Paket Lengkap 1-Kesatuan A4).

### F. Pengatur Alur di `src/App.tsx`
- Menghubungkan fungsi perpindahan antar tahap wizard secara mulus agar transisi terasa alami dan terarah.

---

## 3. Rencana Pengujian & Verifikasi
1. **Verifikasi Tampilan Beranda**: Memastikan halaman utama tampil sangat bersih dengan fokus utama pada tombol "Buat SPJ Baru".
2. **Verifikasi Tab Bar**: Memastikan desain tab bar mengambang (*floating*) tampil proporsional di layar HP maupun desktop.
3. **Verifikasi Alur Wizard**: Menguji alur dari klik tombol "Buat SPJ Baru" -> pengisian kuitansi -> klik lanjut -> input foto GPS -> klik lanjut -> input nota bukti -> klik selesai -> cetak paket SPJ.
4. **Verifikasi Teknis**: Menjalankan `compile_applet` dan `lint_applet` untuk memastikan tidak ada error TypeScript maupun styling.
