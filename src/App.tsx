import React, { useState, useEffect } from 'react';
import { TabType, KuitansiData, FotoDokumentasi, BuktiBayar, RincianBiaya, ProjectSPJ } from './types';
import { initialKuitansi, initialDokumentasi, initialBuktiBayar } from './utils/initialData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { KuitansiForm } from './components/KuitansiForm';
import { KuitansiPreview } from './components/KuitansiPreview';
import { DokumentasiForm } from './components/DokumentasiForm';
import { DokumentasiPrintPreview } from './components/DokumentasiPrintPreview';
import { BuktiBayarForm } from './components/BuktiBayarForm';
import { BuktiBayarPrintPreview } from './components/BuktiBayarPrintPreview';
import { PaketLengkapPrintPreview } from './components/PaketLengkapPrintPreview';
import { ProjectManagerModal } from './components/ProjectManagerModal';
import { ProjectManagerView } from './components/ProjectManagerView';
import { DiscussionGuide } from './components/DiscussionGuide';
import { LogoDinasPage } from './components/LogoDinasPage';
import { LandingPage } from './components/LandingPage';
import { SidebarMenu } from './components/SidebarMenu';
import { OfflineIndicator } from './components/OfflineIndicator';
import { DeviceAccessGuideModal } from './components/DeviceAccessGuideModal';
import { DeploymentGuideModal } from './components/DeploymentGuideModal';
import { UnauthorizedDomainModal } from './components/UnauthorizedDomainModal';
import { GoogleLoginModal } from './components/GoogleLoginModal';
import { LinkedInLeftColumn } from './components/LinkedInLeftColumn';
import { LinkedInRightColumn } from './components/LinkedInRightColumn';
import { LinkedInComposer } from './components/LinkedInComposer';
import { initAuth } from './utils/auth';
import { User } from 'firebase/auth';
import { konversiTerbilang } from './utils/terbilang';

import { LOGO_KALTARA_SVG } from './utils/logoKaltara';

const STORAGE_KEYS = {
  PROJECTS: 'sidinas_projects_v2',
  ACTIVE_PROJECT_ID: 'sidinas_active_project_id_v2',
  LEGACY_KUITANSI: 'sidinas_kuitansi_v2',
  LEGACY_DOKUMENTASI: 'sidinas_dokumentasi_v2',
  LEGACY_BUKTI_BAYAR: 'sidinas_bukti_bayar_v2'
};

