import React, { useState } from 'react';
import { 
  BarChart, 
  Download, 
  Printer, 
  Layers, 
  FileCheck, 
  Building2, 
  Users, 
  Award,
  Wallet,
  Calendar,
  CheckCircle2,
  TableProperties
} from 'lucide-react';
import { SetoranDana, PenyaluranDana, DanaType, UserRole } from '../types';

interface LaporanProps {
  setoranList: SetoranDana[];
  penyaluranList: PenyaluranDana[];
  userRole?: UserRole;
}

export default function Laporan({ setoranList, penyaluranList, userRole }: LaporanProps) {
  const [laporanPeriode, setLaporanPeriode] = useState<'Harian' | 'Bulanan' | 'Triwulan' | 'Tahunan'>('Bulanan');
  const [laporanDestinasi, setLaporanDestinasi] = useState<'Semua' | 'Yayasan' | 'BAZNAS' | 'Publikasi'>('Semua');

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  // Kalkulasi Keuangan
  const getSubtotalPemasukan = (type: DanaType) => {
    return setoranList
      .filter(s => s.type === type)
      .reduce((sum, s) => sum + s.amount, 0);
  };

  const getSubtotalPenyaluran = (type: DanaType) => {
    return penyaluranList
      .filter(p => p.danaSourceType === type && (p.status === 'Penyaluran' || p.status === 'Dokumentasi'))
      .reduce((sum, p) => sum + p.amountApproved, 0);
  };

  const danaTypesList: DanaType[] = ['Zakat Fitrah', 'Zakat Mal', 'Infak', 'Sedekah', 'Wakaf'];

  const totalIn = setoranList.reduce((sum, s) => sum + s.amount, 0);
  const totalOut = penyaluranList
    .filter(p => p.status === 'Penyaluran' || p.status === 'Dokumentasi')
    .reduce((sum, p) => sum + p.amountApproved, 0);
  const saldoNetto = totalIn - totalOut;

  // Print function
  const triggerPrint = () => {
    window.print();
  };

  // CSV download function for all finances
  const downloadLaporanExcel = () => {
    const headers = ['Jenis Dana', 'Total Penghimpunan', 'Total Penyaluran', 'Saldo Sisa', 'Status Syariah'];
    const rows = danaTypesList.map(type => {
      const pin = getSubtotalPemasukan(type);
      const pout = getSubtotalPenyaluran(type);
      return [
        type,
        pin,
        pout,
        pin - pout,
        type.startsWith('Zakat') ? 'Tersalurkan khusus 8 Asnaf' : 'Tersalur sosial/operasional/amil'
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Rekapitulasi_Syariah_LAZ_${laporanPeriode}_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">

      {/* Filter Laporan Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        <div className="space-y-1">
          <h3 className="font-display font-semibold text-slate-800 text-lg">Pusat Laporan & Akuntabilitas Syariah</h3>
          <p className="text-xs text-slate-500">Pilah laporan untuk Yayasan Al Hamid Hadum, BAZNAS Kabupaten, maupun Publikasi Umum</p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Periode</span>
            <select 
              value={laporanPeriode}
              onChange={(e) => setLaporanPeriode(e.target.value as any)}
              className="text-xs border border-slate-200 rounded-lg p-1.5 focus:ring-1 focus:ring-emerald-500 outline-none font-semibold text-slate-700 bg-white"
            >
              <option value="Harian">Harian (MDT)</option>
              <option value="Bulanan">Bulanan (Kementerian)</option>
              <option value="Triwulan">Triwulan (Yayasan)</option>
              <option value="Tahunan">Tahunan (BAZNAS)</option>
            </select>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tujuan Salinan</span>
            <select 
              value={laporanDestinasi}
              onChange={(e) => setLaporanDestinasi(e.target.value as any)}
              className="text-xs border border-slate-200 rounded-lg p-1.5 focus:ring-1 focus:ring-emerald-500 outline-none font-semibold text-slate-700 bg-white"
            >
              <option value="Semua">Semua Penerima</option>
              <option value="Yayasan">Yayasan Al Hamid Hadum</option>
              <option value="BAZNAS">BAZNAS RI & Kemag</option>
              <option value="Publikasi">Papan Tempel Publikasi</option>
            </select>
          </div>

          <div className="flex items-end gap-1">
            <button 
              onClick={downloadLaporanExcel}
              className="p-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 flex items-center gap-1 cursor-pointer"
              title="Download format Excel/CSV"
            >
              <Download className="w-4 h-4" /> Excel
            </button>
            <button 
              onClick={triggerPrint}
              className="p-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-200 flex items-center gap-1 cursor-pointer"
              title="Cetak/Print Laporan"
            >
              <Printer className="w-4 h-4" /> Cetak
            </button>
          </div>

        </div>

      </div>

      {/* Tampilan Salinan Laporan sesuai Entitas Pilihan */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 print:shadow-none print:border-none">
        
        {/* Header Lembaran Resmi */}
        <div className="text-center space-y-2 border-b-2 border-black pb-5">
          <span className="text-[10px] font-black tracking-widest text-amber-600 block uppercase">
            LAPORAN REKAPITULASI DANA FILANTROPI ISLAM
          </span>
          <h2 className="text-xl md:text-2xl font-black font-display text-slate-900 uppercase">
            LAZ MDT AL JIHAD YAYASAN AL HAMID HADUM
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
            Kantor Cabang MDT Al Jihad, Kp. Hadum. Pembukuan Resmi Periode {laporanPeriode} per tanggal {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}.
          </p>
          <div className="inline-flex gap-4 pt-1 text-[10px] text-slate-400 font-mono">
            <span>Destinasi Laporan: {laporanDestinasi === 'Semua' ? 'Yayasan, BAZNAS & Publikasi' : `Salinan Khusus ${laporanDestinasi}`}</span>
            <span>|</span>
            <span>Status Audit: Internal Terverifikasi</span>
          </div>
        </div>

        {/* Seksi Ringkasan Total */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
            <span className="text-[10px] text-emerald-800 font-bold block uppercase tracking-wide">Total Penghimpunan Kas</span>
            <span className="text-lg font-black text-emerald-950 font-mono mt-1 block">
              {formatRupiah(totalIn)}
            </span>
            <span className="text-[9px] text-emerald-600 mt-1 block">Dari akumulasi seluruh setoran online & tunai</span>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-center">
            <span className="text-[10px] text-amber-800 font-bold block uppercase tracking-wide">Total Penyaluran Program</span>
            <span className="text-lg font-black text-amber-950 font-mono mt-1 block">
              {formatRupiah(totalOut)}
            </span>
            <span className="text-[9px] text-amber-600 mt-1 block">Tepat sasaran 8 asnaf dan urusan sosial</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-700 font-bold block uppercase tracking-wide">Saldo Netto Kas Tersedia</span>
            <span className="text-lg font-black text-emerald-900 font-mono mt-1 block">
              {formatRupiah(saldoNetto)}
            </span>
            <span className="text-[9px] text-slate-500 mt-1 block">Tersimpan di brankas Kantor &amp; Rekening Resmi BANK BRI</span>
          </div>
        </div>

        {/* Tabel Besar Posisi Keuangan per Dana */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
            <TableProperties className="w-4 h-4 text-emerald-600" />
            Lampiran I: Rekapitulasi per Kategori Amal (Zakat, Infak, Sedekah, Wakaf)
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-400 bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-3">Kategori Jenis Dana</th>
                  <th className="p-3 text-right">Pemasukan (Khidmat)</th>
                  <th className="p-3 text-right">Penyaluran (Tasharruf)</th>
                  <th className="p-3 text-right">Saldo Tersedia</th>
                  <th className="p-3">Aturan Syariat (Keterangan Penyaluran)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {danaTypesList.map((type) => {
                  const ins = getSubtotalPemasukan(type);
                  const outs = getSubtotalPenyaluran(type);
                  const sld = ins - outs;

                  return (
                    <tr key={type} className="hover:bg-slate-50/50">
                      <td className="p-3 font-semibold text-slate-800">{type}</td>
                      <td className="p-3 text-right font-semibold text-emerald-800 font-mono">{formatRupiah(ins)}</td>
                      <td className="p-3 text-right font-semibold text-amber-700 font-mono">{formatRupiah(outs)}</td>
                      <td className="p-3 text-right font-bold text-emerald-950 font-mono">{formatRupiah(sld)}</td>
                      <td className="p-3 text-[11px] text-slate-500 italic">
                        {type === 'Zakat Fitrah' && 'Mutlak ke 8 Asnaf Dhuafa sebelum Lebaran'}
                        {type === 'Zakat Mal' && 'Pembersihan harta usaha & tabungan nisab'}
                        {type === 'Infak' && 'Fleksibel untuk operasional MDT & bantuan guru'}
                        {type === 'Sedekah' && 'Sosial warga, tanggap kesehatan, santunan yatim'}
                        {type === 'Wakaf' && 'Aset produktif musholla/sumur madrasah Al-Jihad'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lembaran Audit Jejak Transaksi (Auditable Ledger Tracing) */}
        {userRole === 'admin_yayasan' ? (
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 text-center space-y-2 mt-4">
            <span className="text-emerald-800 text-xs font-black tracking-widest uppercase block">🔒 PROTOKOL PRIVASI INDIVIDUAL</span>
            <p className="text-[11px] text-slate-500 max-w-lg mx-auto">
              Sesuai dengan hak akses pengawasan <strong>Admin Yayasan</strong>, rincian slip harian dan data personal muzakki disangkal untuk kepatuhan perlindungan data publik. Hubungi Amil Bendahara umum untuk otorisasi pembukuan Excel/CSV lengkap.
            </p>
          </div>
        ) : (
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Lampiran II: Jejak Riwayat Setoran Terakhir (Minyak Pelacak Audit)
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px] text-slate-600">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-500">
                    <th className="p-2">No. Kwitansi</th>
                    <th className="p-2">Nama Muzakki</th>
                    <th className="p-2">Tipe Dana</th>
                    <th className="p-2">Keterangan Setoran</th>
                    <th className="p-2 text-right">Jumlah</th>
                    <th className="p-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {setoranList.slice(-6).map((s) => (
                    <tr key={s.id} className="border-b border-slate-100">
                      <td className="p-2 font-mono font-bold text-emerald-800">{s.noKwitansi}</td>
                      <td className="p-2 font-medium text-slate-800">{s.muzakkiName}</td>
                      <td className="p-2">{s.type}</td>
                      <td className="p-2 italic text-[10px]">"{s.keterangan}"</td>
                      <td className="p-2 text-right font-bold font-mono text-slate-900">{formatRupiah(s.amount)}</td>
                      <td className="p-2 text-center text-emerald-700 font-bold">✓ SAH</td>
                    </tr>
                  ))}
                  {setoranList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-slate-400 font-light">Belum ada rincian setoran sah.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Nota Kaki dan Tanda Tangan Kepengurusan */}
        <div className="pt-6 border-t border-slate-300">
          <p className="text-[10px] text-slate-400 italic text-center leading-relaxed">
            Laporan ini disusun secara otomatis oleh Sistem Terpadu LAZ MDT Al Jihad yang berada di bawah pengawasan langsung Dewan Syariah Pengurus Yayasan Al Hamid Hadum. Semua angka dapat dicocokkan langsung ke slip fisik atau nomor mutasi BANK BRI.
          </p>

          <div className="grid grid-cols-3 gap-4 text-xs text-center pt-6">
            <div>
              <span className="text-slate-400 block mb-10">Mewakili Pengurus Yayasan</span>
              <span className="font-bold text-slate-800 block underline underline-offset-2">Holid Assad, S.Pd</span>
              <span className="text-[10px] text-slate-400">Pembina Yayasan Al Hamid Hadum</span>
            </div>

            <div>
              <span className="text-slate-400 block mb-10">Bendahara Umum LAZ</span>
              <span className="font-bold text-slate-800 block underline underline-offset-2">Rahmi Rahmawati</span>
              <span className="text-[10px] text-slate-400">Amil Bendahara</span>
            </div>

            <div>
              <span className="text-slate-400 block mb-10">Ketua Pelaksana LAZ</span>
              <span className="font-bold text-slate-800 block underline underline-offset-2">Reni Nurhayani, M.Pd.</span>
              <span className="text-[10px] text-slate-400">Direktur Eksekutif</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
