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
  Send
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
                <MessageSquare className="w-5 h-5 text-emerald-700 animate-pulse" />
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
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
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
  );
}
