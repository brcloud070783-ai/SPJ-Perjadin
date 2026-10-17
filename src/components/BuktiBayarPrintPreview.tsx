import React, { useState, useRef, useEffect } from 'react';
import { KuitansiData, BuktiBayar } from '../types';
import { formatRupiah, formatTanggalIndo } from '../utils/terbilang';
import { exportElementToPdf } from '../utils/pdfExport';
import { 
  Printer, 
  ArrowLeft, 
  Download, 
  Receipt, 
  Calendar, 
  Tag, 
  Loader2, 
  FileText, 
  CheckCircle2,
  Minus,
  Plus
} from 'lucide-react';

interface BuktiBayarPrintPreviewProps {
  kuitansi: KuitansiData;
  list: BuktiBayar[];
  onBack: () => void;
}

export const BuktiBayarPrintPreview: React.FC<BuktiBayarPrintPreviewProps> = ({
  kuitansi,
  list,
  onBack
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [documentFilter, setDocumentFilter] = useState<'normal' | 'bw'>('bw');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const a4WidthPx = 794;
  const availableWidth = Math.max(300, (containerWidth || (typeof window !== 'undefined' ? window.innerWidth : 800)) - 24);
  const fitScale = Math.min(1, Math.round((availableWidth / a4WidthPx) * 100) / 100);
  const defaultFitPercent = Math.max(35, Math.round(fitScale * 100));

  const [zoomPercent, setZoomPercent] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 794) {
      return Math.max(35, Math.round((Math.max(300, window.innerWidth - 24) / 794) * 100));
    }
    return 100;
  });

  const initialTouchDistanceRef = useRef<number | null>(null);
  const initialScaleRef = useRef<number>(100);
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    const updateWidth = () => {
      if (scrollContainerRef.current) {
        setContainerWidth(scrollContainerRef.current.clientWidth);
      } else if (typeof window !== 'undefined') {
        setContainerWidth(window.innerWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Multi-touch Pinch to Zoom Handler
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
      initialTouchDistanceRef.current = dist;
      initialScaleRef.current = zoomPercent;
    } else if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        if (zoomPercent < 90) {
          setZoomPercent(100);
        } else {
          setZoomPercent(defaultFitPercent);
        }
      }
      lastTapRef.current = now;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialTouchDistanceRef.current) {
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
      const factor = dist / initialTouchDistanceRef.current;
      const targetPercent = Math.min(250, Math.max(35, Math.round(initialScaleRef.current * factor)));
      setZoomPercent(targetPercent);
    }
  };

  const handleTouchEnd = () => {
    initialTouchDistanceRef.current = null;
  };

  // Mouse drag-to-scroll implementation for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleZoomIn = () => setZoomPercent((prev) => Math.min(250, prev + 15));
  const handleZoomOut = () => setZoomPercent((prev) => Math.max(35, prev - 15));
  const handleFitScreen = () => setZoomPercent(defaultFitPercent);
  const handleZoom100 = () => setZoomPercent(100);

  const totalNominal = list.reduce((sum, item) => sum + item.nominal, 0);

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const safeName = (kuitansi.namaPelaksana || 'Bukti_Bayar')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .slice(0, 30);
      const fileName = `Bukti_Pembayaran_A4_${safeName}.pdf`;
      await exportElementToPdf('bukti-bayar-a4-sheet', fileName);
    } catch (err) {
      console.error('Gagal mengekspor PDF bukti pembayaran:', err);
      alert('Terjadi kendala saat membuat PDF. Anda juga dapat menggunakan tombol "Cetak A4" lalu pilih Simpan sebagai PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentScale = zoomPercent / 100;

  return (
    <div className="space-y-4 pb-24">
      {/* Action Toolbar Header (Hidden in Print) */}
      <div className="print:hidden bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2.5 sticky top-14 z-30">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 active:scale-95 px-3 py-2 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Upload Bukti</span>
        </button>

        {/* CamScanner Thermal Enhancer Filter Toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/60 text-[11px] font-semibold text-slate-700">
          <span className="px-2 text-slate-500 text-[10px] hidden md:inline">Filter Cetak:</span>
          <button
            onClick={() => setDocumentFilter('normal')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              documentFilter === 'normal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Warna Asli
          </button>
          <button
            onClick={() => setDocumentFilter('bw')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              documentFilter === 'bw' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Sangat tajam untuk struk thermal dan kertas kuning agar teks terbaca jelas saat dicetak"
          >
            <span>Hitam Putih Tajam</span>
          </button>
        </div>

        {/* View Zoom Switcher with Pinch & Controls */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/60 text-[11px] font-semibold text-slate-700">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-blue-600 transition-all cursor-pointer"
            title="Perkecil Zoom"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          
          <span className="px-2 font-mono text-xs font-bold text-slate-800 min-w-[42px] text-center">
            {zoomPercent}%
          </span>

          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-blue-600 transition-all cursor-pointer"
            title="Perbesar Zoom"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-slate-300 mx-1" />

          <button
            onClick={handleFitScreen}
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
              zoomPercent === defaultFitPercent ? 'bg-white text-blue-600 shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Pas Layar
          </button>

          <button
            onClick={handleZoom100}
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
              zoomPercent === 100 ? 'bg-white text-blue-600 shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            100%
          </button>
        </div>

        {/* Actions: Download PDF & Print */}
        <div className="flex items-center gap-2">
          {/* Unduh PDF Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 px-3.5 py-2 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            title="Unduh berkas PDF siap cetak ukuran A4"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Membuat PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PDF (A4)</span>
              </>
            )}
          </button>

          {/* Cetak A4 Button */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
            title="Buka dialog cetak browser"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Cetak A4</span>
          </button>
        </div>
      </div>

      {/* Info Badge */}
      <div className="print:hidden bg-violet-50 border border-violet-200 text-violet-900 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 text-violet-600 shrink-0" />
          <span>
            Format Cetak Resmi <strong>Daftar Bukti Pembayaran Riil A4</strong> ({list.length} Lembar Bukti Terlampir)
          </span>
        </div>
        <span className="text-[11px] font-semibold text-violet-700 hidden sm:inline">
          Total: {formatRupiah(totalNominal)}
        </span>
      </div>

      {/* Touch Pinch & Pan Floating Helper Badge */}
      <div className="print:hidden flex items-center justify-between px-3.5 py-1.5 bg-blue-50/80 border border-blue-200/60 rounded-xl text-[11px] text-blue-900">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">👌</span>
          <span><strong>Tips Layar Sentuh:</strong> Gunakan 2 jari (cubit / renggangkan) untuk Zoom In & Out • Ketuk 2x untuk reset</span>
        </div>
        <div className="font-mono font-bold text-[#0000B3] bg-white px-2 py-0.5 rounded-md border border-blue-200 shrink-0 ml-2">
          {zoomPercent}%
        </div>
      </div>

      {/* DOCUMENT PREVIEW CONTAINER */}
      <div 
        ref={scrollContainerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        className={`w-full overflow-x-auto pb-6 touch-pan-x overscroll-x-contain ${
          isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
        }`}
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
          touchAction: 'pan-x pan-y'
        }}
      >
        <div className="w-max min-w-full flex justify-center py-1 px-1 sm:px-2">
          <div
            style={{
              width: `${Math.round(a4WidthPx * currentScale)}px`,
              height: `${Math.round(1122 * currentScale)}px`,
              position: 'relative',
              overflow: 'hidden'
            }}
            className="transition-all duration-75 preview-scale-wrapper"
          >
            <div
              id="bukti-bayar-a4-sheet"
              className="kuitansi-a4-document bg-white print-page-a4 text-black shadow-xl border border-slate-800 print:border-black rounded-xs"
              style={{
                width: '210mm',
                minHeight: '292mm',
                padding: '12mm 15mm 15mm 15mm',
                fontFamily: "'Tahoma', 'Segoe UI', Arial, sans-serif",
                fontSize: '8.5pt',
                lineHeight: 1.4,
                color: '#000000',
                backgroundColor: '#ffffff',
                transform: `scale(${currentScale})`,
                transformOrigin: 'top left'
              }}
            >
            {/* Inner Document Border (Same outer framing as official receipt) */}
            <div className="border border-black p-4 sm:p-5 min-h-[265mm] flex flex-col justify-between">
              <div>
                {/* JUDUL DOKUMEN CETAK (Tanpa Kop Surat & Tanpa Box Info) */}
                <div className="text-center pb-2 mb-3 border-b-2 border-black">
                  <h1 className="text-[13pt] font-bold tracking-wider uppercase text-black">
                    LAMPIRAN BUKTI PEMBAYARAN PERJALANAN DINAS
                  </h1>
                  <p className="text-[8.5pt] text-black font-mono mt-0.5">
                    Nomor SPT : {kuitansi.nomorSuratTugas || '-'}
                  </p>
                </div>

                {/* GRID FOTO BUKTI PEMBAYARAN 2 x 1 (Maksimal untuk Kertas A4) */}
                <div>
                  {list.length === 0 ? (
                    <div className="text-center py-24 text-slate-400 italic">
                      Belum ada foto bukti pembayaran yang diupload.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {list.map((item, idx) => (
                        <div
                          key={item.id}
                          className="border border-black p-2 bg-white flex flex-col justify-between"
                          style={{ height: '115mm' }}
                        >
                          {/* Image Box Maximized across width and height */}
                          <div className="w-full h-[98mm] bg-white border border-slate-300 relative overflow-hidden flex items-center justify-center p-1">
                            <img
                              src={item.fotoUrl}
                              alt={item.namaVendor}
                              className="max-h-full max-w-full object-contain transition-all"
                              style={{
                                filter: (documentFilter === 'bw' || item.filterMode === 'bw')
                                  ? 'grayscale(100%) contrast(190%) brightness(105%)'
                                  : item.filterMode === 'contrast'
                                  ? 'contrast(135%) brightness(105%)'
                                  : 'none'
                              }}
                            />
                          </div>

                          {/* Detail Keterangan Nota */}
                          <div className="text-[8pt] pt-1 border-t border-slate-300 flex justify-between items-center px-1 font-sans">
                            <div className="font-bold text-black flex items-center gap-2">
                              <span>{idx + 1}. {item.namaVendor}</span>
                              <span className="font-normal font-mono text-[7.5pt] text-slate-700">
                                (No: {item.nomorBukti} • {formatTanggalIndo(item.tanggalTransaksi)})
                              </span>
                              {item.keterangan && (
                                <span className="font-normal text-[7.5pt] text-slate-600 truncate max-w-[280px]">
                                  • {item.keterangan}
                                </span>
                              )}
                            </div>
                            <div className="font-mono font-bold text-[9pt] text-black shrink-0">
                              {formatRupiah(item.nominal).replace(/\s+/g, '')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Catatan Kaki Lembar Cetak */}
              <div className="pt-3 mt-4 border-t border-dashed border-black text-[7.5pt] flex justify-between items-center text-slate-700">
                <span>Lampiran Foto Bukti Pembayaran Riil SPPD</span>
                <span>Tercetak melalui Sistem Informasi Perjalanan Dinas</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
