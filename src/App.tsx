import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  TrendingUp, 
  HeartHandshake, 
  Users, 
  Layers, 
  FileCheck, 
  ShieldCheck, 
  Cpu, 
  HelpCircle,
  LogOut,
  FolderLock,
  Compass,
  AlertTriangle,
  BadgeInfo,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Lock,
  Unlock,
  Key
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import Penghimpunan from './components/Penghimpunan';
import Mustahik from './components/Mustahik';
import Penyaluran from './components/Penyaluran';
import Laporan from './components/Laporan';
import AsistenCerdas from './components/AsistenCerdas';
import ProfilLembaga from './components/ProfilLembaga';
import { SetoranDana, MustahikProfile, PenyaluranDana, UserRole, UserProfile } from './types';
import { 
  initializeDefaultRoleCodes, 
  subscribeSetoran, 
  subscribeMustahik, 
  subscribePenyaluran, 
  subscribeRoleCodes, 
  dbAddSetoran, 
  dbUpdateSetoran, 
  dbDeleteSetoran, 
  dbAddMustahik, 
  dbUpdateMustahik, 
  dbDeleteMustahik, 
  dbAddPenyaluran, 
  dbUpdatePenyaluran, 
  dbDeletePenyaluran, 
  dbUpdateRoleCodes,
  onAuthReady
} from './firebase';

// INITIAL SEED DATA FOR FIRST VISIT (Starts completely empty as requested so no non-inputted data is present)
const INITIAL_SETORAN: SetoranDana[] = [];
const INITIAL_MUSTAHIK: MustahikProfile[] = [];
const INITIAL_PENYALURAN: PenyaluranDana[] = [];

const ROLE_CODES = {
  'YYSN88': {
    role: 'admin_yayasan' as UserRole,
    username: 'amil_yayasan',
    fullName: 'Holid Assad, S.Pd',
    email: 'admin.aljihad@gmail.com',
    label: 'Admin Yayasan'
  },
  'KETUA12': {
    role: 'ketua_laz' as UserRole,
    username: 'amil_ketua',
    fullName: 'Reni Nurhayani, M.Pd.',
    email: 'ketua.aljihad@gmail.com',
    label: 'Ketua LAZ'
  },
  'BENDA99': {
    role: 'bendahara' as UserRole,
    username: 'amil_bendahara',
    fullName: 'Rahmi Rahmawati',
    email: 'bendahara.aljihad@gmail.com',
    label: 'Bendahara LAZ'
  },
  'SEKRE77': {
    role: 'sekretaris' as UserRole,
    username: 'amil_sekretaris',
    fullName: 'Siti Khalimah, S.Pd',
    email: 'sekretaris.aljihad@gmail.com',
    label: 'Sekretaris'
  },
  'LAPNG55': {
    role: 'bidang_lapangan' as UserRole,
    username: 'amil_lapangan',
    fullName: 'Fahmi Siddiq',
    email: 'lapangan.aljihad@gmail.com',
    label: 'Tim Lapangan'
  }
};

const TAB_VISIBILITY: Record<UserRole, string[]> = {
  admin_yayasan: ['dashboard', 'laporan', 'profil', 'bantuan'],
  ketua_laz: ['dashboard', 'penghimpunan', 'mustahik', 'penyaluran', 'laporan', 'profil', 'bantuan'],
  bendahara: ['dashboard', 'penghimpunan', 'penyaluran', 'laporan', 'profil', 'bantuan'],
  sekretaris: ['dashboard', 'penghimpunan', 'mustahik', 'laporan', 'profil', 'bantuan'],
  bidang_lapangan: ['dashboard', 'penyaluran', 'laporan', 'profil', 'bantuan'],
  donatur: ['dashboard', 'penghimpunan', 'laporan', 'profil', 'bantuan'],
};

