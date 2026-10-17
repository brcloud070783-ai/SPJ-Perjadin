import React from 'react';
import { 
  FileSpreadsheet, 
  Camera, 
  Receipt, 
  Printer, 
  FolderPlus,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { TabType, KuitansiData, ProjectSPJ } from '../types';

interface LinkedInComposerProps {
  kuitansi: KuitansiData;
  activeProject?: ProjectSPJ;
  activeTab: TabType;
  onNavigateTab: (tab: TabType) => void;
  onCreateNewProject: () => void;
  totalDokumentasi: number;
  totalBuktiBayar: number;
}

export const LinkedInComposer: React.FC<LinkedInComposerProps> = ({
  kuitansi,
  activeProject,
  activeTab,
  onNavigateTab,
  onCreateNewProject,
  totalDokumentasi,
  totalBuktiBayar
}) => {
  const initialName = (kuitansi.namaPelaksana || 'AP').slice(0, 2).toUpperCase();

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3.5 mb-4 transition-all hover:shadow-sm">
      {/* Top Input Trigger Box ala LinkedIn "Start a post" */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 p-0.5 shrink-0 overflow-hidden">
          {kuitansi.logoUrl ? (
            <img 
              src={kuitansi.logoUrl} 
              alt="Logo" 
              className="w-full h-full object-contain rounded-full"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-[#0000B3] text-white flex items-center justify-center font-bold text-xs">
              {initialName}
            </div>
          )}
        </div>

        <button
          onClick={() => onNavigateTab('kuitansi')}
          className="flex-1 text-left px-4 py-2.5 rounded-full bg-slate-100/80 hover:bg-slate-100 border border-slate-200/60 text-slate-500 hover:text-slate-800 text-xs font-medium transition-all cursor-pointer flex items-center justify-between group"
        >
          <span className="truncate">
            {activeProject ? `Edit: ${activeProject.namaProject}` : 'Mulai susun berkas SPJ perjalanan dinas...'}
          </span>
          <span className="text-[11px] font-bold text-[#0000B3] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
            <span>Buka Form</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </button>
      </div>

      {/* 4 Tombol Cepat ala LinkedIn Composer (Media, Event, Write article) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-2.5">
        <button
          onClick={() => onNavigateTab('kuitansi')}
          className={`flex items-center justify-center gap-2 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'kuitansi'
              ? 'bg-blue-50 text-[#0000B3] border border-blue-200/70'
              : 'hover:bg-slate-50 text-slate-700'
          }`}
          title="Isi formulir kuitansi & rincian biaya"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#0000B3] shrink-0" />
          <span className="truncate">Kuitansi</span>
        </button>

        <button
          onClick={() => onNavigateTab('dokumentasi')}
          className={`flex items-center justify-center gap-2 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'dokumentasi'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/70'
              : 'hover:bg-slate-50 text-slate-700'
          }`}
          title="Lampirkan foto dokumentasi bergeotagging"
        >
          <Camera className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="truncate">Foto ({totalDokumentasi})</span>
        </button>

        <button
          onClick={() => onNavigateTab('bukti_bayar')}
          className={`flex items-center justify-center gap-2 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'bukti_bayar'
              ? 'bg-amber-50 text-amber-800 border border-amber-200/70'
              : 'hover:bg-slate-50 text-slate-700'
          }`}
          title="Unggah bukti pengeluaran riil nota & tiket"
        >
          <Receipt className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="truncate">Bukti Riil ({totalBuktiBayar})</span>
        </button>

        <button
          onClick={() => onNavigateTab('paket_lengkap')}
          className={`flex items-center justify-center gap-2 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'paket_lengkap'
              ? 'bg-cyan-50 text-cyan-800 border border-cyan-200/70'
              : 'hover:bg-slate-50 text-slate-700'
          }`}
          title="Pratinjau cetak paket lengkap SPJ"
        >
          <Printer className="w-4 h-4 text-cyan-600 shrink-0" />
          <span className="truncate">Cetak Paket</span>
        </button>
      </div>
    </div>
  );
};
