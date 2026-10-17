import React from 'react';
import { 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Clock,
  ShieldCheck,
  FileCheck2,
  FolderOpen
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
  const nomorSPD = activeProject?.nomorSPD || kuitansi?.nomorSPPD || '';
  const kotaAsal = kuitansi?.kotaAsal || 'Tanjung Selor';
  const kotaTujuan = kuitansi?.kotaTujuan || 'Tarakan';
  const hasDraft = Boolean(kuitansi?.namaPelaksana);

  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center px-4 py-8 max-w-xl mx-auto animate-fade-in text-slate-800">
      
      {/* HEADER RINGKAS & IDENTITAS SISTEM */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0000B3] text-xs font-bold border border-blue-100 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sistem SPJ Perjalanan Dinas 2026</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Administrasi Pertanggungjawaban
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Standar Kemenkeu RI · Kuitansi Otomatis, Dokumentasi GPS, dan Bukti Riil Siap Cetak
        </p>
      </div>

      {/* ========================================================================= */}
      {/* SATU-SATUNYA PUSAT PERHATIAN UTAMA DI HALAMAN HOME: TOMBOL BUAT SPJ       */}
      {/* Penerapan palet 5-warna resmi (#0000B3, #0052CC, #00B4D8, #F0F7FF, #0A1128) */}
      {/* ========================================================================= */}
      <div className="w-full relative group max-w-md">
        {/* Soft atmospheric focus halo */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#0000B3]/25 via-[#0052CC]/20 to-[#00B4D8]/20 rounded-[30px] blur-md opacity-70 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />

        <button
          onClick={() => onStartApp('kuitansi')}
          className="w-full relative bg-white hover:bg-slate-50/70 rounded-[26px] p-6 sm:p-7 border-2 border-[#0000B3]/30 hover:border-[#0000B3] shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer text-left active:scale-[0.99] flex flex-col gap-4 group"
        >
          {/* Top Row: Microcopy Kicker & Badge Standar */}
          <div className="flex items-center justify-between text-xs w-full">
            <span className="inline-flex items-center gap-1.5 font-extrabold text-[#0000B3] uppercase tracking-wider text-[11px] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Standar Permenkeu RI</span>
            </span>

            <span className="inline-flex items-center gap-1 text-slate-400 font-medium text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>~3 menit siap cetak</span>
            </span>
          </div>

          {/* Center Body: Simbol Utuh + Judul + Tombol Panah Aksi */}
          <div className="flex items-center gap-4.5 w-full">
            
            {/* GAMBAR SIMBOL KHUSUS SPJ (100% UTUH, TIDAK TERPOTONG, ELEGAN) */}
            <div className="relative shrink-0 p-1">
              {/* Symbolic squircle container */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00008F] via-[#0000B3] to-[#0052CC] text-white flex items-center justify-center shadow-lg shadow-blue-950/25 group-hover:scale-105 transition-transform duration-300">
                {/* Official SPJ Document Vector */}
                <svg 
                  className="w-9 h-9 text-white drop-shadow-xs" 
                  viewBox="0 0 32 32" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="5" y="4" width="16" height="22" rx="3" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="1.6" />
                  <path d="M9 7H19L24 12V25C24 26.1046 23.1046 27 22 27H9C7.89543 27 7 26.1046 7 25V9C7 7.89543 7.89543 7 9 7Z" fill="white" />
                  <path d="M19 7V11C19 11.5523 19.4477 12 20 12H24L19 7Z" fill="#BAE6FD" />
                  <rect x="10" y="14" width="9" height="1.8" rx="0.9" fill="#0000B3" />
                  <rect x="10" y="17.5" width="7" height="1.8" rx="0.9" fill="#0000B3" />
                  <rect x="10" y="21" width="5" height="1.8" rx="0.9" fill="#0000B3" />
                </svg>
              </div>

              {/* Plus Badge Berwarna Kontras (Cyan) di Luar Icon Container */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#00B4D8] text-slate-950 flex items-center justify-center font-black shadow-md border-2 border-white z-20">
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>

            {/* DETAIL & MICROCOPY BERBOBOT */}
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#0000B3] transition-colors leading-tight tracking-tight">
                Buat SPJ
              </h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                Kuitansi SPD, lampiran Foto GPS berstempel, & nota fisik format A4.
              </p>
            </div>

            {/* ACTION BUTTON BULAT DENGAN PANAH */}
            <div className="shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#0000B3] text-white flex items-center justify-center shadow-md group-hover:bg-[#00008F] group-hover:translate-x-1 transition-all">
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>

          </div>

          {/* Bottom Footnote: Micro-steps workflow */}
          <div className="pt-3 border-t border-blue-50 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#0000B3]" />
              1. Kuitansi
            </span>
            <span className="text-slate-300">→</span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              2. Foto GPS
            </span>
            <span className="text-slate-300">→</span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              3. Nota Riil
            </span>
            <span className="font-extrabold text-[#0000B3] ml-auto">
              Mulai Sekarang →
            </span>
          </div>

          {/* DRAF AKTIF (JIKA ADA DRAF TERSIMPAN) - INTEGRATED DRAFT BAR */}
          {hasDraft && (
            <div className="mt-1 bg-blue-50/80 border border-blue-100 rounded-xl px-3 py-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <FileCheck2 className="w-4 h-4 text-[#0000B3] shrink-0" />
                <span className="text-slate-700 truncate font-medium">
                  Draf Aktif: <strong className="text-slate-900">{kotaAsal} → {kotaTujuan}</strong>
                </span>
              </div>
              <span className="font-mono font-bold text-[#0000B3] shrink-0 ml-2">
                Rp {totalBiaya.toLocaleString('id-ID')}
              </span>
            </div>
          )}

        </button>
      </div>

      {/* QUICK FOOTER LINK KE PENGELOLA BERKAS (JIKA PERLU CARI ARSIP) */}
      {onOpenProjectManager && (
        <div className="mt-6 text-center">
          <button
            onClick={onOpenProjectManager}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#0000B3] transition-colors py-1.5 px-3 rounded-lg hover:bg-white/80"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Buka Riwayat & Arsip Berkas SPJ</span>
          </button>
        </div>
      )}

    </div>
  );
};

