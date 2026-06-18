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

// INITIAL SEED DATA FOR FIRST VISIT
const INITIAL_SETORAN: SetoranDana[] = [
  {
    id: 's-1',
    muzakkiName: 'Ibu H. Fatimah',
    phone: '081270009944',
    alamat: 'Kp. Hadum RT 02 RW 01',
    amount: 450000,
    type: 'Zakat Fitrah',
    paymentMethod: 'Tunai',
    tanggal: '10 Juni 2026',
    keterangan: 'Zakat Fitrah keluarga Ibu Fatimah, total 10 jiwa',
    noKwitansi: 'LAZ-ZF-20260610-4491'
  },
  {
    id: 's-2',
    muzakkiName: 'Bpk. H. Syukur',
    phone: '085718223399',
    alamat: 'Perum Gading Indah Blok C3 No.10',
    amount: 15000000,
    type: 'Zakat Mal',
    paymentMethod: 'Transfer Bank',
    tanggal: '12 Juni 2026',
    keterangan: 'Zakat Mal tabungan usaha dagang tahunan',
    noKwitansi: 'LAZ-ZM-20260612-8812'
  },
  {
    id: 's-3',
    muzakkiName: 'Hamba Allah',
    phone: '',
    alamat: 'Kp. Hadum',
    amount: 2500000,
    type: 'Infak',
    paymentMethod: 'Tunai',
    tanggal: '14 Juni 2026',
    keterangan: 'Kotak amal Jum’at Masjid & MDT Al-Jihad',
    noKwitansi: 'LAZ-IF-20260614-2201'
  },
  {
    id: 's-4',
    muzakkiName: 'Kel. Bpk. Rudi Purwanto',
    phone: '081399882200',
    alamat: 'Kp. Hadum RT 04 RW 02',
    amount: 1000000,
    type: 'Sedekah',
    paymentMethod: 'QRIS',
    tanggal: '15 Juni 2026',
    keterangan: 'Sedekah syukuran kelulusan anak',
    noKwitansi: 'LAZ-SD-20260615-5601'
  },
  {
    id: 's-5',
    muzakkiName: 'Hamba Allah (Alm. H. Sanusi)',
    phone: '085322998877',
    alamat: 'Yayasan Al Hamid',
    amount: 12000000,
    type: 'Wakaf',
    paymentMethod: 'Transfer Bank',
    tanggal: '16 Juni 2026',
    keterangan: 'Wakaf sarana sumur bor MDT Al Jihad',
    noKwitansi: 'LAZ-WK-20260616-9031'
  }
];

const INITIAL_MUSTAHIK: MustahikProfile[] = [
  {
    id: 'm-1',
    nama: 'Pak Mamat Saputra',
    identitasNo: '3201092801550002',
    phone: '089999221100',
    alamat: 'Kp. Hadum RT 03 RW 01',
    asnaf: 'Fakir',
    penghasilan: 350000,
    tanggungan: 3,
    kondisiRumah: 'Dinding kayu rapuh, lantai semen retak, atap bocor parah.',
    statusVerifikasi: 'Layak',
    catatanVerifikasi: 'Pemeriksaan lapangan menunjukkan dhuafa tersebut tidak memiliki modal nafkah tetap, kesehatan terganggu.',
    riwayatBantuanIds: []
  },
  {
    id: 'm-2',
    nama: 'Ibu Aminah binti Kodir',
    identitasNo: '3201095503710003',
    phone: '085711223344',
    alamat: 'Kp. Hadum RT 01 RW 01, Gg. Musholla',
    asnaf: 'Miskin',
    penghasilan: 800000,
    tanggungan: 4,
    kondisiRumah: 'Mengontrak bangunan kayu bersekat seng. Menghidupi 4 anak sekolah.',
    statusVerifikasi: 'Layak',
    catatanVerifikasi: 'Bekerja sebagai buruh cuci serabutan. Layak diberikan bantuan kebutuhan sembako bulanan.',
    riwayatBantuanIds: []
  },
  {
    id: 'm-3',
    nama: 'Pak Rozak Siregar',
    identitasNo: '3201101212800002',
    phone: '',
    alamat: 'Kp. Hadum RT 04 RW 02',
    asnaf: 'Gharimin',
    penghasilan: 1200000,
    tanggungan: 2,
    kondisiRumah: 'Rumah sederhana warisan orang tua.',
    statusVerifikasi: 'Belum Diperiksa',
    catatanVerifikasi: 'Sedang menunggu pemeriksaan berkas bukti rincian resep obat & jeratan hutang rentenir pengobatan anak sakit.',
    riwayatBantuanIds: []
  }
];

