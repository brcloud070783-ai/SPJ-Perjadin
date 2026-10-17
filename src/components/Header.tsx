import React, { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  Home, 
  FileSpreadsheet, 
  Camera, 
  Receipt, 
  Briefcase, 
  Printer, 
  Search, 
  ChevronDown, 
  Menu, 
  X, 
  Building2, 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  FolderOpen,
  Image as ImageIcon,
  HelpCircle,
  Cloud
} from 'lucide-react';
import { TabType, KuitansiData, ProjectSPJ } from '../types';

interface HeaderProps {
  activeTab: TabType;
  kuitansi: KuitansiData;
  activeProject?: ProjectSPJ;
  projects?: ProjectSPJ[];
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
  onSelectProject?: (id: string) => void;
  onNavigateTab?: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  kuitansi,
  activeProject,
  projects = [],
  user,
  totalDokumentasi,
  totalBuktiBayar,
  onGoToLanding,
  onOpenProjectManager,
  onOpenPaketLengkap,
  onOpenLogoDinas,
  onOpenDeviceHelp,
  onOpenDeployGuide,
  onOpenGoogleLogin,
  onOpenSidebar,
  onSelectProject,
  onNavigateTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter projects / data based on search query
  const filteredProjects = searchQuery.trim() === '' ? [] : projects.filter(p => 
    p.namaProject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.nomorSPD && p.nomorSPD.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.kuitansi?.namaPelaksana && p.kuitansi.namaPelaksana.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.kuitansi?.maksudPerjalanan && p.kuitansi.maksudPerjalanan.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const initialName = (kuitansi.namaPelaksana || 'AP').slice(0, 2).toUpperCase();

  const handleNav = (tab: TabType) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    } else if (tab === 'landing' && onGoToLanding) {
      onGoToLanding();
    } else if (tab === 'paket_lengkap') {
      onOpenPaketLengkap();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/90 shadow-2xs print:hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-2 sm:gap-4">
          
          {/* 1. LEFT ZONE: LINKEDIN ICON BADGE + SEARCH BAR */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-1 max-w-xs sm:max-w-sm md:max-w-md">
            {/* SPJ Kaltara Square Icon (LinkedIn Logo Style) */}
            <button
              onClick={() => handleNav('landing')}
              className="w-9 h-9 rounded-md bg-[#0000B3] hover:bg-[#000090] text-white flex items-center justify-center font-black text-sm tracking-tighter shrink-0 shadow-xs cursor-pointer active:scale-95 transition-all"
              title="SiDinas Kaltara - Beranda"
            >
              SPJ
            </button>

            {/* LinkedIn-style Interactive Search Input */}
            <div className="relative flex-1">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari SPJ, no. SPD, pelaksana..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full pl-9 pr-8 py-1.5 bg-[#EDF3F8] hover:bg-[#E2E8F0] focus:bg-white text-xs text-slate-800 placeholder-slate-500 rounded-md border border-transparent focus:border-slate-300 focus:ring-2 focus:ring-[#0000B3]/20 focus:outline-hidden transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Search Autocomplete / Results Popover */}
              {isSearchFocused && searchQuery.trim() !== '' && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-lg border border-slate-200 shadow-xl z-50 p-2 max-h-72 overflow-y-auto">
                  <div className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                    Hasil Pencarian Berkas ({filteredProjects.length})
                  </div>
                  {filteredProjects.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-500">
                      Tidak ditemukan berkas yang cocok dengan "{searchQuery}"
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredProjects.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            if (onSelectProject) onSelectProject(p.id);
                            setIsSearchFocused(false);
                            setSearchQuery('');
                            handleNav('kuitansi');
                          }}
                          className="p-2 rounded-md hover:bg-blue-50 text-xs text-slate-700 cursor-pointer transition-colors"
                        >
                          <div className="font-semibold text-slate-900">{p.namaProject}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>SPD: {p.nomorSPD || '-'}</span>
                            <span>·</span>
                            <span>Pelaksana: {p.kuitansi?.namaPelaksana || '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 2. CENTER / RIGHT ZONE: LINKEDIN ICONIC VERTICAL NAVIGATION TABS */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 h-full">
            {/* Beranda Tab */}
            <button
              onClick={() => handleNav('landing')}
              className={`flex flex-col items-center justify-center px-3 h-full border-b-2 text-[11px] transition-all cursor-pointer min-w-[56px] ${
                activeTab === 'landing'
                  ? 'border-[#0000B3] text-[#0000B3] font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span>Beranda</span>
            </button>

            {/* Kuitansi Tab */}
            <button
              onClick={() => handleNav('kuitansi')}
              className={`flex flex-col items-center justify-center px-3 h-full border-b-2 text-[11px] transition-all cursor-pointer min-w-[56px] ${
                activeTab === 'kuitansi'
                  ? 'border-[#0000B3] text-[#0000B3] font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5 mb-0.5" />
              <span>Kuitansi</span>
            </button>

            {/* Foto Dokumentasi Tab */}
            <button
              onClick={() => handleNav('dokumentasi')}
              className={`relative flex flex-col items-center justify-center px-3 h-full border-b-2 text-[11px] transition-all cursor-pointer min-w-[56px] ${
                activeTab === 'dokumentasi'
                  ? 'border-[#0000B3] text-[#0000B3] font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="relative">
                <Camera className="w-5 h-5 mb-0.5" />
                {totalDokumentasi > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#0000B3] text-white text-[9px] font-bold px-1 rounded-full leading-tight">
                    {totalDokumentasi}
                  </span>
                )}
              </div>
              <span>Foto</span>
            </button>

            {/* Bukti Bayar Tab */}
            <button
              onClick={() => handleNav('bukti_bayar')}
              className={`relative flex flex-col items-center justify-center px-3 h-full border-b-2 text-[11px] transition-all cursor-pointer min-w-[56px] ${
                activeTab === 'bukti_bayar'
                  ? 'border-[#0000B3] text-[#0000B3] font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="relative">
                <Receipt className="w-5 h-5 mb-0.5" />
                {totalBuktiBayar > 0 && (
                  <span className="absolute -top-1 -right-2 bg-amber-600 text-white text-[9px] font-bold px-1 rounded-full leading-tight">
                    {totalBuktiBayar}
                  </span>
                )}
              </div>
              <span>Bukti Riil</span>
            </button>

            {/* Arsip Proyek Tab */}
            <button
              onClick={onOpenProjectManager}
              className={`relative flex flex-col items-center justify-center px-3 h-full border-b-2 text-[11px] transition-all cursor-pointer min-w-[56px] ${
                activeTab === 'berkas'
                  ? 'border-[#0000B3] text-[#0000B3] font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <Briefcase className="w-5 h-5 mb-0.5" />
              <span>Arsip ({projects.length})</span>
            </button>

            {/* Cetak Paket Tab */}
            <button
              onClick={onOpenPaketLengkap}
              className={`flex flex-col items-center justify-center px-3 h-full border-b-2 text-[11px] transition-all cursor-pointer min-w-[56px] ${
                activeTab === 'paket_lengkap'
                  ? 'border-[#0000B3] text-[#0000B3] font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <Printer className="w-5 h-5 mb-0.5" />
              <span>Cetak</span>
            </button>
          </nav>

          {/* 3. RIGHT ZONE: USER PROFILE DROPDOWN ("SAYA" ALA LINKEDIN) & SIDEBAR TOGGLE */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Profil "Saya" Dropdown Button */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex flex-col items-center justify-center px-2 py-1 rounded-md hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                title="Profil & Pengaturan Akun"
              >
                <div className="w-6 h-6 rounded-full bg-[#0000B3] text-white flex items-center justify-center font-bold text-[10px] overflow-hidden border border-white shadow-2xs">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Foto" className="w-full h-full object-cover" />
                  ) : (
                    <span>{initialName}</span>
                  )}
                </div>
                <div className="flex items-center gap-0.5 text-[10px] font-medium text-slate-600 mt-0.5">
                  <span className="hidden sm:inline">Saya</span>
                  <ChevronDown className="w-2.5 h-2.5" />
                </div>
              </button>

              {/* LinkedIn Style Profile Menu Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-3 space-y-3">
                  {/* Info Header ASN */}
                  <div className="flex items-start gap-2.5 pb-2.5 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-[#0000B3] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="Foto" className="w-full h-full object-cover" />
                      ) : (
                        <span>{initialName}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 truncate">
                        {kuitansi.namaPelaksana || 'ASN Pelaksana'}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {kuitansi.jabatanPelaksana || 'Biro Adpim Kaltara'}
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                        NIP. {kuitansi.nipPelaksana || '-'}
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-1 text-xs">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        if (onOpenLogoDinas) onOpenLogoDinas();
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 text-slate-700 hover:text-[#0000B3] text-left transition-colors cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>Kelola Lambang Instansi</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenProjectManager();
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 text-slate-700 hover:text-[#0000B3] text-left transition-colors cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span>Manajer Berkas & Proyek</span>
                    </button>

                    {onOpenDeviceHelp && (
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onOpenDeviceHelp();
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 text-slate-700 hover:text-[#0000B3] text-left transition-colors cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span>Solusi Error 403 & HP</span>
                      </button>
                    )}

                    {onOpenDeployGuide && (
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onOpenDeployGuide();
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 text-slate-700 hover:text-[#0000B3] text-left transition-colors cursor-pointer"
                      >
                        <Cloud className="w-3.5 h-3.5 text-slate-400" />
                        <span>Panduan Online Publik</span>
                      </button>
                    )}
                  </div>

                  {/* Google Login Status */}
                  <div className="pt-2 border-t border-slate-100">
                    {onOpenGoogleLogin && (
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onOpenGoogleLogin();
                        }}
                        className="w-full py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-[#0000B3] text-[#0000B3] hover:text-white text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {user ? (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Terhubung Cloud ({user.displayName?.split(' ')[0] || 'User'})</span>
                          </>
                        ) : (
                          <>
                            <LogIn className="w-3.5 h-3.5" />
                            <span>Sinkronkan Akun Google</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile/Sidebar Quick Menu Button */}
            {onOpenSidebar && (
              <button
                onClick={onOpenSidebar}
                className="w-8 h-8 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#0000B3] flex md:hidden items-center justify-center transition-colors cursor-pointer"
                title="Buka Menu Lengkap"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
