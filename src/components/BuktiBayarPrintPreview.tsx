import React, { useState } from 'react';
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
  CheckCircle2 
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
  const [zoomLevel, setZoomLevel] = useState<'fit' | '100' | '125'>('fit');
  const [documentFilter, setDocumentFilter] = useState<'normal' | 'bw'>('bw');

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

  const getScaleStyle = () => {
    if (zoomLevel === '100') {
      return { transform: 'none', transformOrigin: 'top center' };
    }
    if (zoomLevel === '125') {
      return { transform: 'scale(1.25)', transformOrigin: 'top center' };
    }
    return { transform: 'none' };
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Action Toolbar Header (Hidden in Print) */}
      <div className="print:hidden bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2.5 sticky top-14 z-30">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 active:scale-95 px-3 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Upload Bukti</span>
        </button>

        {/* CamScanner Thermal Enhancer Filter Toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/60 text-[11px] font-semibold text-slate-700">
          <span className="px-2 text-slate-500 text-[10px] hidden md:inline">Filter Cetak:</span>
          <button
            onClick={() => setDocumentFilter('normal')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              documentFilter === 'normal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Warna Asli
          </button>
          <button
            onClick={() => setDocumentFilter('bw')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              documentFilter === 'bw' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Sangat tajam untuk struk thermal dan kertas kuning agar teks terbaca jelas saat dicetak"
          >
            <span>Hitam Putih Tajam (CamScanner)</span>
          </button>
        </div>

        {/* View Zoom Switcher */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/60 text-[11px] font-semibold text-slate-600">
          <button
            onClick={() => setZoomLevel('fit')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              zoomLevel === 'fit' ? 'bg-white text-blue-600 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Pas Layar
          </button>
          <button
            onClick={() => setZoomLevel('100')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              zoomLevel === '100' ? 'bg-white text-blue-600 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            100% Asli
          </button>
          <button
            onClick={() => setZoomLevel('125')}
            className={`px-2 py-1 rounded-lg transition-all ${
              zoomLevel === '125' ? 'bg-white text-blue-600 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            +125%
          </button>
        </div>

        {/* Actions: Download PDF & Print */}
        <div className="flex items-center gap-2">
          {/* Unduh PDF Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 px-3.5 py-2 rounded-xl shadow-xs transition-all disabled:opacity-50"
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
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 px-3.5 py-2 rounded-xl shadow-xs transition-all"
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

      {/* DOCUMENT PREVIEW CONTAINER */}
      <div className="overflow-x-auto pb-6 flex justify-center">
        <div
          style={getScaleStyle()}
          className="transition-transform duration-200"
        >
          <div
            id="bukti-bayar-a4-sheet"
            className="kuitansi-a4-document bg-white print-page-a4 text-black shadow-xl border border-slate-800 print:border-black rounded-xs"
            style={{
              width: '210mm',
              minHeight: '292mm',
              padding: '12mm 15mm 15mm 15mm',
              fontFamily: 'Tahoma, Segoe UI, Arial, sans-serif',
              fontSize: '8.5pt',
              lineHeight: 1.4,
              color: '#000000',
              backgroundColor: '#ffffff'
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
  );
};