export default function App() {
  const [activeTab, setActiveTab ] = useState<string>('dashboard');
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('laz_aljihad_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      username: 'umum_donatur',
      fullName: 'Masyarakat / Donatur Umum',
      role: 'donatur',
      email: 'mdtaljihad2026@gmail.com'
    };
  });

  const [roleCodes, setRoleCodes] = useState<Record<string, { role: UserRole; username: string; fullName: string; email: string; label: string }>>({ ...ROLE_CODES });

  // State Dialog Login Pengurus
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginCodeInput, setLoginCodeInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [showPinGuide, setShowPinGuide] = useState(false);

  // Auto-redirect jika tab tersimpan tidak diperbolehkan untuk peran saat ini
  useEffect(() => {
    const allowed = TAB_VISIBILITY[currentUser.role] || ['dashboard', 'profil'];
    if (!allowed.includes(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [currentUser.role, activeTab]);

  // State Keuangan & Data Utama
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [setoranList, setSetoranList] = useState<SetoranDana[]>([]);
  const [mustahikList, setMustahikList] = useState<MustahikProfile[]>([]);
  const [penyaluranList, setPenyaluranList] = useState<PenyaluranDana[]>([]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubAuth = onAuthReady(() => {
      setIsAuthReady(true);
    });
    return () => {
      unsubAuth();
    };
  }, []);

  // Synchronize with Firebase Real-time Firestore
  useEffect(() => {
    if (!isAuthReady) return;

    // 1. Initialize default role codes in Firestore once if they are missing
    initializeDefaultRoleCodes(ROLE_CODES);

    // 2. Subscribe to roleCodes changes
    const unsubRoleCodes = subscribeRoleCodes((newCodes) => {
      if (newCodes && Object.keys(newCodes).length > 0) {
        setRoleCodes(newCodes as any);
      }
    });

    // 3. Subscribe to setoran changes
    const unsubSetoran = subscribeSetoran((data) => {
      setSetoranList(data);
    });

    // 4. Subscribe to mustahik changes
    const unsubMustahik = subscribeMustahik((data) => {
      setMustahikList(data);
    });

    // 5. Subscribe to penyaluran changes
    const unsubPenyaluran = subscribePenyaluran((data) => {
      setPenyaluranList(data);
    });

    return () => {
      unsubRoleCodes();
      unsubSetoran();
      unsubMustahik();
      unsubPenyaluran();
    };
  }, [isAuthReady]);

  // Actions handlers connected to Cloud Firestore (Realtime Synchronized)
  const handleAddSetoran = (newSetoran: SetoranDana) => {
    dbAddSetoran(newSetoran).catch(err => console.error("Error adding setoran to Firestore:", err));
  };

  const handleUpdateSetoran = (updatedSetoran: SetoranDana) => {
    dbUpdateSetoran(updatedSetoran).catch(err => console.error("Error updating setoran in Firestore:", err));
  };

  const handleDeleteSetoran = (id: string) => {
    dbDeleteSetoran(id).catch(err => console.error("Error deleting setoran from Firestore:", err));
  };

  const handleAddMustahik = (newMustahik: MustahikProfile) => {
    dbAddMustahik(newMustahik).catch(err => console.error("Error adding mustahik to Firestore:", err));
  };

  const handleVerifyMustahik = (id: string, status: 'Belum Diperiksa' | 'Layak' | 'Tidak Layak', catatan: string) => {
    const found = mustahikList.find(m => m.id === id);
    if (!found) return;

    const updated: MustahikProfile = {
      ...found,
      statusVerifikasi: status,
      catatanVerifikasi: catatan,
      tanggalVerifikasi: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    dbUpdateMustahik(updated).catch(err => console.error("Error verifying mustahik in Firestore:", err));
  };

  const handleAddPenyaluran = (newPenyaluran: PenyaluranDana) => {
    dbAddPenyaluran(newPenyaluran).catch(err => console.error("Error adding penyaluran to Firestore:", err));
  };

  const handleUpdatePenyaluranStatus = (id: string, updates: Partial<PenyaluranDana>) => {
    const found = penyaluranList.find(p => p.id === id);
    if (!found) return;

    const updated: PenyaluranDana = {
      ...found,
      ...updates
    };

    dbUpdatePenyaluran(updated).catch(err => console.error("Error updating penyaluran status in Firestore:", err));
  };

  const handleUpdateRoleCodes = (newCodes: Record<string, any>) => {
    dbUpdateRoleCodes(newCodes).catch(err => console.error("Error updating role codes in Firestore:", err));
  };

  const handleClearAllData = () => {
    // Clear list view locally first
    setSetoranList([]);
    setMustahikList([]);
    setPenyaluranList([]);

    // Clear from Firestore
    setoranList.forEach(item => {
      dbDeleteSetoran(item.id).catch(err => console.error(err));
    });
    mustahikList.forEach(item => {
      dbDeleteMustahik(item.id).catch(err => console.error(err));
    });
    penyaluranList.forEach(item => {
      dbDeletePenyaluran(item.id).catch(err => console.error(err));
    });

    // Reset role security codes back to initial factory values in Firestore
    dbUpdateRoleCodes(ROLE_CODES).catch(err => console.error(err));

    localStorage.removeItem('laz_aljihad_user');
    localStorage.removeItem('laz_aljihad_setoran');
    localStorage.removeItem('laz_aljihad_mustahik');
    localStorage.removeItem('laz_aljihad_penyaluran');
    localStorage.removeItem('laz_aljihad_setoran_v2');
    localStorage.removeItem('laz_aljihad_setoran_v3');
    localStorage.removeItem('laz_aljihad_mustahik_v2');
    localStorage.removeItem('laz_aljihad_penyaluran_v2');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    const code = loginCodeInput.trim().toUpperCase();
    if (!code) {
      setLoginError('Silakan masukkan kode akses pengurus.');
      return;
    }

    const found = roleCodes[code];
    if (found) {
      const newUser: UserProfile = {
        username: found.username,
        fullName: found.fullName,
        role: found.role,
        email: found.email
      };
      setCurrentUser(newUser);
      localStorage.setItem('laz_aljihad_user', JSON.stringify(newUser));
      setLoginSuccess(`Berhasill masuk sebagai ${found.label}!`);
      
      setTimeout(() => {
        setLoginCodeInput('');
        setLoginSuccess('');
        setShowLoginModal(false);
      }, 1200);
    } else {
      setLoginError('Kode akses salah atau tidak terdaftar. Hubungi Admin Yayasan atau silakan cek daftar Kode Akses di Profil.');
    }
  };

  const handleLogout = () => {
    const guestUser: UserProfile = {
      username: 'umum_donatur',
      fullName: 'Masyarakat / Donatur Umum',
      role: 'donatur',
      email: 'mdtaljihad2026@gmail.com'
    };
    setCurrentUser(guestUser);
    localStorage.removeItem('laz_aljihad_user');
    setActiveTab('dashboard');
  };

  // Kalkulasi total zakat fitrah & zakat mal terkumpul untuk memverifikasi capping 12.5% Amil
  const totalZakatFitrah = setoranList
    .filter(s => s.type === 'Zakat Fitrah')
    .reduce((sum, s) => sum + s.amount, 0);

  const totalZakatMal = setoranList
    .filter(s => s.type === 'Zakat Mal')
    .reduce((sum, s) => sum + s.amount, 0);

  const totalZakatTerkumpul = totalZakatFitrah + totalZakatMal;

  const totalInfakSedekahTerkumpul = setoranList
    .filter(s => s.type === 'Infak' || s.type === 'Sedekah' || s.type === 'Wakaf')
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden selection:bg-amber-100 selection:text-emerald-900" id="laz_app_root">
      
      {/* HEADER UTAMA */}
      <nav className="h-18 bg-emerald-900 border-b-2 border-[#D4AF37] flex items-center justify-between px-4 md:px-8 shrink-0 z-50 print:hidden shadow-lg">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 border-2 border-amber-400 rounded-full flex items-center justify-center font-extrabold text-amber-300 font-display text-lg tracking-tight shadow-md">
            🕌
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black leading-none tracking-tight text-base md:text-xl font-display">LAZ AL JIHAD</span>
            <span className="text-amber-300 text-[10px] font-bold tracking-widest uppercase mt-0.5">MDT AL JIHAD YAYASAN AL HAMID HADUM</span>
          </div>
        </div>

        {/* Sistem Login/Logout Pengurus Berjenjang */}
        <div className="flex items-center gap-2">
          
          {currentUser.role !== 'donatur' ? (
            // State: Terautentikasi (Pengurus)
            <div className="flex items-center gap-2 bg-emerald-950/40 p-1.5 md:p-2 rounded-2xl border border-emerald-500/20">
              <div className="hidden md:flex flex-col text-right text-[11px] pr-2 border-r border-emerald-700/60">
                <span className="text-amber-400 font-black text-[9px] uppercase tracking-wider block">PENGURUS TERKAIT</span>
                <span className="text-white font-bold">{currentUser.fullName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-amber-400/10 text-amber-300 font-black rounded text-[9px] uppercase border border-amber-400/20">
                  {currentUser.role === 'admin_yayasan' && '🛡️ Admin Yayasan'}
                  {currentUser.role === 'ketua_laz' && '👳 Ketua LAZ'}
                  {currentUser.role === 'bendahara' && '💰 Bendahara'}
                  {currentUser.role === 'sekretaris' && '✍️ Sekretaris'}
                  {currentUser.role === 'bidang_lapangan' && '🏃 Lapangan'}
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-700 hover:bg-red-800 text-white font-extrabold text-[10px] uppercase py-1 px-2 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  title="Keluar dari sistem pengurus"
                >
                  <LogOut className="w-3 h-3" /> Keluar
                </button>
              </div>
            </div>
          ) : (
            // State: Mode Umum (Masyarakat / Guest)
            <div className="flex items-center gap-1.5">
              <span className="hidden sm:inline-block px-2.5 py-1 bg-emerald-950/50 text-emerald-300 rounded-lg text-[10.5px] font-bold border border-emerald-800">
                🌐 Mode Publik (Donatur / Umum)
              </span>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="bg-amber-500 hover:bg-amber-600 active:transform active:scale-95 text-emerald-950 font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer border border-amber-400"
              >
                <Lock className="w-3.5 h-3.5 shrink-0" /> Masuk Pengurus
              </button>
            </div>
          )}

        </div>

      </nav>

      {/* DETAILED SCREEN WRAPPER */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* NAVIGASI MENUTAB - Side/Header responsive */}
        <aside className="w-full md:w-60 bg-white border-b md:border-b-0 md:border-r border-slate-200 py-4 px-4 flex flex-col justify-between shrink-0 z-10 print:hidden shadow-sm">
          
          <div className="space-y-5">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block mb-2 uppercase tracking-widest">MENU UTAMA</span>
              <div className="flex flex-col gap-1.5">
                
                {TAB_VISIBILITY[currentUser.role]?.includes('dashboard') && (
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                      activeTab === 'dashboard' 
                        ? 'bg-emerald-800 text-white shadow' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" /> Ikhtisar Beranda
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                )}

                {TAB_VISIBILITY[currentUser.role]?.includes('penghimpunan') && (
                  <button 
                    onClick={() => setActiveTab('penghimpunan')}
                    className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                      activeTab === 'penghimpunan' 
                        ? 'bg-emerald-800 text-white shadow' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> Penghimpunan Kas
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                )}

                {TAB_VISIBILITY[currentUser.role]?.includes('mustahik') && (
                  <button 
                    onClick={() => setActiveTab('mustahik')}
                    className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                      activeTab === 'mustahik' 
                        ? 'bg-emerald-800 text-white shadow' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" /> Mustahik (8 Asnaf)
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                )}

                {TAB_VISIBILITY[currentUser.role]?.includes('penyaluran') && (
                  <button 
                    onClick={() => setActiveTab('penyaluran')}
                    className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                      activeTab === 'penyaluran' 
                        ? 'bg-emerald-800 text-white shadow' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4" /> Penyaluran Dana
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                )}

                {TAB_VISIBILITY[currentUser.role]?.includes('laporan') && (
                  <button 
                    onClick={() => setActiveTab('laporan')}
                    className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                      activeTab === 'laporan' 
                        ? 'bg-emerald-800 text-white shadow' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4" /> Laporan Real-Time
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                )}

                {TAB_VISIBILITY[currentUser.role]?.includes('bantuan') && (
                  <button 
                    onClick={() => setActiveTab('bantuan')}
                    className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                      activeTab === 'bantuan' 
                        ? 'bg-emerald-800 text-white shadow' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-emerald-500 animate-pulse" /> Layanan Bantuan WA
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                )}

                {TAB_VISIBILITY[currentUser.role]?.includes('profil') && (
                  <button 
                    onClick={() => setActiveTab('profil')}
                    className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                      activeTab === 'profil' 
                        ? 'bg-emerald-800 text-white shadow' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <BadgeInfo className="w-4 h-4 text-amber-500" /> Profil LAZ Jihad
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                )}

              </div>
            </div>

            {/* Quick stats on the sidebar */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2 text-xs">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">INFO INTEGRITAS</span>
              <div className="flex justify-between items-center text-slate-600">
                <span>Total Muzakki:</span>
                <span className="font-bold text-slate-800">
                  {setoranList.filter((v,i,a) => a.findIndex(t => t.muzakkiName === v.muzakkiName) === i).length}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Mustahik Layak:</span>
                <span className="font-bold text-emerald-800">
                  {mustahikList.filter(m => m.statusVerifikasi === 'Layak').length} Jiwa
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center gap-1.5 text-[10px] text-emerald-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                SLA Kemenag Aktif
              </div>
            </div>
          </div>

          {/* Footer of the sidebar */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 space-y-1">
            <p className="font-bold text-slate-600">&copy; 2026 Yayasan Al Hamid Hadum</p>
            <p>MDT Al Jihad v3.2 Terpadu</p>
          </div>

        </aside>

        {/* CONTAINER CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {/* Active component mounting based on activeTab */}
          {activeTab === 'dashboard' && (
            <Dashboard 
              setoranList={setoranList}
              mustahikList={mustahikList}
              penyaluranList={penyaluranList}
              onNavigate={(tab) => setActiveTab(tab)}
              userRole={currentUser.role}
              onClearAllData={handleClearAllData}
            />
          )}

          {activeTab === 'penghimpunan' && (
            <Penghimpunan 
              setoranList={setoranList}
              onAddSetoran={handleAddSetoran}
              onUpdateSetoran={handleUpdateSetoran}
              onDeleteSetoran={handleDeleteSetoran}
              userRole={currentUser.role}
            />
          )}

          {activeTab === 'mustahik' && (
            <Mustahik 
              mustahikList={mustahikList}
              onAddMustahik={handleAddMustahik}
              onVerifyMustahik={handleVerifyMustahik}
              userRole={currentUser.role}
            />
          )}

          {activeTab === 'penyaluran' && (
            <Penyaluran 
              penyaluranList={penyaluranList}
              mustahikList={mustahikList}
              onAddPenyaluran={handleAddPenyaluran}
              onUpdatePenyaluranStatus={handleUpdatePenyaluranStatus}
              totalZakatTerkumpul={totalZakatTerkumpul}
              totalInfakSedekahTerkumpul={totalInfakSedekahTerkumpul}
              userRole={currentUser.role}
            />
          )}

          {activeTab === 'laporan' && (
            <Laporan 
              setoranList={setoranList}
              penyaluranList={penyaluranList}
              userRole={currentUser.role}
            />
          )}

          {activeTab === 'bantuan' && (
            <AsistenCerdas 
              userRole={currentUser.role}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'profil' && (
            <ProfilLembaga 
              currentUser={currentUser}
              roleCodes={roleCodes}
              onUpdateRoleCodes={handleUpdateRoleCodes}
            />
          )}

        </main>

      </div>

      {/* DIALOG/MODAL LOGIN PENGURUS */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fade-in" id="login_modal">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
            
            {/* Header Dialog */}
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-5 border-b-2 border-amber-400 relative">
              <div className="absolute right-4 top-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setLoginError('');
                    setLoginSuccess('');
                    setLoginCodeInput('');
                  }}
                  className="text-slate-300 hover:text-white text-lg font-bold w-7 h-7 rounded-full bg-black/10 flex items-center justify-center transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-400/10 text-amber-300 rounded-xl border border-amber-300/20">
                  <Lock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display font-black text-xs md:text-sm uppercase tracking-tight">KREDENSIAL HAK AKSES PENGURUS</h3>
                  <p className="text-[10px] text-slate-300 font-normal">Masukkan kode penugasan resmi LAZ MDT Al Jihad</p>
                </div>
              </div>
            </div>

            {/* Content Form */}
            <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
              
              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-[10px] font-semibold flex items-start gap-2 animate-bounce">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-650 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              {loginSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-3 text-[10px] font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 animate-bounce" />
                  <span>{loginSuccess}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">MASUKKAN KODE PIN PENGURUS</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input 
                    type="password"
                    placeholder="Contoh kode: KETUA12"
                    value={loginCodeInput}
                    onChange={(e) => setLoginCodeInput(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-250 rounded-xl text-xs font-mono font-black focus:bg-white focus:ring-2 focus:ring-emerald-800 focus:border-emerald-800 outline-none transition-all uppercase placeholder:normal-case tracking-widest text-slate-900 shadow-inner"
                    autoFocus
                  />
                </div>
              </div>

              <div className="pt-1 select-none">
                <button 
                  type="submit"
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer transform active:scale-95"
                >
                  <Unlock className="w-3.5 h-3.5" /> Verifikasi Akses Masuk
                </button>
              </div>

              <div className="text-center pt-2">
                <button 
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setLoginError('');
                    setLoginCodeInput('');
                  }}
                  className="text-[10px] text-slate-450 hover:text-slate-650 font-bold underline cursor-pointer"
                >
                  Tetap dalam Mode Umum (Donatur / Masyarakat)
                </button>
              </div>

              <div className="border-t border-slate-100 pt-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowPinGuide(!showPinGuide)}
                  className="w-full text-center text-[10px] text-emerald-800 font-bold hover:underline cursor-pointer flex items-center justify-center gap-1"
                >
                  {showPinGuide ? '▲ Sembunyikan' : '▼ Lihat'} Daftar Kode Akses Berdasarkan Peran
                </button>
                
                {showPinGuide && (
                  <div className="mt-2 bg-slate-50 rounded-xl p-3 border border-slate-200/60 space-y-1.5 text-[10px] text-slate-600 font-mono">
                    <span className="font-extrabold text-slate-500 uppercase tracking-widest block mb-1">Kode Akses Aktif:</span>
                    {(Object.entries(roleCodes) as [string,  any][]).map(([pinCode, userDetails]) => (
                      <div key={pinCode} className="flex justify-between items-center py-0.5 border-b border-slate-100 last:border-0">
                        <span className="font-sans font-semibold text-slate-700">{userDetails.label}:</span>
                        <span className="font-bold text-emerald-800 tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] border border-emerald-100">{pinCode}</span>
                      </div>
                    ))}
                    <span className="text-[9px] text-amber-700 font-sans font-bold block mt-2 text-center leading-normal">
                      💡 Pengurus yang masuk dapat mengganti Kode Akses ini kapan saja di tab "Profil".
                    </span>
                  </div>
                )}
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
