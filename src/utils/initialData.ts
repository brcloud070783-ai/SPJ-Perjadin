import { KuitansiData, FotoDokumentasi, BuktiBayar } from '../types';
import { LOGO_KALTARA_SVG } from './logoKaltara';

export const initialKuitansi: KuitansiData = {
  id: 'kuitansi-kaltara-2026',
  nomorKuitansi: '',
  tahunAnggaran: '2026',
  subKegiatan: '1.01.02.1.01.0060 - 5.1.02.04.001.00001 - (Koordinasi, Perencanaan, Supervisi dan Evaluasi Layanan di Bidang Pendidikan )',
  instansiInduk: 'PEMERINTAH PROVINSI KALIMANTAN UTARA',
  namaDinas: 'DINAS PENDIDIKAN DAN KEBUDAYAAN',
  alamatKop: 'Jalan Kol. Soetadji Nomor 009 RT. 095 (Gedung Gabungan Dinas 2, Lantai 1),',
  kotaKop: 'Tanjung Selor, Bulungan, Kalimantan Utara 77212 Telepon Seluler 082352465546',
  kontakKop: 'Laman http://disdikbud.kaltaraprov.go.id, Pos-el kaltara.pendidikan@gmail.com',
  logoUrl: LOGO_KALTARA_SVG,
  nomorSPPD: '094/39/SPPD/DD/I/2026',
  nomorSuratTugas: '094/39/SPT/UM-Set/DD/I/2026',
  sudahTerimaDari: 'Bendahara Pengeluaran Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Utara',
  namaPelaksana: 'Bayu Ramadhan',
  nipPelaksana: '198307072015031002',
  jabatanPelaksana: 'Staf Pelaksana',
  instansi: 'Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Utara',
  maksudPerjalanan: 'Pendampingan Kepala Dinas dalam rangka tindak lanjut temuan BPK terkait penggunaan anggaran sekolah pada satuan pendidikan di Kabupaten Nunukan',
  kotaAsal: 'Tanjung Selor',
  kotaTujuan: 'Tanjung Selor - Nunukan (PP)',
  tanggalBerangkat: '2026-04-01',
  tanggalKembali: '2026-04-03',
  lamaHari: 3,
  rincianBiaya: [
    {
      id: 'rb-1',
      uraian: 'Uang harian',
      kategori: 'uang_harian',
      volume: 3,
      satuan: 'hari',
      hargaSatuan: 430000,
      total: 1290000
    },
    {
      id: 'rb-2',
      uraian: 'Transportasi Tanjung Selor - Tarakan - Nunukan',
      kategori: 'transport',
      volume: 1,
      satuan: 'kali',
      hargaSatuan: 850000,
      total: 850000
    },
    {
      id: 'rb-3',
      uraian: 'Hotel Nunukan',
      kategori: 'penginapan',
      volume: 2,
      satuan: 'malam',
      hargaSatuan: 360000,
      total: 720000
    }
  ],
  totalBiaya: 2860000,
  terbilang: 'Dua juta delapan ratus enam puluh ribu rupiah',
  tanggalKuitansi: '2026-04-06',
  jabatanPenyetuju: 'Pengguna Anggaran',
  namaPPK: 'Hasanuddin, S.Pd., M.Si',
  nipPPK: '197405272007011010',
  jabatanBendahara: 'Bendahara Pengeluaran,',
  namaBendahara: 'Kevin Albertus PS, A.Md.',
  nipBendahara: '199203042018021001'
};

export const initialDokumentasi: FotoDokumentasi[] = [];

export const initialBuktiBayar: BuktiBayar[] = [];
