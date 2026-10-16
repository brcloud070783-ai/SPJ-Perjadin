import React from 'react';
import { 
  Menu, 
  X, 
  Building2, 
  FolderOpen, 
  Cloud, 
  Download, 
  Upload, 
  BookOpen, 
  Smartphone, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles,
  RotateCcw,
  LogIn,
  UserCheck,
  User as UserIcon
} from 'lucide-react';
import { User } from 'firebase/auth';
import { KuitansiData, ProjectSPJ, TabType } from '../types';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeProject?: ProjectSPJ;
  user?: User | null;
  onOpenProjectManager: () => void;
  onOpenLogoDinas: () => void;
  onOpenDeviceHelp: () => void;
  onOpenDeployGuide: () => void;
  onExportProject: () => void;
  onImportProject: (file: File) => void;
  onNavigateToTab: (tab: TabType) => void;
  onResetData?: () => void;
  onOpenGoogleLogin?: () => void;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  isOpen,
  onClose,
  activeProject,
  user,
  onOpenProjectManager,
  onOpenLogoDinas,
  onOpenDeviceHelp,
  onOpenDeployGuide,
  onExportProject,
  onImportProject,
  onNavigateToTab,
  onResetData,
  onOpenGoogleLogin
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden print:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Sidebar Drawer */}
      <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-[#180A30] text-slate-100 shadow-2xl flex flex-col border-r border-purple-900/60 animate-slideRight">
        
        {/* Header Drawer */}
        <div className="p-4 bg-purple-950/80 border-b border-purple-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#00C4CC] to-[#7D2AE8] text-white flex items-center justify-center font-black shadow-md">
              SD
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">Menu & Pengaturan</h2>
              <p className="text-[10px] text-purple-300 font-mono truncate max-w-[160px]">
                {activeProject?.namaProject || 'SPJ Perjalanan Dinas'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs font-sans">
          
          {/* USER ACCOUNT CARD */}
          {onOpenGoogleLogin && (
            <div className="p-3 rounded-2xl bg-purple-900/40 border border-purple-800/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-cyan-300" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-800 flex items-center justify-center text-cyan-300">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] text-purple-300 block font-medium">
                      {user ? 'Terhubung Google' : 'Akun Pengguna'}
                    </span>
                    <span className="font-bold text-white text-xs truncate max-w-[130px] block">
                      {user ? (user.displayName || user.email?.split('@')[0]) : 'Tamu (Offline)'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => { onClose(); onOpenGoogleLogin(); }}
                  className="px-2.5 py-1 rounded-lg bg-[#00C4CC]/20 hover:bg-[#00C4CC]/30 text-cyan-200 border border-cyan-400/30 text-[10px] font-bold cursor-pointer transition-all"
                >
                  {user ? 'Kelola' : 'Masuk'}
                </button>
              </div>
            </div>
          )}

          {/* SECTION 1: MANAJEMEN BERKAS */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest px-2">
              Berkas & Project SPJ
            </div>
            
            <button
              onClick={() => { onClose(); onOpenProjectManager(); }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/70 border border-purple-800/60 text-purple-100 hover:text-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <FolderOpen className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
                <span className="font-bold">Kelola & Ganti Project SPJ</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
            </button>
          </div>

          {/* SECTION 2: PENGATURAN KOP & PEJABAT */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest px-2">
              Kop Surat & Instansi
            </div>

            <button
              onClick={() => { onClose(); onOpenLogoDinas(); }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/70 border border-purple-800/60 text-purple-100 hover:text-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
                <span className="font-bold">Kelola Logo & Kop Instansi</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
            </button>
          </div>

          {/* SECTION 3: CADANGAN & PENYIMPANAN */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest px-2">
              Cadangan & Portabilitas (.SPJ)
            </div>

            <button
              onClick={() => { onClose(); onExportProject(); }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/70 border border-purple-800/60 text-purple-100 hover:text-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Download className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="font-bold">Unduh Berkas Project (.SPJ)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/70 border border-purple-800/60 text-purple-100 hover:text-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Upload className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                <span className="font-bold">Pulihkan / Impor Berkas SPJ</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
            </button>

            <input 
              ref={fileInputRef}
              type="file"
              accept=".spj,.json"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  onImportProject(f);
                  onClose();
                }
              }}
              className="hidden"
            />
          </div>

          {/* SECTION 4: PANDUAN & BANTUAN */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest px-2">
              Panduan & Informasi
            </div>

            <button
              onClick={() => { onClose(); onNavigateToTab('diskusi'); }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/70 border border-purple-800/60 text-purple-100 hover:text-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
                <span className="font-bold">Panduan SBM & Diskusi Audit</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
            </button>

            <button
              onClick={() => { onClose(); onOpenDeviceHelp(); }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/70 border border-purple-800/60 text-purple-100 hover:text-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                <span className="font-bold">Panduan Akses HP & Solusi 403</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
            </button>

            <button
              onClick={() => { onClose(); onOpenDeployGuide(); }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/70 border border-purple-800/60 text-purple-100 hover:text-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                <span className="font-bold">Panduan Deploy Server Vercel</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
            </button>
          </div>

          {/* SECTION 5: PEMELIHARAAN DATA */}
          {onResetData && (
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest px-2">
                Pemeliharaan Data
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Muat ulang data contoh resmi SPJ? Tindakan ini akan mengembalikan data SPJ yang sedang aktif ke format contoh default.')) {
                    onResetData();
                    onClose();
                  }
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 border border-rose-900/50 text-rose-300 hover:text-rose-100 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-rose-400 group-hover:rotate-180 transition-transform" />
                  <span className="font-bold">Reset ke Data Contoh</span>
                </div>
              </button>
            </div>
          )}

        </div>

        {/* Footer Sidebar */}
        <div className="p-3.5 bg-purple-950/90 border-t border-purple-900/60 text-center text-[11px] text-purple-300/80">
          SiDinas PWA • Kuitansi & SPPD v2.0
        </div>

      </div>
    </div>
  );
};
