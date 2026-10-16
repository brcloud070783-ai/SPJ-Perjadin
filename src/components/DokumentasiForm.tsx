import React, { useState, useRef } from 'react';
import { FotoDokumentasi } from '../types';
import { 
  Camera, 
  Upload, 
  MapPin, 
  Calendar, 
  Clock, 
  Trash2, 
  Plus, 
  Eye, 
  X, 
  Sparkles, 
  Navigation, 
  FileCheck, 
  Check, 
  AlertCircle,
  ExternalLink,
  Copy,
  Layers,
  Search,
  Printer,
  Zap,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { formatTanggalIndo } from '../utils/terbilang';

interface DokumentasiFormProps {
  list: FotoDokumentasi[];
  onAdd: (item: FotoDokumentasi) => void;
  onDelete: (id: string) => void;
  onOpenPrintPreview?: () => void;
  onPrevStep?: () => void;
  onNextStep?: () => void;
}

export const DokumentasiForm: React.FC<DokumentasiFormProps> = ({
  list,
  onAdd,
  onDelete,
  onOpenPrintPreview,
  onPrevStep,
  onNextStep
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<FotoDokumentasi | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kategori, setKategori] = useState<FotoDokumentasi['kategori']>('rapat');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [waktu, setWaktu] = useState(
    new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
  );
  const [lokasi, setLokasi] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [gpsData, setGpsData] = useState<{ latitude: number; longitude: number; accuracy?: number } | undefined>(undefined);
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setJudul('');
    setDeskripsi('');
    setKategori('rapat');
    setLokasi('');
    setFotoUrl('');
    setGpsData(undefined);
    setGpsError('');
    setShowAddModal(false);
  };

  // Client-side image compression using HTML5 Canvas to prevent high-res phone camera images from freezing browser
  const processAndCompressImage = (file: File) => {
    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1280;
        const MAX_HEIGHT = 1280;
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
          if (!gpsData) {
            fetchGpsLocation();
          }
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

  const fetchGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Browser tidak mendukung deteksi GPS.');
      return;
    }

    setIsGettingGps(true);
    setGpsError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsData({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy)
        });
        setIsGettingGps(false);
      },
      (err) => {
        setIsGettingGps(false);
        setGpsError('Izin lokasi belum diberikan. Koordinat dapat diisi manual.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fotoUrl) {
      alert('Silakan ambil atau upload foto kegiatan!');
      return;
    }
    if (!judul.trim()) {
      alert('Judul kegiatan wajib diisi!');
      return;
    }

    const newItem: FotoDokumentasi = {
      id: `dok-${Date.now()}`,
      judul: judul.trim(),
      deskripsi: deskripsi.trim(),
      kategori,
      tanggal,
      waktu,
      lokasi: lokasi.trim() || 'Lokasi Kegiatan Dinas',
      koordinatGps: gpsData,
      fotoUrl,
      createdAt: Date.now()
    };

    onAdd(newItem);
    resetForm();
  };

  // Filtered items
  const filteredList = list.filter((item) => {
    const matchCat = filterCategory === 'semua' || item.kategori === filterCategory;
    const matchSearch =
      searchQuery === '' ||
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const categories = [
    { id: 'semua', label: 'Semua' },
    { id: 'rapat', label: 'Rapat' },
    { id: 'lapangan', label: 'Lapangan' },
    { id: 'presentasi', label: 'Paparan' },
    { id: 'kunjungan', label: 'Kunjungan' }
  ];

  return (
    <div className="space-y-4 pb-24">
      {/* Top Banner */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Dokumentasi Foto Kegiatan
            </h2>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              {list.length} Foto
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Bukti visual kegiatan dinas lapangan dilengkapi stempel waktu & geotagging GPS
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenPrintPreview && list.length > 0 && (
            <button
              onClick={onOpenPrintPreview}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              title="Lihat & Cetak Hasil Dokumentasi Format A4"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak A4</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Ambil / Upload Foto</span>
          </button>
        </div>
      </div>

      {/* Filter Category Chips & Search */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCategory(c.id)}
              className={`text-xs px-3 py-1 rounded-lg transition-all font-medium whitespace-nowrap ${
                filterCategory === c.id
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {list.length > 2 && (
          <div className="relative min-w-[140px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari dokumentasi..."
              className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 w-full focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}
      </div>

      {/* Grid of documented photos */}
      {filteredList.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-2xl border border-dashed border-slate-200">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-700">
            {list.length === 0 ? 'Belum Ada Dokumentasi Kegiatan' : 'Tidak Ada Foto Sesuai Filter'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Ambil foto rapat, kunjungan lapangan, atau kegiatan dinas untuk melengkapi SPJ.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
          >
            <Camera className="w-4 h-4" />
            <span>Ambil Foto Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Photo preview container */}
              <div 
                className="relative aspect-4/3 bg-slate-900 group cursor-pointer"
                onClick={() => setSelectedPreview(item)}
              >
                <img
                  src={item.fotoUrl}
                  alt={item.judul}
                  className="w-full h-full object-cover transition-transform group-hover:scale-102"
                />

                {/* Category badge */}
                <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  {item.kategori}
                </div>

                {/* Fullscreen view trigger */}
                <div className="absolute top-2.5 right-2.5 bg-slate-900/70 hover:bg-slate-900 text-white p-1.5 rounded-lg opacity-90 transition-opacity">
                  <Eye className="w-3.5 h-3.5" />
                </div>

                {/* Watermark stamp overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-2.5 text-white">
                  <div className="flex items-center gap-1 text-[10px] text-amber-300 font-mono">
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span>{formatTanggalIndo(item.tanggal)} • {item.waktu} WITA</span>
                  </div>
                  {item.koordinatGps && (
                    <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-mono mt-0.5">
                      <Navigation className="w-2.5 h-2.5 shrink-0" />
                      <span>GPS: {item.koordinatGps.latitude.toFixed(5)}, {item.koordinatGps.longitude.toFixed(5)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Detail Content */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {item.judul}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{item.lokasi}</span>
                  </div>
                  {item.deskripsi && (
                    <p className="text-[11px] text-slate-600 mt-2 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {item.deskripsi}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                  {item.koordinatGps ? (
                    <a
                      href={`https://www.google.com/maps?q=${item.koordinatGps.latitude},${item.koordinatGps.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Peta Google</span>
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-400">ID: {item.id}</span>
                  )}

                  <button
                    onClick={() => onDelete(item.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* WIZARD STEP NAVIGATION FOOTER */}
      <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2.5 pb-20">
        {onPrevStep && (
          <button
            type="button"
            onClick={onPrevStep}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Kuitansi (Tahap 1)</span>
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
              <span>Cetak Foto A4</span>
            </button>
          )}

          {onNextStep && (
            <button
              type="button"
              onClick={onNextStep}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-110 active:scale-95 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>Lanjut: Nota & Bukti Bayar (Tahap 3)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Modal: Ambil / Upload Foto Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Ambil / Upload Dokumentasi Foto
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
              {/* Photo Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Foto Dokumentasi Kegiatan <span className="text-rose-500">*</span>
                </label>

                {isCompressing ? (
                  <div className="aspect-16/10 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-500">
                    <Sparkles className="w-6 h-6 animate-spin text-emerald-600" />
                    <span className="text-xs font-medium">Memproses & mengoptimalkan foto...</span>
                  </div>
                ) : fotoUrl ? (
                  <div className="relative aspect-16/10 rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                    <img src={fotoUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFotoUrl('')}
                      className="absolute top-2 right-2 bg-rose-600 text-white p-1.5 rounded-lg hover:bg-rose-700 transition-colors shadow-xs"
                      title="Ganti Foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {/* Timestamp Camera / Geotagging Watermark overlay */}
                    <div className="absolute bottom-2 inset-x-2 bg-black/85 backdrop-blur-xs p-2 rounded-lg text-[9px] text-white font-mono leading-tight border border-white/20">
                      <div className="text-amber-300 font-bold flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                        <span>{lokasi || 'Tarakan / Nunukan, Prov. Kalimantan Utara'}</span>
                      </div>
                      <div className="text-slate-200 text-[8px] mt-0.5 flex flex-wrap items-center gap-x-2">
                        <span>{formatTanggalIndo(tanggal)} • {waktu} WITA</span>
                        {gpsData ? (
                          <span className="text-emerald-400 font-bold">
                            GPS: {gpsData.latitude.toFixed(4)}°, {gpsData.longitude.toFixed(4)}° (±{gpsData.accuracy}m)
                          </span>
                        ) : (
                          <span className="text-amber-300/80">GPS: Mode Otomatis</span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Native Camera Trigger */}
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 active:scale-98 rounded-xl text-emerald-700 transition-all gap-1.5"
                    >
                      <Camera className="w-6 h-6 text-emerald-600" />
                      <span className="text-xs font-bold">Kamera HP</span>
                      <span className="text-[10px] text-emerald-600/70">Jepret Langsung</span>
                    </button>
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {/* Gallery / File Picker */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100/80 active:scale-98 rounded-xl text-slate-700 transition-all gap-1.5"
                    >
                      <Upload className="w-6 h-6 text-slate-500" />
                      <span className="text-xs font-bold">Pilih Galeri</span>
                      <span className="text-[10px] text-slate-400">File Foto</span>
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

              {/* Quick Agenda Templates */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 p-2.5 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-900">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Isi Cepat Format Agenda Dinas:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setJudul('Rapat Koordinasi & Evaluasi Program Layanan');
                      setKategori('rapat');
                      setDeskripsi('Koordinasi bersama jajaran pejabat dinas dan stakeholder terkait tindak lanjut kegiatan.');
                    }}
                    className="text-[10px] font-medium bg-white hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-md text-slate-800 transition-colors"
                  >
                    Rapat Koordinasi
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setJudul('Kunjungan Lapangan & Uji Petik Sarana Sekolah');
                      setKategori('lapangan');
                      setDeskripsi('Pemeriksaan langsung kondisi fisik sarana prasarana sekolah dan verifikasi kelayakan.');
                    }}
                    className="text-[10px] font-medium bg-white hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-md text-slate-800 transition-colors"
                  >
                    Kunjungan Lapangan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setJudul('Pendampingan & Klarifikasi Tindak Lanjut Temuan BPK');
                      setKategori('presentasi');
                      setDeskripsi('Pemberian klarifikasi, penjelasan bukti pendukung, dan penandatanganan berita acara.');
                    }}
                    className="text-[10px] font-medium bg-white hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-md text-slate-800 transition-colors"
                  >
                    Pendampingan BPK
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setJudul('Serah Terima Berkas Administrasi & SPJ');
                      setKategori('serah_terima');
                      setDeskripsi('Penyerahan dokumen laporan hasil pelaksanaan tugas dan kelengkapan bukti pembayaran riil.');
                    }}
                    className="text-[10px] font-medium bg-white hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-md text-slate-800 transition-colors"
                  >
                    Serah Terima SPJ
                  </button>
                </div>
              </div>

              {/* Judul Kegiatan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Agenda / Nama Kegiatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="mis: Pendampingan Tindak Lanjut Temuan BPK di Disdikbud Nunukan"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Kategori & Lokasi */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Agenda
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="rapat">Rapat / Koordinasi</option>
                    <option value="lapangan">Kunjungan Lapangan</option>
                    <option value="presentasi">Paparan / Presentasi</option>
                    <option value="kunjungan">Kunjungan Kerja</option>
                    <option value="serah_terima">Serah Terima Berkas</option>
                    <option value="lainnya">Agenda Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tempat / Ruangan
                  </label>
                  <input
                    type="text"
                    value={lokasi}
                    onChange={(e) => setLokasi(e.target.value)}
                    placeholder="mis: Aula Disdikbud Nunukan"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Tanggal & Waktu */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Kegiatan
                  </label>
                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Waktu (Jam:Menit)
                  </label>
                  <input
                    type="text"
                    value={waktu}
                    onChange={(e) => setWaktu(e.target.value)}
                    placeholder="09:30"
                    className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              {/* GPS Koordinat Tracker */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Validasi Geotagging GPS</span>
                  </div>
                  <button
                    type="button"
                    onClick={fetchGpsLocation}
                    disabled={isGettingGps}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-md transition-colors disabled:opacity-50"
                  >
                    {isGettingGps ? 'Mendeteksi...' : 'Deteksi GPS'}
                  </button>
                </div>

                {gpsData ? (
                  <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50/80 p-2 rounded border border-emerald-200 flex items-center justify-between">
                    <span>{gpsData.latitude.toFixed(6)}, {gpsData.longitude.toFixed(6)}</span>
                    <span className="text-[10px] text-emerald-600">±{gpsData.accuracy}m</span>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-500">
                    Tekan 'Deteksi GPS' untuk merekam koordinat koordinat riil saat dinas luar kota.
                  </div>
                )}
                {gpsError && (
                  <div className="text-[10px] text-amber-700 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>{gpsError}</span>
                  </div>
                )}
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Uraian / Ringkasan Hasil Kegiatan
                </label>
                <textarea
                  rows={2}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Ringkasan poin pembahasan, kesepakatan, atau temuan lapangan..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 leading-relaxed"
                />
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
                  className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 inline-flex items-center justify-center gap-1.5 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Dokumentasi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setSelectedPreview(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300 p-1"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedPreview.fotoUrl}
              alt={selectedPreview.judul}
              className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl"
            />
            <div className="mt-3 text-center text-white space-y-1">
              <h3 className="text-sm font-bold">{selectedPreview.judul}</h3>
              <p className="text-xs text-slate-300">{selectedPreview.lokasi} • {formatTanggalIndo(selectedPreview.tanggal)}</p>
              {selectedPreview.deskripsi && (
                <p className="text-xs text-slate-400 max-w-lg mx-auto">{selectedPreview.deskripsi}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
