import React, { useState, useRef } from 'react';
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
  FileText, 
  User, 
  Calendar, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Receipt,
  ArrowRight,
  ArrowLeft,
  Upload,
  RotateCcw,
  Tag,
  ShieldCheck,
  Zap,
  X
} from 'lucide-react';

interface KuitansiFormProps {
  data: KuitansiData;
  onChange: (updated: KuitansiData) => void;
  onPreview: () => void;
  buktiBayarList?: BuktiBayar[];
  onOpenLogoDinas?: () => void;
}

type StepType = 'kop' | 'pegawai' | 'rincian' | 'ttd';

export const KuitansiForm: React.FC<KuitansiFormProps> = ({
  data,
  onChange,
  onPreview,
  buktiBayarList = [],
  onOpenLogoDinas
}) => {
  const [activeStep, setActiveStep] = useState<StepType>('rincian');
  const [showSbmModal, setShowSbmModal] = useState(false);
  const [selectedSbm, setSelectedSbm] = useState<SbmRate>(SBM_RATES[0]);
  const [includeSbmHotel, setIncludeSbmHotel] = useState(true);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof KuitansiData, value: any) => {
    onChange({
      ...data,
      [field]: value
    });
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

  const addRincianItem = () => {
    const newItem: RincianBiaya = {
      id: `rb-${Date.now()}`,
      uraian: 'Komponen Pengeluaran Riil Tambahan',
      kategori: 'transport',
      volume: 1,
      satuan: 'kali',
      hargaSatuan: 100000,
      total: 100000
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

  const removeRincianItem = (index: number) => {
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
      uraian: `${b.namaVendor} - ${b.keterangan || 'Bukti Riil'}`,
      kategori: b.kategori === 'tiket' ? 'transport' : b.kategori === 'hotel' ? 'penginapan' : 'lainnya',
      volume: 1,
      satuan: 'bukti',
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
    
    // Create copy
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

  const steps = [
    { id: 'kop' as StepType, label: '1. Kop', icon: Building2 },
    { id: 'pegawai' as StepType, label: '2. Tugas', icon: User },
    { id: 'rincian' as StepType, label: '3. Rincian', icon: Calculator },
    { id: 'ttd' as StepType, label: '4. TTD Pejabat', icon: ShieldCheck }
  ];

  return (
    <div className="space-y-4 pb-24">
      {/* Top Banner with Summary & Preview Button */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Pengisian Kuitansi SPPD
            </h2>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
              Format A4 Tahoma
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Total Saat Ini: <strong className="text-slate-800 font-mono">{formatRupiah(data.totalBiaya)}</strong> ({data.rincianBiaya.length} rincian)
          </p>
        </div>

        <button
          onClick={onPreview}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Lihat Kuitansi A4</span>
        </button>
      </div>

      {/* Modern Stepper Indicator */}
      <div className="grid grid-cols-4 gap-1 sm:gap-1.5 bg-slate-200/70 p-1 rounded-xl text-[10px] sm:text-[11px] font-semibold">
        {steps.map((st) => {
          const Icon = st.icon;
          const isActive = activeStep === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setActiveStep(st.id)}
              className={`py-2 px-1 rounded-lg transition-all text-center flex items-center justify-center gap-1 sm:gap-1.5 select-none ${
                isActive
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="truncate">{st.label}</span>
            </button>
          );
        })}
      </div>

      {/* STEP 1: KOP SURAT & LEGALITAS */}
      {activeStep === 'kop' && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                Kop Surat Instansi & Penomoran
              </h3>
              <p className="text-[11px] text-slate-500">
                Identitas pemerintah daerah atau instansi yang tercetak di kepala kuitansi
              </p>
            </div>

            {/* Logo Preview & Custom Upload */}
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <div className="w-10 h-12 border border-slate-200 rounded-lg p-1 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                <img
                  src={(!data.logoUrl || data.logoUrl.startsWith('data:image/svg+xml') || data.logoUrl.includes('kaltaraSky')) ? LOGO_KALTARA_SVG : data.logoUrl}
                  alt="Logo Kop"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors cursor-pointer text-left"
                >
                  Ubah Logo (Upload Quick File)
                </button>
                {onOpenLogoDinas && (
                  <button
                    type="button"
                    onClick={onOpenLogoDinas}
                    className="text-[10px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded-lg transition-colors cursor-pointer text-left flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    <span>Halaman Khusus Upload Logo Dinas</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => updateField('logoUrl', LOGO_KALTARA_SVG)}
                  className="text-[9.5px] font-medium text-slate-600 hover:text-blue-700 underline text-left cursor-pointer"
                  title="Gunakan Lambang Resmi Provinsi Kalimantan Utara (Kaltara Benuanta)"
                >
                  Reset / Gunakan Logo Kaltara Resmi
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Pemerintah / Instansi Induk
              </label>
              <input
                type="text"
                value={data.instansiInduk || ''}
                onChange={(e) => updateField('instansiInduk', e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 uppercase font-semibold"
                placeholder="PEMERINTAH PROVINSI KALIMANTAN UTARA"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Nama Dinas / Satuan Kerja
              </label>
              <input
                type="text"
                value={data.namaDinas || ''}
                onChange={(e) => updateField('namaDinas', e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 uppercase font-bold"
                placeholder="DINAS PENDIDIKAN DAN KEBUDAYAAN"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Alamat Kantor (Gedung & RT)
              </label>
              <input
                type="text"
                value={data.alamatKop || ''}
                onChange={(e) => updateField('alamatKop', e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Kota, Wilayah & Telepon
              </label>
              <input
                type="text"
                value={data.kotaKop || ''}
                onChange={(e) => updateField('kotaKop', e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Laman Web & Pos-el (Email)
              </label>
              <input
                type="text"
                value={data.kontakKop || ''}
                onChange={(e) => updateField('kontakKop', e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Tahun Anggaran
              </label>
              <input
                type="text"
                value={data.tahunAnggaran || '2026'}
                onChange={(e) => updateField('tahunAnggaran', e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-bold font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                No. Kuitansi (Bukti Kas)
              </label>
              <input
                type="text"
                value={data.nomorKuitansi}
                onChange={(e) => updateField('nomorKuitansi', e.target.value)}
                placeholder="Dapat dikosongkan atau diisi nomor kas"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Sub Kegiatan DPA / RKA
              </label>
              <textarea
                rows={2}
                value={data.subKegiatan || ''}
                onChange={(e) => updateField('subKegiatan', e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-mono leading-relaxed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Sudah Terima Dari (Satker Bendahara)
              </label>
              <input
                type="text"
                value={data.sudahTerimaDari}
                onChange={(e) => updateField('sudahTerimaDari', e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-medium"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setActiveStep('pegawai')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all"
            >
              <span>Lanjut: Data Pegawai & Rute</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DATA PEGAWAI & TUGAS */}
      {activeStep === 'pegawai' && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-600" />
              Pegawai Pelaksana & Surat Perintah Tugas (SPT)
            </h3>
            <p className="text-[11px] text-slate-500">
              Data penerima uang dan uraian tugas kedinasan
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Nama Penerima (A.n) & Gelar
              </label>
              <input
                type="text"
                value={data.namaPelaksana}
                onChange={(e) => updateField('namaPelaksana', e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-bold"
                placeholder="Bayu Ramadhan"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                NIP Penerima
              </label>
              <input
                type="text"
                value={data.nipPelaksana || ''}
                onChange={(e) => updateField('nipPelaksana', e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-mono"
                placeholder="198307072015031002"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Nomor SPT (Surat Perintah Tugas)
              </label>
              <input
                type="text"
                value={data.nomorSuratTugas}
                onChange={(e) => updateField('nomorSuratTugas', e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-mono"
                placeholder="094/39/SPT/UM-Set/DD/I/2026"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Rute Tujuan (PP)
              </label>
              <input
                type="text"
                value={data.kotaTujuan}
                onChange={(e) => updateField('kotaTujuan', e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-medium"
                placeholder="Tanjung Selor - Nunukan (PP)"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Untuk Pengeluaran (Maksud Perjalanan Dinas)
              </label>
              <textarea
                rows={2}
                value={data.maksudPerjalanan}
                onChange={(e) => updateField('maksudPerjalanan', e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 leading-relaxed"
                placeholder="Pendampingan Kepala Dinas dalam rangka tindak lanjut temuan BPK..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Tanggal Berangkat
              </label>
              <input
                type="date"
                value={data.tanggalBerangkat}
                onChange={(e) => updateField('tanggalBerangkat', e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Tanggal Kembali
              </label>
              <input
                type="date"
                value={data.tanggalKembali}
                onChange={(e) => updateField('tanggalKembali', e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveStep('kop')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStep('rincian')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all"
            >
              <span>Lanjut: Rincian Biaya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: RINCIAN BIAYA RIIL */}
      {activeStep === 'rincian' && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-blue-600" />
                Daftar Rincian Pengeluaran
              </h3>
              <p className="text-[11px] text-slate-500">
                Uang harian, tiket transportasi, akomodasi hotel, dan biaya riil
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSbmModal(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors shadow-2xs"
                title="Buka kalkulator Standar Biaya Masukan PMK resmi untuk Uang Harian & Hotel"
              >
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                <span>Kalkulator SBM</span>
              </button>

              {buktiBayarList.length > 0 && (
                <button
                  type="button"
                  onClick={syncFromBuktiBayar}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
                  title="Tarik nominal dari bukti pembayaran yang sudah diupload"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sinkronkan ({buktiBayarList.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* List items */}
          <div className="space-y-3">
            {data.rincianBiaya.map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded-md shrink-0">
                    #{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item.uraian}
                    onChange={(e) => handleRincianChange(idx, 'uraian', e.target.value)}
                    className="flex-1 text-xs font-semibold bg-white px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                    placeholder="Nama pengeluaran / uraian"
                  />
                  {data.rincianBiaya.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRincianItem(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Hapus baris"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2 pt-1 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Kategori</label>
                    <select
                      value={item.kategori}
                      onChange={(e) => handleRincianChange(idx, 'kategori', e.target.value)}
                      className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg"
                    >
                      <option value="uang_harian">Uang Harian</option>
                      <option value="transport">Transportasi</option>
                      <option value="penginapan">Penginapan/Hotel</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Volume</label>
                    <input
                      type="number"
                      min={1}
                      value={item.volume}
                      onChange={(e) => handleRincianChange(idx, 'volume', e.target.value)}
                      className="w-full text-center text-xs p-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Satuan</label>
                    <input
                      type="text"
                      value={item.satuan}
                      onChange={(e) => handleRincianChange(idx, 'satuan', e.target.value)}
                      className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg text-center"
                      placeholder="hari/malam/kali"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Harga Satuan (Rp)</label>
                    <input
                      type="number"
                      value={item.hargaSatuan}
                      onChange={(e) => handleRincianChange(idx, 'hargaSatuan', e.target.value)}
                      className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg font-mono text-right font-medium"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs pt-1.5 border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-500">
                    {item.volume} {item.satuan} &times; {formatRupiah(item.hargaSatuan)}
                  </span>
                  <span className="font-bold text-slate-900 font-mono text-xs">
                    = {formatRupiah(item.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addRincianItem}
            className="w-full py-2.5 border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/50 hover:bg-blue-50 text-blue-700 text-xs font-semibold rounded-xl inline-flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Komponen Pengeluaran</span>
          </button>

          {/* Total & Terbilang Banner */}
          <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 shadow-inner">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Total Jumlah Sebesar
              </span>
              <span className="text-xl font-bold font-mono text-amber-400">
                {formatRupiah(data.totalBiaya)}
              </span>
            </div>
            <div className="text-xs bg-slate-800/90 p-2.5 rounded-lg border border-slate-700 text-slate-300 italic">
              <span className="text-slate-400 font-medium not-italic">Terbilang Rupiah: </span>
              "{data.terbilang}"
            </div>
          </div>

          <div className="pt-2 flex justify-between gap-2">
            <button
              type="button"
              onClick={() => setActiveStep('pegawai')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStep('ttd')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
            >
              <span>Lanjut: Tanda Tangan & Pejabat</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: TANDA TANGAN & PEJABAT PENGESAH */}
      {activeStep === 'ttd' && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Kolom Tanda Tangan & Pejabat Pengesah SPJ
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Atur nama, NIP, sebutan jabatan, dan coretan/upload tanda tangan digital untuk 3 pejabat kuitansi
              </p>
            </div>
          </div>

          {/* 1. Pejabat Pembuat Komitmen / Penyetuju */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="font-bold text-xs text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] flex items-center justify-center font-extrabold">1</span>
              <span>Pejabat Pembuat Komitmen (PPK) / Penyetuju (Kolom Kiri Bawah)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-medium text-slate-600 mb-1">Sebutan Jabatan</label>
                <input
                  type="text"
                  value={data.jabatanPenyetuju || ''}
                  onChange={(e) => updateField('jabatanPenyetuju', e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-medium"
                  placeholder="Pejabat Pembuat Komitmen"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-600 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={data.namaPPK || ''}
                  onChange={(e) => updateField('namaPPK', e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-bold"
                  placeholder="Hasanuddin, S.Pd., M.Si"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-600 mb-1">NIP Pejabat</label>
                <input
                  type="text"
                  value={data.nipPPK || ''}
                  onChange={(e) => updateField('nipPPK', e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-mono"
                  placeholder="197405272007011010"
                />
              </div>
            </div>
            <SignaturePad
              label="Coret Tanda Tangan Digital PPK / Penyetuju"
              initialSignature={data.ttdPPK}
              onSave={(url) => updateField('ttdPPK', url)}
            />
          </div>

          {/* 2. Bendahara Pengeluaran */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="font-bold text-xs text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] flex items-center justify-center font-extrabold">2</span>
              <span>Bendahara Pengeluaran (Kolom Kanan Bawah)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-medium text-slate-600 mb-1">Sebutan Jabatan</label>
                <input
                  type="text"
                  value={data.jabatanBendahara || ''}
                  onChange={(e) => updateField('jabatanBendahara', e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-medium"
                  placeholder="Bendahara Pengeluaran"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-600 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={data.namaBendahara || ''}
                  onChange={(e) => updateField('namaBendahara', e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-bold"
                  placeholder="Kevin Albertus PS, A.Md."
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-600 mb-1">NIP Bendahara</label>
                <input
                  type="text"
                  value={data.nipBendahara || ''}
                  onChange={(e) => updateField('nipBendahara', e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-mono"
                  placeholder="199203042018021001"
                />
              </div>
            </div>
            <SignaturePad
              label="Coret Tanda Tangan Digital Bendahara Pengeluaran"
              initialSignature={data.ttdBendahara}
              onSave={(url) => updateField('ttdBendahara', url)}
            />
          </div>

          {/* 3. Yang Menerima / Pelaksana */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="font-bold text-xs text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] flex items-center justify-center font-extrabold">3</span>
              <span>Yang Menerima / Pelaksana Perjalanan Dinas (Kolom Kanan Atas)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-medium text-slate-600 mb-1">Nama Lengkap Penerima</label>
                <input
                  type="text"
                  value={data.namaPelaksana || ''}
                  onChange={(e) => updateField('namaPelaksana', e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-bold"
                  placeholder="Bayu Ramadhan"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-600 mb-1">NIP Penerima</label>
                <input
                  type="text"
                  value={data.nipPelaksana || ''}
                  onChange={(e) => updateField('nipPelaksana', e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-mono"
                  placeholder="198307072015031002"
                />
              </div>
            </div>
            <SignaturePad
              label="Coret Tanda Tangan Digital Pelaksana / Yang Menerima"
              initialSignature={data.ttdPelaksana}
              onSave={(url) => updateField('ttdPelaksana', url)}
            />
          </div>

          <div className="pt-2 flex justify-between gap-2">
            <button
              type="button"
              onClick={() => setActiveStep('rincian')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
            <button
              type="button"
              onClick={onPreview}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Selesai & Buka Kuitansi A4</span>
            </button>
          </div>
        </div>
      )}

      {/* SBM (Standar Biaya Masukan) Modal */}
      {showSbmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Kalkulator Standar SBM Resmi</h3>
                  <p className="text-[10px] text-slate-300">PMK Kemenkeu Standar Biaya Masukan Perjalanan Dinas</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSbmModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  1. Pilih Wilayah / Provinsi Tujuan Dinas:
                </label>
                <select
                  value={selectedSbm.provinsi}
                  onChange={(e) => {
                    const found = SBM_RATES.find(r => r.provinsi === e.target.value);
                    if (found) setSelectedSbm(found);
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  {SBM_RATES.map((rate) => (
                    <option key={rate.provinsi} value={rate.provinsi}>
                      {rate.provinsi} ({rate.kotaUtama})
                    </option>
                  ))}
                </select>
              </div>

              {/* Rate Breakdown Card */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-medium">Tarif Uang Harian Luar Kota:</span>
                  <span className="font-bold font-mono text-blue-900">
                    {formatRupiah(selectedSbm.uangHarianLuarKota)} / hari
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-medium">Standar Plafon Penginapan/Hotel:</span>
                  <span className="font-bold font-mono text-purple-900">
                    {formatRupiah(selectedSbm.penginapanStandar)} / malam
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700 border-t border-blue-200/60 pt-1.5">
                  <span className="font-medium">Durasi Perjalanan Terdata:</span>
                  <span className="font-bold font-mono text-slate-900">
                    {data.lamaHari || 3} Hari ({Math.max(1, (data.lamaHari || 3) - 1)} Malam)
                  </span>
                </div>
              </div>

              {/* Calculation Preview */}
              <div className="p-3 bg-slate-900 text-white rounded-xl space-y-2">
                <div className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider">
                  Hasil Perhitungan Standar:
                </div>
                <div className="flex justify-between items-center text-slate-200">
                  <span>Uang Harian ({data.lamaHari || 3} hari)</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {formatRupiah((data.lamaHari || 3) * selectedSbm.uangHarianLuarKota)}
                  </span>
                </div>
                {includeSbmHotel && (
                  <div className="flex justify-between items-center text-slate-200">
                    <span>Hotel ({Math.max(1, (data.lamaHari || 3) - 1)} malam)</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {formatRupiah(Math.max(1, (data.lamaHari || 3) - 1) * selectedSbm.penginapanStandar)}
                    </span>
                  </div>
                )}
                <div className="border-t border-slate-700 pt-2 flex justify-between items-center text-sm font-bold">
                  <span>Total Alokasi SBM</span>
                  <span className="font-mono text-amber-300">
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
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="text-xs">Sertakan juga baris Penginapan / Hotel standar</span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSbmModal(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => applySbmRate(selectedSbm, includeSbmHotel)}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-xs inline-flex items-center gap-1.5 transition-all"
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
