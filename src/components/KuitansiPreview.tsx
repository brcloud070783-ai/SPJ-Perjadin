import React, { useState, useRef } from 'react';
import { KuitansiData } from '../types';
import { formatRupiah, formatTanggalIndo } from '../utils/terbilang';
import { exportElementToPdf } from '../utils/pdfExport';
import { 
  Printer, 
  ArrowLeft, 
  Download, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Eye, 
  Share2, 
  Check, 
  Sparkles 
} from 'lucide-react';

interface KuitansiPreviewProps {
  data: KuitansiData;
  onBack: () => void;
}

export const KuitansiPreview: React.FC<KuitansiPreviewProps> = ({ data, onBack }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<'fit' | '100' | '125'>('fit');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [showSignatureBlock, setShowSignatureBlock] = useState(true);

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const safeName = (data.namaPelaksana || 'Kuitansi')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .slice(0, 30);
      const fileName = `Kuitansi_A4_Tahoma_${safeName}.pdf`;
      await exportElementToPdf('kuitansi-a4-sheet', fileName);
    } catch (err) {
      console.error('Gagal mengekspor PDF:', err);
      alert('Terjadi kendala saat membuat PDF. Anda juga dapat menggunakan tombol "Cetak A4" lalu pilih Simpan sebagai PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareSummary = () => {
    const text = `*KUITANSI RESMI PERJALANAN DINAS*\nNo: ${data.nomorKuitansi || '-'}\nInstansi: ${data.namaDinas}\nPelaksana: ${data.namaPelaksana}\nTujuan: ${data.kotaTujuan}\nTanggal: ${formatTanggalIndo(data.tanggalBerangkat)} s.d ${formatTanggalIndo(data.tanggalKembali)}\nTotal: ${formatRupiah(data.totalBiaya)}\nTerbilang: ${data.terbilang}`;

    if (navigator.share) {
      navigator.share({
        title: `Kuitansi SPPD - ${data.namaPelaksana}`,
        text
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    }
  };

  // Determine scaling style based on selected view mode
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
      {/* Action Toolbar Header */}
      <div className="print:hidden bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2.5 sticky top-14 z-30">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 active:scale-95 px-3 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Edit Data</span>
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
          <button
            onClick={handleShareSummary}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:bg-slate-100 px-2.5 py-2 rounded-xl border border-slate-200 transition-colors"
            title="Bagikan Ringkasan"
          >
            {copyFeedback ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span className="hidden sm:inline">{copyFeedback ? 'Tersalin' : 'Bagi'}</span>
          </button>

          {/* Unduh PDF Button (Primary) */}
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
            <span className="hidden xs:inline">Cetak</span>
          </button>
        </div>
      </div>

      {/* Secondary Controls Bar */}
      <div className="print:hidden bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-xl flex items-center justify-between text-xs text-slate-600">
        <button
          type="button"
          onClick={() => setShowSignatureBlock(!showSignatureBlock)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
            showSignatureBlock
              ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
              : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className={`w-3.5 h-3.5 ${showSignatureBlock ? 'text-blue-600' : 'text-slate-400'}`} />
          <span>Kolom TTD 3 Pejabat: {showSignatureBlock ? 'Tampil' : 'Sembunyi'}</span>
        </button>

        <span className="text-[11px] font-medium text-slate-500">
          Format: <span className="font-bold text-slate-800">Tahoma 8,5pt • A4 Portrait</span>
        </span>
      </div>

      {/* DOCUMENT PREVIEW CONTAINER */}
      <div className="overflow-x-auto pb-6 flex justify-center">
        <div
          style={getScaleStyle()}
          className="transition-transform duration-200"
        >
          <div
            id="kuitansi-a4-sheet"
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
            {/* Inner Document Border (Exact match to outer framing in user image) */}
            <div className="border border-black p-4 sm:p-5 min-h-[265mm] flex flex-col justify-between">
              <div>
                {/* KOP SURAT */}
                <div className="relative pb-2">
                  <div className="flex items-center gap-3">
                    {/* Logo Daerah Kalimantan Utara */}
                    <div className="w-[64px] h-[78px] shrink-0 flex items-center justify-center">
                      <img
                        src={(!data.logoUrl || data.logoUrl.startsWith('data:image/svg+xml') || data.logoUrl.includes('kaltaraSky')) ? '/logo-kaltara.svg' : data.logoUrl}
                        alt="Logo Provinsi Kalimantan Utara"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>

                    {/* Teks Kop Instansi */}
                    <div className="flex-1 text-center pr-2">
                      <div className="text-[10.5pt] font-bold tracking-tight uppercase leading-tight">
                        {data.instansiInduk || 'PEMERINTAH PROVINSI KALIMANTAN UTARA'}
                      </div>
                      <div className="text-[12pt] font-black tracking-normal uppercase leading-tight mt-0.5">
                        {data.namaDinas || 'DINAS PENDIDIKAN DAN KEBUDAYAAN'}
                      </div>
                      <div className="text-[7.5pt] mt-1 leading-snug text-black">
                        {data.alamatKop || 'Jalan Kol. Soetadji Nomor 009 RT. 095 (Gedung Gabungan Dinas 2, Lantai 1),'}
                      </div>
                      <div className="text-[7.5pt] leading-snug text-black">
                        {data.kotaKop || 'Tanjung Selor, Bulungan, Kalimantan Utara 77212 Telepon Seluler 082352465546'}
                      </div>
                      <div className="text-[7.5pt] leading-snug text-black">
                        {data.kontakKop || 'Laman http://disdikbud.kaltaraprov.go.id, Pos-el kaltara.pendidikan@gmail.com'}
                      </div>
                    </div>
                  </div>

                  {/* Garis Ganda Kop Surat (Tebal & Tipis) */}
                  <div className="mt-2">
                    <div className="border-t-[2.5px] border-black"></div>
                    <div className="border-t-[0.8px] border-black mt-[1.5px]"></div>
                  </div>
                </div>

                {/* Tahun Anggaran (Right Aligned) */}
                <div className="text-right text-[8.5pt] font-normal mt-1 mb-1">
                  Tahun Anggaran {data.tahunAnggaran || '2026'}
                </div>

                {/* No. Kuitansi & Sub Kegiatan */}
                <div className="text-[8.5pt] space-y-0.5 mb-3">
                  <div className="flex items-start">
                    <div className="w-[95px] shrink-0">No. Kuitansi</div>
                    <div className="w-[12px] shrink-0">:</div>
                    <div className="flex-1 font-mono">{data.nomorKuitansi || ''}</div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-[95px] shrink-0">Sub Kegiatan</div>
                    <div className="w-[12px] shrink-0">:</div>
                    <div className="flex-1 leading-tight">
                      {data.subKegiatan || '1.01.02.1.01.0060 - 5.1.02.04.001.00001 - (Koordinasi, Perencanaan, Supervisi dan Evaluasi Layanan di Bidang Pendidikan )'}
                    </div>
                  </div>
                </div>

                {/* JUDUL KUITANSI */}
                <div className="text-center my-3">
                  <h1 className="text-[13pt] font-bold tracking-wider uppercase text-black inline-block">
                    KUITANSI
                  </h1>
                </div>

                {/* BODY KUITANSI */}
                <div className="space-y-2 text-[8.5pt]">
                  {/* Sudah terima dari */}
                  <div className="flex items-start">
                    <div className="w-[125px] shrink-0">Sudah terima dari</div>
                    <div className="w-[12px] shrink-0">:</div>
                    <div className="flex-1 leading-snug">
                      {data.sudahTerimaDari || 'Bendahara Pengeluaran Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Utara'}
                    </div>
                  </div>

                  {/* Sebesar */}
                  <div className="flex items-center">
                    <div className="w-[125px] shrink-0">Sebesar</div>
                    <div className="w-[12px] shrink-0">:</div>
                    <div className="flex-1 font-normal text-[8.5pt]">
                      {formatRupiah(data.totalBiaya).replace(/\s+/g, '')}
                    </div>
                  </div>

                  {/* Terbilang Rupiah */}
                  <div className="flex items-start">
                    <div className="w-[125px] shrink-0">Terbilang Rupiah</div>
                    <div className="w-[12px] shrink-0">:</div>
                    <div className="flex-1 italic">
                      {data.terbilang || 'Dua juta delapan ratus enam puluh ribu rupiah'}
                    </div>
                  </div>

                  {/* Untuk Pengeluaran */}
                  <div className="flex items-start">
                    <div className="w-[125px] shrink-0">Untuk Pengeluaran</div>
                    <div className="w-[12px] shrink-0">:</div>
                    <div className="flex-1 leading-relaxed">
                      {data.maksudPerjalanan || 'Pendampingan Kepala Dinas dalam rangka tindak lanjut temuan BPK terkait penggunaan anggaran sekolah pada satuan pendidikan di Kabupaten Nunukan'}
                    </div>
                  </div>

                  {/* Sub rincian perjalanan (Indented A.n, Tujuan, Tanggal, No. SPT) */}
                  <div className="pl-6 pt-1 space-y-1">
                    <div className="flex items-start">
                      <div className="w-[85px] shrink-0">A.n</div>
                      <div className="w-[12px] shrink-0">:</div>
                      <div className="flex-1 font-normal">{data.namaPelaksana}</div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-[85px] shrink-0">Tujuan</div>
                      <div className="w-[12px] shrink-0">:</div>
                      <div className="flex-1">{data.kotaTujuan}</div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-[85px] shrink-0">Tanggal</div>
                      <div className="w-[12px] shrink-0">:</div>
                      <div className="flex-1">
                        {formatTanggalIndo(data.tanggalBerangkat)} s.d {formatTanggalIndo(data.tanggalKembali)}
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-[85px] shrink-0">No. SPT</div>
                      <div className="w-[12px] shrink-0">:</div>
                      <div className="flex-1 font-mono">{data.nomorSuratTugas}</div>
                    </div>

                    <div className="flex items-start pt-1">
                      <div className="w-[120px] shrink-0">Dengan rincian :</div>
                    </div>

                    {/* TABEL RINCIAN DENGAN FORMAT SPPD EXACT */}
                    <div className="space-y-1 pl-2 pt-0.5">
                      {data.rincianBiaya.map((item, idx) => {
                        const formulaText =
                          item.volume > 1
                            ? `${formatRupiah(item.hargaSatuan).replace(/\s+/g, '')} x ${item.volume} ${item.satuan}`
                            : `${formatRupiah(item.hargaSatuan).replace(/\s+/g, '')}`;

                        return (
                          <div key={item.id} className="grid grid-cols-12 gap-1 items-baseline">
                            <div className="col-span-1 w-4 text-left">{idx + 1}</div>
                            <div className="col-span-6 pr-2 leading-tight -ml-[20px]">{item.uraian}</div>
                            <div className="col-span-3 text-left font-mono text-[8.5pt] ml-[28px]">
                              {formulaText}
                            </div>
                            <div className="col-span-2 text-right font-mono font-normal text-[8.5pt]">
                              {formatRupiah(item.total).replace(/\s+/g, '')}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* LEMBAR PENGESAHAN & TANDA TANGAN 3 PEJABAT */}
              {showSignatureBlock ? (
                <div className="pt-[10px] mt-[23px] pb-[137px] text-[8.5pt] leading-tight">
                  {/* Baris 1: Tempat, Tanggal & Yang Menerima (Kanan Atas) */}
                  <div className="flex justify-end mb-4">
                    <div className="w-[230px] text-left pl-[66px] ml-0 space-y-0.5">
                      <div>{data.kotaAsal || 'Tanjung Selor'}, {formatTanggalIndo(data.tanggalKuitansi)}</div>
                      <div className="font-normal">Yang Menerima,</div>

                      {/* Area TTD Pelaksana */}
                      <div className="h-14 flex items-center justify-center my-0.5">
                        {data.ttdPelaksana ? (
                          <img src={data.ttdPelaksana} alt="TTD Pelaksana" className="max-h-14 max-w-full object-contain" />
                        ) : (
                          <div className="h-12"></div>
                        )}
                      </div>

                      <div className="font-normal underline text-[8.5pt]">
                        {data.namaPelaksana || '..............................................'}
                      </div>
                      <div className="text-[8.5pt] font-mono">
                        NIP. {data.nipPelaksana || '....................................'}
                      </div>
                    </div>
                  </div>

                  {/* Baris 2: 2 Kolom Sejajar (Menyetujui & Lunas Dibayar) */}
                  <div className="grid grid-cols-2 gap-4 text-left pt-1">
                    {/* Menyetujui PPK / PA */}
                    <div className="space-y-0.5">
                      <div className="font-normal">Menyetujui :</div>
                      <div className="font-normal text-[8.5pt]">{data.jabatanPenyetuju || 'Pejabat Pembuat Komitmen'}</div>

                      {/* Area TTD PPK */}
                      <div className="h-14 flex items-center justify-center my-0.5">
                        {data.ttdPPK ? (
                          <img src={data.ttdPPK} alt="TTD Penyetuju" className="max-h-14 max-w-full object-contain" />
                        ) : (
                          <div className="h-12"></div>
                        )}
                      </div>

                      <div className="font-normal underline text-[8.5pt]">
                        {data.namaPPK || '..............................................'}
                      </div>
                      <div className="text-[8.5pt] font-mono">
                        NIP. {data.nipPPK || '....................................'}
                      </div>
                    </div>

                    {/* Bendahara Pengeluaran */}
                    <div className="space-y-0.5 ml-[145px]">
                      <div className="font-normal text-[8.5pt] mt-[17px] -mb-[2px] ml-0">{data.jabatanBendahara || 'Bendahara Pengeluaran'}</div>

                      {/* Area TTD Bendahara */}
                      <div className="h-14 flex items-center justify-center my-0.5">
                        {data.ttdBendahara ? (
                          <img src={data.ttdBendahara} alt="TTD Bendahara" className="max-h-14 max-w-full object-contain" />
                        ) : (
                          <div className="h-12"></div>
                        )}
                      </div>

                      <div className="font-normal underline text-[8.5pt]">
                        {data.namaBendahara || '..............................................'}
                      </div>
                      <div className="text-[8.5pt] font-mono">
                        NIP. {data.nipBendahara || '....................................'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* CATATAN DOKUMEN & TANGGAL (Tanpa TTD & Pengesahan) */
                <div className="pt-6 mt-8 border-t border-dashed border-black/40 text-[8pt] flex justify-between items-center text-slate-800">
                  <div>
                    <span className="font-normal">Kuitansi Perjalanan Dinas</span>
                    <span className="text-slate-600 block text-[7.5pt]">Dokumen dicetak tanpa lembar pengesahan dan TTD fisik</span>
                  </div>
                  <div className="text-right font-normal">
                    {data.kotaAsal}, {formatTanggalIndo(data.tanggalKuitansi)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
