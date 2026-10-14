import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md animate-bounce">
      <div className="flex items-center gap-3 rounded-xl bg-amber-600 px-4 py-3 text-xs font-semibold text-white shadow-2xl backdrop-blur-md border border-amber-400/30">
        <WifiOff className="h-4 w-4 shrink-0 animate-pulse text-amber-200" />
        <div className="flex-1">
          <p className="font-bold">Mode Luring (Offline Active)</p>
          <p className="text-[11px] text-amber-100 font-normal">Aplikasi berjalan tanpa koneksi internet. Data draf tersimpan secara lokal.</p>
        </div>
      </div>
    </div>
  );
};
