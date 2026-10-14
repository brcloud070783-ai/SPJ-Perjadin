import React, { useState, useRef, useEffect } from 'react';
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
  Loader2
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

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
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
}

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  isOpen,
  onClose,
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
  onLoadProjectFromCloud
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
    if (isOpen) {
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
    }
  }, [isOpen]);

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
      showFeedback('error', err.message || 'Gagal masuk ke Google Drive.');
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

  if (!isOpen) return null;

  const filteredProjects = projects.filter(p => 
    p.namaProject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.nomorSPD && p.nomorSPD.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.kuitansi?.namaPelaksana && p.kuitansi.namaPelaksana.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.kuitansi?.kotaTujuan && p.kuitansi.kotaTujuan.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#180A30] via-[#2D0D5B] to-[#7D2AE8] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 text-cyan-300 flex items-center justify-center border border-white/20 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                Pengelola Berkas Project SPJ
              </h2>
              <p className="text-xs text-purple-200/90 font-medium">
                Penyimpanan Offline HP & Synchronized Google Drive Cloud
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Google Drive Status Bar */}
        <div className="bg-purple-900/10 border-b border-purple-100 px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs">
            <Cloud className={`w-4 h-4 ${user ? 'text-emerald-600' : 'text-slate-400'}`} />
            {user ? (
              <span className="text-slate-700 font-semibold">
                Google Drive: <strong className="text-purple-950">{user.email}</strong>
              </span>
            ) : (
              <span className="text-slate-600">
                Google Drive: <strong className="text-amber-800">Belum terhubung</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={handleSyncAllProjects}
                  disabled={isSyncing === 'all'}
                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#7D2AE8] to-[#9E52FF] text-white text-[11px] font-bold inline-flex items-center gap-1.5 shadow-2xs hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSyncing === 'all' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CloudUpload className="w-3.5 h-3.5" />
                  )}
                  <span>Cadangkan Semua ke Drive</span>
                </button>

                <button
                  onClick={handleGoogleLogout}
                  className="px-2 py-1 rounded-xl bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                  title="Keluar dari Google Drive"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoggingIn}
                className="gsi-material-button text-[11px] font-bold px-3 py-1 rounded-xl bg-white border border-slate-300 hover:border-purple-400 text-slate-800 flex items-center gap-2 shadow-2xs cursor-pointer"
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

        {/* Feedback Alert Banner */}
        {feedbackMessage && (
          <div className={`px-4 py-2 text-xs font-bold text-center border-b ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}>
            {feedbackMessage.text}
          </div>
        )}

        {/* Tab Switcher & Action Bar */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center shrink-0">
          <div className="flex bg-slate-200/80 p-1 rounded-xl gap-1">
            <button
              onClick={() => setActiveTab('local')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'local'
                  ? 'bg-white text-[#7D2AE8] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📱 File HP Lokal ({projects.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('drive');
                if (driveToken) fetchDriveList(driveToken);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'drive'
                  ? 'bg-white text-[#7D2AE8] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Cloud Google Drive {driveFiles.length > 0 && `(${driveFiles.length})`}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari SPJ..."
                className="w-full pl-8 pr-2 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#7D2AE8]"
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
              className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-[#7D2AE8] text-xs font-bold inline-flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
              title="Import Berkas SPJ dari HP (.spj)"
            >
              <Upload className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Impor .SPJ</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('local');
                setIsCreating(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#7D2AE8] to-[#9E52FF] text-white text-xs font-extrabold inline-flex items-center gap-1 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Project Baru</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {/* Create Form inline if active */}
          {isCreating && (
            <form onSubmit={handleCreateSubmit} className="bg-purple-50/80 border-2 border-dashed border-[#7D2AE8] rounded-2xl p-4 space-y-3 animate-fade-in">
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
                    Nama Project / Kegiatan *
                  </label>
                  <input
                    type="text"
                    value={newNama}
                    onChange={(e) => setNewNama(e.target.value)}
                    placeholder="Contoh: SPJ Konsultasi Nunukan - April 2026"
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
                  className="px-3 py-1.5 rounded-xl bg-white text-slate-600 font-bold text-xs border border-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#7D2AE8] text-white font-extrabold text-xs shadow-md cursor-pointer"
                >
                  Simpan & Buka Project
                </button>
              </div>
            </form>
          )}

          {/* TAB 1: LOCAL FILES */}
          {activeTab === 'local' && (
            filteredProjects.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">Tidak ada project SPJ lokal ditemukan</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Klik "Project Baru" untuk memulai draf berkas SPJ dinas Anda.
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
                    className={`rounded-2xl border p-3.5 transition-all space-y-3 ${
                      isActive
                        ? 'bg-purple-50/60 border-2 border-[#7D2AE8] shadow-md'
                        : 'bg-white border-slate-200/90 hover:border-purple-200 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {isActive && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#7D2AE8] text-white text-[10px] font-extrabold">
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
                          <div className="space-y-2 pt-1 border-t border-purple-200 my-2">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500">Nama Project</label>
                              <input
                                type="text"
                                value={editNama}
                                onChange={(e) => setEditNama(e.target.value)}
                                className="w-full px-2.5 py-1 rounded-lg bg-white border border-purple-300 text-xs font-bold text-slate-900 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500">Nomor SPD</label>
                              <input
                                type="text"
                                value={editNomorSPD}
                                onChange={(e) => setEditNomorSPD(e.target.value)}
                                className="w-full px-2.5 py-1 rounded-lg bg-white border border-purple-300 text-xs font-medium text-slate-900 focus:outline-none"
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
                              <h4 className="text-sm font-black text-slate-900 leading-snug">
                                {project.namaProject}
                              </h4>
                              {onUpdateProjectMeta && (
                                <button
                                  onClick={() => handleStartEditing(project)}
                                  className="text-slate-400 hover:text-[#7D2AE8] transition-colors p-0.5"
                                  title="Ubah Nama & SPD"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium flex-wrap mt-0.5">
                              {project.nomorSPD && (
                                <span>SPD: <strong className="text-slate-800">{project.nomorSPD}</strong></span>
                              )}
                              {project.kuitansi?.namaPelaksana && (
                                <span>Pelaksana: <strong className="text-slate-800">{project.kuitansi.namaPelaksana}</strong></span>
                              )}
                              {project.kuitansi?.kotaTujuan && (
                                <span>Tujuan: <strong className="text-slate-800">{project.kuitansi.kotaTujuan}</strong></span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 block font-medium">Nilai Kuitansi</span>
                        <span className="text-sm font-black text-[#7D2AE8]">
                          Rp {totalNilai.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    {/* Summary Indicators */}
                    <div className="flex items-center gap-3 bg-white/80 p-2 rounded-xl border border-slate-100 text-[11px] flex-wrap">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        <span>Kuitansi A4: <strong className="text-slate-800">1 Lembar</strong></span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className={`w-2 h-2 rounded-full ${totalFoto > 0 ? 'bg-rose-500' : 'bg-slate-300'}`} />
                        <span>Foto GPS: <strong className="text-slate-800">{totalFoto} Foto</strong></span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className={`w-2 h-2 rounded-full ${totalNota > 0 ? 'bg-amber-500' : 'bg-slate-300'}`} />
                        <span>Nota/Bukti: <strong className="text-slate-800">{totalNota} Nota</strong></span>
                      </div>
                    </div>

                    {/* Bottom Actions Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Status Selector */}
                        <select
                          value={project.status}
                          onChange={(e) => onUpdateStatus(project.id, e.target.value as any)}
                          className="text-[11px] font-bold bg-slate-100 border border-slate-200 text-slate-700 px-2 py-1 rounded-lg focus:outline-none"
                        >
                          <option value="draf">Draf</option>
                          <option value="selesai">Selesai/Lengkap</option>
                          <option value="terkirim">Terkirim</option>
                        </select>

                        <button
                          onClick={() => onExportProject(project)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-[#7D2AE8] text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                          title="Unduh Berkas Project (.spj)"
                        >
                          <Download className="w-3 h-3" />
                          <span>Unduh .SPJ</span>
                        </button>

                        <button
                          onClick={() => handleUploadProjectToDrive(project)}
                          disabled={isSyncing === project.id}
                          className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#7D2AE8] text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                          title="Upload / Update Ke Google Drive"
                        >
                          {isSyncing === project.id ? (
                            <Loader2 className="w-3 h-3 animate-spin text-purple-600" />
                          ) : (
                            <CloudUpload className="w-3 h-3 text-purple-600" />
                          )}
                          <span>Sync Drive</span>
                        </button>

                        <button
                          onClick={() => onDuplicateProject(project.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-[#7D2AE8] text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                          title="Duplikasi Project Ini"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </button>

                        {projects.length > 1 && (
                          <button
                            onClick={() => {
                              setConfirmDeleteModal({
                                isOpen: true,
                                type: 'local',
                                id: project.id,
                                name: project.namaProject
                              });
                            }}
                            className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                            title="Hapus Project Lokal"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {!isActive ? (
                        <button
                          onClick={() => {
                            onSelectProject(project.id);
                            onClose();
                          }}
                          className="px-4 py-1.5 rounded-xl bg-[#7D2AE8] hover:bg-purple-900 text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer active:scale-95"
                        >
                          Buka & Kerjakan
                        </button>
                      ) : (
                        <button
                          onClick={onClose}
                          className="px-4 py-1.5 rounded-xl bg-purple-100 text-[#7D2AE8] font-extrabold text-xs cursor-pointer hover:bg-purple-200"
                        >
                          Lanjutkan Edit
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )
          )}

          {/* TAB 2: GOOGLE DRIVE FILES */}
          {activeTab === 'drive' && (
            <div className="space-y-3">
              {!user ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 space-y-3">
                  <Cloud className="w-12 h-12 text-purple-300 mx-auto" />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800">Google Drive Belum Terhubung</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Hubungkan akun Google Anda untuk melihat, menyinkronkan, dan mencadangkan berkas SPJ secara online.
                    </p>
                  </div>
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoggingIn}
                    className="px-4 py-2 rounded-xl bg-[#7D2AE8] text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
                    <span>Masuk Dengan Google Drive</span>
                  </button>
                </div>
              ) : isLoadingDriveFiles ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 text-[#7D2AE8] animate-spin mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">Memuat berkas dari Google Drive...</p>
                </div>
              ) : driveFiles.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 space-y-3">
                  <CloudUpload className="w-10 h-10 text-slate-300 mx-auto" />
                  <div>
                    <p className="text-xs font-bold text-slate-700">Belum ada file SPJ di Google Drive</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Klik "Sync Drive" pada project lokal Anda di tab File HP untuk mencadangkannya ke Cloud.
                    </p>
                  </div>
                  <button
                    onClick={handleSyncAllProjects}
                    disabled={isSyncing === 'all'}
                    className="px-3.5 py-1.5 rounded-xl bg-[#7D2AE8] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    {isSyncing === 'all' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CloudUpload className="w-3.5 h-3.5" />}
                    <span>Cadangkan Semua Project Sekarang</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-semibold">
                    <span>Folder: Google Drive / SiDinas SPJ Backup</span>
                    <button
                      onClick={() => fetchDriveList()}
                      className="text-[#7D2AE8] hover:underline inline-flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Refresh List
                    </button>
                  </div>

                  {driveFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex items-center justify-between gap-3 hover:border-purple-200 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#7D2AE8] flex items-center justify-center shrink-0">
                          <Cloud className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-extrabold text-slate-900 truncate">
                            {file.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                            Diperbarui di Drive: {new Date(file.modifiedTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleDownloadDriveFile(file)}
                          disabled={isSyncing === file.id}
                          className="px-3 py-1.5 rounded-xl bg-[#7D2AE8] text-white text-xs font-bold inline-flex items-center gap-1 shadow-xs hover:bg-purple-900 transition-colors cursor-pointer disabled:opacity-50"
                          title="Buka & Unduh ke HP"
                        >
                          {isSyncing === file.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CloudDownload className="w-3.5 h-3.5" />
                          )}
                          <span>Buka Di HP</span>
                        </button>

                        <button
                          onClick={() => {
                            setConfirmDeleteModal({
                              isOpen: true,
                              type: 'drive',
                              id: file.id,
                              name: file.name
                            });
                          }}
                          disabled={isSyncing === file.id}
                          className="px-2 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                          title="Hapus dari Google Drive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Info */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 text-slate-500 text-[11px] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span>Semua data tersimpan aman secara offline di HP & tersinkronisasi otomatis ke Google Drive.</span>
          </div>

          <span className="font-extrabold text-slate-700 shrink-0">
            {activeTab === 'local' ? `${projects.length} Project HP` : `${driveFiles.length} File Cloud`}
          </span>
        </div>
      </div>

      {/* Explicit User Confirmation Modal for Destructive Delete */}
      {confirmDeleteModal.isOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4 animate-scale-up border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Konfirmasi Hapus File</h3>
                <p className="text-xs text-slate-500">
                  {confirmDeleteModal.type === 'local' ? 'Hapus dari memori HP' : 'Hapus dari Google Drive Cloud'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Apakah Anda yakin ingin menghapus berkas SPJ <strong>"{confirmDeleteModal.name}"</strong>? 
              {confirmDeleteModal.type === 'drive'
                ? ' File akan dihapus secara permanen dari folder Google Drive Anda.'
                : ' File lokal di HP Anda akan dihapus.'}
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setConfirmDeleteModal({ isOpen: false, type: 'local', id: '', name: '' })}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md cursor-pointer"
              >
                Ya, Hapus File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
