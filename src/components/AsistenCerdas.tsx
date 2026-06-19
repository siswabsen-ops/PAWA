import React, { useState } from 'react';
import { 
  Compass, 
  HelpCircle, 
  BookOpen, 
  PhoneCall, 
  MessageSquare, 
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Send,
  Calculator,
  Coins,
  Info
} from 'lucide-react';

interface AsistenCerdasProps {
  userRole: string;
  currentUser?: {
    username: string;
    fullName: string;
    role: string;
    email?: string;
  };
}

export default function AsistenCerdas({ userRole, currentUser }: AsistenCerdasProps) {
  const [phoneNo, setPhoneNo] = useState('');
  const [category, setCategory] = useState('Cara Input Setoran Baru');
  const [message, setMessage] = useState('');

  // Sensus Kalkulator Zakat States
  const [fitrahKalkulasi, setFitrahKalkulasi] = useState<number>(45000);
  const [jumlahJiwa, setJumlahJiwa] = useState<string>('4');
  const [zakatMalAsset, setZakatMalAsset] = useState<string>('150000000');

  const hitungZakatFitrahVal = () => {
    const jiwa = parseInt(jumlahJiwa) || 0;
    return jiwa * fitrahKalkulasi;
  };

  const hitungZakatMalVal = () => {
    const asset = parseFloat(zakatMalAsset) || 0;
    const nisabEmas = 100000000; // Standar nisab Rp100.000.000
    if (asset >= nisabEmas) {
      return asset * 0.025;
    }
    return 0;
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const currentName = currentUser?.fullName || 'Tamu / Umum';
  const roleName = currentUser?.role === 'donatur' ? 'Muzakki / Donatur Publik' : (
    currentUser?.role === 'admin_yayasan' ? 'Admin Yayasan' : (
      currentUser?.role === 'ketua_laz' ? 'Ketua LAZ' : (
        currentUser?.role === 'bendahara' ? 'Bendahara LAZ' : (
          currentUser?.role === 'sekretaris' ? 'Sekretaris' : 'Tim Lapangan'
        )
      )
    )
  );

  // Generate WhatsApp text
  const waText = `*Pusat Bantuan LAZ Al-Jihad Digital*\n\n` +
                 `*Nama Pengirim*: ${currentName}\n` +
                 `*Peran Sistem*: ${roleName}\n` +
                 `*Nomor HP Terkait*: ${phoneNo || '-'}\n` +
                 `*Kategori Masalah*: ${category}\n` +
                 `*Deskripsi Kendala/Pertanyaan*:\n"${message || 'Halo Admin, saya butuh bantuan terkait sistem LAZ.'}"`;

  const waUrl = `https://wa.me/628211857851?text=${encodeURIComponent(waText)}`;

  return (
    <div className="space-y-6">
      
      {/* Grid Bantuan & Panduan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Sisi Kiri: Petunjuk Singkat Panduan Operasional / Bantuan */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <h3 className="font-display font-semibold text-slate-800 text-lg">Panduan Operasional</h3>
          </div>

          <div className="space-y-4 text-xs text-slate-600">
            
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 space-y-1.5">
              <span className="font-bold text-emerald-950 block">1. Cara Mencatat Dana Masuk</span>
              <p className="leading-relaxed">
                Buka menu <strong>"Penghimpunan"</strong>. Isi nama muzakki/donatur, nomor HP, jumlah nominal, jenis amal (fitrah, mal, infak, sedekah, wakaf) dan klik <strong>"Catat &amp; Ambil Kwitansi"</strong>. Klik tombol <strong>"Cetak"</strong> untuk memunculkan slip PDF resmi beraudit.
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 space-y-1.5">
              <span className="font-bold text-amber-900 block">2. Cara Verifikasi Mustahik</span>
              <p className="leading-relaxed">
                Buka menu <strong>"Mustahik"</strong>. Masukkan identitas dhuafa serta kelompok asnafnya. Tim Sekretaris/Admin dapat mengklik <strong>"Ubah Status Verifikasi"</strong> untuk mengaudit kelayakan dhuafa (Belum Diperiksa &rarr; Layak &rarr; Tidak Layak) dilengkapi pertimbangan tertulis.
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200/60 space-y-1.5">
              <span className="font-bold text-blue-900 block">3. Cara Penyaluran &amp; Tanda Tangan</span>
              <p className="leading-relaxed">
                Buka menu <strong>"Penyaluran"</strong>. Buat agenda program bantuan. Pipa alur kerja akan mengawal prosesnya. Ketika berstatus <strong>"Penyaluran"</strong>, Anda dapat menekan tombol <strong>"Isi Tanda Terima Digital &amp; Bukti Foto"</strong> untuk menggambar tanda tangan di layar secara langsung!
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-800 block">4. Pengaturan Hak Akses Berjenjang</span>
              <p className="leading-relaxed">
                Lembaga amil dilindungi oleh sistem kualifikasi peran. Anda dapat menyimulasikan peran sebagai <strong>Bendahara, Ketua, Sekretaris, Lapangan,</strong> atau <strong>Donatur</strong> menggunakan tombol pemilih peran yang terletak di sudut kanan atas menu utama.
              </p>
            </div>

          </div>

        </div>

        {/* Sisi Kanan: Formulir Bantuan WhatsApp Gateway */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Header Bantuan */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-150">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shadow-sm">
                  <MessageSquare className="w-5 h-5 text-emerald-700 " />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm font-display uppercase tracking-tight">Hubungi Layanan WhatsApp Gateway</h4>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Layanan Terpusat Ke No. WA 08211857851</p>
                </div>
              </div>
              
              <span className="text-[10px] bg-slate-100 text-slate-500 font-mono font-bold px-2 py-1 rounded">
                ONLINE
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
              <span className="text-[10px] text-emerald-800 font-black tracking-widest uppercase block">ℹ️ SISTEM DUKUNGAN OFF-GRID</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Halo <strong>{currentName}</strong> ({roleName}). Di sini Anda dapat mengirimkan laporan kendala, pertanyaan syariah, atau usul pengembangan langsung kepada administrator LAZ Al Jihad via server WhatsApp Gateway. Isi formulir berikut guna memudahkan peninjauan.
              </p>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mb-1">Nama Pengirim</label>
                  <input 
                    type="text" 
                    value={currentName} 
                    disabled 
                    className="w-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200 px-3 py-2 rounded-xl cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mb-1">Peran Akses</label>
                  <input 
                    type="text" 
                    value={roleName} 
                    disabled 
                    className="w-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200 px-3 py-2 rounded-xl cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mb-1">Nomor HP Hubungi Balik (Opsional)</label>
                  <input 
                    type="tel" 
                    placeholder="Contoh: 0821xxxxxxx" 
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-250 px-3 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mb-1">Kategori Bantuan</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-250 px-3 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
                  >
                    <option value="Cara Input Setoran Baru">Cara Input Setoran Baru</option>
                    <option value="Konsultasi Syariat / Hak Amil">Konsultasi Syariat / Hak Amil</option>
                    <option value="Cetak Kuitansi / Laporan PDF">Cetak Kuitansi / Laporan PDF</option>
                    <option value="Perbaikan Bug / Saran Sistem">Perbaikan Bug / Saran Sistem</option>
                    <option value="Koneksi Rekening bank BRI">Koneksi Rekening bank BRI</option>
                    <option value="Pertanyaan Umum / Lainnya">Pertanyaan Umum / Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mb-1">Detail Kendala atau Pertanyaan</label>
                <textarea 
                  rows={3}
                  placeholder="Tuliskan keluhan atau pesan Anda di sini secara jelas. Misalnya: Kwitansi setoran donasi Zakat Mal #8812 tidak muncul ketika dicetak..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-250 px-3 py-2.5 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 leading-relaxed"
                  required
                />
              </div>
            </div>

          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
            <p className="text-[10px] text-slate-400 leading-tight">
              Setelah mengklik kirim, browser Anda akan dialihkan ke aplikasi WhatsApp untuk menyelesaikan pengiriman pesan.
            </p>

            <a 
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" /> Kirim Bantuan via WhatsApp
            </a>
          </div>

        </div>

      </div>

      {/* KOLOM BARU KALKULATOR ZAKAT DI BAWAH LAYANAN BANTUAN */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4 text-emerald-800">
          <Calculator className="w-5 h-5 text-amber-500 animate-pulse" />
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900">Kalkulator Zakat Interaktif</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Utiliti hitung cepat nisab dan taksiran kewajiban zakat Fitrah serta zakat Mal pengurus/muzakki.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SENSOR A: ZAKAT FITRAH */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-extrabold text-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-600" /> A. ZAKAT FITRAH
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Harga Beras/Jiwa (Rp)</label>
                <input 
                  type="number" 
                  value={fitrahKalkulasi} 
                  onChange={(e) => setFitrahKalkulasi(parseInt(e.target.value) || 0)}
                  className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-emerald-500 shadow-sm"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Jumlah Jiwa</label>
                <input 
                  type="number" 
                  value={jumlahJiwa} 
                  onChange={(e) => setJumlahJiwa(e.target.value)}
                  className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-emerald-500 shadow-sm"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 p-4 rounded-xl text-white flex justify-between items-center shadow">
              <div>
                <span className="text-[10px] text-emerald-250 font-bold uppercase tracking-wider block">Kewajiban Fitrah</span>
                <span className="text-sm font-black tracking-wide">Kewajiban Total</span>
              </div>
              <span className="text-lg font-black font-mono text-amber-300">
                {formatRupiah(hitungZakatFitrahVal())}
              </span>
            </div>
          </div>

          {/* SENSOR B: ZAKAT MAL */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-extrabold text-amber-800 uppercase tracking-widest flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-600" /> B. ZAKAT MAL (Wajib &ge; Nisab)
            </h4>

            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Total Harta Tersimpan (1 Tahun)</label>
              <input 
                type="number" 
                value={zakatMalAsset} 
                onChange={(e) => setZakatMalAsset(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-emerald-500 shadow-sm"
              />
              <span className="text-[9px] text-slate-400 block mt-1 leading-normal flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                Asumsi nisab perak/emas perakitan: Rp100.000.000 (Setara 85g emas)
              </span>
            </div>

            <div className="bg-gradient-to-r from-amber-600 to-amber-800 p-4 rounded-xl text-white flex justify-between items-center shadow">
              <div>
                <span className="text-[10px] text-amber-200 font-bold uppercase tracking-wider block">Kewajiban Mal (2.5%)</span>
                <span className="text-sm font-black tracking-wide">
                  {parseFloat(zakatMalAsset) >= 100000000 ? 'Sudah Wajib Nisab' : 'Belum Wajib Nisab'}
                </span>
              </div>
              <span className="text-lg font-black font-mono text-white">
                {hitungZakatMalVal() > 0 ? formatRupiah(hitungZakatMalVal()) : 'Belum Wajib'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-[10px] text-slate-400">
          *Formulasi dihitung otomatis secara syar'i sesuai Fatwa MUI No. 14 / UU Pengelolaan Zakat No. 23 Tahun 2011.
        </div>
      </div>

    </div>
  );
}
