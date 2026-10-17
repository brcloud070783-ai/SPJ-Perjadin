import React from 'react';
import { TabType } from '../types';
import { Home, FileSpreadsheet, Camera, Receipt, Printer, Briefcase } from 'lucide-react';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  countProjects?: number;
  countDokumentasi?: number;
  countBuktiBayar?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  countDokumentasi = 0,
  countBuktiBayar = 0
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden print:hidden px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        <button
          onClick={() => onChangeTab('landing')}
          className={`flex flex-col items-center justify-center py-1 px-2 text-[10px] transition-colors cursor-pointer ${
            activeTab === 'landing' ? 'text-[#0000B3] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Beranda</span>
        </button>

        <button
          onClick={() => onChangeTab('kuitansi')}
          className={`flex flex-col items-center justify-center py-1 px-2 text-[10px] transition-colors cursor-pointer ${
            activeTab === 'kuitansi' ? 'text-[#0000B3] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-5 h-5 mb-0.5" />
          <span>Kuitansi</span>
        </button>

        <button
          onClick={() => onChangeTab('dokumentasi')}
          className={`relative flex flex-col items-center justify-center py-1 px-2 text-[10px] transition-colors cursor-pointer ${
            activeTab === 'dokumentasi' ? 'text-[#0000B3] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Camera className="w-5 h-5 mb-0.5" />
            {countDokumentasi > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#0000B3] text-white text-[8px] font-bold px-1 rounded-full leading-tight">
                {countDokumentasi}
              </span>
            )}
          </div>
          <span>Foto</span>
        </button>

        <button
          onClick={() => onChangeTab('bukti_bayar')}
          className={`relative flex flex-col items-center justify-center py-1 px-2 text-[10px] transition-colors cursor-pointer ${
            activeTab === 'bukti_bayar' ? 'text-[#0000B3] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Receipt className="w-5 h-5 mb-0.5" />
            {countBuktiBayar > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-600 text-white text-[8px] font-bold px-1 rounded-full leading-tight">
                {countBuktiBayar}
              </span>
            )}
          </div>
          <span>Bukti Riil</span>
        </button>

        <button
          onClick={() => onChangeTab('paket_lengkap')}
          className={`flex flex-col items-center justify-center py-1 px-2 text-[10px] transition-colors cursor-pointer ${
            activeTab === 'paket_lengkap' ? 'text-[#0000B3] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Printer className="w-5 h-5 mb-0.5" />
          <span>Cetak</span>
        </button>
      </div>
    </div>
  );
};
