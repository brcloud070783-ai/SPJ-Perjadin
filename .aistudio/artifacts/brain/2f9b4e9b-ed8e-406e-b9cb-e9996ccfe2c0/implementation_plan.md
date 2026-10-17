# Transformasi Antarmuka SPJ Kaltara Menjadi Format LinkedIn 3-Kolom

Mengubah pengalaman visual dan navigasi sistem SPJ Perjalanan Dinas Pemprov Kalimantan Utara menjadi antarmuka profesional bergaya LinkedIn dengan tata letak 3-kolom yang intuitif, bilah navigasi atas (topbar) dengan ikonografi vertikal dan pencarian terintegrasi, kartu profil ASN, serta kartu ringkasan kepatuhan dokumen.

### User Review & Critical Decisions

> [!IMPORTANT]
> Berdasarkan konfirmasi yang telah Anda berikan, implementasi akan difokuskan pada:
> 1. **Tata Letak 3-Kolom**: Kolom kiri (profil ASN & pintasan proyek), kolom tengah (komposer aksi cepat & workspace dokumen), dan kolom kanan (panduan SBM Kaltara & audit kelengkapan berkas).
> 2. **Topbar Navigasi LinkedIn**: Header dengan logo sistem SPJ, kotak pencarian berkas universal, dan item menu navigasi vertikal (ikon di atas label teks).
> 3. **Harmonisasi Palet**: Memadukan latar netral khas LinkedIn (`#F3F2EF`) dengan warna biru kobalt kustom (`#0000B3`) dan aksen biru muda/cyan untuk tombol aksi, status aktif, dan sorotan.

- **Keputusan Terkonfirmasi**: Struktur 3-kolom desktop dengan respon responsif tablet/mobile, topbar LinkedIn terpadu, dan palet `#0000B3` di atas latar netral `#F3F2EF`.
- **Rekomendasi State**: Seluruh data form yang sudah diinput dan fitur eksisting (kuitansi, SPD, riil, dokumentasi foto/geotagging, cetak PDF, live sync) tetap utuh 100% tanpa ada kehilangan data atau fungsi.

---

### 1. Overview & Core Concept

- **Fungsi Utama**: Menyajikan ruang kerja penyusunan SPJ dinas terpadu yang terasa seperti platform profesional LinkedIn, memudahkan ASN berpindah antar modul dokumen, memantau batas standar biaya masukan (SBM), dan memeriksa status kelengkapan berkas secara langsung.
- **Target Pengguna**: ASN dan pejabat verifikator di lingkungan Pemerintah Provinsi Kalimantan Utara (Biro Administrasi Pimpinan Setda Kaltara).
- **Nilai Tambah**: Memecah kepadatan formulir SPJ ke dalam kartu-kartu terorganisir, mengurangi rasa lelah administratif, dan memperjelas progres pengerjaan SPJ melalui tata letak kolom yang ergonomis.

---

### 2. User Experience & Visual Design

#### Alur Pengguna (User Flow)
1. **Pendaratan & Topbar LinkedIn**: Pengguna disambut oleh bilah navigasi atas dengan logo SPJ Kaltara, pencarian berkas cepat, dan tab navigasi (Beranda, Kuitansi, SPD, Riil, Dokumentasi, Paket Lengkap, Profil).
2. **Kolom Kiri (Profil & Pintasan ASN)**:
   - Kartu identitas ASN pelaksana (Avatar, Nama, NIP, Pangkat/Golongan, Unit Kerja).
   - Indikator ringkasan SPJ (Total anggaran berjalan, jumlah berkas tersimpan).
   - Akses cepat ke Standar Biaya Masukan Kaltara 2025 dan daftar proyek dinas.
3. **Kolom Tengah (Workspace & Composer)**:
   - *Quick Composer Card*: Bar aksi cepat "Mulai Buat Berkas" (Kuitansi, SPD, Riil, Foto Dokumentasi) ala kotak post LinkedIn.
   - *Active Document Card*: Formulir interaktif dari dokumen yang sedang dikerjakan dengan tab tahapan wizard, tabel rincian biaya, dan kalkulator otomatis.
   - *Linimasa / Riwayat Dokumen*: Riwayat perubahan dan status verifikasi berkas dinas.
4. **Kolom Kanan (Audit Kepatuhan & Ekspor)**:
   - *Checklist Kelengkapan SPJ*: Indikator kepatuhan kelengkapan berkas (Kuitansi ✓, SPD ✓, Tiket/Hotel ✓, Dokumentasi Kegiatan ✓).
   - *Kamus Plafon SBM 2025*: Referensi cepat uang harian (Rp 430.000), taksi lokal, dan penginapan sesuai daerah tujuan.
   - *Aksi Cetak Instan*: Tombol ekspor satu klik untuk Paket Lengkap SPJ dan format Excel/PDF.

