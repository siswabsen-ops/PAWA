import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MapPin, 
  Scale, 
  CheckCircle, 
  XCircle, 
  Hourglass, 
  ClipboardCheck,
  AlertCircle
} from 'lucide-react';
import { MustahikProfile, AsnafType, VerifikasiStatus } from '../types';

interface MustahikProps {
  mustahikList: MustahikProfile[];
  onAddMustahik: (newMustahik: MustahikProfile) => void;
  onVerifyMustahik: (id: string, status: VerifikasiStatus, catatan: string) => void;
  userRole: string;
}

const ASNAF_OPTIONS: AsnafType[] = [
  'Fakir',
  'Miskin',
  'Amil',
  'Muallaf',
  'Riqab',
  'Gharimin',
  'Fisabilillah',
  'Ibnu Sabil'
];

export default function Mustahik({ mustahikList, onAddMustahik, onVerifyMustahik, userRole }: MustahikProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAsnaf, setFilterAsnaf] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Register Form State
  const [nama, setNama] = useState('');
  const [identitasNo, setIdentitasNo] = useState('');
  const [phone, setPhone] = useState('');
  const [alamat, setAlamat] = useState('');
  const [asnaf, setAsnaf] = useState<AsnafType>('Miskin');
  const [penghasilan, setPenghasilan] = useState('');
  const [tanggungan, setTanggungan] = useState('');
  const [kondisiRumah, setKondisiRumah] = useState('');
  
  // Auditing / Verification State
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const [auditStatus, setAuditStatus] = useState<VerifikasiStatus>('Layak');
  const [auditCatatan, setAuditCatatan] = useState('');

  // Info alerts
  const [formErr, setFormErr] = useState('');
  const [formOk, setFormOk] = useState('');

  // Sesuai rules: Sekretaris, Admin Yayasan, Ketua LAZ have access
  const canRegister = userRole === 'admin_yayasan' || userRole === 'sekretaris' || userRole === 'ketua_laz';
  const canVerify = userRole === 'admin_yayasan' || userRole === 'ketua_laz' || userRole === 'sekretaris';

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErr('');
    setFormOk('');

    if (!canRegister) {
      setFormErr('Hak Akses Terbatas. Hanya Sekretaris, Admin Yayasan, atau Ketua yang dapat meregistrasi calon Mustahik.');
      return;
    }

    if (!nama.trim() || !identitasNo.trim()) {
      setFormErr('Nama Lengkap dan No. Identitas KTP/KK wajib diisi.');
      return;
    }

    const incomeVal = parseFloat(penghasilan) || 0;
    const kidsVal = parseInt(tanggungan) || 0;

    const newMustahik: MustahikProfile = {
      id: Math.random().toString(36).substring(2, 9),
      nama,
      identitasNo,
      phone,
      alamat,
      asnaf,
      penghasilan: incomeVal,
      tanggungan: kidsVal,
      kondisiRumah: kondisiRumah || 'Kondisi bangunan kayu/sederhana',
      statusVerifikasi: 'Belum Diperiksa',
      catatanVerifikasi: 'Sedang menunggu pemeriksaan berkas oleh tim Sekretariat lapangan.',
      riwayatBantuanIds: []
    };

    onAddMustahik(newMustahik);
    setFormOk(`Berhasil mendaftarkan calon mustahik baru: ${nama}.`);
    
    // Clear
    setNama('');
    setIdentitasNo('');
    setPhone('');
    setAlamat('');
    setPenghasilan('');
    setTanggungan('');
    setKondisiRumah('');
  };

  const submitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuditId) return;

    onVerifyMustahik(selectedAuditId, auditStatus, auditCatatan);
    setSelectedAuditId(null);
    setAuditCatatan('');
  };

  // Searching filter logic
  const filteredList = mustahikList.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.identitasNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.alamat.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAsnaf = filterAsnaf === 'All' ? true : item.asnaf === filterAsnaf;
    const matchesStatus = filterStatus === 'All' ? true : item.statusVerifikasi === filterStatus;

    return matchesSearch && matchesAsnaf && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Panel Pendaftaran Mustahik Baru */}
        <div id="panel_pendaftaran" className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <UserPlus className="w-5 h-5 text-emerald-600" />
            <h3 className="font-display font-semibold text-slate-800 text-lg">Pendaftaran Calon Mustahik</h3>
          </div>

          {!canRegister ? (
            <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-200 text-xs flex gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <div>
                <span className="font-bold">Akses Penulis Terbatas:</span> Login Anda sebagai <strong>{userRole}</strong> tidak memiliki otorisasi menulis data pemohon baru. Silakan ubah peran di header jika dibutuhkan.
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Nama Mustahik Lengkap *</label>
                <input 
                  type="text"
                  placeholder="Contoh: Ibu Minah binti Kodir"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">No. KTP / KK *</label>
                  <input 
                    type="text"
                    placeholder="Contoh: 3201..."
                    value={identitasNo}
                    onChange={(e) => setIdentitasNo(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Pilihan Asnaf *</label>
                  <select 
                    value={asnaf}
                    onChange={(e) => setAsnaf(e.target.value as AsnafType)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none font-bold text-slate-700 bg-white"
                  >
                    {ASNAF_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">No. Kontak / WA</label>
                  <input 
                    type="tel"
                    placeholder="Contoh: 0857..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Uang Masuk / Bln (Rp)</label>
                  <input 
                    type="number"
                    placeholder="Contoh: 800000"
                    value={penghasilan}
                    onChange={(e) => setPenghasilan(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Jml Tanggungan Jiwa</label>
                  <input 
                    type="number"
                    placeholder="Contoh: 3"
                    value={tanggungan}
                    onChange={(e) => setTanggungan(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Spesifikasi Alamat RT/RW</label>
                  <input 
                    type="text"
                    value={alamat}
                    placeholder="RT 02 RW 03 Kp. Hadum"
                    onChange={(e) => setAlamat(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Kondisi Rumah & Layak Bantu</label>
                <textarea 
                  placeholder="Misal: Dinding bilik tipis, atap bocor, menumpang di tanah pekarangan musholla..."
                  value={kondisiRumah}
                  onChange={(e) => setKondisiRumah(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none h-14 resize-none"
                />
              </div>

              {formErr && (
                <div className="text-[11px] text-red-600 font-medium bg-red-50 p-2 rounded border border-red-200">{formErr}</div>
              )}
              {formOk && (
                <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-2 rounded border border-emerald-200">{formOk}</div>
              )}

              <button 
                type="submit" 
                className="w-full py-2.5 bg-emerald-800 text-white hover:bg-emerald-950 transition-colors rounded-lg font-bold text-xs border border-amber-500/20 cursor-pointer flex justify-center items-center gap-1.5 shadow-sm"
              >
                Simpan Calon Mustahik
              </button>
            </form>
          )}

        </div>

        {/* Direktori Mustahik dan Audit Verifikasi */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          
          <div>
            <h3 className="font-display font-semibold text-slate-800 text-lg">Direktori & Verifikasi Mustahik (8 Asnaf)</h3>
            <p className="text-xs text-slate-400">Total data terdaftar: {filteredList.length} dhuafa / asnaf penerima manfaat</p>
          </div>

          {/* Search, Filter Asnaf, Filter Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Cari Mustahik (Nama, NIK, RT)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <select
                value={filterAsnaf}
                onChange={(e) => setFilterAsnaf(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 outline-none font-medium text-slate-700 bg-white"
              >
                <option value="All">Semua Asnaf</option>
                {ASNAF_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 outline-none font-medium text-slate-700 bg-white"
              >
                <option value="All">Semua Status</option>
                <option value="Belum Diperiksa">Belum Diperiksa</option>
                <option value="Layak">Layak</option>
                <option value="Tidak Layak">Tidak Layak</option>
              </select>
            </div>
          </div>

          {/* List Card Grid View - Mobile Friendly & responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredList.map((item) => {
              const statusClass: Record<VerifikasiStatus, string> = {
                'Belum Diperiksa': 'bg-amber-50 text-amber-800 border-amber-200',
                'Layak': 'bg-emerald-50 text-emerald-800 border-emerald-200',
                'Tidak Layak': 'bg-rose-50 text-rose-800 border-rose-200'
              };

              const statusIcon: Record<VerifikasiStatus, any> = {
                'Belum Diperiksa': <Hourglass className="w-3.5 h-3.5 text-amber-600" />,
                'Layak': <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />,
                'Tidak Layak': <XCircle className="w-3.5 h-3.5 text-rose-600" />
              };

              return (
                <div key={item.id} className="border border-slate-100 p-4 rounded-xl flex flex-col justify-between hover:border-emerald-500/30 hover:shadow-sm transition-all space-y-3 relative overflow-hidden bg-slate-50/50">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start gap-1">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded mr-1.5">
                          Asnaf {item.asnaf}
                        </span>
                        <h4 className="text-sm font-bold text-slate-800 inline-block">{item.nama}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border flex items-center gap-1 flex-shrink-0 ${statusClass[item.statusVerifikasi]}`}>
                        {statusIcon[item.statusVerifikasi]} {item.statusVerifikasi}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-1">
                      <p className="flex items-center gap-1"><span className="font-semibold text-slate-400">NIK:</span> {item.identitasNo}</p>
                      <p className="flex items-center gap-1"><span className="font-semibold text-slate-400">Kontak:</span> {item.phone || 'Tanpa Kontak WA'}</p>
                      <p className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {item.alamat || 'Alamat Belum Lengkap'}</p>
                      
                      <div className="bg-white p-2 rounded-lg border border-slate-100 grid grid-cols-2 gap-1 my-1">
                        <div>
                          <span className="block text-[9px] text-slate-400 uppercase">Tanggungan</span>
                          <span className="font-bold text-slate-800 text-[11px]">{item.tanggungan} Jiwa</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-slate-400 uppercase">Pemasukan</span>
                          <span className="font-bold text-slate-800 text-[11px]">{formatRupiah(item.penghasilan)}/bln</span>
                        </div>
                      </div>

                      <p className="font-serif italic text-slate-500 bg-amber-500/5 p-1 px-2 rounded border border-amber-500/10 text-[10px]">
                        "{item.kondisiRumah}"
                      </p>

                      <div className="border-t border-slate-100 pt-1.5 mt-2">
                        <span className="font-bold text-[10px] text-slate-700 block">Riwayat Keputusan Verifikasi:</span>
                        <p className="text-[10px] hover:text-slate-800">{item.catatanVerifikasi}</p>
                      </div>
                    </div>
                  </div>

                  {canVerify && (
                    <div className="pt-2">
                      <button 
                        onClick={() => {
                          setSelectedAuditId(item.id);
                          setAuditStatus(item.statusVerifikasi);
                          setAuditCatatan(item.catatanVerifikasi === 'Sedang menunggu pemeriksaan berkas oleh tim Sekretariat lapangan.' ? '' : item.catatanVerifikasi);
                        }}
                        className="w-full py-1 text-[11px] font-bold bg-white text-emerald-800 border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50 rounded shadow-inner cursor-pointer"
                      >
                        Ubah Status Verifikasi
                      </button>
                    </div>
                  )}

                </div>
              );
            })}

            {filteredList.length === 0 && (
              <div className="col-span-2 text-center py-12 text-slate-400">
                Gak ada data mustahik yang ditemukan. Sila coba daftarkan yang baru!
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Modal Verifikasi Pemohon */}
      {selectedAuditId && (
        <div className="bg-emerald-950/25 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center p-4">
          <form onSubmit={submitVerification} className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <ClipboardCheck className="w-5 h-5 text-emerald-700" />
              <h4 className="font-display font-semibold text-slate-800">Verifikasi & Penilaian Lapangan</h4>
            </div>

            <div className="space-y-3.5 text-xs">
              
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Status Kelayakan Mustahik</label>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    type="button"
                    onClick={() => setAuditStatus('Layak')}
                    className={`p-2.5 rounded-lg border text-center font-bold tracking-wide cursor-pointer transition-all ${auditStatus === 'Layak' ? 'bg-emerald-50 text-emerald-800 border-emerald-500' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                  >
                    Layak
                  </button>
                  <button 
                    type="button"
                    onClick={() => setAuditStatus('Tidak Layak')}
                    className={`p-2.5 rounded-lg border text-center font-bold tracking-wide cursor-pointer transition-all ${auditStatus === 'Tidak Layak' ? 'bg-rose-50 text-rose-800 border-rose-500' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                  >
                    Tidak Layak
                  </button>
                  <button 
                    type="button"
                    onClick={() => setAuditStatus('Belum Diperiksa')}
                    className={`p-2.5 rounded-lg border text-center font-bold tracking-wide cursor-pointer transition-all ${auditStatus === 'Belum Diperiksa' ? 'bg-amber-50 text-amber-800 border-amber-500' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                  >
                    Pending
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Catatan Pertimbangan / Hasil Audit WA</label>
                <textarea 
                  value={auditCatatan}
                  onChange={(e) => setAuditCatatan(e.target.value)}
                  placeholder="Misalnya: Layak asnaf Miskin karena tanggungan 4 anak dan tinggal di rumah kontrakan sekat seng..."
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-emerald-500 h-28 resize-none"
                  required
                />
              </div>

            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setSelectedAuditId(null)}
                className="px-3 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Simpan Verifikasi
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
