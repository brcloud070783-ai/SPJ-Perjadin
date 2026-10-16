import React from 'react';
import { TabType } from '../types';
import { Home } from 'lucide-react';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  countProjects?: number;
  countDokumentasi?: number;
  countBuktiBayar?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab
}) => {
  // Sesuai permintaan pengguna: di halaman beranda tidak perlu ada bilah menu yang menumpuk
  if (activeTab === 'landing') {
    return null;
  }

  return (
    <nav className="fixed bottom-3 inset-x-0 z-40 max-w-xs mx-auto px-3 pointer-events-none print:hidden animate-fade-in">
      <div className="pointer-events-auto flex justify-center">
        {/* HANYA 1 TOMBOL BERANDA UNTUK KEMBALI CEPAT DARI DALAM BERKAS */}
        <button
          onClick={() => onChangeTab('landing')}
          className="px-4 py-2 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-[#6547ED] border border-purple-100/90 shadow-lg shadow-purple-950/10 backdrop-blur-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition-all active:scale-95 group"
          title="Kembali ke Beranda"
        >
          <div className="w-6 h-6 rounded-full bg-[#6547ED] text-white flex items-center justify-center shadow-xs">
            <Home className="w-3.5 h-3.5" />
          </div>
          <span>Kembali ke Beranda</span>
        </button>
      </div>
    </nav>
  );
};