#### Identitas Visual & Tema
- **Aesthetic Direction**: Antarmuka SaaS B2B bergaya LinkedIn—bersih, kontras nyaman, terstruktur dalam kartu bertepi halus (radius 10px–12px), garis pembatas 1px halus, dan visual bebas distraksi.
- **Palet Warna**:
  - Background Utama: `#F3F2EF` (LinkedIn canvas warm-cool neutral).
  - Background Kartu: `#FFFFFF` dengan batas `border-slate-200/80` dan bayangan lembut `shadow-sm`.
  - Aksen Primer: `#0000B3` (Cobalt Blue pilihan Anda untuk tombol utama, tab aktif, dan ikon sorotan).
  - Teks: Slate gelap `#191919` untuk judul/isi utama dan `#64748B` untuk metadata pendukung.
- **Tipografi**:
  - Teks antarmuka: Plus Jakarta Sans / Sans modern untuk legibilitas optimal.
  - Nominal & angka finansial: `font-mono tabular-nums` untuk perataan vertikal nilai rupiah yang presisi.

---

### 3. Key Product Decisions & Trade-Offs

- **Keputusan 1: Desain Kolom Adaptif (Responsive 3-Column)**
  - *Pendekatan*: Pada layar lebar ($\ge 1200\text{px}$), tampil 3 kolom penuh (260px | flex-1 | 300px). Pada tablet ($\ge 768\text{px}$), kolom kanan bergeser menjadi panel expander atau di bawah workspace. Pada mobile ($< 768\text{px}$), kolom profil diminimalkan menjadi header ringkas dan navigasi beralih ke mobile bottom-bar LinkedIn.
  - *Alasan*: Menjamin kenyamanan penggunaan baik saat input data di komputer kantor maupun saat cek cepat melalui smartphone di perjalanan dinas.
- **Keputusan 2: Penyatuan Kontrol ke LinkedIn Topbar**
  - *Pendekatan*: Memindahkan tombol-tombol navigasi halaman ke dalam LinkedIn-style topbar dengan status aktif yang jelas, kotak pencarian berkas langsung, dan dropdown profil pengguna.
  - *Alasan*: Konsisten dengan standar interaksi LinkedIn dan menghemat ruang vertikal layar.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LinkedIn-Style Topbar                           │
│  [Logo SPJ]  [🔍 Cari berkas SPJ...]   [Tab Icons: Beranda|Kuitansi|SPD|Riil|Foto|Cetak]  [Profil] │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      3-Column Workspace Canvas                         │
│  ┌──────────────────┐  ┌───────────────────────────┐  ┌──────────────┐ │
│  │   Left Column    │  │       Center Column       │  │ Right Column │ │
│  │  (~260px width)  │  │     (Flexible Editor)     │  │  (~300px)    │ │
│  │                  │  │                           │  │              │ │
│  │ • Kartu Profil   │  │ • Quick Document Composer │  │ • Status     │ │
│  │   ASN (NIP/Nama) │  │ • Active Document Form    │  │   Kelengkapan│ │
│  │ • Statistik SPJ  │  │   (Kuitansi/SPD/Riil/Foto)│  │ • Plafon SBM │ │
│  │ • Pintasan SBM   │  │ • Wizard Step Navigation  │  │   Provinsi   │ │
│  │ • Switch Proyek  │  │ • Real-time Preview Link  │  │ • Ekspor Satu│ │
│  │                  │  │                           │  │   Klik PDF   │ │
│  └──────────────────┘  └───────────────────────────┘  └──────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

#### Komponen Utama yang Disesuaikan:
1. `src/components/Header.tsx`: Dirombak menjadi LinkedIn Topbar lengkap dengan Search Input, ikon navigasi vertikal, indikator dokumen aktif, dan tombol aksi profil.
2. `src/components/LinkedInLayout.tsx` (atau integrasi di `App.tsx` & `UnifiedSPJWorkspace.tsx`): Wadah 3-kolom responsif dengan kartu-kartu bergaya LinkedIn.
3. `src/components/LinkedInProfileCard.tsx`: Kartu profil pegawai pelaksana di kolom kiri dengan banner dinas Kaltara, avatar ASN, statistik dokumen, dan shortcut cepat.
4. `src/components/LinkedInComplianceWidget.tsx`: Widget kolom kanan yang memantau kelengkapan berkas SPJ, plafon SBM Kaltara 2025, dan pintasan download cetak.
5. Pemeliharaan State & Logic: Seluruh hook `useSPJData`, generator PDF, perhitungan tarif SBM, dan sinkronisasi proyek tetap dihubungkan secara mulus.
