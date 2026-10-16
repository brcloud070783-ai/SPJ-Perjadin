import React from 'react';
import { 
  Plus, 
  Receipt, 
  Camera, 
  CreditCard, 
  ArrowUpRight, 
  ChevronRight, 
  Calendar, 
  Check, 
  MapPin, 
  Printer, 
  FolderOpen,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  Clock,
  Car
} from 'lucide-react';
import { TabType, KuitansiData, FotoDokumentasi, BuktiBayar, ProjectSPJ } from '../types';
import { formatTanggalIndo } from '../utils/terbilang';

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
  
  // Format dates for the Parcelly-style timeline
  const tglBerangkat = kuitansi?.tanggalBerangkat 
    ? new Date(kuitansi.tanggalBerangkat).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : '12 Okt 2026';
    
  const tglKembali = kuitansi?.tanggalKembali 
    ? new Date(kuitansi.tanggalKembali).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : '15 Okt 2026';

  const nomorSPD = activeProject?.nomorSPD || kuitansi?.nomorSPPD || '090/123/SPD/2026';
  const kotaAsal = kuitansi?.kotaAsal || 'Tanjung Selor';
  const kotaTujuan = kuitansi?.kotaTujuan || 'Tarakan';

  // Calculate step progress based on data
  const hasKuitansi = Boolean(kuitansi?.namaPelaksana);
  const hasFoto = dokumentasiList.length > 0;
  const hasNota = buktiBayarList.length > 0;

  return (
    <div className="max-w-md mx-auto px-1 py-1 space-y-4 animate-fade-in pb-24 text-slate-800">
      
      {/* 1. PARCELLY-STYLE HERO DELIVERY/SPJ TRACKER CARD */}
      <div className="bg-gradient-to-br from-[#7357FF] via-[#6547ED] to-[#5133E6] text-white rounded-[32px] p-5 sm:p-6 shadow-xl shadow-purple-900/15 relative overflow-hidden">
        {/* Subtle decorative concentric orbital lines */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full border border-white/15 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          
          {/* Header Row: Status tag + Circle action button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-purple-200/90 tracking-wide">
                SPJ Aktif · Dalam Proses
              </span>
            </div>

            <button
              onClick={() => onStartApp('kuitansi')}
              className="w-8 h-8 rounded-full bg-white text-[#6547ED] flex items-center justify-center font-black shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title="Buka & Edit SPJ Ini"
            >
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Main Identifier: Nomor SPD */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none font-mono">
              {nomorSPD}
            </h2>
            <p className="text-xs text-purple-100 font-medium mt-1 truncate">
              {kuitansi?.namaPelaksana ? `Pelaksana: ${kuitansi.namaPelaksana}` : 'Kuitansi Perjalanan Dinas'}
            </p>
          </div>

          {/* Date Range & Stepper Progress (Parcelly signature layout) */}
          <div className="space-y-2 pt-2 border-t border-white/15">
            <div className="flex justify-between items-center text-[10px] text-purple-200 font-mono">
              <span>{tglBerangkat}</span>
              <span>Selesai: {tglKembali}</span>
            </div>

            {/* Stepper Line with Checkmark Nodes */}
            <div className="flex items-center justify-between relative px-1">
              {/* Connecting line */}
              <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 h-0.5 bg-white/20 -z-0" />

              {/* Step 1: Kuitansi */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  hasKuitansi ? 'bg-white text-[#6547ED]' : 'bg-white/30 text-white'
                }`}>
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="text-[8px] text-purple-200 mt-1 font-semibold">Kuitansi</span>
              </div>

              {/* Step 2: Foto GPS */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  hasFoto ? 'bg-white text-[#6547ED]' : 'bg-white/30 text-white'
                }`}>
                  {hasFoto ? <Check className="w-3 h-3 stroke-[3]" /> : '2'}
                </div>
                <span className="text-[8px] text-purple-200 mt-1 font-semibold">Foto GPS</span>
              </div>

              {/* Step 3: Nota Bayar */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  hasNota ? 'bg-white text-[#6547ED]' : 'bg-white/30 text-white'
                }`}>
                  {hasNota ? <Check className="w-3 h-3 stroke-[3]" /> : '3'}
                </div>
                <span className="text-[8px] text-purple-200 mt-1 font-semibold">Nota Fisik</span>
              </div>

              {/* Step 4: Paket Cetak A4 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  hasKuitansi && hasFoto ? 'bg-[#00E5FF] text-slate-950 shadow-xs' : 'bg-white/30 text-white'
                }`}>
                  <Printer className="w-2.5 h-2.5" />
                </div>
                <span className="text-[8px] text-purple-200 mt-1 font-semibold">Cetak</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. 3 QUICK ACTION SQUIRCLE CARDS (like "Send parcel", "Rates", "Scan QR") */}
      <div className="grid grid-cols-3 gap-3">
        {/* Card 1: Buat Kuitansi / SPJ */}
        <button
          onClick={() => onStartApp('kuitansi')}
          className="bg-white rounded-[24px] p-3.5 sm:p-4 text-center border border-purple-100/70 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group active:scale-95"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 group-hover:bg-[#6547ED] text-[#6547ED] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
            <Receipt className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 leading-tight">Buat SPJ</div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">Kuitansi A4</div>
          </div>
        </button>

        {/* Card 2: Foto GPS Kegiatan */}
        <button
          onClick={() => onStartApp('dokumentasi')}
          className="bg-white rounded-[24px] p-3.5 sm:p-4 text-center border border-purple-100/70 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group active:scale-95"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 group-hover:bg-[#6547ED] text-[#6547ED] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
            <Camera className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 leading-tight">Foto GPS</div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">{dokumentasiList.length} Stempel</div>
          </div>
        </button>

        {/* Card 3: Nota & Bukti Bayar */}
        <button
          onClick={() => onStartApp('bukti_bayar')}
          className="bg-white rounded-[24px] p-3.5 sm:p-4 text-center border border-purple-100/70 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group active:scale-95"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 group-hover:bg-[#6547ED] text-[#6547ED] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
            <CreditCard className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 leading-tight">Nota SPJ</div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">{buktiBayarList.length} Terlampir</div>
          </div>
        </button>
      </div>

      {/* 3. "ACTIVE SHIPMENTS" SECTION -> "BERKAS SPJ BERJALAN" */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
            Berkas SPJ Berjalan
          </h3>
          <button
            onClick={() => onOpenProjectManager ? onOpenProjectManager() : onStartApp('berkas')}
            className="text-xs font-bold text-[#6547ED] hover:text-[#5133E6] transition-colors cursor-pointer"
          >
            Lihat Semua
          </button>
        </div>

        {/* Parcelly Shipment Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Card 1: Active Project */}
          <div 
            onClick={() => onStartApp('kuitansi')}
            className="bg-white rounded-[26px] p-4 border border-purple-100/70 shadow-xs hover:shadow-sm transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-50 text-[#6547ED] border border-purple-100">
                {kotaAsal.slice(0, 3).toUpperCase()} → {kotaTujuan.slice(0, 3).toUpperCase()}
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Draf Aktif
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#6547ED] transition-colors line-clamp-1">
                {kotaAsal} → {kotaTujuan}
              </h4>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                {activeProject?.namaProject || 'SPJ Perjalanan Dinas'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
              <span className="text-slate-500 font-medium">
                Total Biaya:
              </span>
              <span className="font-extrabold text-[#6547ED]">
                Rp {totalBiaya.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Card 2: Panduan & SBM */}
          <div 
            onClick={() => onStartApp('diskusi')}
            className="bg-white rounded-[26px] p-4 border border-purple-100/70 shadow-xs hover:shadow-sm transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                Permenkeu
              </span>
              <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                Standar SBM
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#6547ED] transition-colors line-clamp-1">
                Tarif SBM 2026 & Audit
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                Uang harian & penginapan resmi Kaltara
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
              <span className="text-slate-500 font-medium">
                Status Standar:
              </span>
              <span className="font-extrabold text-blue-700">
                Sesuai Aturan
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. PARCELLY-STYLE BOTTOM PRIMARY ACTION BUTTON (like the right phone's "Delivery confirmed") */}
      <div className="pt-2">
        <button
          onClick={() => onStartApp('kuitansi')}
          className="w-full py-3.5 px-6 rounded-[22px] bg-[#6547ED] hover:bg-[#5739E0] active:scale-98 text-white font-bold text-xs shadow-md shadow-purple-900/15 flex items-center justify-between cursor-pointer transition-all group"
        >
          <span className="text-left">
            <span className="block text-[10px] text-purple-200 font-normal">Langkah 1 dari 3</span>
            <span className="text-xs font-extrabold text-white">Mulai Susun Kuitansi Dinas</span>
          </span>

          <div className="w-8 h-8 rounded-full bg-white/15 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>

    </div>
  );
};
