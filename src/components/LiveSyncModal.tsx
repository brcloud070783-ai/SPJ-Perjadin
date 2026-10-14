import React, { useState, useEffect } from 'react';
import { 
  X, 
  Zap, 
  Wifi, 
  CheckCircle2, 
  Smartphone, 
  Laptop, 
  RefreshCw, 
  CloudUpload, 
  CloudDownload, 
  Copy, 
  Check, 
  Loader2, 
  Radio, 
  ShieldCheck,
  Share2,
  FolderSync
} from 'lucide-react';
import { ProjectSPJ } from '../types';
import { syncProjectToFirestore, subscribeToProjectLiveSync, fetchProjectFromFirestore } from '../utils/firestoreSync';

interface LiveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProject: ProjectSPJ;
  onUpdateActiveProjectFromLive: (updatedProject: ProjectSPJ) => void;
}

export const LiveSyncModal: React.FC<LiveSyncModalProps> = ({
  isOpen,
  onClose,
  activeProject,
  onUpdateActiveProjectFromLive
}) => {
  const [roomCode, setRoomCode] = useState<string>(() => {
    return localStorage.getItem('sidinas_live_room_code') || activeProject.id;
  });
  const [inputCode, setInputCode] = useState<string>('');
  const [isLiveActive, setIsLiveActive] = useState<boolean>(() => {
    return localStorage.getItem('sidinas_is_live_active') === 'true';
  });
  const [isSyncingNow, setIsSyncingNow] = useState(false);
  const [statusText, setStatusText] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Subscribe to Firestore live updates if isLiveActive is true
  useEffect(() => {
    if (!isLiveActive || !roomCode) return;

    const unsubscribe = subscribeToProjectLiveSync(
      roomCode,
      (updated) => {
        if (updated && updated.updatedTime !== activeProject.updatedTime) {
          onUpdateActiveProjectFromLive(updated);
          setStatusText(`✓ Data terupdate dari Cloud (${new Date().toLocaleTimeString('id-ID')})`);
        }
      },
      (err) => {
        setStatusText('Status: Offline / Gagal terhubung');
      }
    );

    return () => unsubscribe();
  }, [isLiveActive, roomCode, activeProject.updatedTime]);

  if (!isOpen) return null;

  const handleToggleLiveSync = async () => {
    if (!isLiveActive) {
      setIsSyncingNow(true);
      try {
        await syncProjectToFirestore(activeProject, roomCode);
        setIsLiveActive(true);
        localStorage.setItem('sidinas_is_live_active', 'true');
        localStorage.setItem('sidinas_live_room_code', roomCode);
        setStatusText('✓ Live Realtime Sync Aktif! Perubahan PC & HP akan otomatis tersinkron.');
      } catch (err: any) {
        alert('Gagal mengaktifkan Live Sync: ' + err.message);
      } finally {
        setIsSyncingNow(false);
      }
    } else {
      setIsLiveActive(false);
      localStorage.setItem('sidinas_is_live_active', 'false');
      setStatusText('Live Sync dinonaktifkan.');
    }
  };

  const handlePushCurrentToCloud = async () => {
    setIsSyncingNow(true);
    try {
      await syncProjectToFirestore(activeProject, roomCode);
      setStatusText('✓ Berhasil mengirim data terbaru PC ke HP!');
    } catch (err: any) {
      alert('Gagal mengirim data: ' + err.message);
    } finally {
      setIsSyncingNow(false);
    }
  };

  const handleConnectByCode = async () => {
    if (!inputCode.trim()) return;
    const targetCode = inputCode.trim();
    setIsSyncingNow(true);
    try {
      const remoteData = await fetchProjectFromFirestore(targetCode);
      if (remoteData) {
        onUpdateActiveProjectFromLive(remoteData);
        setRoomCode(targetCode);
        setIsLiveActive(true);
        localStorage.setItem('sidinas_is_live_active', 'true');
        localStorage.setItem('sidinas_live_room_code', targetCode);
        setStatusText(`✓ Berhasil terhubung ke Kode SPJ: ${targetCode}`);
        setInputCode('');
      } else {
        alert(`Kode SPJ "${targetCode}" tidak ditemukan di Cloud.`);
      }
    } catch (err: any) {
      alert('Gagal terhubung: ' + err.message);
    } finally {
      setIsSyncingNow(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full my-auto shadow-2xl border border-purple-100 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#180A30] via-[#2D0D5B] to-[#7D2AE8] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-purple-200 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-cyan-300 text-xs font-black uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
            <span>Update Langsung PC & HP (Live Sync)</span>
          </div>

          <h2 className="text-xl font-black text-white leading-tight">
            Sinkronisasi Otomatis Realtime Cloud
          </h2>
          <p className="text-xs text-purple-200 mt-1">
            Setiap kali ada perubahan di Laptop (Kuitansi, Nota, Foto GPS), aplikasi di HP akan <strong>ter-update langsung secara otomatis</strong>!
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-slate-700">
          {/* Active Live Status Box */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isLiveActive
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isLiveActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                <span className="font-extrabold text-xs">
                  {isLiveActive ? 'Status: SINKRONISASI LIVE AKTIF' : 'Status: Belum Diaktifkan'}
                </span>
              </div>

              <button
                onClick={handleToggleLiveSync}
                disabled={isSyncingNow}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all shadow-md cursor-pointer disabled:opacity-50 ${
                  isLiveActive
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-gradient-to-r from-[#00C4CC] to-[#0096C7] hover:brightness-110 text-slate-950'
                }`}
              >
                {isSyncingNow ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isLiveActive ? (
                  'Matikan Live'
                ) : (
                  'Aktifkan Live Sync'
                )}
              </button>
            </div>

            {statusText && (
              <p className="text-[11px] font-bold mt-2 text-emerald-800">
                {statusText}
              </p>
            )}
          </div>

          {/* Device Sync Diagram */}
          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
            <div className="flex items-center justify-around text-center py-2">
              <div className="flex flex-col items-center">
                <Laptop className="w-7 h-7 text-[#7D2AE8] mb-1" />
                <span className="font-extrabold text-[11px]">Laptop / PC</span>
                <span className="text-[9px] text-slate-500">Edit Kuitansi / Foto</span>
              </div>

              <div className="flex flex-col items-center text-cyan-600">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="text-[9px] font-bold text-purple-700 mt-1">Sync Instant</span>
              </div>

              <div className="flex flex-col items-center">
                <Smartphone className="w-7 h-7 text-[#7D2AE8] mb-1" />
                <span className="font-extrabold text-[11px]">HP Kamu</span>
                <span className="text-[9px] text-slate-500">Auto Update!</span>
              </div>
            </div>
          </div>

          {/* Share Code / Connection Section */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-purple-950">
              Kode Akses Hubungkan HP & PC:
            </h4>

            {/* Current Room Code */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Kode SPJ Aktif Ini:</span>
              <div className="flex items-center gap-2">
                <code className="bg-white px-3 py-1.5 rounded-lg border border-purple-200 font-mono font-black text-slate-900 text-sm flex-1 truncate">
                  {roomCode}
                </code>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 bg-[#7D2AE8] text-white font-extrabold text-xs rounded-lg inline-flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Tercopy' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Manual Sync Trigger */}
            <button
              onClick={handlePushCurrentToCloud}
              disabled={isSyncingNow}
              className="w-full py-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-[#7D2AE8] border border-purple-300 font-extrabold text-xs inline-flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <CloudUpload className="w-4 h-4" />
              <span>Kirim Data Terbaru PC ke HP Sekarang</span>
            </button>

            {/* Connect to existing Code */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <span className="font-extrabold text-slate-900 text-xs block">
                Buka SPJ dari Laptop Lain via Kode:
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Masukkan Kode SPJ..."
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs font-bold text-slate-900 flex-1 focus:outline-none focus:ring-2 focus:ring-[#7D2AE8]"
                />
                <button
                  onClick={handleConnectByCode}
                  disabled={isSyncingNow || !inputCode.trim()}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
                >
                  Hubungkan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#7D2AE8] hover:bg-purple-800 text-white font-extrabold text-xs shadow-md cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
