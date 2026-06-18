import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  HeartHandshake, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Calculator, 
  CheckCircle2, 
  HelpCircle,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import { SetoranDana, MustahikProfile, PenyaluranDana, DanaType } from '../types';

interface DashboardProps {
  setoranList: SetoranDana[];
  mustahikList: MustahikProfile[];
  penyaluranList: PenyaluranDana[];
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ 
  setoranList, 
  mustahikList, 
  penyaluranList,
  onNavigate 
}: DashboardProps) {
  const [fitrahKalkulasi, setFitrahKalkulasi] = useState<number>(45000); // Rp per jiwa standar
  const [jumlahJiwa, setJumlahJiwa] = useState<string>('4');
  const [zakatMalAsset, setZakatMalAsset] = useState<string>('150000000'); // Di atas nisab mitsal 100jt
  
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

  // Kalkulasi Cepat Zakat Fitrah
  const hitungZakatFitrahVal = () => {
    const jiwa = parseInt(jumlahJiwa) || 0;
    return jiwa * fitrahKalkulasi;
  };

  // Kalkulasi Cepat Zakat Mal (2.5% jika mencapai nisab logam mulia mitsal 85 gram emas = ~R100.000.000)
  const hitungZakatMalVal = () => {
    const asset = parseFloat(zakatMalAsset) || 0;
    const nisabEmas = 100000000; // Standar nisab simulasi 85g emas
    if (asset >= nisabEmas) {
      return asset * 0.025;
    }
    return 0;
  };

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
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
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

        {/* Sisi Kanan: Kalkulator Zakat Interaktif Cepat */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-800">
              <Calculator className="w-5 h-5 text-amber-500" />
              <h3 className="font-display font-bold text-lg text-slate-900">Kalkulator Zakat</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Utiliti hitung cepat nisab dan taksiran kewajiban zakat Fitrah serta zakat Mal pengurus/muzakki.
            </p>

            <div className="border-b border-slate-100 pb-3">
              <label className="text-xs font-bold text-slate-700 block mb-1">A. ZAKAT FITRAH</label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <span className="text-[10px] text-slate-400">Harga Beras/Jiwa (Rp)</span>
                  <input 
                    type="number" 
                    value={fitrahKalkulasi} 
                    onChange={(e) => setFitrahKalkulasi(parseInt(e.target.value) || 0)}
                    className="w-full text-xs border border-slate-200 rounded px-2 py-1 mt-0.5 focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Jumlah Jiwa</span>
                  <input 
                    type="number" 
                    value={jumlahJiwa} 
                    onChange={(e) => setJumlahJiwa(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded px-2 py-1 mt-0.5 focus:outline-emerald-500"
                  />
                </div>
              </div>
              <div className="bg-emerald-50 p-2 rounded flex justify-between items-center border border-emerald-100">
                <span className="text-[11px] text-emerald-800 font-medium">Kewajiban Fitrah:</span>
                <span className="text-xs font-black text-emerald-900">{formatRupiah(hitungZakatFitrahVal())}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">B. ZAKAT MAL (Wajib bila &ge; Nisab)</label>
              <div className="mb-2">
                <span className="text-[10px] text-slate-400">Total Harta Tersimpan (1 tahun)</span>
                <input 
                  type="number" 
                  value={zakatMalAsset} 
                  onChange={(e) => setZakatMalAsset(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded px-2 py-1 mt-0.5 focus:outline-emerald-500"
                />
                <span className="text-[9px] text-slate-400 block mt-0.5">Asumsi nisab perak/emas perakitan: Rp100.000.000</span>
              </div>
              <div className="bg-amber-50 p-2 rounded flex justify-between items-center border border-amber-100">
                <span className="text-[11px] text-amber-800 font-medium font-sans">Kewajiban Mal (2.5%):</span>
                <span className="text-xs font-black text-amber-900">
                  {hitungZakatMalVal() > 0 ? formatRupiah(hitungZakatMalVal()) : 'Belum Wajib Nisab'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">
            Sesuai kualifikasi Fatwa MUI No. 14 / UU Pengelolaan Zakat No. 23 Tahun 2011.
          </div>
        </div>

      </div>

      {/* Bawah: Daftar Transaksi Terakhir & Keunggulan Al-Jihad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Transaksi Terakhir */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-display font-semibold text-slate-900">Setoran Penghimpunan Terbaru</h3>
              <p className="text-xs text-slate-400">Arus masuk dana dari para Muzakki & Munfiq dan amalan kebajikan</p>
            </div>
            <button 
              onClick={() => onNavigate('penghimpunan')}
              className="text-xs text-emerald-800 font-bold hover:underline"
            >
              Kelola Setoran &rarr;
            </button>
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
        </div>

      </div>

    </div>
  );
}