const INITIAL_PENYALURAN: PenyaluranDana[] = [
  {
    id: 'p-1',
    noPenyaluran: 'DISB-44122',
    peruntukanName: 'Sembako Beras & Minyak Kaum Fakir RT 03',
    mustahikId: 'm-1',
    mustahikNama: 'Pak Mamat Saputra',
    asnafTarget: 'Fakir',
    danaSourceType: 'Zakat Fitrah',
    amountRequested: 450000,
    amountApproved: 450000,
    status: 'Dokumentasi',
    tanggalUsulan: '11 Juni 2026',
    tanggalPenyaluran: '12 Juni 2026',
    diusulkanOleh: 'LAPANGAN',
    disetujuiOleh: 'KETUA_LAZ',
    keterangan: 'Penyerahan sembako beras 20kg dan santunan tunai Rp150.000.',
    buktiFotoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23ecfdf5"/><circle cx="150" cy="100" r="40" fill="%2334d399" opacity="0.3"/><rect x="110" y="80" width="80" height="40" rx="5" fill="%23047857"/><circle cx="150" cy="100" r="10" fill="white"/><text x="150" y="160" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23065f46" text-anchor="middle">Sembako Beras &amp; Santunan</text><text x="150" y="180" font-family="monospace" font-size="9" fill="%23047857" text-anchor="middle">MDT Al Jihad - Terverifikasi</text></svg>',
    tandaTerimaDigital: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50" viewBox="0 0 100 50"><path d="M 10 30 C 30 10, 60 40, 90 20" stroke="%23047857" stroke-width="2" fill="none"/></svg>'
  },
  {
    id: 'p-2',
    noPenyaluran: 'DISB-88331',
    peruntukanName: 'Santunan Biaya Renovasi Kelas MDT Al Jihad',
    asnafTarget: 'Fisabilillah',
    danaSourceType: 'Wakaf',
    amountRequested: 8500000,
    amountApproved: 8500000,
    status: 'Dokumentasi',
    tanggalUsulan: '14 Juni 2026',
    tanggalPenyaluran: '15 Juni 2026',
    diusulkanOleh: 'SEKRETARIS',
    disetujuiOleh: 'ADMIN_YAYASAN',
    keterangan: 'Belanja pasir, semen dan tegel kelas mengaji dhuafa murid Al-Jihad.',
    buktiFotoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23fef3c7"/><circle cx="150" cy="100" r="40" fill="%23f59e0b" opacity="0.3"/><rect x="115" y="85" width="70" height="30" rx="2" fill="%23d97706"/><text x="150" y="150" font-family="sans-serif" font-size="11" font-weight="bold" fill="%2378350f" text-anchor="middle">Renovasi Sarana Kelas</text><text x="150" y="170" font-family="monospace" font-size="9" fill="%23b45309" text-anchor="middle">Yayasan Al Hamid Hadum</text></svg>',
    tandaTerimaDigital: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50" viewBox="0 0 100 50"><path d="M 20 20 Q 50 45, 80 15" stroke="%23b45309" stroke-width="3" fill="none"/></svg>'
  },
  {
    id: 'p-3',
    noPenyaluran: 'DISB-99120',
    peruntukanName: 'Penyaluran Insentif Bulanan Guru Ngaji MDT',
    asnafTarget: 'Fisabilillah',
    danaSourceType: 'Infak',
    amountRequested: 1500000,
    amountApproved: 1500000,
    status: 'Penyaluran',
    tanggalUsulan: '15 Juni 2026',
    diusulkanOleh: 'BENDAHARA',
    disetujuiOleh: 'KETUA_LAZ',
    keterangan: 'Insentif untuk 3 ustadz pengajar sukarela dhuafa MDT Al Jihad.'
  }
];

