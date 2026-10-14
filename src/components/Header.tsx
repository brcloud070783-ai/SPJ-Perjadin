import React from 'react';
import { Briefcase, RotateCcw, FileText, FolderOpen, Printer, Sparkles, ChevronDown, Rocket } from 'lucide-react';
import { TabType, KuitansiData, ProjectSPJ } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeTab: TabType;
  kuitansi: KuitansiData;
  activeProject?: ProjectSPJ;
  totalDokumentasi: number;
  totalBuktiBayar: number;
  onResetData: () => void;
  onQuickPreview: () => void;
  onGoToLanding?: () => void;
  onOpenProjectManager: () => void;
  onOpenPaketLengkap: () => void;
  onOpenDeviceHelp?: () => void;
  onOpenDeployGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  kuitansi,
  activeProject,
  onResetData,
  onQuickPreview,
  onGoToLanding,
  onOpenProjectManager,
  onOpenPaketLengkap,
  onOpenDeviceHelp,
  onOpenDeployGuide
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#180A30] text-white border-b border-purple-900/50 px-3 sm:px-4 py-2 print:hidden shadow-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand & Active Project Selector */}
        <div className="flex items-center gap-2 overflow-hidden">
          <button 
            onClick={onGoToLanding}
            className="flex items-center gap-2 text-left cursor-pointer group select-none shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00C4CC] to-[#7D2AE8] text-white flex items-center justify-center shadow-md shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="hidden xs:block">
              <h1 className="text-sm font-extrabold text-white flex items-center gap-1.5 leading-none">
                <span>SiDinas</span>
                <span className="text-[9px] font-bold bg-[#00C4CC] text-slate-950 px-1 py-0.2 rounded">
                  PWA
                </span>
              </h1>
              <p className="text-[9px] text-purple-200/80 font-medium">
                SPPD A4
              </p>
            </div>
          </button>

          {/* Project Switcher Badge */}
          <button
            onClick={onOpenProjectManager}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-700/60 text-xs text-purple-100 transition-all cursor-pointer truncate max-w-[170px] sm:max-w-[280px]"
            title="Ganti / Kelola Berkas SPJ Project"
          >
            <FolderOpen className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
            <span className="font-extrabold truncate text-[11px]">
              {activeProject?.namaProject || 'Berkas SPJ'}
            </span>
            <ChevronDown className="w-3 h-3 text-purple-300 shrink-0" />
          </button>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {onOpenDeployGuide && (
            <button
              onClick={onOpenDeployGuide}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 active:scale-95 text-white text-xs font-black inline-flex items-center gap-1 transition-all shadow-sm shrink-0 cursor-pointer"
              title="Panduan Deploy ke Vercel/Netlify Gratis (Bebas 403)"
            >
              <Rocket className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">Deploy Gratis</span>
            </button>
          )}

          {onOpenDeviceHelp && (
            <button
              onClick={onOpenDeviceHelp}
              className="px-2 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/40 text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer"
              title="Solusi Error 403 & Akses HP Banyak Akun"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="hidden sm:inline">Akses HP / 403</span>
              <span className="sm:hidden">403?</span>
            </button>
          )}

          {/* Paket Lengkap 1-Click Print */}
          <button
            onClick={onOpenPaketLengkap}
            className="text-xs font-black bg-gradient-to-r from-[#00C4CC] to-[#0096C7] hover:brightness-110 active:scale-95 text-slate-950 px-2.5 sm:px-3 py-1.5 rounded-xl inline-flex items-center gap-1 transition-all shadow-sm shrink-0 cursor-pointer"
            title="Pratinjau & Cetak Paket Lengkap 1-Kesatuan SPJ"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Paket SPJ</span>
          </button>

          <PWAInstallButton variant="compact" />

          <button
            onClick={() => {
              if (window.confirm('Muat ulang data contoh resmi?')) {
                onResetData();
              }
            }}
            className="text-xs font-medium text-purple-200 hover:text-white bg-white/10 active:scale-95 px-2 py-1.5 rounded-xl inline-flex items-center gap-1 transition-all border border-white/10 shrink-0 cursor-pointer"
            title="Reset Data Contoh"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
