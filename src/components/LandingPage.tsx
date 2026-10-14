import React, { useState } from 'react';
import { 
  Receipt, 
  Camera, 
  CreditCard, 
  Lightbulb, 
  ArrowRight, 
  CheckCircle2, 
  Printer, 
  Plus,
  Sparkles,
  FileText,
  MapPin,
  Clock,
  Search,
  SlidersHorizontal,
  FolderOpen,
  ChevronRight,
  User,
  Bell,
  ShieldCheck,
  FileCheck,
  Zap
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
      tag: 'HP & Cloud Drive',
      icon: FolderOpen,
      gradient: 'from-[#180A30] to-[#7D2AE8]',
      shadow: 'shadow-purple-900/30',
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'kuitansi' as TabType,
      title: 'Kuitansi A4',
      tag: 'Permenkeu 113',
      icon: Receipt,
      gradient: 'from-[#7D2AE8] to-[#9E52FF]',
      shadow: 'shadow-purple-500/20',
      badgeColor: 'bg-purple-100 text-purple-700'
    },
    {
      id: 'dokumentasi' as TabType,
      title: 'Foto GPS',
      tag: `${dokumentasiList.length} Stempel Waktu`,
      icon: Camera,
      gradient: 'from-[#FF3366] to-[#FF6B8B]',
      shadow: 'shadow-rose-500/20',
      badgeColor: 'bg-rose-100 text-rose-700'
    },
    {
      id: 'bukti_bayar' as TabType,
      title: 'Nota & Bukti',
      tag: `${buktiBayarList.length} Terlampir`,
      icon: CreditCard,
      gradient: 'from-[#FF9900] to-[#FF5500]',
      shadow: 'shadow-amber-500/20',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'diskusi' as TabType,
      title: 'Panduan SPJ',
      tag: 'Audit SBM 2026',
      icon: Lightbulb,
      gradient: 'from-[#00C853] to-[#00E676]',
      shadow: 'shadow-emerald-500/20',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'paket_lengkap' as TabType,
      title: 'Cetak Paket',
      tag: '1-Kesatuan A4',
      icon: Printer,
      gradient: 'from-[#00C4CC] to-[#0096C7]',
      shadow: 'shadow-cyan-500/20',
      badgeColor: 'bg-cyan-100 text-cyan-800'
    }
  ];

  // Filtered categories based on search
  const filteredCategories = quickCategories.filter(cat => 
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-2xl mx-auto px-1">
      {/* CANVA GREETING & HEADER BAR */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#7D2AE8] via-[#00C4CC] to-[#FF3366] p-0.5 shadow-md">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-black text-[#7D2AE8] text-sm">
                SD
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-medium">Selamat Datang,</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-[#7D2AE8] text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3" /> ASN/PPTK
              </span>
            </div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
              SiDinas SPD & SPJ Mobile
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onStartApp('diskusi')}
            className="w-9 h-9 rounded-full bg-white border border-slate-200/80 text-slate-600 hover:text-[#7D2AE8] hover:bg-purple-50 flex items-center justify-center transition-colors shadow-2xs cursor-pointer relative"
            title="Panduan SPJ"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
          </button>
        </div>
      </div>

      {/* CANVA SEARCH BAR */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kuitansi, SPPD, foto GPS, atau templat SPJ..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-purple-100 shadow-sm text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7D2AE8]/30 focus:border-[#7D2AE8] transition-all"
          />
          {searchQuery ? (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 text-xs text-slate-400 hover:text-slate-600 font-bold bg-slate-100 rounded-full w-5 h-5 flex items-center justify-center"
            >
              ✕
            </button>
          ) : (
            <SlidersHorizontal className="w-4 h-4 text-purple-400 absolute right-4 pointer-events-none" />
          )}
        </div>
      </div>

      {/* CANVA HERO MAGIC BANNER */}
      <div className="bg-gradient-to-br from-[#180A30] via-[#2D0D5B] to-[#7D2AE8] text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#00C4CC]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-[#FF3366]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cyan-200 text-[11px] font-bold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            Format Otomatis A4 Permenkeu
          </div>

          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Mau buat dokumen apa hari ini?
            </h2>
            <p className="text-xs text-purple-200/90 mt-1 font-normal leading-relaxed">
              Buat kuitansi dinas, stempel lokasi foto kegiatan, dan lampiran nota secara rapi & siap cetak PDF.
            </p>
          </div>

          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={() => onStartApp('kuitansi')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00C4CC] to-[#00B4D8] text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Buat SPJ Baru</span>
            </button>

            <button
              onClick={() => onStartApp('diskusi')}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 font-bold text-xs backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
              <span>Panduan</span>
            </button>
          </div>
        </div>
      </div>

      {/* PWA INSTALL BANNER */}
      <PWAInstallButton variant="banner" />

      {/* CANVA CATEGORY ICON SUITE (2 ROWS GRID) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#7D2AE8]" />
            Menu Utama SPJ
          </h3>
          <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
            6 Pilihan
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {filteredCategories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <button
                key={`${cat.title}-${index}`}
                onClick={() => onStartApp(cat.id)}
                className="flex flex-col items-center p-3 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group active:scale-95 text-center"
              >
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${cat.gradient} text-white flex items-center justify-center shadow-md ${cat.shadow} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-extrabold text-slate-800 mt-2 line-clamp-1 group-hover:text-[#7D2AE8]">
                  {cat.title}
                </span>
                <span className={`text-[9px] font-bold mt-0.5 px-1.5 py-0.2 rounded ${cat.badgeColor} truncate max-w-full`}>
                  {cat.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CANVA "LANJUTKAN PENGERJAAN" / RECENT DESIGNS */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Melanjutkan Pengerjaan
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Draft berkas SPJ yang sedang aktif
            </p>
          </div>

          <button 
            onClick={() => onStartApp('kuitansi')}
            className="text-xs font-bold text-[#7D2AE8] hover:text-purple-900 flex items-center gap-0.5 cursor-pointer"
          >
            <span>Semua</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* CANVA FILTER CHIPS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'semua', label: 'Semua Berkas' },
            { id: 'kuitansi', label: 'Kuitansi & SPPD' },
            { id: 'dokumentasi', label: 'Foto GPS' },
            { id: 'bukti', label: 'Bukti Bayar' }
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === chip.id
                  ? 'bg-[#7D2AE8] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* DRAFT CARDS LIST (CANVA STYLE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Card 1: Kuitansi */}
          {(activeFilter === 'semua' || activeFilter === 'kuitansi') && (
            <div className="bg-white rounded-2xl border border-purple-100 shadow-2xs hover:shadow-md transition-all p-3.5 flex flex-col justify-between gap-3 group">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-14 rounded-xl bg-purple-50 border border-purple-200/80 flex flex-col items-center justify-center p-1 shrink-0 relative overflow-hidden group-hover:border-[#7D2AE8] transition-colors">
                    <div className="w-full h-2 bg-[#7D2AE8] rounded-xs mb-1" />
                    <Receipt className="w-5 h-5 text-[#7D2AE8]" />
                    <span className="text-[8px] font-black text-purple-700 uppercase mt-0.5">A4</span>
                  </div>

                  <div>
                    <span className="inline-block text-[9px] font-extrabold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded mb-1">
                      Kuitansi Permenkeu
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-[#7D2AE8] transition-colors line-clamp-1">
                      {kuitansi?.namaPelaksana ? `Kuitansi - ${kuitansi.namaPelaksana}` : 'Kuitansi Dinas Baru'}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                      {kuitansi?.kotaTujuan ? `Tujuan: ${kuitansi.kotaTujuan}` : 'Belum ditentukan'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Total SPJ</span>
                  <span className="font-extrabold text-[#7D2AE8]">
                    Rp {totalBiaya.toLocaleString('id-ID')}
                  </span>
                </div>

                <button
                  onClick={() => onStartApp('kuitansi')}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 text-[#7D2AE8] group-hover:bg-[#7D2AE8] group-hover:text-white font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Edit A4</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Card 2: Foto GPS */}
          {(activeFilter === 'semua' || activeFilter === 'dokumentasi') && (
            <div className="bg-white rounded-2xl border border-rose-100 shadow-2xs hover:shadow-md transition-all p-3.5 flex flex-col justify-between gap-3 group">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-14 rounded-xl bg-rose-50 border border-rose-200/80 flex flex-col items-center justify-center p-1 shrink-0 relative overflow-hidden group-hover:border-rose-500 transition-colors">
                    <div className="w-full h-2 bg-[#FF3366] rounded-xs mb-1" />
                    <Camera className="w-5 h-5 text-[#FF3366]" />
                    <span className="text-[8px] font-black text-rose-700 uppercase mt-0.5">GPS</span>
                  </div>

                  <div>
                    <span className="inline-block text-[9px] font-extrabold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded mb-1">
                      Dokumentasi Kegiatan
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-[#FF3366] transition-colors line-clamp-1">
                      Album Stempel GPS
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                      {dokumentasiList.length > 0 
                        ? `${dokumentasiList.length} Foto Geotag Tersimpan` 
                        : 'Belum ada foto kegiatan'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Status GPS</span>
                  <span className="font-extrabold text-rose-600">
                    {dokumentasiList.length > 0 ? 'Siap Cetak' : 'Tambah Foto'}
                  </span>
                </div>

                <button
                  onClick={() => onStartApp('dokumentasi')}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 text-[#FF3366] group-hover:bg-[#FF3366] group-hover:text-white font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Kelola Foto</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Card 3: Bukti Bayar */}
          {(activeFilter === 'semua' || activeFilter === 'bukti') && (
            <div className="bg-white rounded-2xl border border-amber-100 shadow-2xs hover:shadow-md transition-all p-3.5 flex flex-col justify-between gap-3 group col-span-1 sm:col-span-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-14 rounded-xl bg-amber-50 border border-amber-200/80 flex flex-col items-center justify-center p-1 shrink-0 relative overflow-hidden group-hover:border-amber-500 transition-colors">
                    <div className="w-full h-2 bg-[#FF9900] rounded-xs mb-1" />
                    <CreditCard className="w-5 h-5 text-[#FF9900]" />
                    <span className="text-[8px] font-black text-amber-700 uppercase mt-0.5">GRID</span>
                  </div>

                  <div>
                    <span className="inline-block text-[9px] font-extrabold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded mb-1">
                      Lampiran Nota & Fisik
                    </span>
                    <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                      Lampiran Nota Pembayaran (Layout Grid 2x1)
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                      {buktiBayarList.length > 0 
                        ? `${buktiBayarList.length} Nota/Tiket/Hotel terlampir` 
                        : 'Belum ada nota terlampir'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Total Lampiran</span>
                  <span className="font-extrabold text-amber-700">
                    {buktiBayarList.length} Nota
                  </span>
                </div>

                <button
                  onClick={() => onStartApp('bukti_bayar')}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Upload & Susun Nota</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
