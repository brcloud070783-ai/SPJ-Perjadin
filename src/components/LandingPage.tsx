import React from 'react';
import { 
  Plus, 
  Receipt, 
  ArrowUpRight, 
  ArrowRight, 
  Check, 
  Printer, 
  Sparkles,
  Clock,
  ShieldCheck,
  MapPin,
  FileText
} from 'lucide-react';
import { TabType, KuitansiData, FotoDokumentasi, BuktiBayar, ProjectSPJ } from '../types';

interface LandingPageProps {
  onStartApp: (tab?: TabType) => void;
  kuitansi?: KuitansiData;
  dokumentasiList?: FotoDokumentasi[];
  buktiBayarList?: BuktiBayar[];
  activeProject?: ProjectSPJ;
  projects?: ProjectSPJ[];
  onOpenProjectManager?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onStartApp,
  kuitansi,
  dokumentasiList = [],
  buktiBayarList = [],
  activeProject,
  projects = [],
  onOpenProjectManager
}) => {
  const totalBiaya = kuitansi?.rincianBiaya?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0;
  
  const nomorSPD = activeProject?.nomorSPD || kuitansi?.nomorSPPD || '090/123/SPD/2026';
  const kotaAsal = kuitansi?.kotaAsal || 'Tanjung Selor';
  const kotaTujuan = kuitansi?.kotaTujuan || 'Tarakan';

  const tglBerangkat = kuitansi?.tanggalBerangkat 
    ? new Date(kuitansi.tanggalBerangkat).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    : '1 Apr';
    
  const tglKembali = kuitansi?.tanggalKembali 
    ? new Date(kuitansi.tanggalKembali).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : '3 Apr 2026';

  const hasKuitansi = Boolean(kuitansi?.namaPelaksana);
  const hasFoto = dokumentasiList.length > 0;
  const hasNota = buktiBayarList.length > 0;

  return (
    <div className="max-w-md mx-auto px-1 py-1 space-y-3.5 animate-fade-in pb-24 text-slate-800">
      
      {/* 1. HERO SPJ STATUS TRACKER (PARCELLY TIMELINE CARD) */}
      <div className="bg-gradient-to-br from-[#7357FF] via-[#6547ED] to-[#5133E6] text-white rounded-[28px] p-4 sm:p-5 shadow-lg shadow-purple-900/15 relative overflow-hidden">
        {/* Subtle decorative concentric orbital lines */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full border border-white/10 pointer-events-none" />

        <div className="relative z-10 space-y-3">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-purple-200/90 tracking-wide uppercase">
              SPJ Aktif · Dalam Proses
            </span>

            <button
              onClick={() => onStartApp('kuitansi')}
              className="w-7 h-7 rounded-full bg-white text-[#6547ED] flex items-center justify-center font-black shadow-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title="Buka & Edit SPJ Ini"
            >
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Main Identifier: Nomor SPD */}
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight font-mono">
              {nomorSPD}
            </h2>
            <p className="text-[11px] text-purple-100 font-medium truncate mt-0.5">
              {kuitansi?.namaPelaksana ? `Pelaksana: ${kuitansi.namaPelaksana}` : 'Kuitansi Perjalanan Dinas'}
            </p>
          </div>

          {/* Date Range & Stepper Progress */}
          <div className="space-y-1.5 pt-2 border-t border-white/15">
            <div className="flex justify-between items-center text-[10px] text-purple-200 font-mono">
              <span>{tglBerangkat}</span>
              <span>Selesai: {tglKembali}</span>
            </div>

            {/* Stepper Line with Checkmark Nodes */}
            <div className="flex items-center justify-between relative px-1">
              <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 h-0.5 bg-white/20 -z-0" />

              {/* Step 1: Kuitansi */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                  hasKuitansi ? 'bg-white text-[#6547ED]' : 'bg-white/30 text-white'
                }`}>
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className="text-[8px] text-purple-200 mt-0.5 font-semibold">Kuitansi</span>
              </div>

              {/* Step 2: Foto GPS */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                  hasFoto ? 'bg-white text-[#6547ED]' : 'bg-white/30 text-white'
                }`}>
                  {hasFoto ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '2'}
                </div>
                <span className="text-[8px] text-purple-200 mt-0.5 font-semibold">Foto GPS</span>
              </div>

              {/* Step 3: Nota Bayar */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                  hasNota ? 'bg-white text-[#6547ED]' : 'bg-white/30 text-white'
                }`}>
                  {hasNota ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '3'}
                </div>
                <span className="text-[8px] text-purple-200 mt-0.5 font-semibold">Nota Fisik</span>
              </div>

              {/* Step 4: Paket Cetak A4 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                  hasKuitansi && hasFoto ? 'bg-[#00E5FF] text-slate-950 shadow-xs' : 'bg-white/30 text-white'
                }`}>
                  <Printer className="w-2.5 h-2.5" />
                </div>
                <span className="text-[8px] text-purple-200 mt-0.5 font-semibold">Cetak</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PUSAT PERHATIAN UTAMA: KOMBINASI WARNA + SIMBOL + MICROCOPY (BUKAN BESAR) */}
      {/* ========================================================================= */}
      <div className="relative group">
        {/* Soft focused glow halo */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6547ED]/20 to-[#00C4CC]/20 rounded-[28px] blur-sm opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <button
          onClick={() => onStartApp('kuitansi')}
          className="w-full relative bg-white hover:bg-[#FAF9FE] rounded-[26px] p-4 sm:p-4.5 border-2 border-[#6547ED]/30 hover:border-[#6547ED] shadow-sm hover:shadow-md transition-all cursor-pointer text-left active:scale-[0.99] flex flex-col gap-3 group"
        >
          {/* Top Bar: Microcopy Kicker + Tag Est. Waktu */}
          <div className="flex items-center justify-between text-[10px] w-full">
            <span className="inline-flex items-center gap-1 font-extrabold text-[#6547ED] uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100/80">
              <Sparkles className="w-2.5 h-2.5 fill-[#6547ED]" />
              <span>Standar Permenkeu RI 2026</span>
            </span>

            <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>~3 mnt selesai</span>
            </span>
          </div>

          {/* Center Body: Gambar Simbol Khusus + Teks Utama + Tombol Aksi */}
          <div className="flex items-center justify-between gap-3 w-full">
            
            {/* GAMBAR SIMBOL KHUSUS SPJ (Vector Symbol Lockup) */}
            <div className="relative shrink-0">
              {/* Symbolic squircle container with purple gradient and soft shadow */}
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-[#5133E6] via-[#6547ED] to-[#7B5CFF] text-white flex items-center justify-center shadow-md shadow-purple-900/20 group-hover:scale-105 transition-transform relative overflow-hidden">
                
                {/* Visual Stamp Line / Watermark inside the symbol */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none" />

                {/* Layered Document & Stamp Vector Symbol */}
                <svg 
                  className="w-7 h-7 text-white drop-shadow-xs" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  {/* Base document sheet */}
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  {/* Stamp check lines */}
                  <line x1="9" y1="13" x2="15" y2="13" />
                  <line x1="9" y1="17" x2="13" y2="17" />
                </svg>

                {/* Miniature Plus badge on bottom right of the symbol */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#00E5FF] text-slate-950 flex items-center justify-center font-black shadow-xs border-2 border-white">
                  <Plus className="w-3 h-3 stroke-[3]" />
                </div>
              </div>
            </div>

            {/* DETAIL & MICROCOPY BERBOBOT */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#6547ED] transition-colors leading-tight tracking-tight">
                  Buat SPJ Baru
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5 line-clamp-2">
                Kuitansi SPD otomatis, stempel Foto GPS, & bukti nota fisik siap cetak.
              </p>
            </div>

            {/* ACTION PILL WITH MICROCOPY (ARROW BUTTON) */}
            <div className="shrink-0 flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#6547ED] text-white flex items-center justify-center shadow-xs group-hover:bg-[#5133E6] group-hover:translate-x-0.5 transition-all">
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

          </div>

          {/* Bottom Footnote: 3 Micro Step Pills */}
          <div className="pt-2 border-t border-purple-50 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6547ED]" />
              1. Kuitansi
            </span>
            <span className="text-slate-300">→</span>
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              2. Foto GPS
            </span>
            <span className="text-slate-300">→</span>
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              3. Nota SPJ
            </span>
            <span className="font-bold text-[#6547ED] ml-auto">
              Mulai →
            </span>
          </div>

        </button>
      </div>

      {/* 3. BERKAS SPJ BERJALAN (INFORMASI SPJ TERBARU) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold text-slate-900 tracking-tight uppercase">
            Berkas SPJ Berjalan
          </h3>
          <button
            onClick={() => onOpenProjectManager ? onOpenProjectManager() : onStartApp('berkas')}
            className="text-[11px] font-bold text-[#6547ED] hover:text-[#5133E6] transition-colors cursor-pointer"
          >
            Lihat Semua
          </button>
        </div>

        {/* Shipment / SPJ Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          
          {/* Card 1: Active Project Details */}
          <div 
            onClick={() => onStartApp('kuitansi')}
            className="bg-white rounded-[22px] p-3.5 border border-purple-100/70 shadow-xs hover:shadow-sm transition-all cursor-pointer space-y-2.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-50 text-[#6547ED] border border-purple-100">
                {kotaAsal.slice(0, 3).toUpperCase()} → {kotaTujuan.slice(0, 3).toUpperCase()}
              </span>
              <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Draf Aktif
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#6547ED] transition-colors line-clamp-1">
                {kotaAsal} → {kotaTujuan}
              </h4>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                {activeProject?.namaProject || 'SPJ Perjalanan Dinas'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
              <span className="text-slate-500 font-medium">
                Total Biaya:
              </span>
              <span className="font-extrabold text-[#6547ED]">
                Rp {totalBiaya.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Card 2: Kelengkapan Berkas Lampiran */}
          <div 
            onClick={() => onStartApp('kuitansi')}
            className="bg-white rounded-[22px] p-3.5 border border-purple-100/70 shadow-xs hover:shadow-sm transition-all cursor-pointer space-y-2.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-50 text-[#6547ED] border border-purple-100">
                Lampiran
              </span>
              <span className="text-[9px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                {dokumentasiList.length + buktiBayarList.length} Berkas
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#6547ED] transition-colors line-clamp-1">
                Kelengkapan Dokumen Fisik
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                {dokumentasiList.length} Foto GPS · {buktiBayarList.length} Nota & Tiket
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
              <span className="text-slate-500 font-medium">
                Format Berkas:
              </span>
              <span className="font-extrabold text-[#6547ED]">
                Permenkeu A4
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
