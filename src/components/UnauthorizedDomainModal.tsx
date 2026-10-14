import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Copy, 
  Check, 
  ExternalLink, 
  Zap, 
  Globe, 
  HelpCircle,
  Wifi,
  Cloud
} from 'lucide-react';

interface UnauthorizedDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLiveSync?: () => void;
}

export const UnauthorizedDomainModal: React.FC<UnauthorizedDomainModalProps> = ({
  isOpen,
  onClose,
  onOpenLiveSync
}) => {
  const [copied, setCopied] = useState(false);
  const currentDomain = window.location.hostname;

  if (!isOpen) return null;

  const handleCopyDomain = () => {
    navigator.clipboard.writeText(currentDomain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full my-auto shadow-2xl border border-rose-200 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-800 text-white p-5 space-y-2 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-rose-200 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Solusi Firebase: auth/unauthorized-domain</span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
            Domain Ini Belum Diizinkan di Firebase Login
          </h2>
          <p className="text-xs text-rose-100">
            Penyebab utama pesan merah <code className="bg-rose-950/80 px-1 py-0.5 rounded font-mono text-amber-300">auth/unauthorized-domain</code> saat klik Hubungkan Google Drive.
          </p>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-slate-700">
          {/* Domain Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <span className="font-extrabold text-amber-950 text-xs block">
              Domain Website Anda Saat Ini:
            </span>
            <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-amber-300">
              <code className="font-mono text-xs font-bold text-slate-900 truncate flex-1">
                {currentDomain}
              </code>
              <button
                onClick={handleCopyDomain}
                className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] inline-flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Tercopy!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Domain</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Solutions */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-purple-900">
              2 Solusi Mudah & Cepat:
            </h4>

            {/* Solusi 1: Live Cloud Sync (Recommended) */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-950 text-xs flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                  Gunakan Live Cloud Sync Realtime (Rekomendasi Utama)
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">Instan & Tanpa Setting</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Fitur **Live Sync Cloud** tidak memerlukan login popup Google Drive! Perubahan yang dibuat di PC akan **langsung ter-update otomatis di HP Anda dalam 1 detik**.
              </p>
              {onOpenLiveSync && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenLiveSync();
                  }}
                  className="w-full mt-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs inline-flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Buka Live Cloud Sync Sekarang</span>
                </button>
              )}
            </div>

            {/* Solusi 2: Tambahkan Domain di Firebase Console */}
            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-purple-950 text-xs flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#7D2AE8] text-white flex items-center justify-center text-[10px] font-black">2</span>
                  Izinkan Domain di Firebase Console
                </span>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">Untuk Google Drive</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Jika Anda tetap ingin menggunakan Google Drive OAuth:
              </p>
              <ol className="list-decimal list-inside text-[11px] text-slate-800 space-y-1 pl-1 font-medium">
                <li>Buka <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-purple-700 font-extrabold underline">Firebase Console</a>.</li>
                <li>Pilih menu <strong>Authentication</strong> &gt; Tab <strong>Settings</strong> &gt; <strong>Authorized Domains</strong>.</li>
                <li>Klik <strong>Add Domain</strong> lalu tempel/paste domain Anda: <code className="bg-purple-100 font-mono text-purple-950 px-1 rounded">{currentDomain}</code></li>
                <li>Coba klik "Hubungkan Google Drive" kembali!</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs shadow-md cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
