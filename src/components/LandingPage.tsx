import React from 'react';
import { 
  Plus, 
  Receipt, 
  Camera, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  FolderOpen,
  Printer
} from 'lucide-react';
import { TabType, KuitansiData, FotoDokumentasi, BuktiBayar } from '../types';

interface LandingPageProps {
  onStartApp: (tab?: TabType) => void;
  kuitansi?: KuitansiData;
  dokumentasiList?: FotoDokumentasi[];
  buktiBayarList?: BuktiBayar[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onStartApp,
  kuitansi,
  dokumentasiList = [],
  buktiBayarList = []
}) => {
  const totalBiaya = kuitansi?.rincianBiaya?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0;

  return (
    <div className="max-w-xl mx-auto px-2 py-4 flex flex-col justify-center min-h-[calc(100vh-140px)] animate-fade-in space-y-6">
      
      {/* GREETING & INTRO */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/80 text-[#7D2AE8] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SiDinas • Standar Permenkeu RI</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Penyusunan SPJ Digital
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto">
          Susun dokumen pertanggungjawaban dinas secara runtut, rapi, dan langsung siap cetak format A4 resmi.
        </p>
      </div>

      {/* HERO PRIMARY ACTION CARD: "BUAT SPJ BARU" */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#7D2AE8] via-[#00C4CC] to-[#FF3366] rounded-3xl blur-md opacity-25 group-hover:opacity-40 transition duration-300 pointer-events-none" />

        <div className="relative bg-white rounded-3xl border border-purple-100 shadow-xl p-6 sm:p-8 text-center space-y-6">
          
          {/* Main Icon Button */}
          <button
            onClick={() => onStartApp('kuitansi')}
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-gradient-to-tr from-[#180A30] via-[#3B1578] to-[#7D2AE8] text-white flex items-center justify-center shadow-lg shadow-purple-900/30 group-hover:scale-105 active:scale-95 transition-all cursor-pointer relative"
            title="Klik untuk Mulai Buat SPJ Baru"
          >
            <Plus className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5] text-cyan-300" />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#00C4CC] text-slate-950 flex items-center justify-center font-black shadow-md border-2 border-white">
              <Receipt className="w-4 h-4" />
            </div>
          </button>

          {/* Heading & Call To Action */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Buat SPJ Baru
            </h2>
            <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
              Mulai proses pengisian kuitansi dinas, otomatis berlanjut ke stempel foto GPS, dan lampiran bukti bayar.
            </p>
          </div>

          {/* 3 Sequential Steps Visual Indicator */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-3">
              Alur Pengerjaan Bertahap (3 Langkah)
            </div>

            <div className="grid grid-cols-3 gap-2 text-left">
              <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100">
                <div className="flex items-center gap-1.5 text-[#7D2AE8] mb-1">
                  <span className="w-4 h-4 rounded-full bg-[#7D2AE8] text-white text-[9px] font-extrabold flex items-center justify-center">1</span>
                  <Receipt className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11px] font-bold text-slate-900">Kuitansi</div>
                <div className="text-[9px] text-slate-500">SPD & Rincian</div>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100">
                <div className="flex items-center gap-1.5 text-rose-600 mb-1">
                  <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-extrabold flex items-center justify-center">2</span>
                  <Camera className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11px] font-bold text-slate-900">Foto GPS</div>
                <div className="text-[9px] text-slate-500">Stempel Lokasi</div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100">
                <div className="flex items-center gap-1.5 text-amber-600 mb-1">
                  <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[9px] font-extrabold flex items-center justify-center">3</span>
                  <CreditCard className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11px] font-bold text-slate-900">Nota Fisik</div>
                <div className="text-[9px] text-slate-500">Tiket & Hotel</div>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => onStartApp('kuitansi')}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#7D2AE8] to-[#5914B8] hover:brightness-110 active:scale-98 text-white font-extrabold text-sm shadow-md shadow-purple-900/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Mulai Pengerjaan Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* QUIET ACTIVE DRAFT SUMMARY */}
      {kuitansi && (
        <div className="bg-white/80 backdrop-blur-xs rounded-2xl border border-slate-200/80 p-3.5 flex items-center justify-between text-xs shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7D2AE8] flex items-center justify-center shrink-0">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Berkas Aktif Saat Ini
              </div>
              <div className="font-extrabold text-slate-900 truncate">
                {kuitansi.namaPelaksana ? `SPJ - ${kuitansi.namaPelaksana}` : 'Kuitansi Perjalanan Dinas'}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Total: <span className="text-[#7D2AE8] font-bold">Rp {totalBiaya.toLocaleString('id-ID')}</span> · {dokumentasiList.length} Foto · {buktiBayarList.length} Nota
              </div>
            </div>
          </div>

          <button
            onClick={() => onStartApp('kuitansi')}
            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7D2AE8] font-bold text-xs shrink-0 cursor-pointer transition-colors"
          >
            Buka
          </button>
        </div>
      )}

    </div>
  );
};
