import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Lightbulb, 
  FileCheck2, 
  Receipt, 
  Camera, 
  CreditCard,
  ArrowRight
} from 'lucide-react';

interface DiscussionGuideProps {
  onGoToKuitansi: () => void;
  onGoToDokumentasi: () => void;
  onGoToBuktiBayar: () => void;
}

export const DiscussionGuide: React.FC<DiscussionGuideProps> = ({
  onGoToKuitansi,
  onGoToDokumentasi,
  onGoToBuktiBayar
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'item-1': true,
    'item-2': true,
    'item-3': false,
    'item-4': false
  });

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const checklist = [
    {
      id: 'item-1',
      title: 'Form Kuitansi & Data Tugas A4',
      subtitle: 'Nama pelaksana, NIP, kota tujuan, & rincian uang harian/transport.',
      actionLabel: 'Buka Kuitansi',
      action: onGoToKuitansi,
      icon: Receipt
    },
    {
      id: 'item-2',
      title: 'Foto Kegiatan GPS Geotag',
      subtitle: 'Foto lapangan lengkap stempel waktu & koordinat lokasi.',
      actionLabel: 'Upload Foto',
      action: onGoToDokumentasi,
      icon: Camera
    },
    {
      id: 'item-3',
      title: 'Nota & Bukti Bayar Pembelian',
      subtitle: 'Struk BBM, Hotel, Tol, atau Tiket dengan filter kontras jernih.',
      actionLabel: 'Upload Nota',
      action: onGoToBuktiBayar,
      icon: CreditCard
    }
  ];

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="space-y-4 pb-20 max-w-3xl mx-auto">
      {/* HEADER CARD */}
      <div className="bg-[#180A30] text-white p-5 rounded-2xl border border-purple-900 shadow-md space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cyan-200 text-xs font-bold">
          <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
          Checklist Kelengkapan Audit SPJ
        </div>
        <h2 className="text-xl font-black text-white">
          Panduan Ringkas Berkas SPPD
        </h2>
        <p className="text-xs text-purple-200/90 font-medium">
          Tandai kelengkapan berkas Anda sebelum dicetak dan diserahkan ke verifikator keuangan.
        </p>

        {/* Progress bar */}
        <div className="pt-2">
          <div className="flex justify-between text-xs font-bold text-cyan-200 mb-1">
            <span>Progress Kelengkapan:</span>
            <span>{completedCount} dari {checklist.length} Selesai</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#00C4CC] to-[#7D2AE8] transition-all duration-300"
              style={{ width: `${(completedCount / checklist.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* CHECKLIST ITEMS */}
      <div className="space-y-2.5">
        {checklist.map((item) => {
          const isChecked = checkedItems[item.id];
          const Icon = item.icon;

          return (
            <div 
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 bg-white ${
                isChecked ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => toggleCheck(item.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    isChecked ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300 text-transparent hover:border-emerald-500'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div className="min-w-0">
                  <h3 className={`text-xs font-extrabold truncate ${isChecked ? 'text-slate-900 line-through text-slate-500' : 'text-slate-900'}`}>
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <button
                onClick={item.action}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-[#7D2AE8] hover:text-white text-[#7D2AE8] font-bold text-xs transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <span>{item.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
