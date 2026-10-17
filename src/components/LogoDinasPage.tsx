import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Check, 
  RotateCcw, 
  Building2, 
  FileText, 
  Sparkles, 
  Layers, 
  Eye, 
  Download, 
  Trash2, 
  CheckCircle2, 
  ArrowLeft,
  Info,
  ShieldCheck,
  Grid
} from 'lucide-react';
import { KuitansiData, ProjectSPJ, TabType } from '../types';
import { LOGO_KALTARA_SVG } from '../utils/logoKaltara';
import { PRESET_LOGOS, PresetLogo } from '../utils/presetLogos';

interface LogoDinasPageProps {
  kuitansi: KuitansiData;
  activeProject?: ProjectSPJ;
  onUpdateKuitansi: (updated: KuitansiData) => void;
  onUpdateAllProjectsLogo?: (logoUrl: string) => void;
  onNavigateToTab: (tab: TabType) => void;
}

export const LogoDinasPage: React.FC<LogoDinasPageProps> = ({
  kuitansi,
  activeProject,
  onUpdateKuitansi,
  onUpdateAllProjectsLogo,
  onNavigateToTab
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [applyToAll, setApplyToAll] = useState(true);

  // Active logo URL
  const currentLogoUrl = kuitansi.logoUrl || LOGO_KALTARA_SVG;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (PNG, JPG, WEBP, atau SVG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        updateLogo(base64, `Logo berhasil diunggah dari ${file.name}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const updateLogo = (newUrl: string, message: string) => {
    const updated = { ...kuitansi, logoUrl: newUrl };
    onUpdateKuitansi(updated);

    if (applyToAll && onUpdateAllProjectsLogo) {
      onUpdateAllProjectsLogo(newUrl);
    }

    showToast(message);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFieldChange = (field: keyof KuitansiData, value: string) => {
    onUpdateKuitansi({
      ...kuitansi,
      [field]: value
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 pt-4 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-16 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-purple-500/30 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}

        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-[#180A30] via-[#2A1052] to-[#0000B3] text-white p-5 sm:p-7 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-semibold backdrop-blur-md border border-white/10">
                <Building2 className="w-3.5 h-3.5" />
                <span>Pengaturan Kepala Surat SPPD</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Upload & Kelola Logo Dinas
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl">
                Unggah logo resmi instansi Anda untuk ditampilkan secara otomatis di seluruh Kop Surat Kuitansi, SPT, SPD, dan Berkas SPJ A4.
              </p>
            </div>

            <button
              onClick={() => onNavigateToTab('kuitansi')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Kuitansi</span>
            </button>
          </div>
        </div>

        {/* GRID MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN: UPLOADER & PRESETS (7 cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* DRAG & DROP UPLOAD CARD */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0000B3] flex items-center justify-center font-bold">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">Unggah File Logo Baru</h2>
                    <p className="text-[11px] text-slate-500">Format yang didukung: PNG, JPG, WEBP, atau SVG (Maks. 5MB)</p>
                  </div>
                </div>
              </div>

              {/* Drag Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? 'border-[#0000B3] bg-blue-50/80 scale-[0.99]'
                    : 'border-slate-300 hover:border-purple-400 bg-slate-50/60 hover:bg-blue-50/30'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-[#0000B3]">
                  <ImageIcon className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700">
                    Klik di sini atau geser file logo ke area ini
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Disarankan gambar latar transparan (PNG) untuk hasil cetak yang paling bersih
                  </p>
                </div>

                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-[#0000B3] hover:bg-[#6820C9] text-white text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  Pilih File Gambar
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Batch apply option */}
              <div className="flex items-center gap-2 bg-blue-50/60 p-3 rounded-2xl border border-blue-100 text-xs">
                <input
                  type="checkbox"
                  id="applyToAllCheck"
                  checked={applyToAll}
                  onChange={(e) => setApplyToAll(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0000B3] focus:ring-[#0000B3] cursor-pointer"
                />
                <label htmlFor="applyToAllCheck" className="text-slate-700 font-medium cursor-pointer">
                  Terapkan logo ini ke <strong className="text-blue-950">semua berkas SPJ project</strong> di aplikasi
                </label>
              </div>
            </div>

            {/* PRESET GALLERY CARD */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-100 text-[#0096C7] flex items-center justify-center font-bold">
                    <Grid className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">Pilih dari Galeri Logo Resmi</h2>
                    <p className="text-[11px] text-slate-500">Preset logo pemerintah daerah dan kementerian siap pakai</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESET_LOGOS.map((preset) => {
                  const isSelected = currentLogoUrl === preset.url;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => updateLogo(preset.url, `Menggunakan ${preset.nama}`)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'border-[#0000B3] bg-blue-50/70 shadow-sm ring-2 ring-purple-500/20'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-12 h-14 bg-white border border-slate-200 rounded-xl p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                        <img
                          src={preset.url}
                          alt={preset.nama}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-[#0000B3] bg-blue-100/80 px-1.5 py-0.2 rounded mb-0.5">
                          {preset.kategori}
                        </span>
                        <h3 className="text-xs font-bold text-slate-800 truncate">
                          {preset.nama}
                        </h3>
                        <p className="text-[10px] text-slate-500 truncate">
                          {preset.deskripsi}
                        </p>
                      </div>

                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-[#0000B3] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="text-[10px] font-semibold text-[#0000B3] hover:underline shrink-0"
                        >
                          Pilih
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Reset Control */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => updateLogo(LOGO_KALTARA_SVG, 'Logo telah dikembalikan ke Kalimantan Utara resmi')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0000B3] bg-slate-100 hover:bg-blue-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset ke Logo Kaltara Resmi</span>
                </button>

                <p className="text-[10px] text-slate-400 italic">
                  Otomatis tersimpan di LocalStorage
                </p>
              </div>
            </div>

          </div>


          {/* RIGHT COLUMN: REALTIME KOP SURAT PREVIEW & INSTANSI DATA (5 cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* REALTIME KOP PREVIEW CARD */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 sticky top-20">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">Pratinjau Kop Surat</h2>
                    <p className="text-[11px] text-slate-500">Tampilan sesungguhnya pada cetak A4</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Live Preview
                </span>
              </div>

              {/* A4 Kop Surat Preview Canvas Box */}
              <div className="bg-white border-2 border-slate-800 p-4 rounded-xl shadow-md text-black font-serif">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-black">
                  {/* Logo Render Box */}
                  <div className="w-[58px] h-[70px] shrink-0 flex items-center justify-center bg-slate-50/50 p-1 rounded">
                    <img
                      src={currentLogoUrl}
                      alt="Logo Kop Instansi"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Header Text Render Box */}
                  <div className="flex-1 text-center space-y-0.5 leading-tight">
                    <h3 className="text-[11px] font-extrabold uppercase tracking-tight text-slate-900">
                      {kuitansi.instansiInduk || 'PEMERINTAH PROVINSI KALIMANTAN UTARA'}
                    </h3>
                    <h2 className="text-[12px] font-black uppercase text-slate-950 tracking-wide">
                      {kuitansi.namaDinas || 'DINAS KOMUNIKASI, INFORMATIKA, STATISTIK DAN PERSANDIAN'}
                    </h2>
                    <p className="text-[9px] font-normal text-slate-800 leading-tight">
                      {kuitansi.alamatKop || 'Jl. Rambutan No. 12, Tanjung Selor, Kalimantan Utara 77212'}
                    </p>
                    <p className="text-[8.5px] font-semibold text-slate-700">
                      {kuitansi.kontakKop || 'Email: diskominfo@kaltaraprov.go.id | Website: diskominfo.kaltaraprov.go.id'}
                    </p>
                  </div>
                </div>

                {/* Sub Header SPD / Kuitansi Line Sample */}
                <div className="pt-2 text-center">
                  <span className="text-[10px] font-bold underline tracking-wider uppercase">
                    KUITANSI / BUKTI PEMBAYARAN
                  </span>
                  <p className="text-[8.5px] text-slate-600">
                    Nomor: {kuitansi.nomorKuitansi || '090/SPD-KUITANSI/2026'}
                  </p>
                </div>
              </div>

              {/* INSTANSI HEADER TEXT QUICK EDITORS */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#0000B3]" />
                  <span>Ubah Teks Kop Surat Langsung</span>
                </h3>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 mb-0.5">
                      Instansi Induk
                    </label>
                    <input
                      type="text"
                      value={kuitansi.instansiInduk || ''}
                      onChange={(e) => handleFieldChange('instansiInduk', e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0000B3] font-bold uppercase bg-white"
                      placeholder="PEMERINTAH PROVINSI KALIMANTAN UTARA"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 mb-0.5">
                      Nama Dinas / Badan
                    </label>
                    <input
                      type="text"
                      value={kuitansi.namaDinas || ''}
                      onChange={(e) => handleFieldChange('namaDinas', e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0000B3] font-bold uppercase bg-white"
                      placeholder="DINAS KOMUNIKASI DAN INFORMATIKA"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 mb-0.5">
                      Alamat Jalan Kop
                    </label>
                    <input
                      type="text"
                      value={kuitansi.alamatKop || ''}
                      onChange={(e) => handleFieldChange('alamatKop', e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0000B3] bg-white"
                      placeholder="Jl. Rambutan No. 12, Tanjung Selor"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 mb-0.5">
                      Kontak / Website / Email
                    </label>
                    <input
                      type="text"
                      value={kuitansi.kontakKop || ''}
                      onChange={(e) => handleFieldChange('kontakKop', e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0000B3] bg-white"
                      placeholder="Email: dinas@kaltaraprov.go.id"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => onNavigateToTab('kuitansi')}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00C4CC] to-[#0096C7] hover:brightness-110 text-slate-950 font-extrabold text-xs transition-all shadow-sm active:scale-95 text-center cursor-pointer"
                >
                  Buka Form Kuitansi
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateToTab('paket_lengkap')}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm active:scale-95 text-center cursor-pointer"
                >
                  Pratinjau Cetak Paket
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
