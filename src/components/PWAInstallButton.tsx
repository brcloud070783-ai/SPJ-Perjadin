import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Check, Share2, PlusSquare } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'pill' | 'banner' | 'card' | 'compact';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'pill', className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  // If running in standalone app mode, hide install trigger
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Browser doesn't support automatic prompt yet (or already prompted)
      setShowDemoModal(true);
    }
  };

  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:opacity-90 transition active:scale-95 ${className}`}
        >
          <Download className="h-3.5 w-3.5" />
          <span>Instal App</span>
        </button>

        {showIOSGuide && <IOSGuideModal onClose={() => setShowIOSGuide(false)} />}
        {showDemoModal && <FallbackGuideModal onClose={() => setShowDemoModal(false)} />}
      </>
    );
  }

  if (variant === 'banner') {
    return (
      <>
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-purple-950 p-4 border border-purple-500/30 shadow-xl ${className}`}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 text-white shadow-lg">
              <Smartphone className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="rounded-md bg-purple-500/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-purple-300 border border-purple-400/30">
                  PWA Mobile
                </span>
                <span className="text-xs text-slate-300">Resmi SiDinas</span>
              </div>
              <h4 className="text-sm font-bold text-white truncate mt-0.5">Instal Aplikasi SiDinas</h4>
              <p className="text-xs text-slate-300 line-clamp-1">Akses instan dari Layar Utama, offline, dan tanpa iklan.</p>
            </div>
            <button
              onClick={handleInstallClick}
              className="shrink-0 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition"
            >
              <Download className="h-4 w-4" />
              <span>Pasang</span>
            </button>
          </div>
        </div>

        {showIOSGuide && <IOSGuideModal onClose={() => setShowIOSGuide(false)} />}
        {showDemoModal && <FallbackGuideModal onClose={() => setShowDemoModal(false)} />}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-purple-900/40 hover:brightness-110 active:scale-95 transition ${className}`}
      >
        <Download className="h-4 w-4" />
        <span>Instal PWA SiDinas</span>
      </button>

      {showIOSGuide && <IOSGuideModal onClose={() => setShowIOSGuide(false)} />}
      {showDemoModal && <FallbackGuideModal onClose={() => setShowDemoModal(false)} />}
    </>
  );
};

const IOSGuideModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
    <div className="w-full max-w-sm rounded-2xl bg-slate-900 p-6 border border-slate-700 shadow-2xl text-slate-100">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-purple-400" />
          <h3 className="font-bold text-base text-white">Instal di iPhone / iPad</h3>
        </div>
        <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 space-y-3 text-xs text-slate-300">
        <div className="flex items-start gap-3 rounded-xl bg-slate-800/60 p-3 border border-slate-700/50">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-xs">
            1
          </div>
          <div>
            <p className="font-semibold text-white">Tekan Tombol Berbagi (Share)</p>
            <p className="text-slate-400 mt-0.5">Ketuk ikon <Share2 className="inline h-3.5 w-3.5 text-cyan-400" /> di bilah navigasi Safari bagian bawah.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-slate-800/60 p-3 border border-slate-700/50">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-xs">
            2
          </div>
          <div>
            <p className="font-semibold text-white">Pilih "Tambah ke Utama"</p>
            <p className="text-slate-400 mt-0.5">Gulir ke bawah lalu pilih opsi <PlusSquare className="inline h-3.5 w-3.5 text-cyan-400" /> <strong>Tambah ke Layar Utama</strong>.</p>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="mt-5 w-full rounded-xl bg-purple-600 py-2.5 text-xs font-bold text-white hover:bg-purple-500 transition"
      >
        Mengerti
      </button>
    </div>
  </div>
);

const FallbackGuideModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
    <div className="w-full max-w-sm rounded-2xl bg-slate-900 p-6 border border-slate-700 shadow-2xl text-slate-100">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-purple-400" />
          <h3 className="font-bold text-base text-white">Cara Instal SiDinas PWA</h3>
        </div>
        <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 space-y-3 text-xs text-slate-300">
        <p className="text-slate-300">
          Aplikasi SiDinas siap diinstal langsung ke perangkat Android / Desktop / iOS Anda:
        </p>
        <ul className="space-y-2 pl-2">
          <li className="flex items-center gap-2 text-slate-200">
            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            <span><strong>Chrome/Edge:</strong> Klik ikon titik tiga di pojok atas &gt; Pilih <i>"Simpan &amp; Bagikan"</i> &gt; <i>"Instal SiDinas"</i>.</span>
          </li>
          <li className="flex items-center gap-2 text-slate-200">
            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            <span><strong>Safari Mobile:</strong> Ketuk tombol Share &gt; <i>"Tambah ke Layar Utama"</i>.</span>
          </li>
        </ul>
      </div>

      <button
        onClick={onClose}
        className="mt-5 w-full rounded-xl bg-purple-600 py-2.5 text-xs font-bold text-white hover:bg-purple-500 transition"
      >
        Tutup
      </button>
    </div>
  </div>
);
