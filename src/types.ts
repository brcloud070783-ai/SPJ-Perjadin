export type TabType = 'landing' | 'berkas' | 'kuitansi' | 'dokumentasi' | 'bukti_bayar' | 'paket_lengkap' | 'diskusi';

export interface RincianBiaya {
  id: string;
  uraian: string;
  kategori: 'uang_harian' | 'transport' | 'penginapan' | 'representasi' | 'lainnya';
  volume: number;
  satuan: string; // misal: Hari, Kali, Malam
  hargaSatuan: number;
  total: number;
}

export interface KuitansiData {
  id: string;
  nomorKuitansi: string;
  subKegiatan: string;
  tahunAnggaran: string;
  instansiInduk: string;
  namaDinas: string;
  alamatKop: string;
  kotaKop: string;
  kontakKop: string;
  logoUrl?: string;
  nomorSPPD: string;
  nomorSuratTugas: string; // no. SPT
  sudahTerimaDari: string;
  namaPelaksana: string;
  nipPelaksana?: string;
  jabatanPelaksana: string;
  instansi: string;
  maksudPerjalanan: string;
  kotaAsal: string;
  kotaTujuan: string;
  tanggalBerangkat: string;
  tanggalKembali: string;
  lamaHari: number;
  rincianBiaya: RincianBiaya[];
  totalBiaya: number;
  terbilang: string;
  tanggalKuitansi: string;
  jabatanPenyetuju: string;
  namaPPK: string; // Penyetuju / Pengguna Anggaran
  nipPPK?: string;
  jabatanBendahara: string;
  namaBendahara: string;
  nipBendahara?: string;
  ttdPelaksana?: string; // base64
  ttdPPK?: string; // base64
  ttdBendahara?: string; // base64
}

export interface FotoDokumentasi {
  id: string;
  kuitansiId?: string;
  judul: string;
  deskripsi: string;
  kategori: 'rapat' | 'lapangan' | 'presentasi' | 'kunjungan' | 'serah_terima' | 'lainnya';
  tanggal: string;
  waktu: string;
  lokasi: string;
  koordinatGps?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  fotoUrl: string; // base64 data url
  showWatermark?: boolean; // Timestamp Camera / Geotagging watermark
  watermarkText?: string;
  createdAt: number;
}

export interface BuktiBayar {
  id: string;
  kuitansiId?: string;
  kategori: 'tiket' | 'hotel' | 'bbm' | 'tol' | 'konsumsi' | 'lainnya';
  namaVendor: string;
  nomorBukti: string;
  tanggalTransaksi: string;
  nominal: number;
  keterangan: string;
  fotoUrl: string; // base64 data url
  filterMode?: 'normal' | 'bw' | 'contrast'; // CamScanner enhancement
  statusRiil: boolean; // Pengeluaran Riil (sesuai bukti)
  createdAt: number;
}

export interface ProjectSPJ {
  id: string;
  namaProject: string; // e.g., "SPJ Nunukan - Konsultasi Publik (April 2026)"
  nomorSPD?: string;
  createdTime: number;
  updatedTime: number;
  status: 'draf' | 'selesai' | 'terkirim';
  kuitansi: KuitansiData;
  dokumentasiList: FotoDokumentasi[];
  buktiBayarList: BuktiBayar[];
}

export interface TripSession {
  kuitansi: KuitansiData;
  dokumentasiList: FotoDokumentasi[];
  buktiBayarList: BuktiBayar[];
}
