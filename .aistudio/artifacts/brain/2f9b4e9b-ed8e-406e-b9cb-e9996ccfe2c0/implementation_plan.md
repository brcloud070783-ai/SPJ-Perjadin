# Rencana Penghapusan Duplikasi Menu & Penerapan 1 Tombol Utama di Beranda

## Masalah yang Diidentifikasi
Pada halaman beranda saat ini terdapat redundansi menu yang membingungkan:
1. **Di bagian tengah**: Terdapat 3 kartu menu terpisah (`Buat SPJ`, `Foto GPS`, `Nota SPJ`).
2. **Di bagian bawah**: Terdapat bilah navigasi (*Bottom Tab Bar*) dengan item yang sama persis (`Kuitansi`, `Foto GPS`, `Nota SPJ`).

Hal ini menyebabkan fungsi tombol saling tumpang tindih dan membuat antarmuka terasa tidak efisien.

---

## Solusi & Arahan Pengguna
Sesuai instruksi pengguna: **Halaman Beranda hanya akan memiliki 1 tombol menu utama di bagian tengah: "Buat SPJ"**.

---

## Rencana Perubahan Detail

### 1. Pembaruan Halaman Beranda (`src/components/LandingPage.tsx`)
- **Menghapus**: Blok 3 kartu tengah yang menduplikasi bilah navigasi bawah (`Buat SPJ`, `Foto GPS`, `Nota SPJ`).
- **Menerapkan 1 Tombol Utama Tunggal di Tengah**:
  - Kartu tombol aksi tunggal berukuran proporsional dan elegan dengan desain Parcelly modern.
  - Ikon kuitansi/plus dengan teks jelas: **"Buat SPJ"** (atau *"Buat SPJ Baru"*).
  - Keterangan ringkas: *"Mulai susun Kuitansi, lanjut stempel Foto GPS, dan lampiran Nota"* (alur 3 tahap terintegrasi).
  - Ketika diklik, langsung mengarahkan pengguna ke **Tahap 1: Formulir Kuitansi**.
- **Mengharmonisasikan Bagian Lain**:
  - Kartu *Hero Status SPJ Aktif* di bagian atas tetap menampilkan nomor SPD, tanggal, dan indikator progres.
  - Bagian bawah menampilkan ringkasan berkas dinas berjalan secara tenang tanpa tombol duplikat.

### 2. Memastikan Peran Bottom Tab Bar (`src/components/BottomNav.tsx`)
- *Floating Tab Bar* di bagian bawah berfungsi sebagai navigasi global antar modul (`Beranda`, `Kuitansi`, `Foto GPS`, `Nota SPJ`, `Berkas`).
- Dengan hanya 1 tombol utama "Buat SPJ" di beranda, peran masing-masing elemen menjadi sangat jelas:
  - **Tombol Tengah Beranda**: Memulai alur pengerjaan SPJ dari awal secara bertahap.
  - **Bottom Tab Bar**: Berpindah cepat antar halaman saat berkas sedang diedit atau dicek.

---

## Rencana Verifikasi
1. **Pengecekan Tampilan**: Memastikan tidak ada lagi 3 kartu terpisah di tengah layar beranda.
2. **Pengecekan Fungsi**: Memastikan tombol tunggal "Buat SPJ" langsung membuka formulir Kuitansi dan memulai alur wizard.
3. **Pengecekan Teknis**: Menjalankan `compile_applet` dan `lint_applet` untuk memastikan tidak ada kesalahan kode atau *type error*.
