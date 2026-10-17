import React, { useState } from 'react';
import { ProjectSPJ, KuitansiData, FotoDokumentasi, BuktiBayar, RincianBiaya } from '../types';
import { 
  FileText, Camera, Receipt, Printer, CheckCircle2, MapPin, 
  Plus, Trash2, ArrowRight, ArrowLeft, RefreshCw, Building2
} from 'lucide-react';
import { konversiTerbilang } from '../utils/terbilang';

interface UnifiedSPJWorkspaceProps {
  activeProject: ProjectSPJ;
  onUpdateProject: (updater: (prev: ProjectSPJ) => ProjectSPJ) => void;
  onOpenPaketLengkap: () => void;
  onOpenProjectManager: () => void;
  onOpenLogoDinas: () => void;
}

export const UnifiedSPJWorkspace: React.FC<UnifiedSPJWorkspaceProps> = ({
  activeProject,
  onUpdateProject,
  onOpenPaketLengkap,
  onOpenProjectManager,
  onOpenLogoDinas,
}) => {
  const [activeStep, setActiveStep] = useState<'kuitansi' | 'dokumentasi' | 'bukti_bayar' | 'rekap'>('kuitansi');

  const kuitansi = activeProject.kuitansi;
  const dokumentasiList = activeProject.dokumentasiList || [];
  const buktiBayarList = activeProject.buktiBayarList || [];

  // Handlers for Kuitansi
  const handleKuitansiChange = (field: keyof KuitansiData, val: any) => {
    onUpdateProject(p => {
      const updatedKuitansi = { ...p.kuitansi, [field]: val };
      return { ...p, kuitansi: updatedKuitansi };
    });
  };

  const handleAddRincian = () => {
    const newRincian: RincianBiaya = {
      id: `rb-${Date.now()}`,
      uraian: 'Biaya Penginapan / Transportasi',
      kategori: 'transport',
      volume: 1,
      satuan: 'Hari',
      hargaSatuan: 250000,
      total: 250000
    };
    onUpdateProject(p => {
      const rincian = [...p.kuitansi.rincianBiaya, newRincian];
      const total = rincian.reduce((acc, curr) => acc + (curr.total || 0), 0);
      return {
        ...p,
        kuitansi: {
          ...p.kuitansi,
          rincianBiaya: rincian,
          totalBiaya: total,
          terbilang: konversiTerbilang(total)
        }
      };
    });
  };

  const handleUpdateRincian = (id: string, field: keyof RincianBiaya, val: any) => {
    onUpdateProject(p => {
      const rincian = p.kuitansi.rincianBiaya.map(r => {
        if (r.id === id) {
          const updated = { ...r, [field]: val };
          if (field === 'volume' || field === 'hargaSatuan') {
            updated.total = Number(updated.volume || 0) * Number(updated.hargaSatuan || 0);
          }
          return updated;
        }
        return r;
      });
      const total = rincian.reduce((acc, curr) => acc + (curr.total || 0), 0);
      return {
        ...p,
        kuitansi: {
          ...p.kuitansi,
          rincianBiaya: rincian,
          totalBiaya: total,
          terbilang: konversiTerbilang(total)
        }
      };
    });
  };

  const handleDeleteRincian = (id: string) => {
    onUpdateProject(p => {
      const rincian = p.kuitansi.rincianBiaya.filter(r => r.id !== id);
      const total = rincian.reduce((acc, curr) => acc + (curr.total || 0), 0);
      return {
        ...p,
        kuitansi: {
          ...p.kuitansi,
          rincianBiaya: rincian,
          totalBiaya: total,
          terbilang: konversiTerbilang(total)
        }
      };
    });
  };

  // Handlers for Dokumentasi / Foto GPS
  const handleAddDokumentasi = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;

    const file = fileInput?.files?.[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const fotoUrl = (event.target?.result as string) || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&auto=format&fit=crop&q=80';
      const newItem: FotoDokumentasi = {
        id: `dok-${Date.now()}`,
        judul: (formData.get('judul') as string) || 'Kegiatan Perjalanan Dinas',
        deskripsi: (formData.get('deskripsi') as string) || '',
        kategori: (formData.get('kategori') as any) || 'lapangan',
        tanggal: (formData.get('tanggal') as string) || new Date().toISOString().split('T')[0],
        waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        lokasi: (formData.get('lokasi') as string) || kuitansi.kotaTujuan || 'Lokasi Kegiatan',
        koordinatGps: {
          latitude: 3.3256,
          longitude: 117.6532,
          accuracy: 5
        },
        fotoUrl,
        showWatermark: true,
        watermarkText: `${kuitansi.kotaTujuan} | ${new Date().toLocaleDateString('id-ID')}`,
        createdAt: Date.now()
      };

      onUpdateProject(p => ({
        ...p,
        dokumentasiList: [newItem, ...(p.dokumentasiList || [])]
      }));
      form.reset();
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      reader.onload({ target: { result: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&auto=format&fit=crop&q=80' } } as any);
    }
  };

  const handleDeleteDokumentasi = (id: string) => {
    onUpdateProject(p => ({
      ...p,
      dokumentasiList: p.dokumentasiList.filter(d => d.id !== id)
    }));
  };

  // Handlers for Bukti Bayar / Nota
  const handleAddBukti = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      const fotoUrl = (event.target?.result as string) || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80';
      const newItem: BuktiBayar = {
        id: `bukti-${Date.now()}`,
        kategori: (formData.get('kategori') as any) || 'tiket',
        namaVendor: (formData.get('namaVendor') as string) || 'Hotel / Vendor Resmi',
        nomorBukti: (formData.get('nomorBukti') as string) || `INV/${Date.now().toString().slice(-6)}`,
        tanggalTransaksi: (formData.get('tanggalTransaksi') as string) || new Date().toISOString().split('T')[0],
        nominal: Number(formData.get('nominal') || 500000),
        keterangan: (formData.get('keterangan') as string) || '',
        fotoUrl,
        filterMode: 'normal',
        statusRiil: true,
        createdAt: Date.now()
      };

      onUpdateProject(p => ({
        ...p,
        buktiBayarList: [newItem, ...(p.buktiBayarList || [])]
      }));
      form.reset();
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      reader.onload({ target: { result: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80' } } as any);
    }
  };

  const handleDeleteBukti = (id: string) => {
    onUpdateProject(p => ({
      ...p,
      buktiBayarList: p.buktiBayarList.filter(b => b.id !== id)
    }));
  };

  // Sync Bukti to Kuitansi
  const handleSyncNotaToKuitansi = () => {
    if (buktiBayarList.length === 0) {
      alert('Belum ada nota bayar yang diinput.');
      return;
    }
    const items = buktiBayarList.map((b, idx) => ({
      id: `rb-sync-${idx}-${Date.now()}`,
      uraian: `${b.namaVendor} (${b.nomorBukti}) - ${b.keterangan || 'Pengeluaran Riil'}`,
      kategori: (b.kategori === 'tiket' ? 'transport' : b.kategori === 'hotel' ? 'penginapan' : 'lainnya') as any,
      volume: 1,
      satuan: 'Bukti',
      hargaSatuan: b.nominal,
      total: b.nominal
    }));

    const uangHarian = kuitansi.rincianBiaya.find(r => r.kategori === 'uang_harian');
    const newRincian = uangHarian ? [uangHarian, ...items] : items;
    const total = newRincian.reduce((acc, curr) => acc + (curr.total || 0), 0);

    onUpdateProject(p => ({
      ...p,
      kuitansi: {
        ...p.kuitansi,
        rincianBiaya: newRincian,
        totalBiaya: total,
        terbilang: konversiTerbilang(total)
      }
    }));
    alert(`Berhasil menyinkronkan ${buktiBayarList.length} nota bayar ke rincian kuitansi utama!`);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-12">
      {/* Top Banner / Project Selector Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-0.5">
            <span>Pusat Berkas Terpadu</span>
            <span>·</span>
            <span className="text-[#0000B3] font-bold">{activeProject.namaProject}</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>Proses SPJ Perjalanan Dinas</span>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              Satu Alur Utuh
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          <button
            onClick={onOpenProjectManager}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
          >
            <span>Ganti Berkas</span>
          </button>
          <button
            onClick={onOpenLogoDinas}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
          >
            <Building2 className="w-3.5 h-3.5 text-[#0000B3]" />
            <span>Logo Dinas</span>
          </button>
          <button
            onClick={onOpenPaketLengkap}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#0000B3] to-blue-700 hover:brightness-110 text-white text-xs font-black shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-300" />
            <span>Cetak Paket Lengkap</span>
          </button>
        </div>
      </div>

      {/* Step Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveStep('kuitansi')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeStep === 'kuitansi'
              ? 'bg-white text-blue-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <FileText className={`w-4 h-4 ${activeStep === 'kuitansi' ? 'text-[#0000B3]' : 'text-slate-400'}`} />
          <span>1. Kuitansi & Rincian</span>
        </button>

        <button
          onClick={() => setActiveStep('dokumentasi')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeStep === 'dokumentasi'
              ? 'bg-white text-blue-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Camera className={`w-4 h-4 ${activeStep === 'dokumentasi' ? 'text-[#0000B3]' : 'text-slate-400'}`} />
          <span>2. Foto GPS ({dokumentasiList.length})</span>
        </button>

        <button
          onClick={() => setActiveStep('bukti_bayar')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeStep === 'bukti_bayar'
              ? 'bg-white text-blue-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Receipt className={`w-4 h-4 ${activeStep === 'bukti_bayar' ? 'text-[#0000B3]' : 'text-slate-400'}`} />
          <span>3. Nota Bayar ({buktiBayarList.length})</span>
        </button>

        <button
          onClick={() => setActiveStep('rekap')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeStep === 'rekap'
              ? 'bg-white text-blue-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <CheckCircle2 className={`w-4 h-4 ${activeStep === 'rekap' ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span>4. Rekap & Cetak</span>
        </button>
      </div>

      {/* Step Content Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
        {/* STEP 1: KUITANSI & RINCIAN */}
        {activeStep === 'kuitansi' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Data Kuitansi & Rincian Biaya Perjalanan</h3>
                <p className="text-xs text-slate-500">Lengkapi nomor SPPD, pelaksana, maksud perjalanan, dan rincian biaya.</p>
              </div>
              <button
                onClick={() => setActiveStep('dokumentasi')}
                className="px-3 py-1.5 rounded-xl bg-[#0000B3] hover:bg-[#000090] text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-all"
              >
                <span>Lanjut Foto GPS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor SPPD / Surat Tugas</label>
                <input
                  type="text"
                  value={kuitansi.nomorSPPD}
                  onChange={(e) => handleKuitansiChange('nomorSPPD', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-[#0000B3]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Pelaksana Perjalanan</label>
                <input
                  type="text"
                  value={kuitansi.namaPelaksana}
                  onChange={(e) => handleKuitansiChange('namaPelaksana', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-[#0000B3]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Maksud Perjalanan Dinas</label>
                <textarea
                  rows={2}
                  value={kuitansi.maksudPerjalanan}
                  onChange={(e) => handleKuitansiChange('maksudPerjalanan', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-[#0000B3]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kota Asal → Kota Tujuan</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={kuitansi.kotaAsal}
                    onChange={(e) => handleKuitansiChange('kotaAsal', e.target.value)}
                    placeholder="Asal"
                    className="px-3 py-2 rounded-xl border border-slate-200"
                  />
                  <input
                    type="text"
                    value={kuitansi.kotaTujuan}
                    onChange={(e) => handleKuitansiChange('kotaTujuan', e.target.value)}
                    placeholder="Tujuan"
                    className="px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Lama Perjalanan (Hari)</label>
                <input
                  type="number"
                  value={kuitansi.lamaHari}
                  onChange={(e) => handleKuitansiChange('lamaHari', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            {/* Rincian Biaya Table */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-black text-slate-900">Rincian Komponen Biaya</h4>
                <div className="flex items-center gap-2">
                  {buktiBayarList.length > 0 && (
                    <button
                      onClick={handleSyncNotaToKuitansi}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Sinkronkan {buktiBayarList.length} Nota Bayar</span>
                    </button>
                  )}
                  <button
                    onClick={handleAddRincian}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#0000B3] hover:bg-blue-100 font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah Baris</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {kuitansi.rincianBiaya.map((r) => (
                  <div key={r.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-slate-50 p-2.5 rounded-xl items-center text-xs">
                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        value={r.uraian}
                        onChange={(e) => handleUpdateRincian(r.id, 'uraian', e.target.value)}
                        placeholder="Uraian biaya..."
                        className="w-full px-2 py-1.5 bg-white rounded-lg border border-slate-200"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="number"
                        value={r.volume}
                        onChange={(e) => handleUpdateRincian(r.id, 'volume', Number(e.target.value))}
                        placeholder="Vol"
                        className="w-full px-2 py-1.5 bg-white rounded-lg border border-slate-200 text-center"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="number"
                        value={r.hargaSatuan}
                        onChange={(e) => handleUpdateRincian(r.id, 'hargaSatuan', Number(e.target.value))}
                        placeholder="Harga Satuan"
                        className="w-full px-2 py-1.5 bg-white rounded-lg border border-slate-200 text-right"
                      />
                    </div>
                    <div className="sm:col-span-1 text-right font-bold text-slate-900">
                      Rp {(r.total || 0).toLocaleString('id-ID')}
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        onClick={() => handleDeleteRincian(r.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Hapus baris"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between bg-blue-50 p-3 rounded-xl border border-blue-200 text-xs">
                <span className="font-bold text-blue-900">Total Keseluruhan Biaya:</span>
                <span className="text-base font-black text-blue-900">Rp {(kuitansi.totalBiaya || 0).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FOTO GPS & DOKUMENTASI */}
        {activeStep === 'dokumentasi' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Foto Dokumentasi & Geotagging GPS</h3>
                <p className="text-xs text-slate-500">Ambil atau upload foto kegiatan lengkap dengan cap koordinat GPS & waktu.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveStep('kuitansi')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kuitansi</span>
                </button>
                <button
                  onClick={() => setActiveStep('bukti_bayar')}
                  className="px-3 py-1.5 rounded-xl bg-[#0000B3] hover:bg-[#000090] text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Lanjut Nota</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Form Tambah Foto */}
            <form onSubmit={handleAddDokumentasi} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-black text-slate-900">Tambah Foto Kegiatan Baru</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Judul / Kegiatan</label>
                  <input
                    type="text"
                    name="judul"
                    placeholder="Contoh: Rapat Koordinasi di Kantor Gubernur"
                    required
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lokasi GPS</label>
                  <input
                    type="text"
                    name="lokasi"
                    defaultValue={kuitansi.kotaTujuan}
                    placeholder="Nama Lokasi"
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">File Foto / Kamera</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#0000B3] hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0000B3] hover:bg-[#000090] text-white text-xs font-bold rounded-xl inline-flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Simpan Foto GPS</span>
                </button>
              </div>
            </form>

            {/* List Foto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dokumentasiList.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-slate-400 text-xs">
                  Belum ada foto dokumentasi GPS yang ditambahkan.
                </div>
              ) : (
                dokumentasiList.map((d) => (
                  <div key={d.id} className="bg-white rounded-xl border border-slate-200 p-3 flex gap-3 items-start shadow-sm">
                    <img src={d.fotoUrl} alt={d.judul} className="w-20 h-20 rounded-lg object-cover border border-slate-200 shrink-0" />
                    <div className="flex-1 min-w-0 text-xs">
                      <h5 className="font-bold text-slate-900 truncate">{d.judul}</h5>
                      <p className="text-[11px] text-slate-500 truncate">{d.lokasi} · {d.tanggal}</p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
                        <MapPin className="w-3 h-3" />
                        <span>GPS Lat: 3.3256, Long: 117.6532</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteDokumentasi(d.id)}
                      className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* STEP 3: NOTA & BUKTI BAYAR */}
        {activeStep === 'bukti_bayar' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Nota & Bukti Pembayaran Riil</h3>
                <p className="text-xs text-slate-500">Catat bukti pengeluaran riil (hotel, tiket pesawat/speedboat, BBM, tol, dll).</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveStep('dokumentasi')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Foto GPS</span>
                </button>
                <button
                  onClick={() => setActiveStep('rekap')}
                  className="px-3 py-1.5 rounded-xl bg-[#0000B3] hover:bg-[#000090] text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Lanjut Rekap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Form Tambah Bukti */}
            <form onSubmit={handleAddBukti} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-black text-slate-900">Tambah Nota / Bukti Bayar</h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Vendor / Toko</label>
                  <input
                    type="text"
                    name="namaVendor"
                    placeholder="Contoh: Hotel Diamond / Loket Tiket"
                    required
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor Nota / Invoice</label>
                  <input
                    type="text"
                    name="nomorBukti"
                    placeholder="INV/001"
                    required
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    name="nominal"
                    placeholder="500000"
                    required
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Upload Bukti Nota</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#0000B3] hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0000B3] hover:bg-[#000090] text-white text-xs font-bold rounded-xl inline-flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Simpan Nota Bayar</span>
                </button>
              </div>
            </form>

            {/* List Nota */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {buktiBayarList.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-slate-400 text-xs">
                  Belum ada nota bayar yang dicatat.
                </div>
              ) : (
                buktiBayarList.map((b) => (
                  <div key={b.id} className="bg-white rounded-xl border border-slate-200 p-3 flex gap-3 items-center shadow-sm">
                    <img src={b.fotoUrl} alt={b.namaVendor} className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0" />
                    <div className="flex-1 min-w-0 text-xs">
                      <h5 className="font-bold text-slate-900 truncate">{b.namaVendor}</h5>
                      <p className="text-[11px] text-slate-500">No: {b.nomorBukti} · {b.tanggalTransaksi}</p>
                      <p className="text-xs font-black text-blue-900 mt-0.5">Rp {b.nominal.toLocaleString('id-ID')}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteBukti(b.id)}
                      className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* STEP 4: REKAP & CETAK */}
        {activeStep === 'rekap' && (
          <div className="space-y-4 text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-black text-slate-900">Berkas SPJ Siap Dicetak & Diserahkan!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Semua komponen (Kuitansi, Rincian Biaya, Foto GPS Dokumentasi, dan Nota Bayar) telah digabungkan dalam 1 kesatuan berkas resmi.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={handleSyncNotaToKuitansi}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-[#0000B3]" />
                <span>Sinkronkan Nota ke Kuitansi</span>
              </button>
              <button
                onClick={onOpenPaketLengkap}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0000B3] to-blue-700 hover:brightness-110 text-white text-xs font-black shadow-md inline-flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-cyan-300" />
                <span>Cetak Paket Lengkap SPJ (PDF)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
