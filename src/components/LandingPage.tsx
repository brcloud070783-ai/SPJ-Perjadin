import React, { useState } from 'react';
import { 
  Receipt, 
  Camera, 
  CreditCard, 
  Lightbulb, 
  ArrowRight, 
  Printer, 
  Plus,
  Sparkles,
  FolderOpen,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Building2,
  Zap,
  Bell,
  ChevronRight
} from 'lucide-react';
import { TabType, KuitansiData, FotoDokumentasi, BuktiBayar } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface LandingPageProps {
  onStartApp: (tab?: TabType) => void;
  kuitansi?: KuitansiData;
  dokumentasiList?: FotoDokumentasi[];
  buktiBayarList?: BuktiBayar[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onStartApp,
  kuitansi,
  dokumentasiList = [],
  buktiBayarList = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'semua' | 'kuitansi' | 'dokumentasi' | 'bukti'>('semua');

  const totalBiaya = kuitansi?.rincianBiaya?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0;

  // 6 Canva-style quick access menu items
  const quickCategories = [
    {
      id: 'berkas' as TabType,
      title: 'Berkas SPJ',
      tag: 'Cloud & HP',
      icon: FolderOpen,
      gradient: 'from-[#180A30] to-[#7D2AE8]',
      shadow: 'shadow-purple-900/20',
    },
    {
      id: 'kuitansi' as TabType,
      title: 'Kuitansi A4',
      tag: 'Permenkeu 113',
      icon: Receipt,
      gradient: 'from-[#7D2AE8] to-[#9E52FF]',
      shadow: 'shadow-purple-500/20',
    },
    {
      id: 'dokumentasi' as TabType,
      title: 'Foto GPS',
      tag: `${dokumentasiList.length} Stempel`,
      icon: Camera,
      gradient: 'from-[#FF3366] to-[#FF6B8B]',
      shadow: 'shadow-rose-500/20',
    },
    {
      id: 'bukti_bayar' as TabType,
      title: 'Nota & Bukti',
      tag: `${buktiBayarList.length} Terlampir`,
      icon: CreditCard,
      gradient: 'from-[#FF9900] to-[#FF5500]',
      shadow: 'shadow-amber-500/20',
    },
    {
      id: 'diskusi' as TabType,
      title: 'Panduan SPJ',
      tag: 'Audit SBM 2026',
      icon: Lightbulb,
      gradient: 'from-[#00C853] to-[#00E676]',
      shadow: 'shadow-emerald-500/20',
    },
    {
      id: 'logo_dinas' as TabType,
      title: 'Logo Dinas',
      tag: 'Kop & Instansi',
      icon: Building2,
      gradient: 'from-[#2563EB] to-[#7D2AE8]',
      shadow: 'shadow-blue-500/20',
    }
  ];

  return (
    <div className="h-[calc(100vh-130px)] flex flex-col justify-between max-w-2xl mx-auto px-1 overflow-hidden animate-fade-in">
      {/* TOP HEADER & SEARCH */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#7D2AE8] to-[#00C4CC] p-0.5 shadow-xs">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-black text-[#7D2AE8] text-xs">
                SD
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-500 font-medium">Selamat Datang,</span>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-purple-100 text-[#7D2AE8] text-[9px] font-bold">
                  <ShieldCheck className="w-2.5 h-2.5" /> ASN
                </span>
              </div>
              <h1 className="text-sm font-black text-slate-900 tracking-tight leading-tight">
                SiDinas SPD & SPJ Mobile
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => onStartApp('diskusi')}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#7D2AE8] flex items-center justify-center transition-colors shadow-2xs relative cursor-pointer"
              title="Panduan SPJ"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            </button>
          </div>
        </div>

        {/* COMPACT SEARCH & BANNER */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="sm:col-span-2 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kuitansi, SPPD, atau foto GPS..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-purple-100 shadow-2xs text-[11px] font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#7D2AE8]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold bg-slate-100 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={() => onStartApp('kuitansi')}
            className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#00C4CC] to-[#00B4D8] text-slate-950 font-black text-[11px] shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Buat SPJ Baru</span>
          </button>
        </div>
      </div>

      {/* 2X3 GRID CARDS MENU (MAIN QUICK ACCESS) */}
      <div className="space-y-1.5 my-1">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#7D2AE8]" />
            Menu Utama (2x3 Grid)
          </h3>
          <span className="text-[9px] text-purple-700 font-bold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
            Siap Cetak PDF
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {quickCategories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <button
                key={`${cat.title}-${index}`}
                onClick={() => onStartApp(cat.id)}
                className="flex flex-col items-start p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs hover:shadow-sm hover:border-purple-200 transition-all cursor-pointer group active:scale-95 text-left relative overflow-hidden"
              >
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${cat.gradient} text-white flex items-center justify-center shadow-xs ${cat.shadow} group-hover:scale-105 transition-transform mb-1.5`}>
                  <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-black text-slate-900 group-hover:text-[#7D2AE8] transition-colors line-clamp-1">
                  {cat.title}
                </span>
                <span className="text-[9px] font-medium text-slate-500 line-clamp-1">
                  {cat.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RECENT DRAFTS / MELANJUTKAN PENGERJAAN (COMPACT SINGLE VIEW) */}
      <div className="space-y-2 pb-1">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-extrabold text-slate-900 tracking-tight">
              Melanjutkan Pengerjaan
            </h3>
            <span className="text-[9px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-medium">
              Aktif
            </span>
          </div>

          <button 
            onClick={() => onStartApp('kuitansi')}
            className="text-[11px] font-bold text-[#7D2AE8] hover:text-purple-900 flex items-center gap-0.5 cursor-pointer"
          >
            <span>Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Card 1: Kuitansi */}
          <div 
            onClick={() => onStartApp('kuitansi')}
            className="bg-white rounded-xl border border-purple-100 shadow-2xs hover:shadow-xs transition-all p-2.5 flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-10 rounded-lg bg-purple-50 border border-purple-200/80 flex flex-col items-center justify-center p-0.5 shrink-0">
                <Receipt className="w-4 h-4 text-[#7D2AE8]" />
                <span className="text-[7px] font-black text-purple-700 uppercase">A4</span>
              </div>
              <div>
                <span className="text-[8px] font-extrabold text-purple-700 bg-purple-100 px-1 py-0.1 rounded">
                  Kuitansi & SPPD
                </span>
                <h4 className="text-[11px] font-extrabold text-slate-900 group-hover:text-[#7D2AE8] transition-colors line-clamp-1">
                  {kuitansi?.namaPelaksana ? kuitansi.namaPelaksana : 'Kuitansi Dinas Utama'}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">
                  Rp {totalBiaya.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            <div className="w-6 h-6 rounded-full bg-purple-50 text-[#7D2AE8] flex items-center justify-center group-hover:bg-[#7D2AE8] group-hover:text-white transition-colors">
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 2: Foto GPS */}
          <div 
            onClick={() => onStartApp('dokumentasi')}
            className="bg-white rounded-xl border border-rose-100 shadow-2xs hover:shadow-xs transition-all p-2.5 flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-10 rounded-lg bg-rose-50 border border-rose-200/80 flex flex-col items-center justify-center p-0.5 shrink-0">
                <Camera className="w-4 h-4 text-[#FF3366]" />
                <span className="text-[7px] font-black text-rose-700 uppercase">GPS</span>
              </div>
              <div>
                <span className="text-[8px] font-extrabold text-rose-700 bg-rose-100 px-1 py-0.1 rounded">
                  Dokumentasi
                </span>
                <h4 className="text-[11px] font-extrabold text-slate-900 group-hover:text-[#FF3366] transition-colors line-clamp-1">
                  Album Stempel Foto GPS
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">
                  {dokumentasiList.length} Foto Tergeotag
                </p>
              </div>
            </div>

            <div className="w-6 h-6 rounded-full bg-rose-50 text-[#FF3366] flex items-center justify-center group-hover:bg-[#FF3366] group-hover:text-white transition-colors">
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