const ROLE_CODES = {
  'YYSN88': {
    role: 'admin_yayasan' as UserRole,
    username: 'amil_yayasan',
    fullName: 'Yusuf Wafa Wibowo, S.Ag',
    email: 'admin.aljihad@gmail.com',
    label: 'Admin Yayasan'
  },
  'KETUA12': {
    role: 'ketua_laz' as UserRole,
    username: 'amil_ketua',
    fullName: 'Ustadz Al Hamid, M.Ag',
    email: 'ketua.aljihad@gmail.com',
    label: 'Ketua LAZ'
  },
  'BENDA99': {
    role: 'bendahara' as UserRole,
    username: 'amil_bendahara',
    fullName: 'Ustadzah Nurul Inayah, S.E.I',
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
  admin_yayasan: ['dashboard', 'laporan', 'profil', 'asisten'],
  ketua_laz: ['dashboard', 'penghimpunan', 'mustahik', 'penyaluran', 'laporan', 'profil', 'asisten'],
  bendahara: ['dashboard', 'penghimpunan', 'penyaluran', 'laporan', 'profil', 'asisten'],
  sekretaris: ['dashboard', 'penghimpunan', 'mustahik', 'laporan', 'profil', 'asisten'],
  bidang_lapangan: ['dashboard', 'penyaluran', 'laporan', 'profil', 'asisten'],
  donatur: ['dashboard', 'penghimpunan', 'laporan', 'profil', 'asisten'],
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

  // State Dialog Login Pengurus
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginCodeInput, setLoginCodeInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  // Auto-redirect jika tab tersimpan tidak diperbolehkan untuk peran saat ini
  useEffect(() => {
    const allowed = TAB_VISIBILITY[currentUser.role] || ['dashboard', 'profil'];
    if (!allowed.includes(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [currentUser.role, activeTab]);

  // State Keuangan & Data Utama
  const [setoranList, setSetoranList] = useState<SetoranDana[]>(() => {
    const local = localStorage.getItem('laz_aljihad_setoran');
    return local ? JSON.parse(local) : INITIAL_SETORAN;
  });

  const [mustahikList, setMustahikList] = useState<MustahikProfile[]>(() => {
    const local = localStorage.getItem('laz_aljihad_mustahik');
    return local ? JSON.parse(local) : INITIAL_MUSTAHIK;
  });

  const [penyaluranList, setPenyaluranList] = useState<PenyaluranDana[]>(() => {
    const local = localStorage.getItem('laz_aljihad_penyaluran');
    return local ? JSON.parse(local) : INITIAL_PENYALURAN;
  });

  // Sync state to local storage for extreme persistence!
  useEffect(() => {
    localStorage.setItem('laz_aljihad_setoran', JSON.stringify(setoranList));
  }, [setoranList]);

  useEffect(() => {
    localStorage.setItem('laz_aljihad_mustahik', JSON.stringify(mustahikList));
  }, [mustahikList]);

  useEffect(() => {
    localStorage.setItem('laz_aljihad_penyaluran', JSON.stringify(penyaluranList));
  }, [penyaluranList]);

  // Actions handlers
  const handleAddSetoran = (newSetoran: SetoranDana) => {
    setSetoranList(prev => [...prev, newSetoran]);
  };

  const handleAddMustahik = (newMustahik: MustahikProfile) => {
    setMustahikList(prev => [...prev, newMustahik]);
  };

  const handleVerifyMustahik = (id: string, status: 'Belum Diperiksa' | 'Layak' | 'Tidak Layak', catatan: string) => {
    setMustahikList(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          statusVerifikasi: status,
          catatanVerifikasi: catatan,
          tanggalVerifikasi: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
        };
      }
      return m;
    }));
  };

  const handleAddPenyaluran = (newPenyaluran: PenyaluranDana) => {
    setPenyaluranList(prev => [...prev, newPenyaluran]);
  };

  const handleUpdatePenyaluranStatus = (id: string, updates: Partial<PenyaluranDana>) => {
    setPenyaluranList(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updates };
      }
      return p;
    }));
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

    const found = ROLE_CODES[code as keyof typeof ROLE_CODES];
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
      setLoginError('Kode akses salah atau tidak terdaftar. Silakan lihat daftar kode panduan di bawah.');
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

                {TAB_VISIBILITY[currentUser.role]?.includes('asisten') && (
                  <button 
                    onClick={() => setActiveTab('asisten')}
                    className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                      activeTab === 'asisten' 
                        ? 'bg-emerald-800 text-white shadow' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" /> Asisten AI &amp; Bantuan
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
            />
          )}

          {activeTab === 'penghimpunan' && (
            <Penghimpunan 
              setoranList={setoranList}
              onAddSetoran={handleAddSetoran}
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

          {activeTab === 'asisten' && (
            <AsistenCerdas 
              userRole={currentUser.role}
            />
          )}

          {activeTab === 'profil' && (
            <ProfilLembaga />
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

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
