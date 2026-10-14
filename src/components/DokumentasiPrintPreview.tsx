import React, { useState } from 'react';
import { KuitansiData, FotoDokumentasi } from '../types';
import { formatTanggalIndo } from '../utils/terbilang';
import { exportElementToPdf } from '../utils/pdfExport';
import { 
  Printer, 
  ArrowLeft, 
  Download, 
  Camera, 
  MapPin, 
  Calendar, 
  Clock, 
  Navigation, 
  Loader2, 
  Share2, 
  Check, 
  FileText 
} from 'lucide-react';

interface DokumentasiPrintPreviewProps {
  kuitansi: KuitansiData;
  list: FotoDokumentasi[];
  onBack: () => void;
}

export const DokumentasiPrintPreview: React.FC<DokumentasiPrintPreviewProps> = ({
  kuitansi,
  list,
  onBack
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<'fit' | '100' | '125'>('fit');

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const safeName = (kuitansi.namaPelaksana || 'Dokumentasi')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .slice(0, 30);
      const fileName = `Dokumentasi_Kegiatan_A4_${safeName}.pdf`;
      await exportElementToPdf('dokumentasi-a4-sheet', fileName);
    } catch (err) {
      console.error('Gagal mengekspor PDF dokumentasi:', err);
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
          <span>Kembali ke Upload Foto</span>
        </button>

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
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 px-3 py-2 rounded-xl shadow-xs transition-all"
            title="Buka dialog cetak browser"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Cetak A4</span>
          </button>
        </div>
      </div>

      {/* Info Badge */}
      <div className="print:hidden bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Format Cetak Resmi <strong>Dokumentasi Kegiatan A4</strong> ({list.length} Foto Terlampir)
          </span>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 hidden sm:inline">
          Font Tahoma • Siap Cetak & Verifikasi
        </span>
      </div>

      {/* DOCUMENT PREVIEW CONTAINER */}
      <div className="overflow-x-auto pb-6 flex justify-center">
        <div
          style={getScaleStyle()}
          className="transition-transform duration-200"
        >
          <div
            id="dokumentasi-a4-sheet"
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
            {/* Inner Document Border (Same outer framing style as official receipt) */}
            <div className="border border-black p-4 sm:p-5 min-h-[265mm] flex flex-col">
                {/* JUDUL DOKUMEN CETAK (Tanpa Kop Surat) */}
                <div className="text-center pb-2.5 mb-3 border-b-2 border-black">
                  <h1 className="text-[13pt] font-bold tracking-wider uppercase text-black">
                    DOKUMENTASI FOTO KEGIATAN PERJALANAN DINAS
                  </h1>
                  <p className="text-[8.5pt] text-black font-mono mt-0.5">
                    Nomor SPT : {kuitansi.nomorSuratTugas || '-'}
                  </p>
                </div>

                {/* INFORMASI TUGAS PERJALANAN */}
                <div className="text-[8.5pt] space-y-1 mb-4 bg-slate-50 print:bg-transparent p-2.5 rounded-sm border border-slate-300 print:border-none">
                  <div className="flex items-start">
                    <div className="w-[120px] shrink-0 font-medium">Pelaksana Tugas</div>
                    <div className="w-[12px] shrink-0">:</div>
                    <div className="flex-1 font-bold">
                      {kuitansi.namaPelaksana} {kuitansi.nipPelaksana && <span className="font-normal font-mono">(NIP. {kuitansi.nipPelaksana})</span>}
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-[120px] shrink-0 font-medium">Maksud Perjalanan</div>
                    <div className="w-[12px] shrink-0">:</div>
                    <div className="flex-1 leading-snug">{kuitansi.maksudPerjalanan}</div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-[120px] shrink-0 font-medium">Tujuan & Waktu</div>
                    <div className="w-[12px] shrink-0">:</div>
                    <div className="flex-1">
                      {kuitansi.kotaTujuan} • {formatTanggalIndo(kuitansi.tanggalBerangkat)} s.d {formatTanggalIndo(kuitansi.tanggalKembali)} ({kuitansi.lamaHari} Hari)
                    </div>
                  </div>
                </div>

                {/* GRID FOTO DOKUMENTASI KEGIATAN */}
                {list.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 italic">
                    Belum ada foto dokumentasi yang diupload.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {list.map((item, idx) => (
                      <div
                        key={item.id}
                        className="border border-black p-2.5 bg-white flex flex-col justify-between"
                        style={{ minHeight: '210px' }}
                      >
                        {/* Frame Foto */}
                        <div className="w-full aspect-16/10 bg-slate-900 border border-slate-300 relative overflow-hidden mb-2">
                          <img
                            src={item.fotoUrl}
                            alt={item.judul}
                            className="w-full h-full object-cover"
                          />
                          {/* Stempel Waktu & GPS di Foto */}
                          <div className="absolute bottom-0 inset-x-0 bg-black/80 text-white p-1.5 text-[7pt] font-mono leading-tight">
                            <div>{formatTanggalIndo(item.tanggal)} • {item.waktu} WITA</div>
                            {item.koordinatGps && (
                              <div className="text-emerald-300">
                                GPS: {item.koordinatGps.latitude.toFixed(5)}, {item.koordinatGps.longitude.toFixed(5)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Keterangan Foto */}
                        <div className="text-[8pt] space-y-1">
                          <div className="font-bold leading-tight">
                            {idx + 1}. {item.judul}
                          </div>
                          <div className="text-[7.5pt] text-slate-700">
                            <strong>Tempat:</strong> {item.lokasi}
                          </div>
                          {item.deskripsi && (
                            <div className="text-[7.5pt] text-slate-800 leading-snug">
                              <strong>Uraian:</strong> {item.deskripsi}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};
