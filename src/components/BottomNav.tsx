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
      step: null,
      badge: null
    },
    {
      id: 'kuitansi' as TabType,
      label: 'Kuitansi',
      icon: Receipt,
      step: '1',
      badge: null
    },
    {
      id: 'dokumentasi' as TabType,
      label: 'Foto GPS',
      icon: Camera,
      step: '2',
      badge: countDokumentasi > 0 ? countDokumentasi : null
    },
    {
      id: 'bukti_bayar' as TabType,
      label: 'Nota SPJ',
      icon: CreditCard,
      step: '3',
      badge: countBuktiBayar > 0 ? countBuktiBayar : null
    },
    {
      id: 'berkas' as TabType,
      label: 'Berkas',
      icon: FolderOpen,
      step: null,
      badge: countProjects > 0 ? countProjects : null
    }
  ];

  return (
    <nav className="fixed bottom-3 inset-x-0 z-40 max-w-md mx-auto px-3 pointer-events-none print:hidden">
      {/* PARCELLY-STYLE FLOATING PILL BAR (WHITE/LAVENDER GLASS WITH RICH VIOLET ACTIVE STATE) */}
      <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-purple-100/90 rounded-full px-2 py-1.5 shadow-xl shadow-purple-950/8 flex items-center justify-between text-slate-400">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex-1 min-h-[44px] flex flex-col items-center justify-center py-1 px-1 rounded-full transition-all relative select-none cursor-pointer group ${
                isActive
                  ? 'bg-[#6547ED] text-white shadow-sm'
                  : 'hover:text-slate-700 hover:bg-purple-50/50 text-slate-400'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-white stroke-[2.2]' : 'stroke-[1.8]'
                  }`}
                />
                
                {/* Step number badge (1, 2, 3) */}
                {tab.step && !tab.badge && (
                  <span className={`absolute -top-1 -right-2 text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center ${
                    isActive ? 'bg-white text-[#6547ED] font-extrabold' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {tab.step}
                  </span>
                )}

                {/* Counter badge */}
                {tab.badge !== null && (
                  <span className={`absolute -top-1.5 -right-2.5 text-[8px] font-bold px-1 rounded-full min-w-3.5 h-3.5 flex items-center justify-center ${
                    isActive ? 'bg-white text-[#6547ED]' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className={`text-[9px] mt-0.5 tracking-tight truncate max-w-[55px] text-center ${
                isActive ? 'text-white font-bold' : 'text-slate-500 font-medium'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
