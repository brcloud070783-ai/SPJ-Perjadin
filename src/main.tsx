import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker with auto-update
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Versi baru aplikasi SiDinas PWA tersedia. Perbarui sekarang?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('SiDinas PWA siap digunakan dalam mode luring (offline).');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
