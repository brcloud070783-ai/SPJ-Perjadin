import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  ShieldCheck, 
  User as UserIcon, 
  LogOut, 
  CheckCircle2, 
  HardDrive, 
  Laptop,
  Lock,
  ChevronRight,
  Zap,
  Sparkles,
  AlertTriangle,
  Info
} from 'lucide-react';
import { User } from 'firebase/auth';
import { googleSignIn, logoutUser } from '../utils/auth';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLoginSuccess: (user: User, token: string) => void;
  onOpenUnauthorizedDomainHelp?: () => void;
}

export const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({
  isOpen,
  onClose,
  user,
  onLoginSuccess,
  onOpenUnauthorizedDomainHelp
}) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    setErrorMsg(null);
    try {
      const res = await googleSignIn();
      if (res) {
        onLoginSuccess(res.user, res.accessToken);
        onClose();
      }
    } catch (err: any) {
      if (err.message === 'UNAUTHORIZED_DOMAIN' || err.message?.includes('unauthorized-domain')) {
        setErrorMsg('Domain Vercel ini menggunakan Project Managed Firebase. Gunakan Mode Lokal agar 100% fitur bisa langsung dipakai!');
        if (onOpenUnauthorizedDomainHelp) {
          onOpenUnauthorizedDomainHelp();
        }
      } else if (err.message === 'POPUP_BLOCKED') {
        setErrorMsg('Pop-up browser diblokir di HP/Browser. Silakan izinkan pop-up Chrome/Safari atau klik "Gunakan Mode Lokal".');
      } else if (err.message === 'POPUP_CLOSED') {
        setErrorMsg('Jendela login ditutup sebelum proses selesai.');
      } else {
        setErrorMsg(err.message || 'Gagal masuk dengan Google. Anda tetap bisa menggunakan Mode Lokal.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setErrorMsg(null);
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#180A30] via-[#2A1252] to-[#7D2AE8] p-5 sm:p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-purple-200 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00C4CC] to-[#7D2AE8] flex items-center justify-center shadow-lg mb-3">
            <LogIn className="w-6 h-6 text-white" />
          </div>

          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>Akun Google & Akses Aplikasi</span>
            <span className="text-[10px] font-bold bg-[#00C4CC] text-slate-950 px-2 py-0.5 rounded-full uppercase">
              SiDinas
            </span>
          </h2>
          <p className="text-xs text-purple-200/90 mt-1">
            Login opsional untuk sinkronisasi Google Drive. Aplikasi tetap bisa dipakai 100% tanpa login!
          </p>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-4 sm:space-y-5">
          {user ? (
            /* Already Logged In State */
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 text-center space-y-3">
              <div className="flex justify-center">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User Avatar'} 
                    className="w-16 h-16 rounded-full border-2 border-emerald-500 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center justify-center gap-1.5">
                  <span>{user.displayName || 'Pengguna Google'}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{user.email}</p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00C4CC] to-[#0096C7] hover:brightness-110 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
                >
                  Lanjutkan ke Aplikasi
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-bold text-xs inline-flex items-center gap-1 transition-all cursor-pointer"
                  title="Keluar dari akun Google"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          ) : (
            /* Not Logged In State */
            <div className="space-y-4">
              {/* Highlight Banner: App is fully functional without login */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-xs flex items-start gap-3 shadow-xs">
                <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-extrabold text-emerald-950 dark:text-emerald-100">
                    Bisa Langsung Pakai Tanpa Login!
                  </p>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    Semua data SPJ, Kuitansi, & Cetak A4 tersimpan langsung di memori HP/PC Anda (Mode Lokal 100% Offline & Anti-Gagal).
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
                  <div className="p-2 rounded-xl bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 shrink-0">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Akses Tanpa Akun</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Tidak perlu verifikasi email atau login berbelit-belit. Langsung buat & cetak Kuitansi.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/40">
                  <div className="p-2 rounded-xl bg-cyan-200 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 shrink-0">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Google Drive Backup (Opsional)</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Fitur cadangkan ke Google Drive dapat dihubungkan jika Anda ingin sync cloud.
                    </p>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p>{errorMsg}</p>
                    {onOpenUnauthorizedDomainHelp && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenUnauthorizedDomainHelp();
                        }}
                        className="text-[11px] underline font-extrabold text-purple-700 dark:text-purple-300 hover:text-purple-900 inline-flex items-center gap-1 cursor-pointer"
                      >
                        Panduan Solusi Domain / Modul HP
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Main Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* 1. Primary Recommendation: Mode Lokal Instant */}
                <button
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:brightness-110 active:scale-[0.98] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Lanjutkan Tanpa Login (Mode Lokal - 100% Lancar)</span>
                </button>

                {/* 2. Optional Google Sign In */}
                <button
                  onClick={handleSignIn}
                  disabled={isLoggingIn}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98] text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-2.5 border border-slate-200 dark:border-slate-700 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isLoggingIn ? (
                    <>
                      <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                      <span>Menghubungkan Akun Google...</span>
                    </>
                  ) : (
                    <>
                      {/* Google G Logo SVG */}
                      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0 p-0.5 shadow-xs">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                      </div>
                      <span>Coba Masuk dengan Akun Google</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Mode Lokal: 100% Aman di HP Anda
          </span>
          <span className="font-bold text-purple-600 dark:text-purple-400">
            SiDinas v2.0
          </span>
        </div>
      </div>
    </div>
  );
};
