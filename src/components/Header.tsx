import React from 'react';
import { User } from 'firebase/auth';
import { 
  Menu, 
  Briefcase, 
  FolderOpen, 
  Printer, 
  ChevronDown, 
  User as UserIcon,
  Sparkles
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
    /* PARCELLY-STYLE CLEAN HEADER (LIGHT CANVAS WITH SOFT LAVENDER TINT) */
    <header className="sticky top-0 z-40 bg-[#FAF9FF]/95 backdrop-blur-md border-b border-purple-100/60 px-3 sm:px-4 py-2.5 print:hidden">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        
        {/* LEFT: Clean Squircle Menu Button */}
        <div className="flex items-center gap-2">
          {onOpenSidebar && (
            <button 
              onClick={onOpenSidebar}
              className="w-9 h-9 rounded-2xl bg-white hover:bg-purple-50 text-slate-700 hover:text-[#6547ED] flex items-center justify-center transition-all cursor-pointer border border-purple-100/80 shadow-2xs"
              title="Menu Lengkap & Pengaturan"
            >
              <Menu className="w-4 h-4 stroke-[2.2]" />
            </button>
          )}

          {/* Project Quick Pill */}
          <button
            onClick={onOpenProjectManager}
            className="hidden xs:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white hover:bg-purple-50/60 border border-purple-100/70 text-slate-700 transition-all cursor-pointer max-w-[130px] sm:max-w-[170px]"
            title={`Ganti SPJ: ${activeProject?.namaProject || 'SPJ Perjalanan Dinas'}`}
          >
            <FolderOpen className="w-3 h-3 text-[#6547ED] shrink-0" />
            <span className="font-semibold truncate text-[11px] text-slate-800">
              {activeProject?.namaProject || 'Berkas SPJ'}
            </span>
            <ChevronDown className="w-2.5 h-2.5 text-slate-400 shrink-0" />
          </button>
        </div>

        {/* CENTER: Wordmark with Editorial Elegance (like "Parcelly") */}
        <button 
          onClick={onGoToLanding}
          className="text-center cursor-pointer select-none"
          title="Ke Beranda SiDinas"
        >
          <h1 className="font-serif text-lg font-black text-slate-900 tracking-tight leading-none hover:text-[#6547ED] transition-colors">
            SiDinas
          </h1>
        </button>

        {/* RIGHT: Paket SPJ Action + Avatar/Initials Badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenPaketLengkap}
            className="px-2.5 py-1 rounded-full bg-purple-50 hover:bg-[#6547ED] text-[#6547ED] hover:text-white border border-purple-200/80 text-[11px] font-bold inline-flex items-center gap-1 transition-all shadow-2xs cursor-pointer active:scale-95"
            title="Pratinjau & Cetak Paket Lengkap SPJ"
          >
            <Printer className="w-3 h-3" />
            <span className="hidden sm:inline">Paket SPJ</span>
          </button>

          {/* Circular Initials / Avatar Pill (like "RA" in Parcelly) */}
          {onOpenGoogleLogin && (
            <button
              onClick={onOpenGoogleLogin}
              className="w-8 h-8 rounded-full bg-[#6547ED]/15 text-[#6547ED] hover:ring-2 hover:ring-[#6547ED]/40 flex items-center justify-center font-bold text-xs transition-all cursor-pointer overflow-hidden border border-purple-200"
              title={user ? `Akun: ${user.displayName || user.email}` : 'Masuk Akun Google'}
            >
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span>{user?.displayName?.slice(0, 2).toUpperCase() || 'SD'}</span>
              )}
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
