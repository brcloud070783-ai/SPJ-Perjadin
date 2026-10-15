import React, { useState, useEffect, useRef } from 'react';
import { 
  FolderPlus, 
  Copy, 
  Trash2, 
  Download, 
  Upload, 
  CheckCircle2, 
  X, 
  Plus, 
  Search, 
  Briefcase,
  AlertCircle,
  Check,
  Cloud,
  CloudUpload,
  CloudDownload,
  RefreshCw,
  LogOut,
  Edit3,
  ExternalLink,
  Loader2,
  HardDrive,
  ShieldCheck,
  FileCheck2,
  Receipt,
  Camera,
  CreditCard,
  Zap
} from 'lucide-react';
import { ProjectSPJ } from '../types';
import { googleSignIn, getAccessToken, logoutUser, initAuth } from '../utils/auth';
import { 
  uploadProjectToDrive, 
  listDriveSPJFiles, 
  downloadProjectFromDrive, 
  deleteProjectFromDrive, 
  DriveFileInfo 
} from '../utils/googleDrive';
import { User } from 'firebase/auth';

interface ProjectManagerViewProps {
  projects: ProjectSPJ[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateProject: (nama: string, nomorSPD: string) => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onExportProject: (project: ProjectSPJ) => void;
  onImportProject: (file: File) => void;
  onUpdateStatus: (id: string, status: ProjectSPJ['status']) => void;
  onUpdateProjectMeta?: (id: string, newNama: string, newNomorSPD: string) => void;
  onLoadProjectFromCloud?: (project: ProjectSPJ) => void;
  onGoToKuitansi?: () => void;
  onOpenUnauthorizedDomainHelp?: () => void;
}

export const ProjectManagerView: React.FC<ProjectManagerViewProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onDuplicateProject,
  onDeleteProject,
  onExportProject,
  onImportProject,
  onUpdateStatus,
  onUpdateProjectMeta,
  onLoadProjectFromCloud,
  onGoToKuitansi,
  onOpenUnauthorizedDomainHelp
}) => {
  const [activeTab, setActiveTab] = useState<'local' | 'drive'>('local');
  const [isCreating, setIsCreating] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editNama, setEditNama] = useState('');
  const [editNomorSPD, setEditNomorSPD] = useState('');
  
  const [newNama, setNewNama] = useState('');
  const [newNomorSPD, setNewNomorSPD] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Google Auth & Drive states
  const [user, setUser] = useState<User | null>(null);
  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSyncing, setIsSyncing] = useState<string | null>(null); // project id or 'all'
  const [driveFiles, setDriveFiles] = useState<DriveFileInfo[]>([]);
  const [isLoadingDriveFiles, setIsLoadingDriveFiles] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Confirmation modal state for destructive delete
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    isOpen: boolean;
    type: 'local' | 'drive';
    id: string;
    name: string;
  }>({ isOpen: false, type: 'local', id: '', name: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (u, token) => {
        setUser(u);
        setDriveToken(token);
        fetchDriveList(token);
      },
      () => {
        setUser(null);
        setDriveToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMessage({ type, text });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const fetchDriveList = async (token?: string) => {
    const tok = token || driveToken || getAccessToken();
    if (!tok) return;
    setIsLoadingDriveFiles(true);
    try {
      const files = await listDriveSPJFiles(tok);
      setDriveFiles(files);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoadingDriveFiles(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setDriveToken(result.accessToken);
        showFeedback('success', `Berhasil terhubung dengan Google Drive (${result.user.email})`);
        fetchDriveList(result.accessToken);
      }
    } catch (err: any) {
      if (err.message === 'UNAUTHORIZED_DOMAIN' || err.message?.includes('unauthorized-domain')) {
        showFeedback('error', 'Domain belum terdaftar di Firebase. Anda dapat terus menggunakan Mode Lokal tanpa login!');
        if (onOpenUnauthorizedDomainHelp) {
          onOpenUnauthorizedDomainHelp();
        }
      } else if (err.message === 'POPUP_BLOCKED') {
        showFeedback('error', 'Pop-up browser diblokir di HP/Browser. Silakan izinkan pop-up Chrome/Safari atau gunakan Mode Lokal.');
      } else if (err.message === 'POPUP_CLOSED') {
        showFeedback('error', 'Jendela login Google ditutup sebelum selesai.');
      } else {
        showFeedback('error', err.message || 'Gagal masuk ke Google Drive. Anda tetap bisa menggunakan Mode Lokal.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logoutUser();
    setUser(null);
    setDriveToken(null);
    setDriveFiles([]);
    showFeedback('success', 'Berhasil keluar dari Google Drive.');
  };

  const handleUploadProjectToDrive = async (project: ProjectSPJ) => {
    const tok = driveToken || getAccessToken();
    if (!tok) {
      handleGoogleSignIn();
      return;
    }

    setIsSyncing(project.id);
    try {
      await uploadProjectToDrive(tok, project);
      showFeedback('success', `Project "${project.namaProject}" berhasil disinkronkan ke Google Drive!`);
      fetchDriveList(tok);
    } catch (err: any) {
      showFeedback('error', err.message || 'Gagal menyinkronkan ke Google Drive.');
    } finally {
      setIsSyncing(null);
    }
  };

  const handleSyncAllProjects = async () => {
    const tok = driveToken || getAccessToken();
    if (!tok) {
      handleGoogleSignIn();
      return;
    }

    setIsSyncing('all');
    try {
      for (const p of projects) {
        await uploadProjectToDrive(tok, p);
      }
      showFeedback('success', `Seluruh ${projects.length} project berhasil dicadangkan ke Google Drive!`);
      fetchDriveList(tok);
    } catch (err: any) {
      showFeedback('error', err.message || 'Gagal mencadangkan project ke Cloud.');
    } finally {
      setIsSyncing(null);
    }
  };

  const handleDownloadDriveFile = async (fileInfo: DriveFileInfo) => {
    const tok = driveToken || getAccessToken();
    if (!tok) return;

    setIsSyncing(fileInfo.id);
    try {
      const project = await downloadProjectFromDrive(tok, fileInfo.id);
      if (onLoadProjectFromCloud) {
        onLoadProjectFromCloud(project);
        showFeedback('success', `Project "${project.namaProject}" berhasil diunduh dan dibuka di HP Anda!`);
        setActiveTab('local');
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Gagal mengunduh project dari Drive.');
    } finally {
      setIsSyncing(null);
    }
  };

  const handleConfirmDelete = async () => {
    const { type, id, name } = confirmDeleteModal;
    setConfirmDeleteModal({ isOpen: false, type: 'local', id: '', name: '' });

    if (type === 'local') {
      onDeleteProject(id);
      showFeedback('success', `Project "${name}" berhasil dihapus dari memori HP.`);
    } else if (type === 'drive') {
      const tok = driveToken || getAccessToken();
      if (!tok) return;
      setIsSyncing(id);
      try {
        await deleteProjectFromDrive(tok, id);
        showFeedback('success', `File "${name}" berhasil dihapus dari Google Drive.`);
        fetchDriveList(tok);
      } catch (err: any) {
        showFeedback('error', err.message || 'Gagal menghapus file dari Google Drive.');
      } finally {
        setIsSyncing(null);
      }
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNama.trim()) return;
    onCreateProject(newNama.trim(), newNomorSPD.trim());
    setNewNama('');
    setNewNomorSPD('');
    setIsCreating(false);
    if (onGoToKuitansi) onGoToKuitansi();
  };

  const handleStartEditing = (p: ProjectSPJ) => {
    setEditingProjectId(p.id);
    setEditNama(p.namaProject);
    setEditNomorSPD(p.nomorSPD || '');
  };

  const handleSaveEditing = (id: string) => {
    if (onUpdateProjectMeta && editNama.trim()) {
      onUpdateProjectMeta(id, editNama.trim(), editNomorSPD.trim());
    }
    setEditingProjectId(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportProject(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filteredProjects = projects.filter(p => 
    p.namaProject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.nomorSPD && p.nomorSPD.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.kuitansi?.namaPelaksana && p.kuitansi.namaPelaksana.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.kuitansi?.kotaTujuan && p.kuitansi.kotaTujuan.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4 pb-24 max-w-4xl mx-auto">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#180A30] via-[#2D0D5B] to-[#7D2AE8] text-white p-5 rounded-3xl shadow-xl border border-purple-900/50 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 text-cyan-300 flex items-center justify-center border border-white/20 shrink-0 shadow-md">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Pengelola Berkas SPJ Dinas
              </h2>
              <p className="text-xs text-purple-200/90 font-medium">
                Satu kesatuan Kuitansi A4, Foto GPS, & Nota — Tersimpan di HP & Google Drive Cloud
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!user ? (
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoggingIn}
                className="px-3.5 py-2 rounded-2xl bg-white text-slate-900 hover:bg-purple-50 font-extrabold text-xs inline-flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer disabled:opacity-60"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                ) : (
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 shrink-0">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                )}
                <span>Masuk Akun Google</span>
              </button>
            ) : null}

            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#00C4CC] to-[#0096C7] hover:brightness-110 text-slate-950 font-black text-xs inline-flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Buat SPJ Baru</span>
            </button>
          </div>
        </div>

        {/* Cloud Connection Badge inside Banner */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs">
            <Cloud className={`w-4.5 h-4.5 ${user ? 'text-emerald-400' : 'text-purple-300'}`} />
            {user ? (
              <span className="text-purple-100 font-semibold">
                Google Drive Status: <strong className="text-cyan-300">{user.email}</strong>
              </span>
            ) : (
              <span className="text-purple-200">
                Google Drive Cloud: <strong className="text-amber-300">Belum terhubung</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={handleSyncAllProjects}
                  disabled={isSyncing === 'all'}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-200 text-xs font-bold inline-flex items-center gap-1.5 border border-white/15 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSyncing === 'all' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CloudUpload className="w-3.5 h-3.5" />
                  )}
                  <span>Cadangkan Semua ke Cloud</span>
                </button>

                <button
                  onClick={handleGoogleLogout}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-purple-200 hover:text-rose-200 transition-colors cursor-pointer"
                  title="Keluar Google Drive"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoggingIn}
                className="px-3.5 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-purple-50 text-xs font-extrabold inline-flex items-center gap-2 shadow-md cursor-pointer"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                ) : (
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 shrink-0">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                )}
                <span>Hubungkan Google Drive</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Toast Banner */}
      {feedbackMessage && (
        <div className={`p-3 rounded-2xl text-xs font-extrabold text-center border shadow-xs animate-fade-in ${
          feedbackMessage.type === 'success'
            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
            : 'bg-rose-50 text-rose-900 border-rose-300'
        }`}>
          {feedbackMessage.text}
        </div>
      )}

      {/* Action Controls & Tab Switcher */}
      <div className="bg-white p-3.5 rounded-2xl border border-purple-100 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('local')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'local'
                ? 'bg-[#7D2AE8] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 font-bold'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>File HP Lokal ({projects.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('drive');
              if (driveToken) fetchDriveList(driveToken);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'drive'
                ? 'bg-[#7D2AE8] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 font-bold'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Cloud Google Drive {driveFiles.length > 0 && `(${driveFiles.length})`}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari SPJ atau NIP..."
              className="w-full pl-8 pr-2 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#7D2AE8]"
            />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".spj,.json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7D2AE8] border border-purple-200 text-xs font-extrabold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Import Berkas SPJ dari Perangkat (.spj)"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Impor .SPJ</span>
          </button>
        </div>
      </div>

      {/* Create Form inline if active */}
      {isCreating && (
        <form onSubmit={handleCreateSubmit} className="bg-purple-50/90 border-2 border-dashed border-[#7D2AE8] rounded-2xl p-4 sm:p-5 space-y-3 animate-fade-in shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-[#7D2AE8] uppercase tracking-wider flex items-center gap-1.5">
              <FolderPlus className="w-4 h-4" />
              Buat Berkas SPJ Project Baru
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Nama Project / Kegiatan Dinas *
              </label>
              <input
                type="text"
                value={newNama}
                onChange={(e) => setNewNama(e.target.value)}
                placeholder="Contoh: SPJ Perjalanan Dinas Nunukan - April 2026"
                required
                className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 text-xs font-medium focus:ring-2 focus:ring-[#7D2AE8] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Nomor SPD / Surat Tugas
              </label>
              <input
                type="text"
                value={newNomorSPD}
                onChange={(e) => setNewNomorSPD(e.target.value)}
                placeholder="Contoh: 090/123/SPD/2026"
                className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 text-xs font-medium focus:ring-2 focus:ring-[#7D2AE8] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3.5 py-1.5 rounded-xl bg-white text-slate-600 font-bold text-xs border border-slate-200 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-[#7D2AE8] text-white font-extrabold text-xs shadow-md cursor-pointer"
            >
              Simpan & Langsung Buka
            </button>
          </div>
        </form>
      )}

      {/* TAB 1: LOCAL FILES */}
      {activeTab === 'local' && (
        <div className="space-y-3">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 p-6 shadow-xs">
              <Briefcase className="w-12 h-12 text-purple-300 mx-auto mb-2" />
              <p className="text-sm font-extrabold text-slate-700">Tidak ada project SPJ ditemukan</p>
              <p className="text-xs text-slate-500 mt-1">
                Klik "Buat SPJ Baru" untuk memulai berkas perjalanan dinas Anda.
              </p>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const isActive = project.id === activeProjectId;
              const isEditingThis = editingProjectId === project.id;
              const totalNilai = project.kuitansi?.totalBiaya || 0;
              const totalFoto = project.dokumentasiList?.length || 0;
              const totalNota = project.buktiBayarList?.length || 0;

              return (
                <div
                  key={project.id}
                  className={`rounded-2xl border p-4 transition-all space-y-3 ${
                    isActive
                      ? 'bg-purple-50/80 border-2 border-[#7D2AE8] shadow-md'
                      : 'bg-white border-slate-200 hover:border-purple-200 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isActive && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#7D2AE8] text-white text-[10px] font-black">
                            <Check className="w-3 h-3 stroke-[3]" /> SEDANG AKTIF
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          project.status === 'selesai'
                            ? 'bg-emerald-100 text-emerald-800'
                            : project.status === 'terkirim'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {project.status === 'selesai' ? 'Selesai / Lengkap' : project.status === 'terkirim' ? 'Terkirim Ke Keuangan' : 'Draf SPJ'}
                        </span>

                        <span className="text-[10px] text-slate-400 font-medium">
                          Diperbarui: {new Date(project.updatedTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      {/* Editable Name / SPD */}
                      {isEditingThis ? (
                        <div className="space-y-2 pt-2 border-t border-purple-200 my-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500">Nama Project</label>
                            <input
                              type="text"
                              value={editNama}
                              onChange={(e) => setEditNama(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-purple-300 text-xs font-bold text-slate-900 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500">Nomor SPD</label>
                            <input
                              type="text"
                              value={editNomorSPD}
                              onChange={(e) => setEditNomorSPD(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-purple-300 text-xs font-medium text-slate-900 focus:outline-none"
                            />
                          </div>
                          <div className="flex justify-end gap-1.5 pt-1">
                            <button
                              onClick={() => setEditingProjectId(null)}
                              className="px-2 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-800"
                            >
                              Batal
                            </button>
                            <button
                              onClick={() => handleSaveEditing(project.id)}
                              className="px-3 py-1 text-[11px] font-bold bg-[#7D2AE8] text-white rounded-lg"
                            >
                              Simpan Perubahan
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-extrabold text-slate-900">
                              {project.namaProject}
                            </h3>
                            <button
                              onClick={() => handleStartEditing(project)}
                              className="text-slate-400 hover:text-purple-600 p-0.5 cursor-pointer"
                              title="Edit nama project & SPD"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            No. SPD: <strong className="text-slate-700">{project.nomorSPD || '-'}</strong> • Pelaksana: <strong>{project.kuitansi?.namaPelaksana || 'Draf'}</strong>
                          </p>
                        </div>
                      )}
                    </div>

                    {!isActive && (
                      <button
                        onClick={() => {
                          onSelectProject(project.id);
                          if (onGoToKuitansi) onGoToKuitansi();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-[#7D2AE8] text-white font-extrabold text-xs shadow-xs cursor-pointer shrink-0"
                      >
                        Buka Project
                      </button>
                    )}
                  </div>

                  {/* Summary Badges */}
                  <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-white border border-purple-100 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 text-purple-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block leading-none">Total Kuitansi</span>
                        <span className="font-extrabold text-slate-900 text-xs">Rp {totalNilai.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-rose-500 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block leading-none">Foto GPS</span>
                        <span className="font-extrabold text-slate-900 text-xs">{totalFoto} Terlampir</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block leading-none">Nota Bayar</span>
                        <span className="font-extrabold text-slate-900 text-xs">{totalNota} Terlampir</span>
                      </div>
                    </div>
                  </div>

                  {/* Toolbar Actions */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400">Status:</span>
                      <select
                        value={project.status}
                        onChange={(e) => onUpdateStatus(project.id, e.target.value as any)}
                        className="bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-extrabold rounded-lg px-2 py-1 focus:outline-none"
                      >
                        <option value="draf">Draf</option>
                        <option value="selesai">Selesai</option>
                        <option value="terkirim">Terkirim</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => handleUploadProjectToDrive(project)}
                        disabled={isSyncing === project.id}
                        className="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        title="Unggah/Sinkronkan ke Google Drive"
                      >
                        {isSyncing === project.id ? (
                          <Loader2 className="w-3 h-3 animate-spin text-cyan-700" />
                        ) : (
                          <CloudUpload className="w-3 h-3 text-cyan-700" />
                        )}
                        <span>Sync Drive</span>
                      </button>

                      <button
                        onClick={() => onDuplicateProject(project.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer"
                        title="Duplikasi Project Ini"
                      >
                        <Copy className="w-3 h-3 text-slate-600" />
                        <span>Duplikasi</span>
                      </button>

                      <button
                        onClick={() => onExportProject(project)}
                        className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#7D2AE8] text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer"
                        title="Ekspor bundel file .SPJ"
                      >
                        <Download className="w-3 h-3 text-purple-600" />
                        <span>Ekspor .SPJ</span>
                      </button>

                      <button
                        onClick={() => setConfirmDeleteModal({
                          isOpen: true,
                          type: 'local',
                          id: project.id,
                          name: project.namaProject
                        })}
                        className="p-1 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Hapus Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: DRIVE FILES */}
      {activeTab === 'drive' && (
        <div className="space-y-3">
          {!user ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-purple-200 p-6 space-y-3 shadow-xs">
              <Cloud className="w-12 h-12 text-purple-400 mx-auto" />
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Google Drive Belum Terhubung</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Hubungkan akun Google Anda untuk melihat, mengunduh, atau mencadangkan seluruh berkas SPJ secara otomatis di cloud Google Drive.
                </p>
              </div>
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoggingIn}
                className="px-5 py-2 rounded-xl bg-[#7D2AE8] hover:bg-purple-800 text-white font-extrabold text-xs inline-flex items-center gap-2 shadow-md cursor-pointer"
              >
                {isLoggingIn && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Hubungkan Google Drive Sekarang</span>
              </button>
            </div>
          ) : isLoadingDriveFiles ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
              <Loader2 className="w-8 h-8 text-[#7D2AE8] animate-spin mx-auto" />
              <p className="text-xs font-extrabold text-slate-700">Memuat berkas dari Google Drive...</p>
            </div>
          ) : driveFiles.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200 p-6 space-y-2">
              <Cloud className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">Belum ada file SPJ di Google Drive Anda</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Buka tab "File HP Lokal" lalu klik "Sync Drive" pada project yang ingin Anda cadangkan secara online.
              </p>
            </div>
          ) : (
            driveFiles.map((file) => (
              <div
                key={file.id}
                className="bg-white rounded-2xl border border-purple-100 p-4 flex items-center justify-between gap-3 hover:shadow-xs transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7D2AE8] flex items-center justify-center shrink-0">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-900 truncate">
                      {file.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Terakhir Diubah: {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDownloadDriveFile(file)}
                    disabled={isSyncing === file.id}
                    className="px-3 py-1.5 rounded-xl bg-[#7D2AE8] hover:bg-purple-800 text-white font-extrabold text-xs inline-flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSyncing === file.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CloudDownload className="w-3.5 h-3.5" />
                    )}
                    <span>Unduh Ke HP</span>
                  </button>

                  <button
                    onClick={() => setConfirmDeleteModal({
                      isOpen: true,
                      type: 'drive',
                      id: file.id,
                      name: file.name
                    })}
                    className="p-1.5 rounded-xl hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Hapus dari Google Drive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      {confirmDeleteModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl border border-rose-100 space-y-4 animate-scale-up">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Konfirmasi Hapus</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {confirmDeleteModal.type === 'local' ? 'Hapus dari memori HP lokal' : 'Hapus dari Google Drive cloud'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-700 font-medium bg-slate-50 p-3 rounded-2xl border border-slate-200">
              Apakah Anda yakin ingin menghapus <strong>"{confirmDeleteModal.name}"</strong>? Data yang dihapus tidak dapat dikembalikan.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmDeleteModal({ isOpen: false, type: 'local', id: '', name: '' })}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md cursor-pointer"
              >
                Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
