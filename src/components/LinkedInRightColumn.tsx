import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  FileText, 
  Cloud, 
  HelpCircle, 
  ExternalLink, 
  ShieldAlert, 
  ArrowRight,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { KuitansiData, FotoDokumentasi, BuktiBayar, TabType, ProjectSPJ } from '../types';

interface LinkedInRightColumnProps {
  kuitansi: KuitansiData;
  dokumentasiList: FotoDokumentasi[];
  buktiBayarList: BuktiBayar[];
  activeProject?: ProjectSPJ;
  onNavigateTab: (tab: TabType) => void;
  onOpenPaketLengkap: () => void;
  onQuickPreviewKuitansi: () => void;
  onOpenDeviceHelp: () => void;
  onOpenDeployGuide: () => void;
}

export const LinkedInRightColumn: React.FC<LinkedInRightColumnProps> = ({
  kuitansi,
  dokumentasiList,
  buktiBayarList,
  activeProject,
  onNavigateTab,
  onOpenPaketLengkap,
  onQuickPreviewKuitansi,
  onOpenDeviceHelp,
  onOpenDeployGuide
}) => {
  // Evaluasi kelengkapan audit SPJ
  const hasKuitansiItems = (kuitansi.rincianBiaya?.length || 0) > 0;
  const hasNomorSPD = Boolean(kuitansi.nomorSPPD && kuitansi.nomorSPPD.trim() !== '');
  const hasBuktiBayar = buktiBayarList.length > 0;
  const hasDokumentasi = dokumentasiList.length > 0;
  const hasSignatures = Boolean(kuitansi.namaPelaksana && kuitansi.namaPPK && kuitansi.namaBendahara);

  const checklistItems = [
    {
      id: 'kuitansi',
      title: 'Kuitansi & Rincian Biaya',
      status: hasKuitansiItems,
      tab: 'kuitansi' as TabType,
      detail: hasKuitansiItems ? `${kuitansi.rincianBiaya.length} item rincian` : 'Belum ada rincian'
    },
    {
      id: 'spd',
      title: 'Nomor Surat Perintah Tugas',
      status: hasNomorSPD,
      tab: 'kuitansi' as TabType,
      detail: hasNomorSPD ? (kuitansi.nomorSPPD || '-') : 'Wajib diisi'
    },
    {
      id: 'bukti_bayar',
      title: 'Bukti Pengeluaran Riil',
      status: hasBuktiBayar,
      tab: 'bukti_bayar' as TabType,
      detail: hasBuktiBayar ? `${buktiBayarList.length} nota/tiket terlampir` : 'Perlu nota riil'
    },
    {
      id: 'dokumentasi',
      title: 'Foto Dokumentasi Kegiatan',
      status: hasDokumentasi,
      tab: 'dokumentasi' as TabType,
      detail: hasDokumentasi ? `${dokumentasiList.length} foto bergeotag` : 'Minimal 1 foto'
    },
    {
      id: 'pejabat',
      title: 'Pengesahan PPK & Bendahara',
      status: hasSignatures,
      tab: 'kuitansi' as TabType,
      detail: hasSignatures ? 'Lengkap' : 'Nama/NIP belum lengkap'
    }
  ];

  const completedCount = checklistItems.filter(item => item.status).length;
  const percentage = Math.round((completedCount / checklistItems.length) * 100);

  return (
    <aside className="w-full space-y-4">
      {/* 1. KARTU AUDIT KELENGKAPAN SPJ (AUDIT CHECKLIST ALA LINKEDIN WIDGET) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 transition-all hover:shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-xs text-slate-900 leading-snug">Audit Berkas SPJ</h3>
            <p className="text-[10px] text-slate-400">Pemeriksaan Kepatuhan BPK / Inspektorat</p>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            percentage === 100 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-blue-50 text-[#0000B3] border-blue-200'
          }`}>
            {percentage}% Siap
          </span>
        </div>

        {/* Bar Progres */}
        <div className="mb-3.5 space-y-1">
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                percentage === 100 
                  ? 'bg-emerald-500' 
                  : 'bg-gradient-to-r from-[#0000B3] to-cyan-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>{completedCount} dari {checklistItems.length} syarat</span>
            <span>{percentage === 100 ? 'Siap Dicetak' : 'Perlu Dilengkapi'}</span>
          </div>
        </div>

        {/* Checklist Interaktif */}
        <div className="space-y-1.5">
          {checklistItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => onNavigateTab(item.tab)}
              className="group flex items-start justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
            >
              <div className="flex items-start gap-2 min-w-0">
                {item.status ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                )}
                <div className="min-w-0">
                  <div className={`text-xs font-semibold leading-tight group-hover:text-[#0000B3] ${
                    item.status ? 'text-slate-800' : 'text-slate-900'
                  }`}>
                    {item.title}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                    {item.detail}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0000B3] group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
            </div>
          ))}
        </div>

        {/* Tombol Cetak Utama */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <button
            onClick={onOpenPaketLengkap}
            className="w-full py-2 px-3 rounded-lg bg-[#0000B3] hover:bg-[#000090] text-white text-xs font-bold transition-all shadow-xs inline-flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Paket Lengkap SPJ</span>
          </button>

          <button
            onClick={onQuickPreviewKuitansi}
            className="w-full py-1.5 px-3 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#0000B3] text-[11px] font-semibold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/80"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Lihat Draf Kuitansi Riil</span>
          </button>
        </div>
      </div>

      {/* 2. KARTU DASAR HUKUM & STANDAR BIAYA */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3.5 transition-all hover:shadow-sm">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
          <BookOpen className="w-3.5 h-3.5 text-[#0000B3]" />
          <h3 className="font-bold text-xs text-slate-900">Dasar Hukum & SOP</h3>
        </div>

        <ul className="space-y-2 text-[11px] text-slate-600">
          <li className="flex items-start gap-1.5">
            <span className="text-[#0000B3] font-bold mt-0.5">▪</span>
            <span><strong>PMK RI SBM 2025/2026</strong>: Ketentuan standar biaya masukan uang harian & transportasi dinas.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-[#0000B3] font-bold mt-0.5">▪</span>
            <span><strong>Pergub Kalimantan Utara</strong>: Pedoman pelaksanaan perjalanan dinas pejabat & ASN Prov. Kaltara.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-[#0000B3] font-bold mt-0.5">▪</span>
            <span><strong>Kepatuhan BPK RI</strong>: Bukti riil nota/tiket/boarding pass wajib dilampirkan lengkap.</span>
          </li>
        </ul>
      </div>

      {/* 3. BANTUAN AKSES & PENERAPAN SISTEM */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3.5 space-y-2">
        <h4 className="font-bold text-xs text-slate-800">Panduan Teknis</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpenDeviceHelp}
            className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#0000B3] text-[11px] font-medium text-left transition-colors border border-slate-200/80 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#0000B3] mb-1" />
            <span className="block leading-tight">Solusi 403 & Akses HP</span>
          </button>
          <button
            onClick={onOpenDeployGuide}
            className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#0000B3] text-[11px] font-medium text-left transition-colors border border-slate-200/80 cursor-pointer"
          >
            <Cloud className="w-3.5 h-3.5 text-cyan-600 mb-1" />
            <span className="block leading-tight">Panduan Online Vercel</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
