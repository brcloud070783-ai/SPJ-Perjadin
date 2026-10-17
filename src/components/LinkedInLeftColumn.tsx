import React from 'react';
import { 
  Building2, 
  MapPin, 
  FolderOpen, 
  Wallet, 
  BookmarkCheck, 
  ChevronRight,
  ShieldCheck,
  FileCheck2,
  ExternalLink,
  PlusCircle
} from 'lucide-react';
import { KuitansiData, ProjectSPJ, TabType } from '../types';
import { formatRupiah } from '../utils/terbilang';

interface LinkedInLeftColumnProps {
  kuitansi: KuitansiData;
  activeProject?: ProjectSPJ;
  projects: ProjectSPJ[];
  activeTab: TabType;
  onNavigateTab: (tab: TabType) => void;
  onSelectProject: (id: string) => void;
  onCreateProject: () => void;
  onOpenProjectManager: () => void;
  onOpenLogoDinas: () => void;
}

export const LinkedInLeftColumn: React.FC<LinkedInLeftColumnProps> = ({
  kuitansi,
  activeProject,
  projects,
  activeTab,
  onNavigateTab,
  onSelectProject,
  onCreateProject,
  onOpenProjectManager,
  onOpenLogoDinas
}) => {
  // Hitung total nilai kuitansi saat ini
  const totalBiaya = kuitansi.totalBiaya || 0;
  const initialName = (kuitansi.namaPelaksana || 'AP').slice(0, 2).toUpperCase();

  return (
    <aside className="w-full space-y-4">
      {/* 1. KARTU PROFIL ASN (GAYA KARTU PROFIL LINKEDIN) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden transition-all hover:shadow-sm">
        {/* Banner Cover dengan gradien Biru Kobalt Kaltara */}
        <div className="h-16 w-full bg-gradient-to-r from-[#000080] via-[#0000B3] to-[#0096C7] relative flex items-center justify-end px-3">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
          <span className="relative z-10 text-[10px] font-bold text-white/90 bg-black/20 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/20">
            Prov. Kaltara
          </span>
        </div>

        {/* Avatar Overlap & Info Profil */}
        <div className="px-4 pb-4 pt-0 -mt-8 relative">
          <div className="flex items-end justify-between mb-3">
            <div className="w-16 h-16 rounded-full bg-white p-1 shadow-md border-2 border-white relative group">
              {kuitansi.logoUrl ? (
                <img 
                  src={kuitansi.logoUrl} 
                  alt="Logo Instansi" 
                  className="w-full h-full object-contain rounded-full bg-slate-50 p-1"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#0000B3] text-white flex items-center justify-center font-bold text-base shadow-inner">
                  {initialName}
                </div>
              )}
              <div 
                onClick={onOpenLogoDinas}
                className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] text-white font-medium cursor-pointer transition-opacity"
                title="Ganti Lambang Instansi"
              >
                Ganti
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('kuitansi')}
              className="text-[11px] font-bold text-[#0000B3] hover:underline flex items-center gap-0.5"
            >
              <span>Edit Data</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Nama & NIP Pegawai */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-sm text-slate-900 leading-snug line-clamp-1">
                {kuitansi.namaPelaksana || 'ASN Pelaksana Tugas'}
              </h2>
              <span title="Terverifikasi E-SPJ">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0000B3] shrink-0" />
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-tight line-clamp-1">
              {kuitansi.jabatanPelaksana || 'Pejabat Fungsional / Staf'}
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              NIP. {kuitansi.nipPelaksana || '19XXXXXXXXXXXXXX'}
            </p>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-600">
            <Building2 className="w-3.5 h-3.5 text-[#0000B3] shrink-0" />
            <span className="truncate">{kuitansi.instansi || 'Pemerintah Provinsi Kalimantan Utara'}</span>
          </div>

          {kuitansi.kotaTujuan && (
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
              <span className="truncate">Tujuan: {kuitansi.kotaTujuan}</span>
            </div>
          )}
        </div>

        {/* Statistik Ringkas ala LinkedIn (Impressions & Connections) */}
        <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 space-y-2 text-xs">
          <div 
            onClick={onOpenProjectManager}
            className="flex items-center justify-between py-1 cursor-pointer hover:text-[#0000B3] group"
          >
            <span className="text-slate-500 text-[11px] group-hover:text-[#0000B3]">Berkas SPJ Aktif</span>
            <span className="font-bold font-mono text-[#0000B3] tabular-nums text-xs">
              {projects.length} Berkas
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-slate-100/70">
            <span className="text-slate-500 text-[11px]">Total Belanja Riil</span>
            <span className="font-bold font-mono text-slate-900 tabular-nums text-xs">
              {formatRupiah(totalBiaya)}
            </span>
          </div>
        </div>

        {/* Quick Link Footer */}
        <div className="border-t border-slate-200/90 p-2.5 bg-white">
          <button
            onClick={onOpenProjectManager}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-blue-50 text-slate-700 hover:text-[#0000B3] text-xs font-bold transition-colors cursor-pointer border border-transparent hover:border-blue-100"
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#0000B3]" />
            <span>Kelola Arsip Proyek SPJ</span>
          </button>
        </div>
      </div>

      {/* 2. KARTU PINTASAN SBM KALTIM & KALTARA 2025 */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3.5 transition-all hover:shadow-sm">
        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-50 text-[#0000B3] flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 leading-none">Standar Biaya (SBM)</h3>
              <span className="text-[10px] text-slate-400">Plafon Resmi Prov. Kaltara</span>
            </div>
          </div>
          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            2025/2026
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 hover:bg-blue-50/60 transition-colors">
            <span className="text-slate-600 text-[11px]">Uang Harian Kaltara</span>
            <span className="font-bold font-mono text-slate-900 text-[11px] tabular-nums">Rp 430.000</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 hover:bg-blue-50/60 transition-colors">
            <span className="text-slate-600 text-[11px]">Penginapan Gol. III</span>
            <span className="font-bold font-mono text-slate-900 text-[11px] tabular-nums">Rp 610.000</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 hover:bg-blue-50/60 transition-colors">
            <span className="text-slate-600 text-[11px]">Taksi Bandara PP</span>
            <span className="font-bold font-mono text-slate-900 text-[11px] tabular-nums">Rp 150.000</span>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('kuitansi')}
          className="mt-3 w-full py-1.5 px-3 rounded-lg bg-blue-50 hover:bg-[#0000B3] text-[#0000B3] hover:text-white text-[11px] font-bold transition-all text-center block cursor-pointer"
        >
          Terapkan Tarif ke Kuitansi
        </button>
      </div>

      {/* 3. DAFTAR BERKAS SPJ TERAKHIR (PINTASAN CEPAT) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3.5 transition-all hover:shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-xs text-slate-900">Berkas Terakhir</h3>
          <button
            onClick={onCreateProject}
            className="text-[11px] font-bold text-[#0000B3] hover:text-[#000090] inline-flex items-center gap-1 cursor-pointer"
            title="Tambah Berkas SPJ Baru"
          >
            <PlusCircle className="w-3 h-3" />
            <span>Baru</span>
          </button>
        </div>

        <div className="space-y-1">
          {projects.slice(0, 3).map((p) => {
            const isActive = p.id === activeProject?.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProject(p.id)}
                className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-start gap-2 cursor-pointer ${
                  isActive 
                    ? 'bg-blue-50 text-[#0000B3] font-bold border border-blue-200/80' 
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <FileCheck2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isActive ? 'text-[#0000B3]' : 'text-slate-400'}`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-[11px]">
                    {p.namaProject}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <span>{p.nomorSPD || 'Tanpa SPD'}</span>
                    <span>·</span>
                    <span className="capitalize">{p.status}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {projects.length > 3 && (
          <button
            onClick={onOpenProjectManager}
            className="mt-2 text-center w-full text-[11px] text-slate-500 hover:text-[#0000B3] font-semibold py-1 hover:underline cursor-pointer"
          >
            Lihat semua {projects.length} berkas →
          </button>
        )}
      </div>
    </aside>
  );
};
