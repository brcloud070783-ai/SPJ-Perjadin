import React, { useState, useRef } from 'react';
import { BuktiBayar } from '../types';
import { formatRupiah, formatTanggalIndo } from '../utils/terbilang';
import { 
  Receipt, 
  Upload, 
  Camera, 
  Trash2, 
  Plus, 
  Eye, 
  X, 
  Check, 
  Building, 
  Calendar, 
  CreditCard, 
  Tag, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles,
  Search,
  ArrowRight,
  ArrowLeft,
  Printer,
  Zap,
  Filter
} from 'lucide-react';

interface BuktiBayarFormProps {
  list: BuktiBayar[];
  onAdd: (item: BuktiBayar) => void;
  onDelete: (id: string) => void;
  onSyncToKuitansi?: () => void;
  onOpenPrintPreview?: () => void;
  onPrevStep?: () => void;
  onCompleteWizard?: () => void;
}

export const BuktiBayarForm: React.FC<BuktiBayarFormProps> = ({
  list,
  onAdd,
  onDelete,
  onSyncToKuitansi,
  onOpenPrintPreview,
  onPrevStep,
  onCompleteWizard
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<BuktiBayar | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [kategori, setKategori] = useState<BuktiBayar['kategori']>('tiket');
  const [namaVendor, setNamaVendor] = useState('');
  const [nomorBukti, setNomorBukti] = useState('');
  const [tanggalTransaksi, setTanggalTransaksi] = useState(new Date().toISOString().split('T')[0]);
  const [nominal, setNominal] = useState<number | ''>('');
  const [keterangan, setKeterangan] = useState('');
  const [statusRiil, setStatusRiil] = useState(true);
  const [fotoUrl, setFotoUrl] = useState('');
  const [filterMode, setFilterMode] = useState<'normal' | 'bw' | 'contrast'>('bw');
  const [isCompressing, setIsCompressing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setKategori('tiket');
    setNamaVendor('');
    setNomorBukti('');
    setNominal('');
    setKeterangan('');
    setStatusRiil(true);
    setFotoUrl('');
    setFilterMode('bw');
    setShowAddModal(false);
  };

  const applyQuickPreset = (preset: {
    kategori: BuktiBayar['kategori'];
    vendor: string;
    nominal: number;
    keterangan: string;
  }) => {
    setKategori(preset.kategori);
    setNamaVendor(preset.vendor);
    setNominal(preset.nominal);
    setNomorBukti(`STRUK-${Math.floor(100000 + Math.random() * 900000)}`);
    setKeterangan(preset.keterangan);
  };

  const processAndCompressImage = (file: File) => {
    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setFotoUrl(compressedDataUrl);
          setIsCompressing(false);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processAndCompressImage(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fotoUrl) {
      alert('Silakan ambil foto atau upload bukti pembayaran / struk!');
      return;
    }
    if (!namaVendor.trim()) {
      alert('Nama vendor/merchant wajib diisi!');
      return;
    }
    if (!nominal || Number(nominal) <= 0) {
      alert('Nominal harus lebih dari Rp 0!');
      return;
    }

    const newItem: BuktiBayar = {
      id: `bb-${Date.now()}`,
      kategori,
      namaVendor: namaVendor.trim(),
      nomorBukti: nomorBukti.trim() || `STRUK-${Date.now().toString().slice(-6)}`,
      tanggalTransaksi,
      nominal: Number(nominal),
      keterangan: keterangan.trim(),
      fotoUrl,
      filterMode,
      statusRiil,
      createdAt: Date.now()
    };

    onAdd(newItem);
    resetForm();
  };

  // Group summary by category
  const totalNominal = list.reduce((sum, item) => sum + item.nominal, 0);

  const kategoriLabels: Record<BuktiBayar['kategori'], { label: string; color: string }> = {
    tiket: { label: 'Tiket & Transport', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    hotel: { label: 'Hotel & Penginapan', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    bbm: { label: 'BBM & Bahan Bakar', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    tol: { label: 'Tol & Parkir', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    konsumsi: { label: 'Konsumsi / Makan', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    lainnya: { label: 'Pengeluaran Lain', color: 'bg-slate-100 text-slate-700 border-slate-200' }
  };

  const filteredList = list.filter((item) => {
    const matchCat = filterCategory === 'semua' || item.kategori === filterCategory;
    const matchSearch =
      searchQuery === '' ||
      item.namaVendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keterangan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-4 pb-24">
      {/* Top Banner */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-600 animate-pulse"></span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Bukti Pembayaran Riil
            </h2>
            <span className="text-[10px] font-bold bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full border border-violet-200">
              {list.length} Bukti
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Nota fisik, boarding pass tiket, invoice hotel & struk belanja terverifikasi
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenPrintPreview && list.length > 0 && (
            <button
              onClick={onOpenPrintPreview}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              title="Lihat & Cetak Daftar Bukti Pembayaran Format A4"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak A4</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Bukti Bayar</span>
          </button>
        </div>
      </div>

      {/* Modern Gradient Recap Card */}
      <div className="bg-linear-to-r from-violet-950 via-indigo-900 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-sm space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[11px] text-violet-200 uppercase tracking-wider font-semibold">
              Total Pengeluaran Riil Terlampir
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-violet-100 mt-1">
              {formatRupiah(totalNominal)}
            </div>
          </div>
          <span className="text-xs bg-white/15 px-3 py-1 rounded-full text-violet-100 font-semibold border border-white/10">
            {list.length} Lembar Bukti
          </span>
        </div>

        {onSyncToKuitansi && (
          <div className="pt-2.5 border-t border-violet-800/80 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-violet-200">
              Sinkronkan daftar bukti ini langsung ke tabel rincian Kuitansi?
            </span>
            <button
              onClick={onSyncToKuitansi}
              className="text-xs font-bold bg-white text-violet-950 px-3.5 py-1.5 rounded-xl hover:bg-violet-50 active:scale-95 transition-all shadow-xs inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              <span>Sinkronkan ke Kuitansi</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterCategory('semua')}
            className={`text-xs px-3 py-1 rounded-lg transition-all font-medium whitespace-nowrap ${
              filterCategory === 'semua'
                ? 'bg-violet-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterCategory('tiket')}
            className={`text-xs px-3 py-1 rounded-lg transition-all font-medium whitespace-nowrap ${
              filterCategory === 'tiket'
                ? 'bg-violet-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tiket
          </button>
          <button
            onClick={() => setFilterCategory('hotel')}
            className={`text-xs px-3 py-1 rounded-lg transition-all font-medium whitespace-nowrap ${
              filterCategory === 'hotel'
                ? 'bg-violet-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Hotel
          </button>
          <button
            onClick={() => setFilterCategory('bbm')}
            className={`text-xs px-3 py-1 rounded-lg transition-all font-medium whitespace-nowrap ${
              filterCategory === 'bbm'
                ? 'bg-violet-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            BBM/Tol
          </button>
        </div>

        {list.length > 2 && (
          <div className="relative min-w-[140px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari vendor / struk..."
              className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 w-full focus:outline-none focus:border-violet-500"
            />
          </div>
        )}
      </div>

      {/* List of Vouchers */}
      {filteredList.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-2xl border border-dashed border-slate-200">
          <div className="w-12 h-12 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-3">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-700">
            {list.length === 0 ? 'Belum Ada Bukti Pembayaran' : 'Tidak Ada Bukti Sesuai Filter'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Upload foto invoice hotel, tiket speedboat/pesawat, atau struk bensin untuk kelengkapan SPJ.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white text-xs font-semibold rounded-xl hover:bg-violet-700 transition-colors"
          >
            <Camera className="w-4 h-4" />
            <span>Foto Struk Pembayaran</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="p-3.5 border-b border-slate-100 flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        kategoriLabels[item.kategori]?.color || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {kategoriLabels[item.kategori]?.label || item.kategori}
                    </span>
                    <span className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                      {item.filterMode === 'bw' ? '📄 B&W Tajam' : item.filterMode === 'contrast' ? '✨ Magic Color' : '🎨 Asli'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">
                    {item.namaVendor}
                  </h4>
                  <div className="text-[11px] font-mono text-slate-400">
                    No: {item.nomorBukti}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold font-mono text-slate-900">
                    {formatRupiah(item.nominal)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {formatTanggalIndo(item.tanggalTransaksi)}
                  </div>
                </div>
              </div>

              {/* Thumbnail Struk & Keterangan */}
              <div className="p-3 flex items-center gap-3 bg-slate-50/70">
                <div
                  className="w-16 h-16 rounded-xl bg-slate-200 shrink-0 overflow-hidden border border-slate-200 cursor-pointer relative group"
                  onClick={() => setSelectedPreview(item)}
                >
                  <img
                    src={item.fotoUrl}
                    alt={item.namaVendor}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    style={{
                      filter: item.filterMode === 'bw'
                        ? 'grayscale(100%) contrast(190%) brightness(105%)'
                        : item.filterMode === 'contrast'
                        ? 'contrast(135%) brightness(105%)'
                        : 'none'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {item.keterangan || 'Tanpa keterangan tambahan.'}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium mt-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Sesuai Pengeluaran Riil (Valid)</span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-2.5 px-3.5 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedPreview(item)}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 font-medium"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Nota</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="inline-flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-md transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* WIZARD STEP 3 COMPLETION FOOTER */}
      <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2.5 pb-20">
        {onPrevStep && (
          <button
            type="button"
            onClick={onPrevStep}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Foto GPS (Tahap 2)</span>
          </button>
        )}

        <div className="flex flex-wrap items-center gap-2 ml-auto">
          {onOpenPrintPreview && (
            <button
              type="button"
              onClick={onOpenPrintPreview}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-cyan-300" />
              <span>Cetak Nota A4</span>
            </button>
          )}

          {onCompleteWizard && (
            <button
              type="button"
              onClick={onCompleteWizard}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6547ED] hover:bg-[#5537E6] active:scale-95 text-white text-xs font-bold rounded-2xl shadow-sm shadow-purple-900/10 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Selesai & Buka Paket Cetak SPJ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Modal Upload Bukti */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-violet-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Upload Bukti Pembayaran / Struk
                </h3>
              </div>
              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
              {/* Expensify-style Quick Preset Bar */}
              <div className="bg-violet-50/70 border border-violet-200/80 p-2.5 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-violet-900">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Isi Cepat / Contoh Struk Riil SPJ:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyQuickPreset({
                      kategori: 'tiket',
                      vendor: 'Speedboat Reguler Miko Natalia (PP)',
                      nominal: 350000,
                      keterangan: 'Tiket rute Tanjung Selor - Tarakan (PP)'
                    })}
                    className="text-[10px] font-medium bg-white hover:bg-violet-100 border border-violet-200 px-2 py-1 rounded-md text-slate-800 transition-colors"
                  >
                    Speedboat (Rp 350rb)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickPreset({
                      kategori: 'hotel',
                      vendor: 'Hotel Neo Tarakan',
                      nominal: 360000,
                      keterangan: 'Penginapan dinas standar SBM 1 malam'
                    })}
                    className="text-[10px] font-medium bg-white hover:bg-violet-100 border border-violet-200 px-2 py-1 rounded-md text-slate-800 transition-colors"
                  >
                    Hotel SBM (Rp 360rb)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickPreset({
                      kategori: 'bbm',
                      vendor: 'SPBU Pertamina 64.771.01',
                      nominal: 250000,
                      keterangan: 'BBM operasional kendaraan dinas roda 4'
                    })}
                    className="text-[10px] font-medium bg-white hover:bg-violet-100 border border-violet-200 px-2 py-1 rounded-md text-slate-800 transition-colors"
                  >
                    BBM Pertamina (Rp 250rb)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickPreset({
                      kategori: 'tol',
                      vendor: 'Taksi Bandara Juwata',
                      nominal: 150000,
                      keterangan: 'Transport lokal bandara ke pelabuhan'
                    })}
                    className="text-[10px] font-medium bg-white hover:bg-violet-100 border border-violet-200 px-2 py-1 rounded-md text-slate-800 transition-colors"
                  >
                    Taksi/Lokal (Rp 150rb)
                  </button>
                </div>
              </div>

              {/* Photo Upload Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Foto Nota / Struk Fisik <span className="text-rose-500">*</span>
                </label>

                {isCompressing ? (
                  <div className="aspect-16/10 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-500">
                    <Sparkles className="w-6 h-6 animate-spin text-violet-600" />
                    <span className="text-xs font-medium">Mengoptimalkan foto nota...</span>
                  </div>
                ) : fotoUrl ? (
                  <div className="space-y-2">
                    <div className="relative aspect-16/10 rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                      <img
                        src={fotoUrl}
                        alt="Preview Bukti"
                        className="w-full h-full object-cover transition-all"
                        style={{
                          filter: filterMode === 'bw'
                            ? 'grayscale(100%) contrast(190%) brightness(105%)'
                            : filterMode === 'contrast'
                            ? 'contrast(135%) brightness(105%)'
                            : 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setFotoUrl('')}
                        className="absolute top-2 right-2 bg-rose-600 text-white p-1.5 rounded-lg hover:bg-rose-700 transition-colors shadow-xs"
                        title="Ganti Foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* CamScanner Filter Picker */}
                    <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-xl text-[11px]">
                      <span className="text-slate-600 font-bold px-1 flex items-center gap-1">
                        <Filter className="w-3 h-3 text-violet-600" /> Filter Cetak:
                      </span>
                      <div className="flex items-center gap-1 font-semibold">
                        <button
                          type="button"
                          onClick={() => setFilterMode('normal')}
                          className={`px-2 py-0.5 rounded-lg transition-all ${
                            filterMode === 'normal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Asli
                        </button>
                        <button
                          type="button"
                          onClick={() => setFilterMode('bw')}
                          className={`px-2 py-0.5 rounded-lg transition-all ${
                            filterMode === 'bw' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                          title="Sangat tajam untuk cetak struk thermal A4"
                        >
                          B&W Tajam
                        </button>
                        <button
                          type="button"
                          onClick={() => setFilterMode('contrast')}
                          className={`px-2 py-0.5 rounded-lg transition-all ${
                            filterMode === 'contrast' ? 'bg-white text-violet-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Kontras
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-violet-300 bg-violet-50/50 hover:bg-violet-50 active:scale-98 rounded-xl text-violet-700 transition-all gap-1.5"
                    >
                      <Camera className="w-6 h-6 text-violet-600" />
                      <span className="text-xs font-bold">Kamera HP</span>
                      <span className="text-[10px] text-violet-600/70">Foto Langsung</span>
                    </button>
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 active:scale-98 rounded-xl text-slate-700 transition-all gap-1.5"
                    >
                      <Upload className="w-6 h-6 text-slate-500" />
                      <span className="text-xs font-bold">Pilih Galeri</span>
                      <span className="text-[10px] text-slate-400">PDF / Foto Struk</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Kategori & Nominal */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Biaya <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="tiket">Tiket & Transportasi</option>
                    <option value="hotel">Penginapan & Hotel</option>
                    <option value="bbm">BBM / Bensin</option>
                    <option value="tol">Tol & Parkir</option>
                    <option value="konsumsi">Konsumsi / Makan</option>
                    <option value="lainnya">Pengeluaran Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nominal Biaya (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={nominal}
                    onChange={(e) => setNominal(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="mis: 850000"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Nama Vendor & No Bukti */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Toko / Maskapai / Vendor <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={namaVendor}
                    onChange={(e) => setNamaVendor(e.target.value)}
                    placeholder="mis: Speedboat Reguler"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    No. Bukti / Kode Booking
                  </label>
                  <input
                    type="text"
                    value={nomorBukti}
                    onChange={(e) => setNomorBukti(e.target.value)}
                    placeholder="mis: SB-TRK-NNK/042"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              {/* Tanggal Transaksi */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Transaksi Struk
                </label>
                <input
                  type="date"
                  value={tanggalTransaksi}
                  onChange={(e) => setTanggalTransaksi(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keterangan Pembayaran
                </label>
                <textarea
                  rows={2}
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="mis: Transportasi PP Tanjung Selor - Tarakan - Nunukan..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 leading-relaxed"
                />
              </div>

              {/* Status Riil toggle */}
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="statusRiilCheck"
                  checked={statusRiil}
                  onChange={(e) => setStatusRiil(e.target.checked)}
                  className="w-4 h-4 text-violet-600 rounded"
                />
                <label htmlFor="statusRiilCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Masuk dalam Daftar Pengeluaran Riil yang Sah (Sesuai Bukti Terlampir)
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-violet-600 hover:bg-violet-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-500/20 inline-flex items-center justify-center gap-1.5 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Bukti Bayar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Struk Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-2xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setSelectedPreview(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300 p-1"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedPreview.fotoUrl}
              alt={selectedPreview.namaVendor}
              className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl bg-white transition-all"
              style={{
                filter: selectedPreview.filterMode === 'bw'
                  ? 'grayscale(100%) contrast(190%) brightness(105%)'
                  : selectedPreview.filterMode === 'contrast'
                  ? 'contrast(135%) brightness(105%)'
                  : 'none'
              }}
            />
            <div className="mt-3 text-center text-white space-y-1">
              <h3 className="text-sm font-bold flex items-center justify-center gap-2">
                <span>{selectedPreview.namaVendor} • {formatRupiah(selectedPreview.nominal)}</span>
                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-white/20">
                  {selectedPreview.filterMode === 'bw' ? '📄 B&W Tajam' : '🎨 Asli'}
                </span>
              </h3>
              <p className="text-xs text-slate-300">{selectedPreview.keterangan || 'Bukti Transaksi'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
