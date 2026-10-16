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
  RotateCcw,
  User as UserIcon
} from 'lucide-react';
import { User } from 'firebase/auth';
import { ProjectSPJ, TabType } from '../types';

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
      {/* 60% NEUTRAL BACKDROP */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* 30% STRUCTURAL DRAWER: SLATE-900 SURFACE */}
      <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-slate-900 text-slate-100 shadow-2xl flex flex-col border-r border-slate-800 animate-slideRight">
        
        {/* Header Drawer */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              SD
            </div>
            <div>
              <h2 className="text-xs font-bold text-white">Menu & Pengaturan</h2>
              <p className="text-[10px] text-slate-400 font-mono truncate max-w-[160px]">
                {activeProject?.namaProject || 'SPJ Perjalanan Dinas'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs font-sans">
          
          {/* USER ACCOUNT CARD */}
          {onOpenGoogleLogin && (
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-7 h-7 rounded-full border border-blue-400" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div>
                    <span className="text-[9px] text-slate-400 block font-medium">
                      {user ? 'Terhubung Google' : 'Akun Pengguna'}
                    </span>
                    <span className="font-bold text-white text-xs truncate max-w-[130px] block">
                      {user ? (user.displayName || user.email?.split('@')[0]) : 'Tamu (Offline)'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => { onClose(); onOpenGoogleLogin(); }}
                  className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold cursor-pointer transition-all"
                >
                  {user ? 'Kelola' : 'Masuk'}
                </button>
              </div>
            </div>
          )}

          {/* SECTION 1: MANAJEMEN BERKAS */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
              Berkas & Project SPJ
            </div>
            
            <button
              onClick={() => { onClose(); onOpenProjectManager(); }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-200 hover:text-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <FolderOpen className="w-4 h-4 text-blue-400" />
                <span className="font-medium text-xs">Kelola & Ganti Project SPJ</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          {/* SECTION 2: PENGATURAN KOP & PEJABAT */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
              Kop Surat & Instansi
            </div>

            <button
              onClick={() => { onClose(); onOpenLogoDinas(); }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-200 hover:text-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span className="font-medium text-xs">Kelola Logo & Kop Instansi</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          {/* SECTION 3: CADANGAN & PENYIMPANAN */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
              Cadangan & Portabilitas (.SPJ)
            </div>

            <button
              onClick={() => { onClose(); onExportProject(); }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-200 hover:text-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Download className="w-4 h-4 text-slate-300" />
                <span className="font-medium text-xs">Unduh Berkas Project (.SPJ)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-200 hover:text-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Upload className="w-4 h-4 text-slate-300" />
                <span className="font-medium text-xs">Pulihkan / Impor Berkas SPJ</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
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
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
              Panduan & Informasi
            </div>

            <button
              onClick={() => { onClose(); onNavigateToTab('diskusi'); }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-200 hover:text-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span className="font-medium text-xs">Panduan SBM & Diskusi Audit</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              onClick={() => { onClose(); onOpenDeviceHelp(); }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-200 hover:text-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-slate-300" />
                <span className="font-medium text-xs">Panduan Akses HP & Solusi 403</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              onClick={() => { onClose(); onOpenDeployGuide(); }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-200 hover:text-white transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-slate-300" />
                <span className="font-medium text-xs">Panduan Deploy Server Vercel</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          {/* SECTION 5: PEMELIHARAAN DATA */}
          {onResetData && (
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                Pemeliharaan Data
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Muat ulang data contoh resmi SPJ? Tindakan ini akan mengembalikan data SPJ yang sedang aktif ke format contoh default.')) {
                    onResetData();
                    onClose();
                  }
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/40 text-rose-300 hover:text-rose-100 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-rose-400 group-hover:rotate-180 transition-transform" />
                  <span className="font-medium text-xs">Reset ke Data Contoh</span>
                </div>
              </button>
            </div>
          )}

        </div>

        {/* Footer Sidebar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 text-center text-[10px] text-slate-500">
          SiDinas PWA • Kuitansi & SPPD v2.0
        </div>

      </div>
    </div>
  );
};
