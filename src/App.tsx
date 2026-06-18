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
  Sparkles
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import Penghimpunan from './components/Penghimpunan';
import Mustahik from './components/Mustahik';
import Penyaluran from './components/Penyaluran';
import Laporan from './components/Laporan';
import AsistenCerdas from './components/AsistenCerdas';
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

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    username: 'amil_wafa',
    fullName: 'Yusuf Wafa Wibowo, S.Ag',
    role: 'admin_yayasan',
    email: 'admin.aljihad@gmail.com'
  });

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

  const handleRoleChange = (role: UserRole) => {
    const namesMap: Record<UserRole, string> = {
      'admin_yayasan': 'Yusuf Wafa Wibowo, S.Ag (Yayasan)',
      'ketua_laz': 'Ustadz Al Hamid, M.Ag (Ketua)',
      'bendahara': 'Ustadzah Nurul Inayah, S.E.I (Bendahara)',
      'sekretaris': 'Siti Khalimah, S.Pd (Sekretaris)',
      'bidang_lapangan': 'Fahmi Siddiq (Tim Lapangan)',
      'donatur': 'Bpk. Donatur Budiman'
    };
    setCurrentUser({
      username: `amil_${role}`,
      fullName: namesMap[role],
      role: role,
      email: `${role}.aljihad@gmail.com`
    });
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

        {/* Roles Swapper for "Sistem Hak Akses Berjenjang" simulation */}
        <div className="flex items-center gap-2">
          
          <div className="hidden lg:flex flex-col text-right text-xs pr-2 border-r border-emerald-700">
            <span className="text-amber-300 font-bold block text-[10px] uppercase">AKSES SAAT INI</span>
            <span className="text-white font-semibold">{currentUser.fullName}</span>
          </div>

          <div className="bg-emerald-950/60 p-1 rounded-xl border border-emerald-600/30 flex items-center gap-1.5">
            <span className="hidden sm:inline text-[9px] font-black text-emerald-300 px-2 uppercase tracking-wider">Pilih Peran:</span>
            <select 
              value={currentUser.role}
              onChange={(e) => handleRoleChange(e.target.value as UserRole)}
              className="bg-emerald-900 text-white font-bold text-xs p-1 px-2 border-none outline-none rounded-lg cursor-pointer focus:ring-1 focus:ring-amber-400 font-medium"
            >
              <option value="admin_yayasan">🛡️ Admin Yayasan</option>
              <option value="ketua_laz">👳 Ketua LAZ</option>
              <option value="bendahara">💰 Bendahara LAZ</option>
              <option value="sekretaris">✍️ Sekretaris</option>
              <option value="bidang_lapangan">🏃 Lapangan</option>
              <option value="donatur">👤 Donatur / Umum</option>
            </select>
          </div>
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
            />
          )}

          {activeTab === 'asisten' && (
            <AsistenCerdas 
              userRole={currentUser.role}
            />
          )}

        </main>

      </div>

    </div>
  );
}
