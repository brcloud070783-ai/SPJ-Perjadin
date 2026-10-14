import React from 'react';
import { TabType } from '../types';
import { 
  Receipt, 
  Camera, 
  CreditCard, 
  FolderOpen, 
  Home
} from 'lucide-react';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  countProjects?: number;
  countDokumentasi: number;
  countBuktiBayar: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  countProjects = 0,
  countDokumentasi,
  countBuktiBayar
}) => {
  const tabs = [
    {
      id: 'landing' as TabType,
      label: 'Beranda',
      icon: Home,
      badge: null
    },
    {
      id: 'berkas' as TabType,
      label: 'Berkas SPJ',
      icon: FolderOpen,
      badge: countProjects > 0 ? countProjects : null
    },
    {
      id: 'kuitansi' as TabType,
      label: 'Kuitansi',
      icon: Receipt,
      badge: null
    },
    {
      id: 'dokumentasi' as TabType,
      label: 'Foto GPS',
      icon: Camera,
      badge: countDokumentasi > 0 ? countDokumentasi : null
    },
    {
      id: 'bukti_bayar' as TabType,
      label: 'Nota Bayar',
      icon: CreditCard,
      badge: countBuktiBayar > 0 ? countBuktiBayar : null
    }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-purple-100/90 print:hidden shadow-lg shadow-purple-950/5 safe-area-pb">
      <div className="max-w-md mx-auto grid grid-cols-5 px-1 py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all relative select-none cursor-pointer ${
                isActive
                  ? 'text-[#7D2AE8] font-bold'
                  : 'text-slate-500 hover:text-purple-700 font-medium'
              }`}
            >
              <div className="relative">
                {/* Active glow background pill Canva */}
                {isActive && (
                  <span className="absolute -inset-2 bg-gradient-to-r from-purple-50 to-cyan-50/60 rounded-xl -z-10 animate-fade-in border border-purple-200/50" />
                )}
                
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4] text-[#7D2AE8]' : 'stroke-[1.8]'
                  }`}
                />
                
                {tab.badge !== null && (
                  <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-[#FF3366] to-[#7D2AE8] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full min-w-4 text-center ring-2 ring-white shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] mt-1 tracking-tight truncate w-full text-center transition-colors ${
                isActive ? 'text-[#7D2AE8] font-extrabold' : 'text-slate-500 font-medium'
              }`}>
                {tab.label}
              </span>

              {/* Active micro-indicator dot */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#7D2AE8] to-[#00C4CC] mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
