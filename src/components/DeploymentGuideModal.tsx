import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  Rocket, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Server, 
  UploadCloud, 
  Sparkles, 
  Terminal,
  ShieldCheck,
  Zap,
  HelpCircle,
  FolderArchive
} from 'lucide-react';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activePlatform, setActivePlatform] = useState<'vercel' | 'netlify' | 'github' | 'cloudflare'>('vercel');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-auto shadow-2xl border border-blue-100 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A1128] via-[#00008F] to-[#0000B3] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-blue-200 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-cyan-300 text-xs font-black uppercase tracking-wider mb-1">
            <Rocket className="w-4 h-4" />
            <span>Hosting Publik Gratis & Bebas 403</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
            Cara Deploy SiDinas ke Hosting Publik Gratis
          </h2>
          <p className="text-xs text-blue-200 mt-1">
            Publikasikan aplikasi ini agar 100% bisa dibuka oleh siapapun di HP/Laptop tanpa login Google.
          </p>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-3 gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActivePlatform('vercel')}
            className={`px-4 py-2.5 rounded-t-xl font-black text-xs transition-all flex items-center gap-2 border-b-2 cursor-pointer whitespace-nowrap ${
              activePlatform === 'vercel'
                ? 'border-[#0000B3] bg-white text-[#0000B3] shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            1. Vercel (Rekomendasi Utama)
          </button>

          <button
            onClick={() => setActivePlatform('netlify')}
            className={`px-4 py-2.5 rounded-t-xl font-black text-xs transition-all flex items-center gap-2 border-b-2 cursor-pointer whitespace-nowrap ${
              activePlatform === 'netlify'
                ? 'border-[#0000B3] bg-white text-[#0000B3] shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-cyan-500" />
            2. Netlify (Drag & Drop)
          </button>

          <button
            onClick={() => setActivePlatform('github')}
            className={`px-4 py-2.5 rounded-t-xl font-black text-xs transition-all flex items-center gap-2 border-b-2 cursor-pointer whitespace-nowrap ${
              activePlatform === 'github'
                ? 'border-[#0000B3] bg-white text-[#0000B3] shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#0000B3]" />
            3. GitHub Pages / Render
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto text-xs text-slate-700">
          {/* Key Advantage Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-xs text-emerald-900">Keuntungan Deploy ke Hosting Publik:</h4>
              <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                URL Publik (seperti <code className="bg-emerald-100 font-mono text-emerald-950 px-1 py-0.5 rounded">https-[#00C4CC].vercel.app</code>) <strong>100% BEBAS DIBUKA DI HP SIAPAPUN</strong> tanpa perlu akun Google <code className="bg-emerald-100 font-mono text-emerald-950 px-1 py-0.5 rounded">brcloud070783@gmail.com</code> dan <strong>bebas Error 403</strong> selamanya!
              </p>
            </div>
          </div>

          {/* Vercel Guide */}
          {activePlatform === 'vercel' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-2xl border border-blue-100">
                <div>
                  <span className="font-black text-blue-950 text-xs">Vercel.com (Gratis 100%)</span>
                  <p className="text-[11px] text-purple-800">Deployment otomatis hanya butuh 1-2 menit via GitHub atau Vercel CLI.</p>
                </div>
                <a
                  href="https://vercel.com/new"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#0000B3] hover:bg-[#000090] text-white font-extrabold text-xs inline-flex items-center gap-1 cursor-pointer shrink-0"
                >
                  Buka Vercel <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider text-blue-950">
                  Langkah-Langkah Deploy Vercel:
                </h4>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-extrabold text-slate-900 flex items-center justify-between">
                    <span>Langkah 1: Download / Push Kode ke GitHub</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Upload repositori project ini ke akun GitHub Anda (atau buat repositori baru bernama <code className="font-mono bg-slate-200 px-1 rounded">sidinas-pwa</code>).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-extrabold text-slate-900 flex items-center justify-between">
                    <span>Langkah 2: Hubungkan di Vercel</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Masuk ke <strong>vercel.com</strong> &gt; Klik <strong>"Add New Project"</strong> &gt; Pilih repositori GitHub Anda.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-extrabold text-slate-900 flex items-center justify-between">
                    <span>Langkah 3: Konfigurasi Build (Otomatis)</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Vercel secara otomatis mendeteksi Vite. Pengaturan standar:
                  </p>
                  <ul className="list-disc list-inside text-[11px] font-mono bg-slate-900 text-slate-200 p-2.5 rounded-lg space-y-1">
                    <li>Build Command: npm run build</li>
                    <li>Output Directory: dist</li>
                  </ul>
                  <p className="text-[10px] text-emerald-600 font-bold">
                    ✓ File vercel.json telah disiapkan di folder root agar tidak error refresh 404.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-extrabold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Selesai! Anda akan mendapatkan URL HTTPS Publik aktif yang bisa dikirim ke HP manapun!</span>
                </div>
              </div>
            </div>
          )}

          {/* Netlify Guide */}
          {activePlatform === 'netlify' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between bg-cyan-50 p-3 rounded-2xl border border-cyan-100">
                <div>
                  <span className="font-black text-cyan-950 text-xs">Netlify.com (Drag & Drop / GitHub)</span>
                  <p className="text-[11px] text-cyan-800">Cara paling praktis tanpa perlu setting DNS atau server.</p>
                </div>
                <a
                  href="https://app.netlify.com/drop"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs inline-flex items-center gap-1 cursor-pointer shrink-0"
                >
                  Netlify Drop <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider text-blue-950">
                  2 Cara Deploy Netlify:
                </h4>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h5 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[10px]">A</span>
                    Cara Paling Cepat: Drag & Drop Folder <code className="bg-slate-200 font-mono px-1 rounded">dist</code>
                  </h5>
                  <ol className="list-decimal list-inside text-[11px] text-slate-700 space-y-1 font-medium">
                    <li>Jalankan perintah build di laptop: <code className="bg-slate-200 font-mono px-1 rounded">npm run build</code></li>
                    <li>Buka <strong className="text-cyan-700">app.netlify.com/drop</strong></li>
                    <li>Tarik (drag) folder hasil build (<code className="bg-slate-200 font-mono px-1 rounded">dist</code>) ke halaman web Netlify Drop.</li>
                    <li>Dalam 5 detik, situs Anda langsung LIVE dengan URL publik!</li>
                  </ol>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h5 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">B</span>
                    Cara Otomatis via GitHub
                  </h5>
                  <p className="text-[11px] text-slate-600">
                    Hubungkan akun GitHub Anda di Netlify, pilih repo, dan file <code className="bg-slate-200 font-mono px-1 rounded">netlify.toml</code> yang sudah tersedia di project ini akan otomatis mengonfigurasi segalanya.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* GitHub Pages / Cloudflare Guide */}
          {(activePlatform === 'github' || activePlatform === 'cloudflare') && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
                <h4 className="font-black text-blue-950 text-xs flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#0000B3]" />
                  Alternative Hosting Publik Gratis Lainnya:
                </h4>
                <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-2 font-medium">
                  <li>
                    <strong>Cloudflare Pages:</strong> Kunjungi <code className="bg-blue-100 font-mono text-blue-950 px-1 rounded">pages.cloudflare.com</code> &gt; Hubungkan GitHub &gt; Build Command: <code className="bg-blue-100 font-mono text-blue-950 px-1 rounded">npm run build</code> &gt; Output: <code className="bg-blue-100 font-mono text-blue-950 px-1 rounded">dist</code>.
                  </li>
                  <li>
                    <strong>GitHub Pages:</strong> Tambahkan gh-pages atau gunakan GitHub Actions untuk meng-compile folder <code className="bg-blue-100 font-mono text-blue-950 px-1 rounded">dist</code> secara gratis di server GitHub.
                  </li>
                  <li>
                    <strong>Render.com:</strong> Kunjungi <code className="bg-blue-100 font-mono text-blue-950 px-1 rounded">render.com</code> &gt; Buat "Static Site" &gt; Hubungkan repo GitHub.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Command helper snippet */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-cyan-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-cyan-400" />
                Perintah Build untuk Hosting Sendiri:
              </span>
              <button
                onClick={() => handleCopy('npm run build', 'cmd')}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2 py-0.5 rounded font-bold transition-colors cursor-pointer"
              >
                {copiedText === 'cmd' ? 'Tercopy!' : 'Copy'}
              </button>
            </div>
            <pre className="font-mono text-[11px] bg-slate-950 p-2.5 rounded-lg text-emerald-400 overflow-x-auto">
              npm run build
            </pre>
            <p className="text-[10px] text-slate-400">
              Perintah ini akan menghasilkan folder <code className="text-amber-300 font-mono">dist/</code> berisi file HTML, JS, dan CSS statis yang siap diunggah ke hosting manapun.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[10px] text-slate-500 font-medium">
            ✓ Konfigurasi <code className="font-mono text-[#0000B3] font-bold">vercel.json</code> & <code className="font-mono text-[#0000B3] font-bold">netlify.toml</code> sudah siap di project.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0000B3] hover:bg-[#000090] text-white font-extrabold text-xs shadow-md cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
