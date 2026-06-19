import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  HeartHandshake, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  CheckCircle2, 
  HelpCircle,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import { SetoranDana, MustahikProfile, PenyaluranDana, DanaType, UserRole } from '../types';

interface DashboardProps {
  setoranList: SetoranDana[];
  mustahikList: MustahikProfile[];
  penyaluranList: PenyaluranDana[];
  onNavigate: (tab: string) => void;
  userRole?: UserRole;
  onClearAllData?: () => void;
}

export default function Dashboard({ 
  setoranList, 
  mustahikList, 
  penyaluranList,
  onNavigate,
  userRole,
  onClearAllData
}: DashboardProps) {
  const [showConfirmClear, setShowConfirmClear] = useState<boolean>(false);
  
  // Hitung total dari setoran
  const totalDanaMasuk = setoranList.reduce((sum, item) => sum + item.amount, 0);
  
  // Hitung pengeluaran / penyaluran yang statusnya 'Penyaluran' atau 'Dokumentasi' (sudah disalurkan)
  const totalDanaKeluar = penyaluranList
    .filter(p => p.status === 'Penyaluran' || p.status === 'Dokumentasi')
    .reduce((sum, item) => sum + item.amountApproved, 0);

  const saldoTersedia = totalDanaMasuk - totalDanaKeluar;

  // Breakdown per jenis dana
  const getPemasukanByType = (type: DanaType) => {
    return setoranList
      .filter(s => s.type === type)
      .reduce((sum, s) => sum + s.amount, 0);
  };

  const getPenyaluranByType = (type: DanaType) => {
    return penyaluranList
      .filter(p => p.danaSourceType === type && (p.status === 'Penyaluran' || p.status === 'Dokumentasi'))
      .reduce((sum, p) => sum + p.amountApproved, 0);
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const ringkasanDana = [
    { name: 'Zakat Fitrah', color: 'bg-emerald-50 text-emerald-800 border-emerald-100', in: getPemasukanByType('Zakat Fitrah'), out: getPenyaluranByType('Zakat Fitrah') },
    { name: 'Zakat Mal', color: 'bg-amber-50 text-amber-800 border-amber-100', in: getPemasukanByType('Zakat Mal'), out: getPenyaluranByType('Zakat Mal') },
    { name: 'Infak', color: 'bg-teal-50 text-teal-800 border-teal-100', in: getPemasukanByType('Infak'), out: getPenyaluranByType('Infak') },
    { name: 'Sedekah', color: 'bg-lime-50 text-lime-800 border-lime-100', in: getPemasukanByType('Sedekah'), out: getPenyaluranByType('Sedekah') },
    { name: 'Wakaf', color: 'bg-blue-50 text-blue-800 border-blue-101', in: getPemasukanByType('Wakaf'), out: getPenyaluranByType('Wakaf') },
  ];

  // Hitung rasio penyaluran
  const rasioPenyaluranPercent = totalDanaMasuk > 0 
    ? Math.round((totalDanaKeluar / totalDanaMasuk) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Profil Banner Lembaga */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 rounded-3xl p-6 text-white border border-amber-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-12">
          <Building2 className="w-96 h-96" />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-400/30 rounded-full text-amber-300 text-xs font-semibold uppercase tracking-wider">
              ✨ DI BAWAH NAUNGAN YAYASAN AL HAMID HADUM
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight">
              LAZ MDT Al Jihad
            </h1>
            <p className="text-emerald-100 max-w-xl text-sm leading-relaxed">
              Sistem Manajemen Terpadu pendaftaran Muzakki, verifikasi profil 8 Golongan Asnaf Mustahik, akuntansi keuangan, hingga pengawasan penyaluran dana zakat secara syari, amanah, dan transparan.
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-xs text-emerald-200">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> Sesuai Syariat Islam
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> Akuntabel & Tepat Sasaran
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> Transparansi 100%
              </span>
            </div>
          </div>

          <div className="bg-emerald-950/40 backdrop-blur-sm border border-emerald-600/30 rounded-2xl p-4 space-y-3">
            <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider block">
              Prinsip Kerja & Tagline
            </span>
            <div className="border-l-4 border-amber-500 pl-3">
              <p className="italic text-base font-medium text-amber-200">
                "Amanah, Transparan, Tepat Sasaran"
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Mengutamakan ketelitian penyaluran sesuai Al-Quran Surat At-Taubah ayat 60.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tampilan Ringkasan Atas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* TOTAL PENGHIMPUNAN (DANA MASUK) */}
        <div id="stat_pemasukan" className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:border-emerald-200 transition-all group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium tracking-wide block uppercase">Total Penghimpunan</span>
              <span className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                {formatRupiah(totalDanaMasuk)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Dari {setoranList.length} transaksi</span>
            <span className="text-emerald-600 font-medium flex items-center gap-0.5">
              Aktif <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* TOTAL PENYALURAN (DANA KELUAR) */}
        <div id="stat_penyaluran" className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:border-amber-200 transition-all group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium tracking-wide block uppercase">Dana Tersalurkan</span>
              <span className="text-2xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                {formatRupiah(totalDanaKeluar)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Rasio Penyaluran</span>
            <span className="text-amber-600 font-semibold">{rasioPenyaluranPercent}%</span>
          </div>
        </div>

        {/* SALDO TERSEDIA */}
        <div id="stat_saldo" className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:border-emerald-200 transition-all group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium tracking-wide block uppercase">Saldo Kas LAZ</span>
              <span className="text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {formatRupiah(saldoTersedia)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-800 border border-emerald-200">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Netto Tersedia</span>
            <span className="text-emerald-700 font-bold">100% Syariah</span>
          </div>
        </div>

        {/* MUZAKKI & MUSTAHIK */}
        <div id="stat_mustahik" className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:border-indigo-100 transition-all group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium tracking-wide block uppercase">Muzakki & Mustahik</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">
                  {setoranList.filter((v,i,a) => a.findIndex(t => t.muzakkiName === v.muzakkiName) === i).length}
                </span>
                <span className="text-xs text-slate-400">Muzakki</span>
                <span className="text-slate-300">|</span>
                <span className="text-2xl font-bold text-slate-900">
                  {mustahikList.length}
                </span>
                <span className="text-xs text-slate-400">Mustahik</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Mustahik Layak</span>
            <span className="text-emerald-600 font-semibold">
              {mustahikList.filter(m => m.statusVerifikasi === 'Layak').length} Terverifikasi
            </span>
          </div>
        </div>

      </div>

      {/* Tengah: Laporan Grafik visual SVG (No recharts dependency risk) + Alokasi Pos Kas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visualisasi Grafik Dana Masuk & Keluar secara Proporsional */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-display font-semibold text-lg text-slate-900">Grafik Posisi Keuangan</h3>
              <p className="text-xs text-slate-500">Perbandingan pemasukan terkumpul vs pengeluaran tersalur per jenis dana</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
                <span>Pemasukan</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded bg-amber-500 inline-block"></span>
                <span>Disalurkan</span>
              </div>
            </div>
          </div>

          {/* SVG Progress Bars Layout */}
          <div className="space-y-6 pt-2">
            {ringkasanDana.map((item, idx) => {
              const maxVal = Math.max(...ringkasanDana.map(r => Math.max(r.in, r.out, 100000)));
              const inWidthPercent = Math.max(5, (item.in / maxVal) * 100);
              const outWidthPercent = Math.max(3, (item.out / maxVal) * 100);

              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${item.color} border font-bold`}>
                        {item.name}
                      </span>
                    </span>
                    <div className="space-x-3 text-right">
                      <span className="text-emerald-600">In: {formatRupiah(item.in)}</span>
                      <span className="text-amber-600">Out: {formatRupiah(item.out)}</span>
                    </div>
                  </div>

                  {/* Dual Bar Representation */}
                  <div className="relative h-6 bg-slate-50 rounded-full overflow-hidden border border-slate-100 flex flex-col justify-center">
                    {/* Input Bar */}
                    <div 
                      className="absolute left-0 top-0 bottom-1 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-r-md transition-all duration-500" 
                      style={{ width: `${inWidthPercent}%`, height: '55%' }}
                    ></div>
                    {/* Output Bar */}
                    <div 
                      className="absolute left-0 bottom-0 top-1/2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-r-md transition-all duration-500" 
                      style={{ width: `${outWidthPercent}%`, height: '45%' }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-3">
            <span>*Diperbarui secara real-time dari data setoran dan penyaluran</span>
            <button 
              onClick={() => onNavigate('laporan')}
              className="text-emerald-700 font-semibold hover:underline flex items-center gap-0.5"
            >
              Lihat Detail Laporan Keuangan →
            </button>
          </div>
        </div>

      </div>

      {/* Bawah: Daftar Transaksi Terakhir & Keunggulan Al-Jihad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {userRole === 'admin_yayasan' ? (
          /* High-Level Monitoring Summary instead of detail transaction list */
          <div className="lg:col-span-2 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 md:p-8 border-b-4 border-amber-500 shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-1/4 translate-x-1/4">
              <Building2 className="w-64 h-64" />
            </div>
            
            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-300/20">
                🛡️ MONITORING MODE KEPENGURUSAN YAYASAN
              </span>
              <h3 className="font-display text-xl font-black uppercase tracking-tight text-white leading-snug">
                IKHTISAR KEUANGAN AMANAH REAL-TIME
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                Halo <strong>Holid Assad, S.Pd</strong>. Anda sedang mengakses dalam mode Pengawas Utama (Admin Yayasan). Sesuai dengan instruksi, menu operasional detail penambahan/pengeditan data disembunyikan. Anda disajikan data ringkasan utuh dari seluruh pos dana filantropi secara transparan dan akuntabel.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4 text-xs font-mono">
                <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase">Sensus Muzakki</span>
                  <strong className="text-amber-300 text-sm">{setoranList.filter((v,i,a) => a.findIndex(t => t.muzakkiName === v.muzakkiName) === i).length} Nama</strong>
                </div>
                <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase">Target Penyaluran</span>
                  <strong className="text-amber-300 text-sm">{mustahikList.length} Mustahik</strong>
                </div>
                <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-900 col-span-2 md:col-span-1">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase">Kepatuhan Audit</span>
                  <strong className="text-emerald-300 text-sm">✓ Sesuai Syariah</strong>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-emerald-800/60 flex justify-between items-center text-[10px] text-slate-400 relative z-10">
              <span>Sistem Pencatatan LAZ Al Jihad Digital Terpadu</span>
              <button 
                onClick={() => onNavigate('laporan')}
                className="text-amber-400 font-bold hover:underline flex items-center gap-1"
              >
                Tinjau Laporan Rekapitulasi &rarr;
              </button>
            </div>
          </div>
        ) : (
          /* Normal detailed transaction table for other management roles & guests */
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-display font-semibold text-slate-900">Setoran Penghimpunan Terbaru</h3>
                <p className="text-xs text-slate-400">Arus masuk dana dari para Muzakki & Munfiq dan amalan kebajikan</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold text-[10px]">
                    <th className="py-2">No. Kwitansi</th>
                    <th className="py-2">Muzakki</th>
                    <th className="py-2">Jenis Dana</th>
                    <th className="py-2">Jumlah</th>
                    <th className="py-2">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {setoranList.slice(-4).reverse().map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-2.5 font-mono text-emerald-800">{s.noKwitansi}</td>
                      <td className="py-2.5 font-medium text-slate-800">{s.muzakkiName}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                          {s.type}
                        </span>
                      </td>
                      <td className="py-2.5 font-bold text-slate-900">{formatRupiah(s.amount)}</td>
                      <td className="py-2.5 text-slate-400">{s.tanggal}</td>
                    </tr>
                  ))}
                  {setoranList.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400 font-light">Belum ada dana masuk yang diinput.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Panel Informasi Struktur Yayasan Al Hamid Hadum */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-display font-semibold text-slate-900">Yayasan Al Hamid Hadum</h3>
          
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex gap-2 items-start">
              <div className="p-1.5 bg-amber-100 rounded text-amber-800 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <p>MDT Al Jihad didirikan oleh Yayasan Al Hamid Hadum untuk menjembatani asuhan keagamaan masyarakat secara merata.</p>
            </div>
            
            <div className="flex gap-2 items-start">
              <div className="p-1.5 bg-amber-100 rounded text-amber-800 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <p>LAZ Al Jihad merupakan inkubator pengelolaan filantropi Islam dalam rangka dakwah dan pembebasan mustahik dari garis kemiskinan.</p>
            </div>

            <div className="flex gap-2 items-start">
              <div className="p-1.5 bg-amber-100 rounded text-amber-800 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <p>Perhitungan operasional Amil dikontrol ketat maksimal 12,5% demi kepatuhan sanksi syar'i.</p>
            </div>
          </div>

          <div className="bg-emerald-900 text-white rounded-xl p-3.5 text-center shadow-inner border border-amber-500/20">
            <span className="text-[10px] font-bold uppercase text-amber-300 tracking-widest block mb-1">
              REKENING RESMI MASJID/MDT (BANK BRI)
            </span>
            <p className="font-mono text-sm font-semibold selection:bg-amber-400">BRI: 4157-01-064388-53-4</p>
            <span className="text-[10px] text-slate-200 block mt-0.5">an. MDT AL JIHAD</span>
          </div>

          {/* Kolom Clear Data Khusus Pengurus */}
          {userRole !== 'donatur' && (
            <div className="bg-rose-50 rounded-xl p-4 border border-rose-100 space-y-2.5">
              <span className="text-[10px] text-rose-800 font-bold block uppercase tracking-wider">Fitur Administrator</span>
              <p className="text-[11px] text-slate-600 leading-tight">Gunakan tombol di bawah untuk membersihkan semua data penginputan jika ingin memulai ulang sensus baru.</p>
              
              {!showConfirmClear ? (
                <button 
                  onClick={() => setShowConfirmClear(true)}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 px-3 rounded-lg transition-transform active:scale-95 cursor-pointer text-center"
                >
                  Hapus Semua Data (Clear)
                </button>
              ) : (
                <div className="bg-white p-2.5 rounded-lg border border-rose-200 space-y-2">
                  <p className="text-[10px] text-red-650 font-bold">Apakah Anda yakin? Seluruh data penghimpunan, mustahik, &amp; penyaluran terinput akan dihapus permanen.</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        onClearAllData?.();
                        setShowConfirmClear(false);
                      }}
                      className="flex-1 bg-red-650 hover:bg-red-700 text-white font-bold text-[10px] py-1.5 rounded cursor-pointer text-center"
                    >
                      Ya, Hapus Semua
                    </button>
                    <button 
                      onClick={() => setShowConfirmClear(false)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] py-1.5 rounded cursor-pointer text-center"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
