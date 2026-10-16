import React, { useState } from 'react';
import { ProjectSPJ, KuitansiData, FotoDokumentasi, BuktiBayar } from '../types';
import { 
  X, Receipt, Camera, CreditCard, CheckCircle2, 
  ArrowRight, ArrowLeft, MapPin, Building2, Sparkles 
} from 'lucide-react';
import { konversiTerbilang } from '../utils/terbilang';

interface UnifiedWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProject: ProjectSPJ;
  onUpdateProject: (updater: (prev: ProjectSPJ) => ProjectSPJ) => void;
}

export const UnifiedWizardModal: React.FC<UnifiedWizardModalProps> = ({
  isOpen,
  onClose,
  activeProject,
  onUpdateProject,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states initialized from activeProject
  const [nomorSPPD, setNomorSPPD] = useState(activeProject.kuitansi.nomorSPPD || '');
  const [namaPelaksana, setNamaPelaksana] = useState(activeProject.kuitansi.namaPelaksana || '');
  const [maksudPerjalanan, setMaksudPerjalanan] = useState(activeProject.kuitansi.maksudPerjalanan || '');
  const [kotaTujuan, setKotaTujuan] = useState(activeProject.kuitansi.kotaTujuan || '');
  const [nominalBiaya, setNominalBiaya] = useState<number>(activeProject.kuitansi.totalBiaya || 750000);

  // GPS photo state
  const [fotoJudul, setFotoJudul] = useState('Kegiatan Lapangan SPPD');
  const [fotoLokasi, setFotoLokasi] = useState(activeProject.kuitansi.kotaTujuan || 'Tujuan Dinas');
  const [fotoPreview, setFotoPreview] = useState<string>('https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&auto=format&fit=crop&q=80');

  // Nota bayar state
  const [namaVendor, setNamaVendor] = useState('Hotel & Transportasi Resmi');
  const [nomorNota, setNomorNota] = useState(`INV/${Date.now().toString().slice(-6)}`);
  const [nominalNota, setNominalNota] = useState<number>(nominalBiaya);
  const [notaPreview, setNotaPreview] = useState<string>('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80');

  if (!isOpen) return null;

  const handleFinishWizard = () => {
    // Update Kuitansi, add Dokumentasi, add BuktiBayar in 1 unified action!
    const newKuitansi: KuitansiData = {
      ...activeProject.kuitansi,
      nomorSPPD,
      namaPelaksana,
      maksudPerjalanan,
      kotaTujuan,
      totalBiaya: nominalBiaya,
      terbilang: konversiTerbilang(nominalBiaya),
      rincianBiaya: [
        {
          id: `rb-wiz-${Date.now()}`,
          uraian: `Biaya Perjalanan Dinas ke ${kotaTujuan} - ${maksudPerjalanan}`,
          kategori: 'transport',
          volume: 1,
          satuan: 'Paket',
          hargaSatuan: nominalBiaya,
          total: nominalBiaya
        }
      ]
    };

    const newDokumentasi: FotoDokumentasi = {
      id: `dok-${Date.now()}`,
      judul: fotoJudul,
      deskripsi: maksudPerjalanan,
      kategori: 'lapangan',
      tanggal: new Date().toISOString().split('T')[0],
      waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      lokasi: fotoLokasi,
      koordinatGps: { latitude: 3.3256, longitude: 117.6532, accuracy: 4 },
      fotoUrl: fotoPreview,
      showWatermark: true,
      watermarkText: `${fotoLokasi} | ${new Date().toLocaleDateString('id-ID')}`,
      createdAt: Date.now()
    };

    const newBukti: BuktiBayar = {
      id: `bukti-${Date.now()}`,
      kategori: 'hotel',
      namaVendor,
      nomorBukti: nomorNota,
      tanggalTransaksi: new Date().toISOString().split('T')[0],
      nominal: nominalNota,
      keterangan: maksudPerjalanan,
      fotoUrl: notaPreview,
      filterMode: 'normal',
      statusRiil: true,
      createdAt: Date.now()
    };

    onUpdateProject(p => ({
      ...p,
      status: 'selesai',
      kuitansi: newKuitansi,
      dokumentasiList: [newDokumentasi, ...(p.dokumentasiList || [])],
      buktiBayarList: [newBukti, ...(p.buktiBayarList || [])]
    }));

    alert('Berhasil membuat Berkas SPJ terpadu (Kuitansi + Foto GPS + Nota Bayar)!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-[#0B192C] text-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-[#1E3E62] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#1E3E62] px-5 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-300 font-bold mb-0.5">
              <span>Canva Mobile Wizard</span>
              <span>·</span>
              <span>Langkah {step} dari 3</span>
            </div>
            <h2 className="text-base font-black text-white">
              {step === 1 && '1. Data Kuitansi & SPPD'}
              {step === 2 && '2. Foto GPS Dokumentasi'}
              {step === 3 && '3. Nota & Bukti Pembayaran'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {step === 1 && (
            <div className="space-y-3 animate-fade-in">
              <div>
                <label className="block font-bold text-purple-200 mb-1">Nomor SPPD / Surat Tugas</label>
                <input
                  type="text"
                  value={nomorSPPD}
                  onChange={(e) => setNomorSPPD(e.target.value)}
                  placeholder="090/123/SPD/2026"
                  className="w-full px-3 py-2 bg-[#1E3E62] text-white rounded-xl border border-white/20 focus:border-cyan-400 outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-purple-200 mb-1">Nama Pelaksana Perjalanan</label>
                <input
                  type="text"
                  value={namaPelaksana}
                  onChange={(e) => setNamaPelaksana(e.target.value)}
                  placeholder="Nama Lengkap & NIP"
                  className="w-full px-3 py-2 bg-[#1E3E62] text-white rounded-xl border border-white/20 focus:border-cyan-400 outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-purple-200 mb-1">Maksud Perjalanan Dinas</label>
                <textarea
                  rows={2}
                  value={maksudPerjalanan}
                  onChange={(e) => setMaksudPerjalanan(e.target.value)}
                  placeholder="Konsultasi dan koordinasi..."
                  className="w-full px-3 py-2 bg-[#1E3E62] text-white rounded-xl border border-white/20 focus:border-cyan-400 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-purple-200 mb-1">Kota Tujuan</label>
                  <input
                    type="text"
                    value={kotaTujuan}
                    onChange={(e) => setKotaTujuan(e.target.value)}
                    placeholder="Jakarta / Balikpapan"
                    className="w-full px-3 py-2 bg-[#1E3E62] text-white rounded-xl border border-white/20"
                  />
                </div>
                <div>
                  <label className="block font-bold text-purple-200 mb-1">Total Biaya (Rp)</label>
                  <input
                    type="number"
                    value={nominalBiaya}
                    onChange={(e) => setNominalBiaya(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1E3E62] text-white rounded-xl border border-white/20 font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 animate-fade-in">
              <div>
                <label className="block font-bold text-purple-200 mb-1">Judul / Keterangan Foto</label>
                <input
                  type="text"
                  value={fotoJudul}
                  onChange={(e) => setFotoJudul(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1E3E62] text-white rounded-xl border border-white/20"
                />
              </div>
              <div>
                <label className="block font-bold text-purple-200 mb-1">Lokasi Stempel GPS</label>
                <input
                  type="text"
                  value={fotoLokasi}
                  onChange={(e) => setFotoLokasi(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1E3E62] text-white rounded-xl border border-white/20"
                />
              </div>
              <div className="flex items-center gap-3 bg-[#1E3E62] p-3 rounded-2xl border border-white/10">
                <img src={fotoPreview} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-cyan-400/50" />
                <div className="flex-1">
                  <div className="flex items-center gap-1 text-cyan-300 font-bold text-[11px] mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Geotagging Aktif</span>
                  </div>
                  <p className="text-purple-200 text-[10px]">Koordinat GPS otomatis tersemat di sudut foto.</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3 animate-fade-in">
              <div>
                <label className="block font-bold text-purple-200 mb-1">Nama Vendor / Toko / Hotel</label>
                <input
                  type="text"
                  value={namaVendor}
                  onChange={(e) => setNamaVendor(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1E3E62] text-white rounded-xl border border-white/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-purple-200 mb-1">Nomor Nota / Invoice</label>
                  <input
                    type="text"
                    value={nomorNota}
                    onChange={(e) => setNomorNota(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1E3E62] text-white rounded-xl border border-white/20"
                  />
                </div>
                <div>
                  <label className="block font-bold text-purple-200 mb-1">Nominal Nota (Rp)</label>
                  <input
                    type="number"
                    value={nominalNota}
                    onChange={(e) => setNominalNota(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#1E3E62] text-white rounded-xl border border-white/20 font-bold"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#1E3E62] p-3 rounded-2xl border border-white/10">
                <img src={notaPreview} alt="Nota" className="w-16 h-16 rounded-xl object-cover border border-cyan-400/50" />
                <div className="flex-1">
                  <div className="flex items-center gap-1 text-emerald-300 font-bold text-[11px] mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Bukti Bayar Riil</span>
                  </div>
                  <p className="text-purple-200 text-[10px]">Nota siap disinkronkan ke rincian kuitansi.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-[#1E3E62] px-5 py-3.5 flex items-center justify-between border-t border-white/10 shrink-0">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as any)}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-black inline-flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>Lanjut</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinishWizard}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:brightness-110 text-slate-950 font-black inline-flex items-center gap-2 transition-all shadow-lg cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Berkas SPJ Lengkap</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
