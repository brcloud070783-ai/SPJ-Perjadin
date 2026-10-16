import React, { useState, useRef, useMemo } from 'react';
import { KuitansiData, RincianBiaya, BuktiBayar } from '../types';
import { konversiTerbilang, formatRupiah, formatTanggalIndo } from '../utils/terbilang';
import { SignaturePad } from './SignaturePad';
import { LOGO_KALTARA_SVG } from '../utils/logoKaltara';
import { SBM_RATES, SbmRate } from '../utils/sbmData';
import { 
  Plus, 
  Trash2, 
  Calculator, 
  Eye, 
  Sparkles, 
  User, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft,
  Upload,
  RotateCcw,
  ShieldCheck,
  Zap,
  X,
  Search,
  Copy,
  Receipt,
  Clock,
  Layers,
  MapPin,
  Briefcase,
  FileCheck
} from 'lucide-react';

interface KuitansiFormProps {
  data: KuitansiData;
  onChange: (updated: KuitansiData) => void;
  onPreview: () => void;
  onNextStep?: () => void;
  buktiBayarList?: BuktiBayar[];
  onOpenLogoDinas?: () => void;
}

type StepType = 'kop' | 'pegawai' | 'rincian' | 'ttd';

export const KuitansiForm: React.FC<KuitansiFormProps> = ({
  data,
  onChange,
  onPreview,
  onNextStep,
  buktiBayarList = [],
  onOpenLogoDinas
}) => {
  const [activeStep, setActiveStep] = useState<StepType>('rincian');
  const [showSbmModal, setShowSbmModal] = useState(false);
  const [sbmSearch, setSbmSearch] = useState('');
  const [selectedSbm, setSelectedSbm] = useState<SbmRate>(SBM_RATES[0]);
  const [includeSbmHotel, setIncludeSbmHotel] = useState(true);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Helper to calculate days between two dates
  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 1;
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffTime = d2.getTime() - d1.getTime();
    if (isNaN(diffTime) || diffTime < 0) return 1;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diffDays);
  };

  const updateField = (field: keyof KuitansiData, value: any) => {
    let updated = {
      ...data,
      [field]: value
    };

    // Auto-compute lamaHari if date changes
    if (field === 'tanggalBerangkat' || field === 'tanggalKembali') {
      const start = field === 'tanggalBerangkat' ? value : data.tanggalBerangkat;
      const end = field === 'tanggalKembali' ? value : data.tanggalKembali;
      const days = calculateDays(start, end);
      updated.lamaHari = days;
    }

    onChange(updated);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateField('logoUrl', result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRincianChange = (index: number, key: keyof RincianBiaya, val: any) => {
    const newRincian = [...data.rincianBiaya];
    const item = { ...newRincian[index], [key]: val };

    if (key === 'volume' || key === 'hargaSatuan') {
      const vol = key === 'volume' ? Math.max(1, Number(val) || 0) : item.volume;
      const harga = key === 'hargaSatuan' ? Math.max(0, Number(val) || 0) : item.hargaSatuan;
      item.volume = vol;
      item.hargaSatuan = harga;
      item.total = vol * harga;
    }

    newRincian[index] = item;
    const totalSemua = newRincian.reduce((acc, curr) => acc + (curr.total || 0), 0);

    onChange({
      ...data,
      rincianBiaya: newRincian,
      totalBiaya: totalSemua,
      terbilang: konversiTerbilang(totalSemua)
    });
  };

  const addPresetItem = (
    kategori: RincianBiaya['kategori'], 
    defaultUraian: string, 
    satuan: string, 
    defaultVolume: number, 
    defaultHarga: number
  ) => {
    const newItem: RincianBiaya = {
      id: `rb-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      uraian: defaultUraian,
      kategori,
      volume: defaultVolume,
      satuan,
      hargaSatuan: defaultHarga,
      total: defaultVolume * defaultHarga
    };
    const newRincian = [...data.rincianBiaya, newItem];
    const totalSemua = newRincian.reduce((acc, curr) => acc + (curr.total || 0), 0);
    onChange({
      ...data,
      rincianBiaya: newRincian,
      totalBiaya: totalSemua,
      terbilang: konversiTerbilang(totalSemua)
    });
  };

  const duplicateRincianItem = (index: number) => {
    const source = data.rincianBiaya[index];
    const duplicate: RincianBiaya = {
      ...source,
      id: `rb-dup-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      uraian: `${source.uraian} (Salinan)`
    };
    const newRincian = [...data.rincianBiaya];
    newRincian.splice(index + 1, 0, duplicate);
    const totalSemua = newRincian.reduce((acc, curr) => acc + (curr.total || 0), 0);
    onChange({
      ...data,
      rincianBiaya: newRincian,
      totalBiaya: totalSemua,
      terbilang: konversiTerbilang(totalSemua)
    });
  };

  const removeRincianItem = (index: number) => {
    if (data.rincianBiaya.length <= 1) return;
    const newRincian = data.rincianBiaya.filter((_, idx) => idx !== index);
    const totalSemua = newRincian.reduce((acc, curr) => acc + (curr.total || 0), 0);
    onChange({
      ...data,
      rincianBiaya: newRincian,
      totalBiaya: totalSemua,
      terbilang: konversiTerbilang(totalSemua)
    });
  };

  const syncFromBuktiBayar = () => {
    if (buktiBayarList.length === 0) return;

    const itemsFromBukti: RincianBiaya[] = buktiBayarList.map((b, idx) => ({
      id: `rb-sync-${idx}-${Date.now()}`,
      uraian: `${b.namaVendor} (${b.nomorBukti}) - ${b.keterangan || 'Bukti Riil'}`,
      kategori: (b.kategori === 'tiket' ? 'transport' : b.kategori === 'hotel' ? 'penginapan' : 'lainnya') as RincianBiaya['kategori'],
      volume: 1,
      satuan: 'Bukti',
      hargaSatuan: b.nominal,
      total: b.nominal
    }));

    const uangHarianItem = data.rincianBiaya.find((r) => r.kategori === 'uang_harian');
    const finalItems = uangHarianItem ? [uangHarianItem, ...itemsFromBukti] : itemsFromBukti;

    const totalSemua = finalItems.reduce((acc, curr) => acc + (curr.total || 0), 0);
    onChange({
      ...data,
      rincianBiaya: finalItems,
      totalBiaya: totalSemua,
      terbilang: konversiTerbilang(totalSemua)
    });
  };

  const applySbmRate = (rate: SbmRate, includeHotel: boolean) => {
    const days = data.lamaHari || 3;
    const hotelNights = Math.max(1, days - 1);
    
    let newItems = [...data.rincianBiaya];
    const uhIndex = newItems.findIndex(i => i.kategori === 'uang_harian');
    const uhItem: RincianBiaya = {
      id: uhIndex >= 0 ? newItems[uhIndex].id : `rb-sbm-uh-${Date.now()}`,
      uraian: `Uang harian ${rate.provinsi} (${days} hari @ ${formatRupiah(rate.uangHarianLuarKota).replace(/\s+/g, '')})`,
      kategori: 'uang_harian',
      volume: days,
      satuan: 'hari',
      hargaSatuan: rate.uangHarianLuarKota,
      total: days * rate.uangHarianLuarKota
    };

    if (uhIndex >= 0) {
      newItems[uhIndex] = uhItem;
    } else {
      newItems.unshift(uhItem);
    }

    if (includeHotel) {
      const hotelIndex = newItems.findIndex(i => i.kategori === 'penginapan');
      const hotelItem: RincianBiaya = {
        id: hotelIndex >= 0 ? newItems[hotelIndex].id : `rb-sbm-ht-${Date.now()}`,
        uraian: `Penginapan / Hotel standar ${rate.provinsi} (${hotelNights} malam)`,
        kategori: 'penginapan',
        volume: hotelNights,
        satuan: 'malam',
        hargaSatuan: rate.penginapanStandar,
        total: hotelNights * rate.penginapanStandar
      };
      if (hotelIndex >= 0) {
        newItems[hotelIndex] = hotelItem;
      } else {
        newItems.push(hotelItem);
      }
    }

    const totalSemua = newItems.reduce((acc, curr) => acc + (curr.total || 0), 0);
    onChange({
      ...data,
      rincianBiaya: newItems,
      totalBiaya: totalSemua,
      terbilang: konversiTerbilang(totalSemua)
    });
    setShowSbmModal(false);
  };

  // Grouped totals for summary inspection
  const categoryTotals = useMemo(() => {
    return data.rincianBiaya.reduce(
      (acc, curr) => {
        const cat = curr.kategori || 'lainnya';
        acc[cat] = (acc[cat] || 0) + (curr.total || 0);
        return acc;
      },
      {} as Record<string, number>
    );
  }, [data.rincianBiaya]);

  // Filtered SBM list for quick lookup
  const filteredSbmRates = useMemo(() => {
    if (!sbmSearch.trim()) return SBM_RATES;
    const q = sbmSearch.toLowerCase();
    return SBM_RATES.filter(
      r => r.provinsi.toLowerCase().includes(q) || r.kotaUtama.toLowerCase().includes(q)
    );
  }, [sbmSearch]);

  const steps = [
    { id: 'kop' as StepType, label: 'Kop & Dinas', desc: 'Identitas Instansi', icon: Building2 },
    { id: 'pegawai' as StepType, label: 'Pegawai & SPT', desc: 'Data Surat Tugas', icon: User },
    { id: 'rincian' as StepType, label: 'Rincian Biaya', desc: 'Tarif & Pengeluaran', icon: Calculator },
    { id: 'ttd' as StepType, label: 'Pengesahan', desc: '3 Pejabat & TTD', icon: ShieldCheck }
  ];

  return (
    <div className="space-y-4 pb-24">
      {/* Top Header Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Pengisian Kuitansi SPPD
            </h2>
            <span className="text-slate-400">/</span>
            <span className="text-xs text-slate-600 font-medium font-mono">
              {data.nomorSuratTugas || 'Belum ada No. SPT'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Pelaksana: <strong className="text-slate-800 font-semibold">{data.namaPelaksana || '-'}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Tujuan: <strong className="text-slate-800 font-semibold">{data.kotaTujuan || '-'}</strong></span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums font-mono font-bold text-blue-600">{formatRupiah(data.totalBiaya)}</span>
          </div>
        </div>

        <button
          onClick={onPreview}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Lihat Kuitansi A4</span>
        </button>
      </div>

      {/* Structured Stepper Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          const isActive = activeStep === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setActiveStep(st.id)}
              className={`p-2.5 rounded-xl transition-all text-left flex items-center gap-2.5 select-none cursor-pointer ${
                isActive
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {idx + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold truncate leading-tight">{st.label}</div>
                <div className="text-[10px] text-slate-400 truncate hidden sm:block mt-0.5">{st.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* STEP 1: KOP SURAT & LEGALITAS */}
      {activeStep === 'kop' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Identitas Lembaga & Kepala Surat</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kop instansi yang tercetak di bagian teratas kuitansi resmi
              </p>
            </div>

            {/* Logo Preview & Actions */}
            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200 self-start sm:self-auto">
              <div className="w-12 h-14 bg-white border border-slate-200 rounded-lg p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                <img
                  src={(!data.logoUrl || data.logoUrl.startsWith('data:image/svg+xml') || data.logoUrl.includes('kaltaraSky')) ? LOGO_KALTARA_SVG : data.logoUrl}
                  alt="Logo Kop"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    Ganti Logo
                  </button>
                  {onOpenLogoDinas && (
                    <button
                      type="button"
                      onClick={onOpenLogoDinas}
                      className="text-xs font-semibold text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      Koleksi Logo
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => updateField('logoUrl', LOGO_KALTARA_SVG)}
                  className="text-[10px] text-slate-500 hover:text-slate-800 underline block cursor-pointer"
                >
                  Gunakan Lambang Resmi Provinsi Kaltara
                </button>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Form Fields: Instansi */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
              1. Instansi & SKPD
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Pemerintah / Instansi Induk
                </label>
                <input
                  type="text"
                  value={data.instansiInduk || ''}
                  onChange={(e) => updateField('instansiInduk', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 uppercase font-semibold text-slate-800"
                  placeholder="PEMERINTAH PROVINSI KALIMANTAN UTARA"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Dinas / Badan / Kantor
                </label>
                <input
                  type="text"
                  value={data.namaDinas || ''}
                  onChange={(e) => updateField('namaDinas', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 uppercase font-bold text-slate-900"
                  placeholder="DINAS PENDIDIKAN DAN KEBUDAYAAN"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Alamat Kantor
                </label>
                <input
                  type="text"
                  value={data.alamatKop || ''}
                  onChange={(e) => updateField('alamatKop', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800"
                  placeholder="Jalan Kol. Soetadji Nomor 009 RT. 095 (Gedung Gabungan Dinas 2, Lantai 1)"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Kota & Kode Pos
                </label>
                <input
                  type="text"
                  value={data.kotaKop || ''}
                  onChange={(e) => updateField('kotaKop', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800"
                  placeholder="Tanjung Selor, Bulungan, Kalimantan Utara 77212"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Laman & Kontak Resmi
                </label>
                <input
                  type="text"
                  value={data.kontakKop || ''}
                  onChange={(e) => updateField('kontakKop', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800"
                  placeholder="Laman http://disdikbud.kaltaraprov.go.id, Pos-el kaltara.pendidikan@gmail.com"
                />
              </div>
            </div>
          </div>

          {/* Form Fields: Penomoran & Akun */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
              2. Administrasi & Penatausahaan Kas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tahun Anggaran
                </label>
                <input
                  type="text"
                  value={data.tahunAnggaran || '2026'}
                  onChange={(e) => updateField('tahunAnggaran', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nomor Kuitansi / Bukti Kas
                </label>
                <input
                  type="text"
                  value={data.nomorKuitansi}
                  onChange={(e) => updateField('nomorKuitansi', e.target.value)}
                  placeholder="Contoh: 001/KUI-SPPD/I/2026"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tanggal Kuitansi
                </label>
                <input
                  type="date"
                  value={data.tanggalKuitansi}
                  onChange={(e) => updateField('tanggalKuitansi', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Sudah Terima Dari (Kuasa Pengguna Anggaran / Bendahara)
                </label>
                <input
                  type="text"
                  value={data.sudahTerimaDari}
                  onChange={(e) => updateField('sudahTerimaDari', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Sub Kegiatan / Akun Rekening Belanja (DPA)
                </label>
                <textarea
                  rows={2}
                  value={data.subKegiatan || ''}
                  onChange={(e) => updateField('subKegiatan', e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-slate-800 leading-relaxed"
                  placeholder="1.01.02.1.01.0060 - 5.1.02.04.001.00001 - (Koordinasi, Perencanaan, Supervisi dan Evaluasi Layanan di Bidang Pendidikan)"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => setActiveStep('pegawai')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <span>Lanjut: Data Pegawai & SPT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DATA PEGAWAI & TUGAS */}
      {activeStep === 'pegawai' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Pegawai Pelaksana & Surat Perintah Tugas (SPT)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Data aparatur penerima uang dan rincian penugasan kedinasan
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nama Penerima / Pelaksana (A.n)
              </label>
              <input
                type="text"
                value={data.namaPelaksana}
                onChange={(e) => updateField('namaPelaksana', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900"
                placeholder="Bayu Ramadhan"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                NIP Pelaksana
              </label>
              <input
                type="text"
                value={data.nipPelaksana || ''}
                onChange={(e) => updateField('nipPelaksana', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-slate-800"
                placeholder="198307072015031002"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Jabatan Pelaksana
              </label>
              <input
                type="text"
                value={data.jabatanPelaksana || ''}
                onChange={(e) => updateField('jabatanPelaksana', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800"
                placeholder="Pengadministrasi Umum"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nomor SPT (Surat Perintah Tugas)
              </label>
              <input
                type="text"
                value={data.nomorSuratTugas}
                onChange={(e) => updateField('nomorSuratTugas', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-slate-900 font-semibold"
                placeholder="094/39/SPT/UM-Set/DD/I/2026"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Kota Asal Berangkat
              </label>
              <input
                type="text"
                value={data.kotaAsal}
                onChange={(e) => updateField('kotaAsal', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800"
                placeholder="Tanjung Selor"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Kota / Lokasi Tujuan Dinas
              </label>
              <input
                type="text"
                value={data.kotaTujuan}
                onChange={(e) => updateField('kotaTujuan', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold"
                placeholder="Nunukan (PP)"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Maksud Perjalanan Dinas (Untuk Pengeluaran)
              </label>
              <textarea
                rows={2}
                value={data.maksudPerjalanan}
                onChange={(e) => updateField('maksudPerjalanan', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 leading-relaxed"
                placeholder="Pendampingan Kepala Dinas dalam rangka tindak lanjut temuan BPK terkait penggunaan anggaran sekolah..."
              />
            </div>

            {/* Travel Dates with Auto-Calculated Duration */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tanggal Berangkat
              </label>
              <input
                type="date"
                value={data.tanggalBerangkat}
                onChange={(e) => updateField('tanggalBerangkat', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tanggal Kembali
              </label>
              <input
                type="date"
                value={data.tanggalKembali}
                onChange={(e) => updateField('tanggalKembali', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800"
              />
            </div>

            <div className="sm:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-slate-700">
                  Durasi Perjalanan: <strong className="font-bold text-slate-900">{data.lamaHari || 1} Hari</strong> ({Math.max(1, (data.lamaHari || 1) - 1)} Malam)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">Ubah manual:</span>
                <input
                  type="number"
                  min={1}
                  value={data.lamaHari}
                  onChange={(e) => updateField('lamaHari', Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center text-xs px-2 py-1 bg-white border border-slate-300 rounded-lg font-mono font-bold"
                />
                <span className="text-xs text-slate-600">Hari</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveStep('kop')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStep('rincian')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <span>Lanjut: Rincian Biaya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: RINCIAN BIAYA RIIL */}
      {activeStep === 'rincian' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600" />
                <span>Rincian Komponen Biaya Perjalanan</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Uang harian, tiket transportasi, penginapan hotel, dan biaya riil
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSbmModal(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl border border-blue-200/80 transition-colors cursor-pointer"
                title="Buka standar SBM PMK Kemenkeu resmi"
              >
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                <span>Kalkulator SBM</span>
              </button>

              {buktiBayarList.length > 0 && (
                <button
                  type="button"
                  onClick={syncFromBuktiBayar}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200/80 transition-colors cursor-pointer"
                  title="Impor pengeluaran dari lampiran bukti bayar"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tarik {buktiBayarList.length} Nota</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-500">Tambah Komponen Cepat:</div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => addPresetItem('uang_harian', `Uang harian ${data.kotaTujuan || 'Luar Kota'}`, 'Hari', data.lamaHari || 3, 430000)}
                className="text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-slate-500" />
                <span>+ Uang Harian</span>
              </button>
              <button
                type="button"
                onClick={() => addPresetItem('transport', `Transportasi PP ${data.kotaAsal} - ${data.kotaTujuan}`, 'Kali', 1, 650000)}
                className="text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-slate-500" />
                <span>+ Transport / Tiket</span>
              </button>
              <button
                type="button"
                onClick={() => addPresetItem('penginapan', `Penginapan / Hotel standar ${data.kotaTujuan}`, 'Malam', Math.max(1, (data.lamaHari || 3) - 1), 600000)}
                className="text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-slate-500" />
                <span>+ Hotel / Penginapan</span>
              </button>
              <button
                type="button"
                onClick={() => addPresetItem('transport', 'Taksi Bandara / Transport Lokal PP', 'Kali', 2, 150000)}
                className="text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-slate-500" />
                <span>+ Taksi / Angkutan</span>
              </button>
              <button
                type="button"
                onClick={() => addPresetItem('lainnya', 'Komponen Pengeluaran Riil Tambahan', 'Kali', 1, 100000)}
                className="text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-slate-500" />
                <span>+ Riil Tambahan</span>
              </button>
            </div>
          </div>

          {/* List items */}
          <div className="space-y-3">
            {data.rincianBiaya.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="w-6 h-6 rounded-md bg-slate-200/90 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    value={item.uraian}
                    onChange={(e) => handleRincianChange(idx, 'uraian', e.target.value)}
                    className="flex-1 text-xs font-semibold bg-white px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-slate-900"
                    placeholder="Uraian rincian pengeluaran"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => duplicateRincianItem(idx)}
                      className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Salin baris ini"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {data.rincianBiaya.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRincianItem(idx)}
                        className="text-rose-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Hapus baris"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Kategori</label>
                    <select
                      value={item.kategori}
                      onChange={(e) => handleRincianChange(idx, 'kategori', e.target.value)}
                      className="w-full text-xs px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                    >
                      <option value="uang_harian">Uang Harian</option>
                      <option value="transport">Transportasi</option>
                      <option value="penginapan">Penginapan/Hotel</option>
                      <option value="representasi">Uang Representasi</option>
                      <option value="lainnya">Lainnya / Riil</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Volume</label>
                    <input
                      type="number"
                      min={1}
                      value={item.volume}
                      onChange={(e) => handleRincianChange(idx, 'volume', e.target.value)}
                      className="w-full text-center text-xs px-2.5 py-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Satuan</label>
                    <input
                      type="text"
                      value={item.satuan}
                      onChange={(e) => handleRincianChange(idx, 'satuan', e.target.value)}
                      className="w-full text-xs px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-center text-slate-800"
                      placeholder="Hari / Malam / Tiket"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Harga Satuan (Rp)</label>
                    <input
                      type="number"
                      value={item.hargaSatuan}
                      onChange={(e) => handleRincianChange(idx, 'hargaSatuan', e.target.value)}
                      className="w-full text-xs px-2.5 py-2 bg-white border border-slate-200 rounded-lg font-mono text-right font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-500 font-mono">
                    {item.volume} {item.satuan} × {formatRupiah(item.hargaSatuan)}
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider mr-2">Subtotal:</span>
                    <span className="font-bold text-slate-900 font-mono text-xs tabular-nums">
                      {formatRupiah(item.total)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clean Breakdown & Total Card */}
          <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <span className="text-xs text-slate-400 font-medium">
                Komposisi Pengeluaran ({data.rincianBiaya.length} Pos):
              </span>
              <div className="flex flex-wrap gap-3 text-xs">
                {categoryTotals['uang_harian'] ? (
                  <span className="text-slate-300">
                    Uang Harian: <strong className="text-white font-mono">{formatRupiah(categoryTotals['uang_harian'])}</strong>
                  </span>
                ) : null}
                {categoryTotals['transport'] ? (
                  <span className="text-slate-300">
                    Transport: <strong className="text-white font-mono">{formatRupiah(categoryTotals['transport'])}</strong>
                  </span>
                ) : null}
                {categoryTotals['penginapan'] ? (
                  <span className="text-slate-300">
                    Hotel: <strong className="text-white font-mono">{formatRupiah(categoryTotals['penginapan'])}</strong>
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Total Jumlah Riil
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                {formatRupiah(data.totalBiaya)}
              </span>
            </div>

            <div className="text-xs bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 text-slate-300 italic leading-relaxed">
              <span className="text-slate-400 font-medium not-italic mr-1.5">Terbilang:</span>
              "{data.terbilang}"
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveStep('pegawai')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStep('ttd')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <span>Lanjut: Pejabat & Tanda Tangan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: TANDA TANGAN & PEJABAT PENGESAH */}
      {activeStep === 'ttd' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Pengesahan & Tanda Tangan Digital 3 Pejabat</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelengkapan tanda tangan pejabat untuk pencetakan dokumen kuitansi sah
            </p>
          </div>

          {/* 1. Pejabat Pembuat Komitmen / Penyetuju */}
          <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-3">
            <div className="font-bold text-xs text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[11px] flex items-center justify-center font-bold">1</span>
              <span>Pejabat Pembuat Komitmen (PPK) / Penyetuju (Kiri Bawah)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Sebutan Jabatan</label>
                <input
                  type="text"
                  value={data.jabatanPenyetuju || ''}
                  onChange={(e) => updateField('jabatanPenyetuju', e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium"
                  placeholder="Pejabat Pembuat Komitmen"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={data.namaPPK || ''}
                  onChange={(e) => updateField('namaPPK', e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
                  placeholder="Hasanuddin, S.Pd., M.Si"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">NIP Pejabat</label>
                <input
                  type="text"
                  value={data.nipPPK || ''}
                  onChange={(e) => updateField('nipPPK', e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-800"
                  placeholder="197405272007011010"
                />
              </div>
            </div>
            <SignaturePad
              label="Tanda Tangan Digital PPK / Penyetuju"
              initialSignature={data.ttdPPK}
              onSave={(url) => updateField('ttdPPK', url)}
            />
          </div>

          {/* 2. Bendahara Pengeluaran */}
          <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-3">
            <div className="font-bold text-xs text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] flex items-center justify-center font-bold">2</span>
              <span>Bendahara Pengeluaran (Kanan Bawah)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Sebutan Jabatan</label>
                <input
                  type="text"
                  value={data.jabatanBendahara || ''}
                  onChange={(e) => updateField('jabatanBendahara', e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium"
                  placeholder="Bendahara Pengeluaran"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={data.namaBendahara || ''}
                  onChange={(e) => updateField('namaBendahara', e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
                  placeholder="Kevin Albertus PS, A.Md."
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">NIP Bendahara</label>
                <input
                  type="text"
                  value={data.nipBendahara || ''}
                  onChange={(e) => updateField('nipBendahara', e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-800"
                  placeholder="199203042018021001"
                />
              </div>
            </div>
            <SignaturePad
              label="Tanda Tangan Digital Bendahara Pengeluaran"
              initialSignature={data.ttdBendahara}
              onSave={(url) => updateField('ttdBendahara', url)}
            />
          </div>

          {/* 3. Yang Menerima / Pelaksana */}
          <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-3">
            <div className="font-bold text-xs text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[11px] flex items-center justify-center font-bold">3</span>
              <span>Yang Menerima / Pelaksana Dinas (Kanan Atas)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Nama Lengkap Penerima</label>
                <input
                  type="text"
                  value={data.namaPelaksana || ''}
                  onChange={(e) => updateField('namaPelaksana', e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900"
                  placeholder="Bayu Ramadhan"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">NIP Penerima</label>
                <input
                  type="text"
                  value={data.nipPelaksana || ''}
                  onChange={(e) => updateField('nipPelaksana', e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-slate-800"
                  placeholder="198307072015031002"
                />
              </div>
            </div>
            <SignaturePad
              label="Tanda Tangan Digital Pelaksana / Yang Menerima"
              initialSignature={data.ttdPelaksana}
              onSave={(url) => updateField('ttdPelaksana', url)}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={() => setActiveStep('rincian')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onPreview}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                <span>Pratinjau Kuitansi A4</span>
              </button>
              {onNextStep && (
                <button
                  type="button"
                  onClick={onNextStep}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6547ED] hover:bg-[#5537E6] active:scale-95 text-white text-xs font-bold rounded-2xl shadow-sm shadow-purple-900/10 transition-all cursor-pointer"
                >
                  <span>Lanjut: Foto GPS Kegiatan (Tahap 2)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SBM (Standar Biaya Masukan) Modal */}
      {showSbmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Kalkulator Standar Biaya Masukan (SBM)</h3>
                  <p className="text-[11px] text-slate-300">Standar tarif PMK Kemenkeu RI untuk perjalanan dinas</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSbmModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
              {/* Province Search */}
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-semibold">
                  Pilih Wilayah / Provinsi Tujuan Dinas:
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={sbmSearch}
                    onChange={(e) => setSbmSearch(e.target.value)}
                    placeholder="Cari provinsi (misal: Kaltara, Jakarta, Jatim)..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
                  {filteredSbmRates.map((rate) => {
                    const isSelected = selectedSbm.provinsi === rate.provinsi;
                    return (
                      <button
                        key={rate.provinsi}
                        type="button"
                        onClick={() => setSelectedSbm(rate)}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected ? 'bg-blue-50 text-blue-800 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div>{rate.provinsi}</div>
                          <div className="text-[10px] text-slate-400">{rate.kotaUtama}</div>
                        </div>
                        <div className="text-right font-mono text-[11px]">
                          {formatRupiah(rate.uangHarianLuarKota)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rate Breakdown Card */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-slate-700">
                  <span>Tarif Uang Harian Luar Kota:</span>
                  <span className="font-bold font-mono text-blue-900 tabular-nums">
                    {formatRupiah(selectedSbm.uangHarianLuarKota)} / hari
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Plafon Standar Penginapan/Hotel:</span>
                  <span className="font-bold font-mono text-purple-900 tabular-nums">
                    {formatRupiah(selectedSbm.penginapanStandar)} / malam
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700 border-t border-blue-200/60 pt-2">
                  <span>Durasi Perjalanan:</span>
                  <span className="font-bold font-mono text-slate-900">
                    {data.lamaHari || 3} Hari ({Math.max(1, (data.lamaHari || 3) - 1)} Malam)
                  </span>
                </div>
              </div>

              {/* Calculation Preview */}
              <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2">
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Hasil Perhitungan Standar:
                </div>
                <div className="flex justify-between items-center text-slate-200">
                  <span>Uang Harian ({data.lamaHari || 3} hari)</span>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums">
                    {formatRupiah((data.lamaHari || 3) * selectedSbm.uangHarianLuarKota)}
                  </span>
                </div>
                {includeSbmHotel && (
                  <div className="flex justify-between items-center text-slate-200">
                    <span>Hotel ({Math.max(1, (data.lamaHari || 3) - 1)} malam)</span>
                    <span className="font-mono font-bold text-emerald-400 tabular-nums">
                      {formatRupiah(Math.max(1, (data.lamaHari || 3) - 1) * selectedSbm.penginapanStandar)}
                    </span>
                  </div>
                )}
                <div className="border-t border-slate-700 pt-2 flex justify-between items-center text-sm font-bold">
                  <span>Total Alokasi SBM</span>
                  <span className="font-mono text-amber-300 tabular-nums">
                    {formatRupiah(
                      (data.lamaHari || 3) * selectedSbm.uangHarianLuarKota +
                      (includeSbmHotel ? Math.max(1, (data.lamaHari || 3) - 1) * selectedSbm.penginapanStandar : 0)
                    )}
                  </span>
                </div>
              </div>

              {/* Option to include Hotel */}
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                <input
                  type="checkbox"
                  checked={includeSbmHotel}
                  onChange={(e) => setIncludeSbmHotel(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs">Sertakan juga baris Penginapan / Hotel standar</span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSbmModal(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => applySbmRate(selectedSbm, includeSbmHotel)}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Terapkan ke Kuitansi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
