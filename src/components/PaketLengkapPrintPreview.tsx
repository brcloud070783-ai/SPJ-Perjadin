import React, { useState } from 'react';
import { ProjectSPJ } from '../types';
import { formatTanggalIndo, formatRupiah } from '../utils/terbilang';
import { exportElementToPdf } from '../utils/pdfExport';
import { LOGO_KALTARA_SVG, LOGO_KALTARA_FALLBACK_DATA_URI } from '../utils/logoKaltara';
import { 
  Printer, 
  ArrowLeft, 
  Download, 
  Briefcase, 
  CheckCircle2, 
  Loader2, 
  FileCheck,
  Folder
} from 'lucide-react';

interface PaketLengkapPrintPreviewProps {
  project: ProjectSPJ;
  onBack: () => void;
}

export const PaketLengkapPrintPreview: React.FC<PaketLengkapPrintPreviewProps> = ({
  project,
  onBack
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [documentFilter, setDocumentFilter] = useState<'normal' | 'bw'>('bw');
  const [showSignatureBlock, setShowSignatureBlock] = useState(true);

  const { kuitansi, dokumentasiList = [], buktiBayarList = [] } = project;
  const totalNominal = kuitansi.totalBiaya || 0;

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const safeName = (project.namaProject || kuitansi.namaPelaksana || 'Paket_SPJ')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .slice(0, 30);
      const fileName = `Paket_Lengkap_SPJ_${safeName}.pdf`;
      await exportElementToPdf('paket-lengkap-a4-bundle', fileName);
    } catch (err) {
      console.error('Gagal mengekspor PDF paket lengkap:', err);
      alert('Terjadi kendala saat membuat PDF. Anda dapat menggunakan tombol "Cetak Semua A4" lalu pilih Simpan sebagai PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Toolbar Header (Hidden in print) */}
      <div className="print:hidden bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-purple-200 shadow-md flex flex-wrap items-center justify-between gap-3 sticky top-14 z-30">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 active:scale-95 px-3 py-2 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSignatureBlock(!showSignatureBlock)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              showSignatureBlock
                ? 'bg-purple-100 text-purple-900 border-purple-300'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${showSignatureBlock ? 'text-purple-700' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Kolom TTD: {showSignatureBlock ? 'Tampil' : 'Sembunyi'}</span>
          </button>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700">
            <span className="px-2 text-slate-500 text-[10px] hidden md:inline">Kontras Nota:</span>
            <button
              onClick={() => setDocumentFilter('normal')}
              className={`px-2 py-1 rounded-lg transition-all ${
                documentFilter === 'normal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Warna
            </button>
            <button
              onClick={() => setDocumentFilter('bw')}
              className={`px-2 py-1 rounded-lg transition-all ${
                documentFilter === 'bw' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              H-P Tajam
            </button>
          </div>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 px-3.5 py-2 rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Membuat PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Paket PDF</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-[#7D2AE8] hover:bg-purple-900 active:scale-95 px-4 py-2 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Seluruh Paket A4</span>
          </button>
        </div>
      </div>

      {/* Info Header Banner */}
      <div className="print:hidden bg-gradient-to-r from-purple-950 via-purple-900 to-[#7D2AE8] text-white p-4 rounded-2xl shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-cyan-300 shrink-0">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white">
              Pratinjau Paket Lengkap Berkas SPJ (1 Kesatuan)
            </h2>
            <p className="text-xs text-purple-200">
              Project: <strong>{project.namaProject}</strong> • Total Nilai: <strong>Rp {totalNominal.toLocaleString('id-ID')}</strong>
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-xl text-cyan-200">
          <FileCheck className="w-4 h-4" />
          <span>Kuitansi + {dokumentasiList.length} Foto GPS + {buktiBayarList.length} Nota</span>
        </div>
      </div>

      {/* PRINTABLE BUNDLE CONTAINER */}
      <div 
        className="w-full overflow-x-auto pb-8 touch-pan-x overscroll-x-contain"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin'
        }}
      >
        <div id="paket-lengkap-a4-bundle" className="w-max min-w-full space-y-8 flex flex-col items-center">
        {/* SECTION 1: KUITANSI A4 */}
        <div
          className="bg-white print-page-a4 text-black shadow-xl border border-slate-800 print:border-black rounded-xs w-[210mm] min-h-[292mm] p-[12mm_15mm_15mm_15mm] text-[8.5pt]"
          style={{ fontFamily: 'Tahoma, Geneva, Verdana, sans-serif', fontSize: '8.5pt' }}
        >
          <div className="border border-black p-4 sm:p-5 min-h-[265mm] flex flex-col justify-between">
            <div>
              {/* Header Kop Surat */}
              <div className="flex items-center gap-3 pb-3 mb-3 border-b-2 border-black">
                <img
                  src={kuitansi.logoUrl || LOGO_KALTARA_SVG}
                  alt="Logo Kop"
                  className="w-14 h-16 object-contain shrink-0"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = LOGO_KALTARA_FALLBACK_DATA_URI;
                  }}
                />
                <div className="text-center flex-1">
                  <h3 className="text-[10pt] font-extrabold uppercase tracking-wide">{kuitansi.instansiInduk}</h3>
                  <h2 className="text-[12pt] font-black uppercase tracking-wider">{kuitansi.namaDinas}</h2>
                  <p className="text-[7.5pt]">{kuitansi.alamatKop}</p>
                  <p className="text-[7.5pt] font-mono">{kuitansi.kontakKop}</p>
                </div>
              </div>

              {/* Title Kuitansi */}
              <div className="text-center my-3">
                <h1 className="text-[14pt] font-black underline uppercase tracking-widest">KUITANSI / BUKTI PEMBAYARAN</h1>
                <p className="text-[8.5pt] font-mono mt-0.5">Nomor: {kuitansi.nomorKuitansi || '....................................................'}</p>
              </div>

              {/* Content Form */}
              <div className="space-y-2 mt-4 text-[8.5pt]">
                <div className="flex">
                  <div className="w-[140px]">Sudah Terima Dari</div>
                  <div className="w-[10px]">:</div>
                  <div className="flex-1">{kuitansi.sudahTerimaDari}</div>
                </div>

                <div className="flex">
                  <div className="w-[140px]">Uang Sejumlah</div>
                  <div className="w-[10px]">:</div>
                  <div className="flex-1 italic bg-slate-100 print:bg-transparent p-1 border border-slate-300 print:border-none">
                    " {kuitansi.terbilang || 'Rupiah'} "
                  </div>
                </div>

                <div className="flex">
                  <div className="w-[140px]">Untuk Pembayaran</div>
                  <div className="w-[10px]">:</div>
                  <div className="flex-1">
                    Biaya Perjalanan Dinas A.n. {kuitansi.namaPelaksana} dalam rangka {kuitansi.maksudPerjalanan} dari {kuitansi.kotaAsal} ke {kuitansi.kotaTujuan} selama {kuitansi.lamaHari} Hari ({formatTanggalIndo(kuitansi.tanggalBerangkat)} s.d {formatTanggalIndo(kuitansi.tanggalKembali)}) berdasarkan Surat Tugas Nomor: {kuitansi.nomorSuratTugas}.
                  </div>
                </div>

                <div className="flex">
                  <div className="w-[140px]">Jumlah Total</div>
                  <div className="w-[10px]">:</div>
                  <div className="flex-1 text-[8.5pt]">
                    Rp {totalNominal.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              {/* Rincian Tabel Biaya */}
              <div className="mt-4">
                <h4 className="text-[8.5pt] mb-1">Rincian Perhitungan Biaya:</h4>
                <table className="w-full border-collapse border border-black text-[8.5pt]">
                  <thead>
                    <tr className="bg-slate-100 print:bg-slate-200">
                      <th className="border border-black p-1 text-center w-8 font-normal">No</th>
                      <th className="border border-black p-1 text-left font-normal">Uraian Rincian</th>
                      <th className="border border-black p-1 text-center w-20 font-normal">Volume</th>
                      <th className="border border-black p-1 text-right w-24 font-normal">Harga Satuan</th>
                      <th className="border border-black p-1 text-right w-28 font-normal">Jumlah (Rp)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kuitansi.rincianBiaya?.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="border border-black p-1 text-center">{idx + 1}</td>
                        <td className="border border-black p-1">{item.uraian}</td>
                        <td className="border border-black p-1 text-center">{item.volume} {item.satuan}</td>
                        <td className="border border-black p-1 text-right">{item.hargaSatuan.toLocaleString('id-ID')}</td>
                        <td className="border border-black p-1 text-right">{item.total.toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 print:bg-transparent">
                      <td colSpan={4} className="border border-black p-1 text-right">JUMLAH TOTAL:</td>
                      <td className="border border-black p-1 text-right">Rp {totalNominal.toLocaleString('id-ID')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* LEMBAR PENGESAHAN & TANDA TANGAN 3 PEJABAT */}
            {showSignatureBlock ? (
              <div className="pt-[10px] mt-[23px] pb-[137px] text-[8.5pt] leading-tight">
                {/* Baris 1: Tempat, Tanggal & Yang Menerima (Kanan Atas) */}
                <div className="flex justify-end mb-4">
                  <div className="w-[230px] text-left pl-[66px] ml-0 space-y-0.5">
                    <div>{kuitansi.kotaAsal || 'Tanjung Selor'}, {formatTanggalIndo(kuitansi.tanggalKuitansi)}</div>
                    <div>Yang Menerima,</div>

                    {/* Area TTD Pelaksana */}
                    <div className="h-14 flex items-center justify-center my-0.5">
                      {kuitansi.ttdPelaksana ? (
                        <img src={kuitansi.ttdPelaksana} alt="TTD Pelaksana" className="max-h-14 max-w-full object-contain" />
                      ) : (
                        <div className="h-12"></div>
                      )}
                    </div>

                    <div className="underline text-[8.5pt]">
                      {kuitansi.namaPelaksana || '..............................................'}
                    </div>
                    <div className="text-[8.5pt] font-mono">
                      NIP. {kuitansi.nipPelaksana || '....................................'}
                    </div>
                  </div>
                </div>

                {/* Baris 2: 2 Kolom Sejajar (Menyetujui & Lunas Dibayar) */}
                <div className="grid grid-cols-2 gap-4 text-left pt-1">
                  {/* Menyetujui PPK / PA */}
                  <div className="space-y-0.5">
                    <div>Menyetujui :</div>
                    <div className="text-[8.5pt]">{kuitansi.jabatanPenyetuju || 'Pejabat Pembuat Komitmen'}</div>

                    {/* Area TTD PPK */}
                    <div className="h-14 flex items-center justify-center my-0.5">
                      {kuitansi.ttdPPK ? (
                        <img src={kuitansi.ttdPPK} alt="TTD Penyetuju" className="max-h-14 max-w-full object-contain" />
                      ) : (
                        <div className="h-12"></div>
                      )}
                    </div>

                    <div className="underline text-[8.5pt]">
                      {kuitansi.namaPPK || '..............................................'}
                    </div>
                    <div className="text-[8.5pt] font-mono">
                      NIP. {kuitansi.nipPPK || '....................................'}
                    </div>
                  </div>

                  {/* Bendahara Pengeluaran */}
                  <div className="space-y-0.5 ml-[145px]">
                    <div className="text-[8.5pt] mt-[17px] -mb-[2px] ml-0">{kuitansi.jabatanBendahara || 'Bendahara Pengeluaran'}</div>

                    {/* Area TTD Bendahara */}
                    <div className="h-14 flex items-center justify-center my-0.5">
                      {kuitansi.ttdBendahara ? (
                        <img src={kuitansi.ttdBendahara} alt="TTD Bendahara" className="max-h-14 max-w-full object-contain" />
                      ) : (
                        <div className="h-12"></div>
                      )}
                    </div>

                    <div className="underline text-[8.5pt]">
                      {kuitansi.namaBendahara || '..............................................'}
                    </div>
                    <div className="text-[8.5pt] font-mono">
                      NIP. {kuitansi.nipBendahara || '....................................'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* CATATAN DOKUMEN & TANGGAL (Tanpa TTD & Pengesahan) */
              <div className="pt-6 mt-8 border-t border-dashed border-black/40 text-[8pt] flex justify-between items-center text-slate-800">
                <div>
                  <span className="font-bold">Kuitansi Perjalanan Dinas</span>
                  <span className="text-slate-600 block text-[7.5pt]">Dokumen dicetak tanpa lembar pengesahan dan TTD fisik</span>
                </div>
                <div className="text-right font-medium">
                  {kuitansi.kotaKop || kuitansi.kotaAsal}, {formatTanggalIndo(kuitansi.tanggalKuitansi)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: DOKUMENTASI FOTO GPS A4 */}
        <div className="bg-white print-page-a4 text-black shadow-xl border border-slate-800 print:border-black rounded-xs w-[210mm] min-h-[292mm] p-[12mm_15mm_15mm_15mm] font-sans text-[8.5pt]">
          <div className="border border-black p-4 sm:p-5 min-h-[265mm] flex flex-col justify-between">
            <div>
              <div className="text-center pb-2 mb-3 border-b-2 border-black">
                <h1 className="text-[13pt] font-bold uppercase tracking-wider">
                  LAMPIRAN DOKUMENTASI FOTO KEGIATAN PERJALANAN DINAS
                </h1>
                <p className="text-[8.5pt] font-mono mt-0.5">Nomor SPT: {kuitansi.nomorSuratTugas || '-'}</p>
              </div>

              {dokumentasiList.length === 0 ? (
                <div className="text-center py-20 text-slate-400 italic">
                  Tidak ada foto dokumentasi terlampir pada berkas project ini.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {dokumentasiList.map((item, idx) => (
                    <div key={item.id} className="border border-black p-2 bg-white flex flex-col justify-between">
                      <div className="w-full aspect-16/10 bg-slate-900 relative overflow-hidden mb-2">
                        <img src={item.fotoUrl} alt={item.judul} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 inset-x-0 bg-black/80 text-white p-1 text-[7pt] font-mono leading-tight">
                          <div>{formatTanggalIndo(item.tanggal)} • {item.waktu} WITA</div>
                          {item.koordinatGps && (
                            <div className="text-emerald-300">
                              GPS: {item.koordinatGps.latitude.toFixed(5)}, {item.koordinatGps.longitude.toFixed(5)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-[8pt] space-y-0.5">
                        <div className="font-bold">{idx + 1}. {item.judul}</div>
                        <div className="text-[7.5pt] text-slate-700"><strong>Tempat:</strong> {item.lokasi}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-dashed border-black text-[7.5pt] flex justify-between text-slate-600">
              <span>Halaman Lampiran Foto GPS</span>
              <span>Project SPJ: {project.namaProject}</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: BUKTI BAYAR & NOTA SCAN A4 */}
        <div className="bg-white print-page-a4 text-black shadow-xl border border-slate-800 print:border-black rounded-xs w-[210mm] min-h-[292mm] p-[12mm_15mm_15mm_15mm] font-sans text-[8.5pt]">
          <div className="border border-black p-4 sm:p-5 min-h-[265mm] flex flex-col justify-between">
            <div>
              <div className="text-center pb-2 mb-3 border-b-2 border-black">
                <h1 className="text-[13pt] font-bold uppercase tracking-wider">
                  LAMPIRAN BUKTI PEMBAYARAN RIIL / NOTA FISIK
                </h1>
                <p className="text-[8.5pt] font-mono mt-0.5">Nomor SPT: {kuitansi.nomorSuratTugas || '-'}</p>
              </div>

              {buktiBayarList.length === 0 ? (
                <div className="text-center py-20 text-slate-400 italic">
                  Tidak ada foto nota/bukti bayar terlampir pada berkas project ini.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {buktiBayarList.map((item, idx) => (
                    <div key={item.id} className="border border-black p-2 bg-white flex flex-col justify-between" style={{ height: '115mm' }}>
                      <div className="w-full h-[98mm] bg-white border border-slate-300 flex items-center justify-center p-1">
                        <img
                          src={item.fotoUrl}
                          alt={item.namaVendor}
                          className="max-h-full max-w-full object-contain"
                          style={{
                            filter: documentFilter === 'bw' ? 'grayscale(100%) contrast(190%) brightness(105%)' : 'none'
                          }}
                        />
                      </div>
                      <div className="text-[8pt] pt-1 border-t border-slate-300 flex justify-between items-center">
                        <div className="font-bold flex items-center gap-2">
                          <span>{idx + 1}. {item.namaVendor}</span>
                          <span className="font-normal font-mono text-[7.5pt] text-slate-700">({item.nomorBukti} • {formatTanggalIndo(item.tanggalTransaksi)})</span>
                        </div>
                        <div className="font-mono font-bold text-[9pt]">{formatRupiah(item.nominal)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-dashed border-black text-[7.5pt] flex justify-between text-slate-600">
              <span>Halaman Lampiran Nota Physical Scan</span>
              <span>Project SPJ: {project.namaProject}</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
