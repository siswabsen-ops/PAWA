import React, { useState } from 'react';
import { 
  Building2, 
  Target, 
  BookOpen, 
  Info, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Award, 
  ShieldCheck, 
  HeartHandshake,
  ExternalLink,
  Lock,
  Unlock,
  Key,
  RefreshCw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface ProfilLembagaProps {
  currentUser?: UserProfile;
  roleCodes?: Record<string, { role: UserRole; username: string; fullName: string; email: string; label: string }>;
  onUpdateRoleCodes?: (newCodes: Record<string, { role: UserRole; username: string; fullName: string; email: string; label: string }>) => void;
}

export default function ProfilLembaga({ currentUser, roleCodes, onUpdateRoleCodes }: ProfilLembagaProps) {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!roleCodes || !onUpdateRoleCodes || !currentUser) {
      setErrorMessage('Konfigurasi sistem keamanan tidak merespon.');
      return;
    }

    // Find the current code for their role
    const currentCodeKey = Object.keys(roleCodes).find(
      key => roleCodes[key].role === currentUser.role
    );

    if (!currentCodeKey) {
      setErrorMessage('Terjadi kesalahan: Peran Anda tidak terdaftar dalam database lokal.');
      return;
    }

    if (oldPin.trim().toUpperCase() !== currentCodeKey.toUpperCase()) {
      setErrorMessage('Kode akses lama yang Anda masukkan tidak sesuai. Harap periksa kembali pin Anda!');
      return;
    }

    const cleanNewPin = newPin.trim().toUpperCase();
    if (cleanNewPin.length < 4) {
      setErrorMessage('Kode akses baru minimal harus terdiri dari 4 karakter.');
      return;
    }

    if (cleanNewPin === currentCodeKey.toUpperCase()) {
      setErrorMessage('Kode akses baru tidak boleh sama dengan kode akses saat ini.');
      return;
    }

    if (cleanNewPin !== confirmPin.trim().toUpperCase()) {
      setErrorMessage('Konfirmasi kode akses baru tidak cocok. Harap ketik ulang untuk kesamaan PIN.');
      return;
    }

    // Check conflict: is this dynamic PIN already used by another role?
    const conflictRole = Object.keys(roleCodes).find(
      key => key.toUpperCase() === cleanNewPin && roleCodes[key].role !== currentUser.role
    );
    if (conflictRole) {
      setErrorMessage(`Kode akses "${cleanNewPin}" sudah digunakan oleh peran ${roleCodes[conflictRole].label}. Harap gunakan kode unik lain!`);
      return;
    }

    // Success - let's replace!
    const updatedCodes = { ...roleCodes };
    const roleDetails = updatedCodes[currentCodeKey];
    delete updatedCodes[currentCodeKey];
    updatedCodes[cleanNewPin] = roleDetails;

    onUpdateRoleCodes(updatedCodes);
    setSuccessMessage(`Sukses! Kode akses (${roleDetails.label}) berhasil diubah menjadi "${cleanNewPin}". Harap simpan dan gunakan kode baru ini pada login berikutnya.`);
    
    // Clear inputs
    setOldPin('');
    setNewPin('');
    setConfirmPin('');
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Banner / Header Profil */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-3xl p-6 md:p-8 border-b-4 border-[#D4AF37] shadow-xl relative overflow-hidden">
        {/* Subtle background pattern decoration */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-1/4 translate-x-1/4">
          <Building2 className="w-96 h-96" />
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-black uppercase tracking-wider border border-amber-300/20">
            <Award className="w-3.5 h-3.5" /> PROFIL RESMI LEMBAGA
          </div>

          <h2 className="text-2xl md:text-3xl font-black font-display tracking-tight leading-tight uppercase">
            LEMBAGA AMIL ZAKAT, INFAK DAN SEDEKAH <br/>
            <span className="text-amber-300 text-3xl md:text-4xl">MDT AL JIHAD</span>
          </h2>
          
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-medium">
            Lembaga pengelola filantropi Islam terpadu yang berada di bawah naungan resmi Yayasan Al Hamid Hadum, berdedikasi membangun kemandirian umat, kesejahteraan dhuafa, dan kelancaran sarana pendidikan agama Islam.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-[11px] md:text-xs">
            <span className="flex items-center gap-1.5 bg-emerald-900/50 px-3 py-1.5 rounded-lg border border-emerald-750">
              <Calendar className="w-3.5 h-3.5 text-amber-300" /> Didirikan: <strong className="text-white">2026</strong>
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-900/50 px-3 py-1.5 rounded-lg border border-emerald-750">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" /> Naungan: <strong className="text-white">Yayasan Al Hamid Hadum</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Informasi Institusi & Kontak Serta Visi Misi */}
        <div className="lg:col-span-2 space-y-6">

          {/* Visi & Misi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* VISI CARD */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg">
                    <Target className="w-5 h-5 text-emerald-700" />
                  </div>
                  <h3 className="font-display font-bold text-slate-800 text-base uppercase tracking-wider">🎯 VISI KAMI</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">
                  "Menjadi lembaga pengelola zakat, infak, sedekah, dan wakaf yang amanah, profesional, transparan, serta terpercaya, guna mendukung kemajuan pendidikan agama dan meningkatkan kesejahteraan masyarakat di lingkungan binaan."
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-50 text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Berlandaskan Syariah Islam dan UU Filantropi
              </div>
            </div>

            {/* MISI CARD */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg">
                    <BookOpen className="w-5 h-5 text-emerald-700" />
                  </div>
                  <h3 className="font-display font-bold text-slate-800 text-base uppercase tracking-wider">📜 MISI KAMI</h3>
                </div>
                
                <ul className="text-xs text-slate-600 space-y-2.5">
                  <li className="flex gap-2 items-start">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span>Menghimpun dana zakat, infak, sedekah, dan wakaf sesuai ketentuan syariat Islam.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>Mengelola keuangan secara rapi, terpisah antar jenis dana, dan akuntabel.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>Menyalurkan bantuan secara tepat sasaran dan tepat waktu kepada asnaf penerima.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">4</span>
                    <span>Mendukung operasional, fasilitas, dan program pendidikan santri di MDT Al Jihad.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">5</span>
                    <span>Meningkatkan kesadaran umat akan pentingnya zakat, infak, dan sedekah.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>

          {/* Sekilas Tentang Section */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="p-2 bg-amber-50 text-amber-800 rounded-lg">
                <Info className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="font-display font-bold text-slate-800 text-lg">💡 SEKILAS TENTANG LEMBAGA KAMI</h3>
            </div>

            <div className="text-xs text-slate-600 space-y-4 leading-relaxed font-normal">
              <p>
                <strong>LAZ MDT Al Jihad</strong> adalah unit pelaksana teknis yang bergerak di bidang pengelolaan dana sosial keagamaan, berada di bawah pembinaan dan tanggung jawab penuh Yayasan Al Hamid Hadum. Berdiri sejak tahun 2026, lembaga ini hadir sebagai perantara yang menghubungkan keinginan beramal dari masyarakat dengan kebutuhan warga yang memerlukan bantuan, sekaligus menjadi penopang utama kegiatan pendidikan dan keagamaan di lingkungan MDT Al Jihad.
              </p>
              <p>
                Dalam menjalankan tugasnya, LAZ MDT Al Jihad menerapkan prinsip <strong>Sesuai Syariat, Amanah, Transparan, Akuntabel, dan Tepat Sasaran</strong>. Seluruh proses pengelolaan didukung oleh sistem digital terpadu pelaporan real-time agar lebih efisien, cepat, serta memudahkan pemantauan dan pertanggungjawaban kepada pemberi dana (muzakki/donatur), pengurus yayasan, dan masyarakat luas.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Kepatuhan</span>
                <span className="text-xs font-black text-emerald-800 block mt-0.5">100% Syariat</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Audit Dana</span>
                <span className="text-xs font-black text-emerald-800 block mt-0.5">Transparan</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Penyaluran</span>
                <span className="text-xs font-black text-emerald-800 block mt-0.5">Tepat Sasaran</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Fasilitas</span>
                <span className="text-xs font-black text-emerald-800 block mt-0.5">Digital Terpadu</span>
              </div>
            </div>
          </div>

          {/* KARTU PENGATURAN GANTI KODE AKSES */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="p-2 bg-amber-50 text-amber-800 rounded-lg">
                <Lock className="w-5 h-5 text-amber-700 animate-pulse" />
              </div>
              <div>
                <h3 className="font-display font-black text-slate-800 text-sm tracking-tight uppercase">⚙️ Pengaturan Keamanan Kode Akses</h3>
                <p className="text-[10px] text-slate-400 font-semibold leading-normal">Kustomisasi kode PIN/Password verifikasi untuk para pengurus amil terdaftar.</p>
              </div>
            </div>

            {currentUser && currentUser.role !== 'donatur' ? (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-xs font-semibold flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-650 mt-0.5 animate-bounce" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-3 text-xs font-bold flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-650 shrink-0 mt-0.5 animate-bounce" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mb-1">Akun Pengurus Aktif</label>
                    <input 
                      type="text" 
                      value={`${currentUser.fullName} (${currentUser.role === 'admin_yayasan' ? 'Admin' : currentUser.role === 'ketua_laz' ? 'Ketua LAZ' : currentUser.role === 'bendahara' ? 'Bendahara' : currentUser.role === 'sekretaris' ? 'Sekretaris' : 'Tim Lapangan'})`} 
                      disabled 
                      className="w-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200 px-3 py-2.5 rounded-xl cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wide block mb-1 text-slate-550">Kode Akses saat ini (Lama)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Key className="w-4 h-4" />
                      </div>
                      <input 
                        type="password"
                        placeholder="Ketik Kode Saat Ini"
                        value={oldPin}
                        onChange={(e) => setOldPin(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-black focus:bg-white focus:outline-emerald-500 tracking-widest text-slate-900 uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block mb-1 text-emerald-800">Kode Akses / PIN Baru</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input 
                        type="password"
                        placeholder="Contoh: PINBARU9"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-emerald-250 rounded-xl text-xs font-mono font-black focus:bg-white focus:outline-emerald-500 tracking-widest text-slate-900 uppercase"
                      />
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 block font-semibold">Min. 4 karakter (Huruf/Angka)</span>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-455 font-bold uppercase tracking-wider block mb-1 text-emerald-800">Ulangi Kode Baru</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <input 
                        type="password"
                        placeholder="Ulangi Kode Baru"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-emerald-250 rounded-xl text-xs font-mono font-black focus:bg-white focus:outline-emerald-500 tracking-widest text-slate-900 uppercase"
                      />
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 block font-semibold">Pastikan penulisan kode cocok</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button 
                    type="submit"
                    className="bg-emerald-800 hover:bg-emerald-950 text-white font-black text-xs px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer uppercase tracking-wider"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Hubungkan &amp; Simpan Kode Baru
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center space-y-3">
                <p className="text-xs text-slate-650 font-medium leading-relaxed">
                  🔒 Anda saat ini sedang mengakses program sebagai <strong>Masyarakat / Donatur Umum</strong> (tidak memiliki akun pengurus terautentikasi). 
                </p>
                <p className="text-[11px] text-slate-400 font-semibold leading-normal">
                  Hanya pengurus yang masuk (Admin Yayasan, Ketua, Bendahara, Sekretaris, Lapangan) yang dapat memodifikasi password PIN pengaman di panel ini.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Kolom Kanan: Detail Informasi Hubungi / Kantor */}
        <div className="lg:col-span-1 space-y-6">

          {/* Kartu Profil Singkat */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Building2 className="w-5 h-5 text-emerald-700" />
              <h3 className="font-display font-semibold text-slate-800 text-sm">Status Legalitas &amp; Alamat</h3>
            </div>

            <div className="space-y-4 text-xs text-slate-650">
              
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Nama Resmi Lembaga</span>
                <span className="font-bold text-slate-800 text-xs">LAZ MDT Al Jihad</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Tahun Beroperasi</span>
                <span className="font-bold text-slate-800 text-xs">Sejak 2026</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Badan Hukum / Pembina</span>
                <span className="font-bold text-slate-800 text-xs">Yayasan Al Hamid Hadum</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Alamat Lengkap Kantor
                </span>
                <p className="text-slate-700 leading-relaxed font-semibold mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  Kp. Bantarjati RT.02 RW.08, Desa Bagendit, Kecamatan Banyuresmi, Kabupaten Garut, Jawa Barat
                </p>
              </div>

            </div>
          </div>

          {/* Kartu Hubungi Kami / Kontak */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-6 border border-amber-200/40 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-amber-200/50">
              <Phone className="w-5 h-5 text-amber-800 animate-bounce" />
              <h3 className="font-display font-semibold text-amber-950 text-sm">Pusat Informasi &amp; Kontak</h3>
            </div>

            <p className="text-[11px] text-amber-900 font-medium">
              Silakan hubungi staf kesekretariatan kami untuk informasi program, jemput donasi, atau ketersediaan berkas audit offline.
            </p>

            <div className="space-y-3.5 text-xs">
              
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 bg-emerald-800 text-white rounded-lg shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] text-amber-800 block font-bold uppercase tracking-wide">WhatsApp</span>
                  <a 
                    href="https://wa.me/628211857851" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="font-mono font-bold text-slate-900 border-b border-dashed border-slate-400 hover:text-emerald-800 flex items-center gap-1"
                  >
                    08211857851 <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1.5 bg-emerald-800 text-white rounded-lg shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] text-amber-800 block font-bold uppercase tracking-wide">Surel / Email</span>
                  <a 
                    href="mailto:mdtaljihad2026@gmail.com" 
                    className="font-mono font-bold text-slate-900 border-b border-dashed border-slate-400 hover:text-emerald-800"
                  >
                    mdtaljihad2026@gmail.com
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Slogan Kebajikan / Syiar */}
          <div className="bg-emerald-900 text-white rounded-2xl p-5 border border-amber-500/15 text-center space-y-2">
            <HeartHandshake className="w-6 h-6 text-amber-400 mx-auto" />
            <p className="font-serif italic text-xs leading-relaxed text-slate-100">
              "Ambilah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan mensucikan mereka..."
            </p>
            <span className="text-[10px] text-amber-300 font-semibold block uppercase">— QS. At-Taubah: 103</span>
          </div>

        </div>

      </div>

    </div>
  );
}
