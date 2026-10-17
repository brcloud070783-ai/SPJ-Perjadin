import React from 'react';
import { 
  X, 
  Smartphone, 
  Globe, 
  ShieldAlert, 
  CheckCircle2, 
  Key, 
  ExternalLink,
  Laptop,
  HelpCircle,
  Zap,
  Lock,
  UserCheck,
  Server,
  Rocket
} from 'lucide-react';

interface DeviceAccessGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDeployGuide?: () => void;
}

export const DeviceAccessGuideModal: React.FC<DeviceAccessGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenDeployGuide
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full my-auto shadow-2xl border border-blue-100 overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0A1128] via-[#00008F] to-[#0000B3] text-white p-5 space-y-2 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-blue-200 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Penyebab Error 403 / Page Not Found di HP</span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
            Mengapa Link Pratinjau Tidak Bisa Dibuka di HP?
          </h2>
          <p className="text-xs text-blue-200 font-normal">
            Penjelasan jujur & langkah pasti agar aplikasi SiDinas bisa terbuka di HP Anda.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-700 font-medium">
          {/* Real Reason box */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 text-rose-950">
            <div className="flex items-center gap-2 font-black text-xs text-rose-800">
              <Lock className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Proteksi Google Cloud Run (IAP Security Lock)</span>
            </div>
            <p className="text-[11.5px] leading-relaxed text-rose-900">
              Tautan berakhiran <code className="bg-rose-100 px-1 py-0.5 rounded font-mono text-rose-950">.asia-southeast1.run.app</code> adalah <strong>Tautan Pratinjau Sementara Pengembang (AI Studio)</strong>.
            </p>
            <p className="text-[11.5px] leading-relaxed text-rose-900">
              Sistem keamanan Google Cloud secara otomatis mengunci link ini dan <strong>MENOLAK (Error 403 / Page Not Found)</strong> siapapun atau HP manapun yang Chrome-nya tidak sedang login menggunakan akun email pengembang utama: <strong className="underline decoration-rose-400">brcloud070783@gmail.com</strong>.
            </p>
          </div>

          {/* Correct steps */}
          <div className="space-y-3 pt-1">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#0000B3]" />
              Langkah Buka Tautan Pratinjau Saat Ini di HP:
            </h3>

            {/* Cara 1 */}
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-950 text-xs flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#0000B3] text-white flex items-center justify-center text-[10px] font-black">1</span>
                  Login Akun Google di Chrome HP
                </span>
                <span className="text-[10px] font-bold text-purple-800 bg-blue-100 px-2 py-0.5 rounded-full">Solusi Link Pratinjau</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Untuk membuka tautan pratinjau <code className="bg-blue-100 px-1 rounded text-blue-950 font-mono">ais-pre-*.run.app</code> di HP Anda secara langsung:
              </p>
              <ol className="list-decimal list-inside text-[11px] text-slate-800 space-y-1.5 pl-1 font-semibold">
                <li>Buka aplikasi <strong>Google Chrome</strong> di HP.</li>
                <li>Klik foto/inisial profil Chrome di pojok kanan atas HP.</li>
                <li>Ganti profil / Login dengan akun: <code className="bg-blue-200/80 px-1.5 py-0.5 rounded text-blue-950 font-mono">brcloud070783@gmail.com</code></li>
                <li>Buka kembali tautan pratinjau. Halaman dijamin terbuka 100%!</li>
              </ol>
            </div>

            {/* Cara 2 */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-950 text-xs flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">2</span>
                  Hosting Publik (Bebas Dipakai Siapapun Tanpa Akun Pengembang)
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">Permanen & Bebas 403</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Agar pegawai / ASN lain di dinas bisa membuka aplikasi SiDinas dari HP mereka masing-masing tanpa akun pengembang:
              </p>
              <ul className="list-disc list-inside text-[11px] text-slate-800 space-y-1 pl-1">
                <li>Aplikasi dapat di-deploy/diunggah ke <strong>Vercel, Netlify, Firebase Hosting, atau Server Web Dinas</strong>.</li>
                <li>Setelah di-deploy ke hosting publik (seperti <code className="bg-emerald-100 px-1 rounded text-emerald-900 font-mono">https://sidinas.web.app</code> atau <code className="bg-emerald-100 px-1 rounded text-emerald-900 font-mono">https://sidinas.dinas.go.id</code>), tautan tersebut <strong>100% BEBAS DIBUKA OLEH SIAPAPUN</strong> dari HP manapun tanpa perlu login akun <code className="bg-emerald-100 px-1 rounded text-emerald-900 font-mono">brcloud070783@gmail.com</code>.</li>
              </ul>
            </div>

            {/* Cara 3 */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-950 text-xs flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-black">3</span>
                  Gunakan Laptop / PC Pengembang
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">Paling Stabil</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Aplikasi SiDinas dirancang optimal untuk pembuatan SPJ, cetak Kuitansi A4, dan rekap kwitansi di Komputer/Laptop. Untuk pengerjaan dokumen dinas, pengerjaan di Laptop sangat disarankan.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          {onOpenDeployGuide && (
            <button
              onClick={() => {
                onClose();
                onOpenDeployGuide();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-extrabold text-xs shadow-md cursor-pointer inline-flex items-center gap-1.5"
            >
              <Rocket className="w-4 h-4 text-amber-300" />
              <span>Panduan Deploy Vercel/Netlify</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0000B3] hover:bg-[#000090] text-white font-extrabold text-xs shadow-md cursor-pointer shrink-0"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
