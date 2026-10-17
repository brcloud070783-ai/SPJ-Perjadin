import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Copy, 
  Check, 
  ExternalLink, 
  Globe, 
  HelpCircle,
  CheckCircle2,
  Zap,
  Info,
  Server
} from 'lucide-react';

interface UnauthorizedDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnauthorizedDomainModal: React.FC<UnauthorizedDomainModalProps> = ({
  isOpen,
  onClose
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
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full my-auto shadow-2xl border border-amber-200 dark:border-slate-800 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 via-purple-900 to-slate-900 text-white p-5 space-y-2 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-amber-200 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Pemberitahuan Domain External (Vercel)</span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
            Mengapa Project Tidak Ditemukan di Firebase Console?
          </h2>
          <p className="text-xs text-amber-100/90">
            Aplikasi diakses dari domain Vercel (<code className="bg-amber-950/80 px-1 py-0.5 rounded font-mono text-amber-300">{currentDomain}</code>).
          </p>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-slate-700 dark:text-slate-300">
          {/* Explanation Box */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-2">
            <div className="flex items-start gap-2 text-amber-900 dark:text-amber-300 font-extrabold text-xs">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>Penjelasan Mengapa Anda Tidak Perlu Buka Firebase Console:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
              Project Firebase bawaan aplikasi ini dibuat dan dikelola <strong>secara otomatis oleh sistem AI Studio</strong> (Managed System Project). Oleh karena itu, project ini <strong>tidak terdaftar di bawah akun Google pribadi Anda</strong>, sehingga Anda tidak dapat menemukannya saat login ke Firebase Console.
            </p>
          </div>

          {/* Solution 1: Mode Lokal */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-2 border-emerald-400 dark:border-emerald-600 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-black text-xs uppercase tracking-wider">
              <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span>Solusi 1 (Terbaik & Instan - 100% Fitur Berjalan):</span>
            </div>

            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              <strong>Gunakan Mode Lokal Tanpa Login!</strong> SiDinas adalah aplikasi <i>Offline-First</i>. Anda dapat membuat SPJ, Kuitansi A4, Nota Foto, Rincian Biaya, dan mengunduh PDF secara penuh tanpa memerlukan login Google/Firebase.
            </p>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Gunakan Mode Lokal Sekarang (Selesai Tanpa Error)</span>
            </button>
          </div>

          {/* Solution 2: Custom Firebase Project */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-xs">
              <Server className="w-4 h-4 text-[#0000B3]" />
              <span>Solusi 2 (Jika Wajib Ingin Menggunakan Firebase Console Pribadi):</span>
            </div>
            <ol className="list-decimal list-inside text-[11px] space-y-1.5 pl-1 font-medium text-slate-600 dark:text-slate-300">
              <li>Buat Project baru secara gratis di <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-[#0000B3] underline font-bold">console.firebase.google.com <ExternalLink className="w-3 h-3 inline" /></a>.</li>
              <li>Aktifkan <strong>Authentication &gt; Google Sign-In</strong>.</li>
              <li>Tambahkan domain Anda (<code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono font-bold text-slate-900 dark:text-white">{currentDomain}</code>) ke menu <strong>Authorized Domains</strong>.</li>
              <li>Salin konfigurasi Firebase Web App Anda dan minta kami menggantinya di aplikasi.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Globe className="w-3.5 h-3.5" />
            <span className="truncate max-w-[180px]">{currentDomain}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs shadow-md cursor-pointer"
          >
            Tutup & Buka Aplikasi
          </button>
        </div>
      </div>
    </div>
  );
};