const createDefaultProject = (): ProjectSPJ => ({
  id: `spj-${Date.now()}`,
  namaProject: 'SPJ Perjalanan Dinas Utama',
  nomorSPD: initialKuitansi.nomorSPPD || '090/123/SPD/2026',
  createdTime: Date.now(),
  updatedTime: Date.now(),
  status: 'draf',
  kuitansi: initialKuitansi,
  dokumentasiList: initialDokumentasi,
  buktiBayarList: initialBuktiBayar
});

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('kuitansi');
  const [isKuitansiPreview, setIsKuitansiPreview] = useState(false);
  const [isDokumentasiPreview, setIsDokumentasiPreview] = useState(false);
  const [isBuktiBayarPreview, setIsBuktiBayarPreview] = useState(false);
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState(false);
  const [isDeviceHelpOpen, setIsDeviceHelpOpen] = useState(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);
  const [isUnauthorizedDomainOpen, setIsUnauthorizedDomainOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isGoogleLoginOpen, setIsGoogleLoginOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize Auth Listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (u) => {
        setUser(u);
      },
      () => {
        setUser(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Initialize Projects Array
  const [projects, setProjects] = useState<ProjectSPJ[]>(() => {
    try {
      const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (savedProjects) {
        const parsed: ProjectSPJ[] = JSON.parse(savedProjects);
        if (parsed.length > 0) {
          // Ensure each project has a valid logoUrl
          return parsed.map((p) => {
            const logo = p.kuitansi?.logoUrl;
            if (!logo) {
              return {
                ...p,
                kuitansi: {
                  ...p.kuitansi,
                  logoUrl: LOGO_KALTARA_SVG
                }
              };
            }
            return p;
          });
        }
      }

      // Check legacy single-project data for seamless migration
      const legacyKuitansi = localStorage.getItem(STORAGE_KEYS.LEGACY_KUITANSI);
      const legacyDokumentasi = localStorage.getItem(STORAGE_KEYS.LEGACY_DOKUMENTASI);
      const legacyBukti = localStorage.getItem(STORAGE_KEYS.LEGACY_BUKTI_BAYAR);

      if (legacyKuitansi || legacyDokumentasi || legacyBukti) {
        const kData = legacyKuitansi ? { ...initialKuitansi, ...JSON.parse(legacyKuitansi) } : initialKuitansi;
        const dData = legacyDokumentasi ? JSON.parse(legacyDokumentasi).filter((item: any) => !item.fotoUrl?.includes('data:image/svg')) : initialDokumentasi;
        const bData = legacyBukti ? JSON.parse(legacyBukti).filter((item: any) => !item.fotoUrl?.includes('data:image/svg')) : initialBuktiBayar;

        const migratedProject: ProjectSPJ = {
          id: `spj-migrated-${Date.now()}`,
          namaProject: kData.maksudPerjalanan ? `SPJ - ${kData.maksudPerjalanan.slice(0, 30)}...` : 'SPJ Perjalanan Dinas Utama',
          nomorSPD: kData.nomorSPPD || '090/123/SPD/2026',
          createdTime: Date.now(),
          updatedTime: Date.now(),
          status: 'draf',
          kuitansi: kData,
          dokumentasiList: dData,
          buktiBayarList: bData
        };

        return [migratedProject];
      }

      return [createDefaultProject()];
    } catch {
      return [createDefaultProject()];
    }
  });

  // Initialize Active Project ID
  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    try {
      const savedActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT_ID);
      if (savedActiveId && projects.some(p => p.id === savedActiveId)) {
        return savedActiveId;
      }
    } catch {
      // fallback
    }
    return projects[0]?.id || '';
  });

  // Current Active Project Object
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || createDefaultProject();

  // Active Project Sub-States
  const kuitansi = activeProject.kuitansi;
  const dokumentasiList = activeProject.dokumentasiList || [];
  const buktiBayarList = activeProject.buktiBayarList || [];

  // Persist Projects Array and Active Project ID
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, activeProjectId);
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [activeProjectId]);

  // Helper to update active project in array
  const updateActiveProject = (updater: (prev: ProjectSPJ) => ProjectSPJ) => {
    setProjects(prevProjects => 
      prevProjects.map(p => {
        if (p.id === activeProject.id) {
          const updated = updater(p);
          return { ...updated, updatedTime: Date.now() };
        }
        return p;
      })
    );
  };

  // State setters for sub-components
  const setKuitansi = (newKuitansi: KuitansiData) => {
    updateActiveProject(p => ({ ...p, kuitansi: newKuitansi }));
  };

  const setDokumentasiList = (newList: FotoDokumentasi[]) => {
    updateActiveProject(p => ({ ...p, dokumentasiList: newList }));
  };

  const setBuktiBayarList = (newList: BuktiBayar[]) => {
    updateActiveProject(p => ({ ...p, buktiBayarList: newList }));
  };

  // Project Management Actions
  const handleCreateProject = (nama: string = 'SPJ Perjalanan Dinas Baru', nomorSPD: string = '090/SPD/2026') => {
    const newProject: ProjectSPJ = {
      id: `spj-${Date.now()}`,
      namaProject: nama,
      nomorSPD: nomorSPD || '090/123/SPD/2026',
      createdTime: Date.now(),
      updatedTime: Date.now(),
      status: 'draf',
      kuitansi: {
        ...initialKuitansi,
        id: `kuitansi-${Date.now()}`,
        nomorSPPD: nomorSPD || initialKuitansi.nomorSPPD
      },
      dokumentasiList: [],
      buktiBayarList: []
    };

    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
  };

  const handleDuplicateProject = (id: string) => {
    const source = projects.find(p => p.id === id);
    if (!source) return;

    const copyProject: ProjectSPJ = {
      ...source,
      id: `spj-copy-${Date.now()}`,
      namaProject: `${source.namaProject} (Salinan)`,
      createdTime: Date.now(),
      updatedTime: Date.now(),
      status: 'draf'
    };

    setProjects(prev => [copyProject, ...prev]);
    setActiveProjectId(copyProject.id);
  };

  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) {
      alert('Tidak dapat menghapus satu-satunya project SPJ. Silakan buat project baru terlebih dahulu.');
      return;
    }

    const remaining = projects.filter(p => p.id !== id);
    setProjects(remaining);
    if (activeProjectId === id) {
      setActiveProjectId(remaining[0].id);
    }
  };

  const handleExportProject = (project: ProjectSPJ) => {
    try {
      const jsonStr = JSON.stringify(project, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeName = project.namaProject.replace(/[^a-zA-Z0-9]/g, '_');
      a.href = url;
      a.download = `Berkas_SPJ_${safeName}.spj`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Gagal mengekspor berkas .SPJ');
    }
  };

  const handleImportProject = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported: ProjectSPJ = JSON.parse(content);

        if (!imported.kuitansi || !Array.isArray(imported.dokumentasiList)) {
          throw new Error('Format berkas .SPJ tidak valid');
        }

        const newProject: ProjectSPJ = {
          ...imported,
          id: `spj-imported-${Date.now()}`,
          namaProject: imported.namaProject ? `${imported.namaProject} (Hasil Impor)` : 'SPJ Hasil Impor',
          updatedTime: Date.now()
        };

        setProjects(prev => [newProject, ...prev]);
        setActiveProjectId(newProject.id);
        alert(`Berhasil mengimpor project "${newProject.namaProject}"!`);
      } catch (err) {
        alert('Gagal membaca berkas .SPJ. Pastikan file dalam format JSON/SPJ yang valid.');
      }
    };
    reader.readAsText(file);
  };

  const handleUpdateStatus = (id: string, status: ProjectSPJ['status']) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status, updatedTime: Date.now() } : p));
  };

  const handleUpdateProjectMeta = (id: string, newNama: string, newNomorSPD: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          namaProject: newNama,
          nomorSPD: newNomorSPD,
          updatedTime: Date.now()
        };
      }
      return p;
    }));
  };

  const handleLoadProjectFromCloud = (cloudProject: ProjectSPJ) => {
    setProjects(prev => {
      const existingIdx = prev.findIndex(p => p.id === cloudProject.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = cloudProject;
        return updated;
      }
      return [cloudProject, ...prev];
    });
    setActiveProjectId(cloudProject.id);
  };

  const handleResetData = () => {
    updateActiveProject(p => ({
      ...p,
      kuitansi: initialKuitansi,
      dokumentasiList: [],
      buktiBayarList: []
    }));
    setIsKuitansiPreview(false);
  };

  // Sync Bukti Bayar into Kuitansi
  const handleSyncBuktiToKuitansi = () => {
    if (buktiBayarList.length === 0) {
      alert('Belum ada bukti pembayaran yang diupload.');
      return;
    }

    const itemsFromBukti: RincianBiaya[] = buktiBayarList.map((b, idx) => ({
      id: `rb-sync-${idx}-${Date.now()}`,
      uraian: `${b.namaVendor} (${b.nomorBukti}) - ${b.keterangan || 'Pengeluaran Riil'}`,
      kategori: (b.kategori === 'tiket' ? 'transport' : b.kategori === 'hotel' ? 'penginapan' : 'lainnya') as RincianBiaya['kategori'],
      volume: 1,
      satuan: 'Bukti',
      hargaSatuan: b.nominal,
      total: b.nominal
    }));

    const uangHarian = kuitansi.rincianBiaya.find((r) => r.kategori === 'uang_harian');
    const newRincian = uangHarian ? [uangHarian, ...itemsFromBukti] : itemsFromBukti;
    const totalSemua = newRincian.reduce((acc, curr) => acc + (curr.total || 0), 0);

    setKuitansi({
      ...kuitansi,
      rincianBiaya: newRincian,
      totalBiaya: totalSemua,
      terbilang: konversiTerbilang(totalSemua)
    });

    setActiveTab('kuitansi');
    setIsKuitansiPreview(false);
    alert(`Berhasil menyinkronkan ${buktiBayarList.length} bukti bayar ke rincian kuitansi!`);
  };

  const handleAddDokumentasi = (item: FotoDokumentasi) => {
    setDokumentasiList([item, ...dokumentasiList]);
  };

  const handleDeleteDokumentasi = (id: string) => {
    if (window.confirm('Hapus foto dokumentasi ini?')) {
      setDokumentasiList(dokumentasiList.filter((d) => d.id !== id));
    }
  };

  const handleAddBuktiBayar = (item: BuktiBayar) => {
    setBuktiBayarList([item, ...buktiBayarList]);
  };

  const handleDeleteBuktiBayar = (id: string) => {
    if (window.confirm('Hapus bukti pembayaran ini?')) {
      setBuktiBayarList(buktiBayarList.filter((b) => b.id !== id));
    }
  };

  const handleUpdateAllProjectsLogo = (logoUrl: string) => {
    setProjects(prevProjects =>
      prevProjects.map(p => ({
        ...p,
        kuitansi: {
          ...p.kuitansi,
          logoUrl
        },
        updatedTime: Date.now()
      }))
    );
  };

  const isPreviewMode = isKuitansiPreview || isDokumentasiPreview || isBuktiBayarPreview || activeTab === 'paket_lengkap';

  const handleNavigateToTab = (tab: TabType) => {
    setActiveTab(tab);
    setIsKuitansiPreview(false);
    setIsDokumentasiPreview(false);
    setIsBuktiBayarPreview(false);
  };

  return (
    <div className="min-h-screen bg-[#F3F2EF] text-slate-800 font-sans selection:bg-[#0000B3] selection:text-white">
      {/* LinkedIn-style Topbar */}
      <Header
        activeTab={activeTab}
        kuitansi={kuitansi}
        activeProject={activeProject}
        projects={projects}
        totalDokumentasi={dokumentasiList.length}
        totalBuktiBayar={buktiBayarList.length}
        onResetData={handleResetData}
        onGoToLanding={() => handleNavigateToTab('landing')}
        onQuickPreview={() => {
          setActiveTab('kuitansi');
          setIsKuitansiPreview(true);
        }}
        onOpenProjectManager={() => setIsProjectManagerOpen(true)}
        onOpenPaketLengkap={() => handleNavigateToTab('paket_lengkap')}
        onOpenLogoDinas={() => handleNavigateToTab('logo_dinas')}
        onOpenDeviceHelp={() => setIsDeviceHelpOpen(true)}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
        user={user}
        onOpenGoogleLogin={() => setIsGoogleLoginOpen(true)}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onSelectProject={(id) => setActiveProjectId(id)}
        onNavigateTab={handleNavigateToTab}
      />

      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeProject={activeProject}
        user={user}
        onResetData={handleResetData}
        onOpenGoogleLogin={() => setIsGoogleLoginOpen(true)}
        onOpenProjectManager={() => setIsProjectManagerOpen(true)}
        onOpenLogoDinas={() => handleNavigateToTab('logo_dinas')}
        onOpenDeviceHelp={() => setIsDeviceHelpOpen(true)}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
        onExportProject={() => handleExportProject(activeProject)}
        onImportProject={handleImportProject}
        onNavigateToTab={handleNavigateToTab}
      />

      {/* Main Container: Full Preview Mode vs LinkedIn 3-Column Layout */}
      {isPreviewMode ? (
        <main className="max-w-4xl mx-auto px-3 sm:px-4 pt-4 pb-28">
          {activeTab === 'kuitansi' && isKuitansiPreview && (
            <KuitansiPreview
              data={kuitansi}
              onBack={() => setIsKuitansiPreview(false)}
            />
          )}

          {activeTab === 'dokumentasi' && isDokumentasiPreview && (
            <DokumentasiPrintPreview
              kuitansi={kuitansi}
              list={dokumentasiList}
              onBack={() => setIsDokumentasiPreview(false)}
            />
          )}

          {activeTab === 'bukti_bayar' && isBuktiBayarPreview && (
            <BuktiBayarPrintPreview
              kuitansi={kuitansi}
              list={buktiBayarList}
              onBack={() => setIsBuktiBayarPreview(false)}
            />
          )}

          {activeTab === 'paket_lengkap' && (
            <PaketLengkapPrintPreview
              project={activeProject}
              onBack={() => handleNavigateToTab('kuitansi')}
            />
          )}
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* 1. LEFT COLUMN (25% on desktop): Profil ASN, SBM 2025, Berkas Cepat */}
            <div className="hidden lg:block lg:col-span-3 sticky top-18">
              <LinkedInLeftColumn
                kuitansi={kuitansi}
                activeProject={activeProject}
                projects={projects}
                activeTab={activeTab}
                onNavigateTab={handleNavigateToTab}
                onSelectProject={(id) => setActiveProjectId(id)}
                onCreateProject={handleCreateProject}
                onOpenProjectManager={() => setIsProjectManagerOpen(true)}
                onOpenLogoDinas={() => handleNavigateToTab('logo_dinas')}
              />
            </div>

            {/* 2. CENTER COLUMN (50% on desktop, full on mobile): Composer & Main Form View */}
            <div className="lg:col-span-6 w-full min-w-0 space-y-4">
              {/* Quick Composer ala LinkedIn "Start a post" */}
              <LinkedInComposer
                kuitansi={kuitansi}
                activeProject={activeProject}
                activeTab={activeTab}
                onNavigateTab={handleNavigateToTab}
                onCreateNewProject={handleCreateProject}
                totalDokumentasi={dokumentasiList.length}
                totalBuktiBayar={buktiBayarList.length}
              />

              {/* View Content Card */}
              {activeTab === 'landing' && (
                <LandingPage
                  onStartApp={(t) => handleNavigateToTab(t || 'kuitansi')}
                  kuitansi={kuitansi}
                  dokumentasiList={dokumentasiList}
                  buktiBayarList={buktiBayarList}
                  activeProject={activeProject}
                  projects={projects}
                  onOpenProjectManager={() => setIsProjectManagerOpen(true)}
                />
              )}

              {activeTab === 'berkas' && (
                <ProjectManagerView
                  projects={projects}
                  activeProjectId={activeProjectId}
                  onSelectProject={(id) => setActiveProjectId(id)}
                  onCreateProject={handleCreateProject}
                  onDuplicateProject={handleDuplicateProject}
                  onDeleteProject={handleDeleteProject}
                  onExportProject={handleExportProject}
                  onImportProject={handleImportProject}
                  onUpdateStatus={handleUpdateStatus}
                  onUpdateProjectMeta={handleUpdateProjectMeta}
                  onLoadProjectFromCloud={handleLoadProjectFromCloud}
                  onGoToKuitansi={() => handleNavigateToTab('kuitansi')}
                  onOpenUnauthorizedDomainHelp={() => setIsUnauthorizedDomainOpen(true)}
                />
              )}

              {activeTab === 'kuitansi' && (
                <KuitansiForm
                  data={kuitansi}
                  onChange={setKuitansi}
                  onPreview={() => setIsKuitansiPreview(true)}
                  onNextStep={() => handleNavigateToTab('dokumentasi')}
                  buktiBayarList={buktiBayarList}
                  onOpenLogoDinas={() => handleNavigateToTab('logo_dinas')}
                  onGoToLanding={() => handleNavigateToTab('landing')}
                />
              )}

              {activeTab === 'dokumentasi' && (
                <DokumentasiForm
                  list={dokumentasiList}
                  onAdd={handleAddDokumentasi}
                  onDelete={handleDeleteDokumentasi}
                  onOpenPrintPreview={() => setIsDokumentasiPreview(true)}
                  onPrevStep={() => handleNavigateToTab('kuitansi')}
                  onNextStep={() => handleNavigateToTab('bukti_bayar')}
                />
              )}

              {activeTab === 'bukti_bayar' && (
                <BuktiBayarForm
                  list={buktiBayarList}
                  onAdd={handleAddBuktiBayar}
                  onDelete={handleDeleteBuktiBayar}
                  onSyncToKuitansi={handleSyncBuktiToKuitansi}
                  onOpenPrintPreview={() => setIsBuktiBayarPreview(true)}
                  onPrevStep={() => handleNavigateToTab('dokumentasi')}
                  onCompleteWizard={() => handleNavigateToTab('paket_lengkap')}
                />
              )}

              {activeTab === 'logo_dinas' && (
                <LogoDinasPage
                  kuitansi={kuitansi}
                  activeProject={activeProject}
                  onUpdateKuitansi={setKuitansi}
                  onUpdateAllProjectsLogo={handleUpdateAllProjectsLogo}
                  onNavigateToTab={handleNavigateToTab}
                />
              )}

              {activeTab === 'diskusi' && (
                <DiscussionGuide
                  onGoToKuitansi={() => handleNavigateToTab('kuitansi')}
                  onGoToDokumentasi={() => handleNavigateToTab('dokumentasi')}
                  onGoToBuktiBayar={() => handleNavigateToTab('bukti_bayar')}
                />
              )}
            </div>

            {/* 3. RIGHT COLUMN (25% on desktop): Audit Kepatuhan, Cetak Utama, Dasar Hukum */}
            <div className="hidden lg:block lg:col-span-3 sticky top-18">
              <LinkedInRightColumn
                kuitansi={kuitansi}
                dokumentasiList={dokumentasiList}
                buktiBayarList={buktiBayarList}
                activeProject={activeProject}
                onNavigateTab={handleNavigateToTab}
                onOpenPaketLengkap={() => handleNavigateToTab('paket_lengkap')}
                onQuickPreviewKuitansi={() => {
                  setActiveTab('kuitansi');
                  setIsKuitansiPreview(true);
                }}
                onOpenDeviceHelp={() => setIsDeviceHelpOpen(true)}
                onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
              />
            </div>

          </div>
        </main>
      )}

      {/* Project Manager Modal */}
      <ProjectManagerModal
        isOpen={isProjectManagerOpen}
        onClose={() => setIsProjectManagerOpen(false)}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={(id) => setActiveProjectId(id)}
        onCreateProject={handleCreateProject}
        onDuplicateProject={handleDuplicateProject}
        onDeleteProject={handleDeleteProject}
        onExportProject={handleExportProject}
        onImportProject={handleImportProject}
        onUpdateStatus={handleUpdateStatus}
        onUpdateProjectMeta={handleUpdateProjectMeta}
        onLoadProjectFromCloud={handleLoadProjectFromCloud}
      />

      {/* Bottom Thumb Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(t) => {
          setActiveTab(t);
          if (t === 'kuitansi') {
            setIsKuitansiPreview(false);
          }
          if (t === 'dokumentasi') {
            setIsDokumentasiPreview(false);
          }
          if (t === 'bukti_bayar') {
            setIsBuktiBayarPreview(false);
          }
        }}
        countProjects={projects.length}
        countDokumentasi={dokumentasiList.length}
        countBuktiBayar={buktiBayarList.length}
      />

      {/* Device Access Guide / 403 Error Help Modal */}
      <DeviceAccessGuideModal
        isOpen={isDeviceHelpOpen}
        onClose={() => setIsDeviceHelpOpen(false)}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
      />

      {/* Deployment Guide Modal */}
      <DeploymentGuideModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
      />

      {/* Unauthorized Domain Error Modal */}
      <UnauthorizedDomainModal
        isOpen={isUnauthorizedDomainOpen}
        onClose={() => setIsUnauthorizedDomainOpen(false)}
      />

      {/* Google Login Direct Modal */}
      <GoogleLoginModal
        isOpen={isGoogleLoginOpen}
        onClose={() => setIsGoogleLoginOpen(false)}
        user={user}
        onLoginSuccess={(u) => {
          setUser(u);
        }}
        onOpenUnauthorizedDomainHelp={() => setIsUnauthorizedDomainOpen(true)}
      />

      {/* PWA Offline Banner */}
      <OfflineIndicator />
    </div>
  );
}
