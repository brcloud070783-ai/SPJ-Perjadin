import React from 'react';
import { User } from 'firebase/auth';
import { 
  Menu, 
  Briefcase, 
  FolderOpen, 
  Printer, 
  ChevronDown, 
  User as UserIcon,
  CheckCircle2
} from 'lucide-react';
import { TabType, KuitansiData, ProjectSPJ } from '../types';

interface HeaderProps {
  activeTab: TabType;
  kuitansi: KuitansiData;
  activeProject?: ProjectSPJ;
  user?: User | null;
  totalDokumentasi: number;
  totalBuktiBayar: number;
  onResetData: () => void;
  onQuickPreview: () => void;
  onGoToLanding?: () => void;
  onOpenProjectManager: () => void;
  onOpenPaketLengkap: () => void;
  onOpenLogoDinas?: () => void;
  onOpenDeviceHelp?: () => void;
  onOpenDeployGuide?: () => void;
  onOpenGoogleLogin?: () => void;
  onOpenSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeProject,
  user,
  onGoToLanding,
  onOpenProjectManager,
  onOpenPaketLengkap,
  onOpenGoogleLogin,
  onOpenSidebar
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#140828] text-white border-b border-purple-900/40 px-3 sm:px-4 py-2 print:hidden shadow-sm backdrop-blur-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        
        {/* LEFT: Menu Sidebar, Brand, & Active Project Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onOpenSidebar && (
            <button 
              onClick={onOpenSidebar}
              className="w-8 h-8 rounded-xl bg-purple-900/40 hover:bg-purple-800/80 text-purple-200 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0 border border-purple-800/50"
              title="Menu Lengkap & Pengaturan"
            >
              <Menu className="w-4 h-4 text-cyan-300" />
            </button>
          )}

          {/* Brand */}
          <button 
            onClick={onGoToLanding}
            className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
            title="Ke Beranda SiDinas"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#00C4CC] to-[#7D2AE8] text-white flex items-center justify-center shadow-xs">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-black tracking-tight text-white hidden xs:inline">
              SiDinas
            </span>
          </button>

          {/* Project Selector (Clean Pill) */}
          <button
            onClick={onOpenProjectManager}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-900/30 hover:bg-purple-900/60 border border-purple-700/50 text-xs text-purple-100 transition-all cursor-pointer min-w-0 max-w-[150px] sm:max-w-[260px] md:max-w-[340px]"
            title={`Ganti / Kelola SPJ: ${activeProject?.namaProject || 'SPJ Perjalanan Dinas'}`}
          >
            <FolderOpen className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
            <span className="font-bold truncate text-[11px] text-slate-100">
              {activeProject?.namaProject || 'Berkas SPJ'}
            </span>
            <ChevronDown className="w-3 h-3 text-purple-300 shrink-0 ml-0.5 opacity-70" />
          </button>
        </div>

        {/* RIGHT: Primary Action (Cetak / Paket SPJ) & Account */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Main Action: Cetak Paket SPJ Lengkap */}
          <button
            onClick={onOpenPaketLengkap}
            className="px-3 py-1.5 rounded-xl bg-[#00C4CC] hover:bg-[#00B4D8] active:scale-95 text-slate-950 text-xs font-black inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Pratinjau & Cetak 1-Kesatuan Paket SPJ (Kuitansi + Dokumentasi + Nota)"
          >
            <Printer className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="text-[11px]">Paket SPJ</span>
          </button>

          {/* Account Profile / Login */}
          {onOpenGoogleLogin && (
            <button
              onClick={onOpenGoogleLogin}
              className="p-1 rounded-full hover:ring-2 hover:ring-cyan-300/40 transition-all cursor-pointer relative"
              title={user ? `Akun: ${user.displayName || user.email}` : 'Masuk Akun Google'}
            >
              {user ? (
                <div className="relative">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Avatar" 
                      className="w-7 h-7 rounded-full border border-cyan-300 object-cover" 
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-xs border border-cyan-400">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-full ring-1 ring-[#140828]" />
                </div>
              ) : (
                <div className="px-2.5 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700/50 text-purple-200 hover:text-white flex items-center gap-1.5 text-xs font-semibold">
                  <UserIcon className="w-3.5 h-3.5 text-cyan-300" />
                  <span className="text-[11px] hidden sm:inline">Masuk</span>
                </div>
              )}
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
