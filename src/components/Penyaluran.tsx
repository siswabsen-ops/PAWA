import React, { useState, useRef } from 'react';
import { 
  HeartHandshake, 
  PlusCircle, 
  Scale, 
  Clock, 
  FolderLock, 
  CheckCircle,
  FileText,
  BadgeAlert,
  Signature,
  Camera,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { PenyaluranDana, MustahikProfile, DanaType, AsnafType, PenyaluranStatus } from '../types';

interface PenyaluranProps {
  penyaluranList: PenyaluranDana[];
  mustahikList: MustahikProfile[];
  onAddPenyaluran: (newPenyaluran: PenyaluranDana) => void;
  onUpdatePenyaluranStatus: (id: string, updates: Partial<PenyaluranDana>) => void;
  totalZakatTerkumpul: number; // For amil fee 12.5% capping calculations
  totalInfakSedekahTerkumpul: number;
  userRole: string;
}

const DANA_SOURCES: DanaType[] = ['Zakat Fitrah', 'Zakat Mal', 'Infak', 'Sedekah', 'Wakaf'];

export default function Penyaluran({ 
  penyaluranList, 
  mustahikList, 
  onAddPenyaluran, 
  onUpdatePenyaluranStatus,
  totalZakatTerkumpul,
  totalInfakSedekahTerkumpul,
  userRole
}: PenyaluranProps) {
  // Form States
  const [peruntukanName, setPeruntukanName] = useState('');
  const [selectedMustahikId, setSelectedMustahikId] = useState('');
  const [asnafTarget, setAsnafTarget] = useState<AsnafType>('Miskin');
  const [danaSourceType, setDanaSourceType] = useState<DanaType>('Zakat Fitrah');
  const [amountRequested, setAmountRequested] = useState('');
  const [keterangan, setKeterangan] = useState('');

  // Signature and Documentation modal state
  const [selectedPenyaluranId, setSelectedPenyaluranId] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState<string>('');
  const [selectedFileUrl, setSelectedFileUrl] = useState<string>('');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Success & Error feedback
  const [formErr, setFormErr] = useState('');
  const [formOk, setFormOk] = useState('');

  // Check roles: Bidang Lapangan, Bendahara, Ketua LAZ, Admin
  const isAllowedToPropose = userRole !== 'donatur';
  const isAllowedToApprove = userRole === 'admin_yayasan' || userRole === 'ketua_laz';
  const isAllowedToDisburse = userRole === 'admin_yayasan' || userRole === 'bendahara' || userRole === 'bidang_lapangan';

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  // Batas Biaya Amil Maksimal 12.5% dari Total Zakat
  const batasAmilMaksimal = totalZakatTerkumpul * 0.125;
  const amilSallaryDisbursed = penyaluranList
    .filter(p => p.asnafTarget === 'Amil' && (p.status === 'Penyaluran' || p.status === 'Dokumentasi'))
    .reduce((sum, item) => sum + item.amountApproved, 0);

  const amilKuotaTersedia = Math.max(0, batasAmilMaksimal - amilSallaryDisbursed);

  const handleProposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErr('');
    setFormOk('');

    if (!isAllowedToPropose) {
      setFormErr('Hak Akses Terbatas. Hanya Donatur yang dilarang membuat usulan.');
      return;
    }

    if (!peruntukanName.trim()) {
      setFormErr('Nama Peruntukan Usulan Bantuan wajib diisi.');
      return;
    }

    const askAmt = parseFloat(amountRequested);
    if (isNaN(askAmt) || askAmt <= 0) {
      setFormErr('Jumlah dana yang diusulkan wajib berupa angka positif.');
      return;
    }

    // Pemisahan Dana Ketat Syariah
    // ZAKAT hanya boleh untuk asnaf, INFAK/SEDEKAH untuk operasional/sosial/Amil dsb.
    // Jika asnafTarget adalah Amil, periksa kepatuhan 12.5% batas amil
    if (asnafTarget === 'Amil' && (danaSourceType === 'Zakat Fitrah' || danaSourceType === 'Zakat Mal')) {
      if (askAmt > amilKuotaTersedia) {
        setFormErr(`Pelanggaran Syariat! Usulan untuk Amil dari dana Zakat melebihi sisa batas maksimum 12.5% (${formatRupiah(amilKuotaTersedia)}). Silakan gunakan sumber dana Infak/Sedekah.`);
        return;
      }
    }

    // Jika dana bersumber dari ZAKAT, pastikan target adalah salah satu dari 8 golongan asnaf
    if ((danaSourceType === 'Zakat Fitrah' || danaSourceType === 'Zakat Mal') && asnafTarget === 'Amil' && askAmt > amilKuotaTersedia) {
      // already caught above
    }

    let mustahikNama = '';
    if (selectedMustahikId) {
      const match = mustahikList.find(m => m.id === selectedMustahikId);
      if (match) {
        mustahikNama = match.nama;
        // Peringatan otomatis kelayakan
        if (match.statusVerifikasi !== 'Layak') {
          setFormErr(`Peringatan: Mustahik yang dipilih (${match.nama}) berstatus "${match.statusVerifikasi}". Sila verifikasi kelayakannya terlebih dahulu.`);
          return;
        }
      }
    }

    const newProposal: PenyaluranDana = {
      id: Math.random().toString(36).substring(2, 9),
      noPenyaluran: `DISB-${Date.now().toString().slice(-5)}`,
      peruntukanName,
      mustahikId: selectedMustahikId || undefined,
      mustahikNama: mustahikNama || undefined,
      asnafTarget: selectedMustahikId ? mustahikList.find(m => m.id === selectedMustahikId)?.asnaf || asnafTarget : asnafTarget,
      danaSourceType,
      amountRequested: askAmt,
      amountApproved: 0, // Belum disetujui
      status: 'Usulan',
      tanggalUsulan: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      diusulkanOleh: userRole.toUpperCase(),
      keterangan: keterangan || `Bantuan sosial program ${peruntukanName}`
    };

    onAddPenyaluran(newProposal);
    setFormOk(`Usulan bantuan "${peruntukanName}" berhasil didaftarkan. Status sekarang: USULAN.`);
    
    // reset form
    setPeruntukanName('');
    setSelectedMustahikId('');
    setAmountRequested('');
    setKeterangan('');
  };

  // Canvas Hand Signature Drawer
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#047857'; // emerald green
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    // Export base64 image data uri to save
    if (canvasRef.current) {
      setSignatureData(canvasRef.current.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData('');
  };

  // Mock upload camera photo
  const handlePhotoMock = () => {
    // Generate beautiful SVGs showing camera proof matching asnaf payout
    const proofUri = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23ecfdf5"/><circle cx="150" cy="100" r="40" fill="%2334d399" opacity="0.3"/><rect x="110" y="80" width="80" height="40" rx="5" fill="%23047857"/><circle cx="150" cy="100" r="10" fill="white"/><text x="150" y="160" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23065f46" text-anchor="middle">Serah Terima Bantuan Syariah</text><text x="150" y="180" font-family="monospace" font-size="9" fill="%23047857" text-anchor="middle">LAZ AL JIHAD - Terverifikasi</text></svg>`;
    setSelectedFileUrl(proofUri);
  };

  // Save digital receipt step
  const executeFinalPenyaluran = () => {
    if (!selectedPenyaluranId) return;
    onUpdatePenyaluranStatus(selectedPenyaluranId, {
      status: 'Dokumentasi',
      buktiFotoUrl: selectedFileUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=120&auto=format&fit=crop&q=80',
      tandaTerimaDigital: signatureData
    });
    setSelectedPenyaluranId(null);
    setSignatureData('');
    setSelectedFileUrl('');
  };

  return (
    <div className="space-y-6">
      
      {/* Alur Kerja Informasi */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-emerald-700" />
          <span className="font-display font-bold text-slate-800 text-sm">Alur Distribusi Mustahik:</span>
        </div>
        <div className="flex items-center flex-wrap gap-1.5 text-xs">
          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg font-bold">1. Usulan</span>
          <span className="text-slate-300">&rarr;</span>
          <span className="text-amber-700 font-bold px-2 py-1 bg-amber-50 rounded-lg">2. Verifikasi</span>
          <span className="text-slate-300">&rarr;</span>
          <span className="text-blue-700 font-bold px-2 py-1 bg-blue-50 rounded-lg">3. Persetujuan</span>
          <span className="text-slate-300">&rarr;</span>
          <span className="text-emerald-700 font-bold px-2 py-1 bg-emerald-50 rounded-lg">4. Penyaluran</span>
          <span className="text-slate-300">&rarr;</span>
          <span className="text-purple-700 font-bold px-2 py-1 bg-purple-50 rounded-lg">5. Dokumentasi</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Usulan Distribusi Baru */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="font-display font-semibold text-slate-800 text-lg">Buat Usulan Baru</h3>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
            <span className="text-[10px] font-black text-amber-800 flex justify-between uppercase">
              <span>Batas Kuota Amil (12.5%):</span>
              <span>{formatRupiah(batasAmilMaksimal)}</span>
            </span>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full transition-all"
                style={{ width: `${Math.min(100, (amilSallaryDisbursed/Math.max(1, batasAmilMaksimal))*100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>Dana Tersalur ke Amil: {formatRupiah(amilSallaryDisbursed)}</span>
              <span>Sisa Kuota: {formatRupiah(amilKuotaTersedia)}</span>
            </div>
          </div>

          {!isAllowedToPropose ? (
            <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-200 text-xs">
              Muzakki/Donatur hanya dapat melihat status penyelesaian program bantuan, tidak diizinkan menulis form proposal ini.
            </div>
          ) : (
            <form onSubmit={handleProposeSubmit} className="space-y-3.5">
              
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Nama Agenda Program Bantuan *</label>
                <input 
                  type="text"
                  placeholder="Misal: Sembako Ramadhan Fakir Miskin RT 02"
                  value={peruntukanName}
                  onChange={(e) => setPeruntukanName(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Target Mustahik (Spesifik/Individu)</label>
                <select
                  value={selectedMustahikId}
                  onChange={(e) => setSelectedMustahikId(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none bg-white text-slate-700"
                >
                  <option value="">-- Penerima Kolektif / Pilih Terlebih dahulu --</option>
                  {mustahikList.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.nama} (Asnaf {m.asnaf}) - {m.statusVerifikasi}
                    </option>
                  ))}
                </select>
                <span className="text-[9px] text-slate-400 block mt-0.5">Biarkan kosong jika bantuan didistribusikan untuk asnaf gabungan secara luas.</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Golongan Asnaf *</label>
                  <select 
                    value={asnafTarget}
                    onChange={(e) => setAsnafTarget(e.target.value as AsnafType)}
                    disabled={!!selectedMustahikId}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-slate-700 bg-white"
                  >
                    <option value="Fakir">Fakir</option>
                    <option value="Miskin">Miskin</option>
                    <option value="Amil">Amil</option>
                    <option value="Muallaf">Muallaf</option>
                    <option value="Riqab">Riqab</option>
                    <option value="Gharimin">Gharimin</option>
                    <option value="Fisabilillah">Fisabilillah</option>
                    <option value="Ibnu Sabil">Ibnu Sabil</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Sumber Kas Utama *</label>
                  <select 
                    value={danaSourceType}
                    onChange={(e) => setDanaSourceType(e.target.value as DanaType)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-slate-700 bg-white"
                  >
                    {DANA_SOURCES.map(ds => (
                      <option key={ds} value={ds}>{ds}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Jumlah Biaya Diajukan (Rp) *</label>
                <input 
                  type="number"
                  placeholder="Contoh: 1500000"
                  value={amountRequested}
                  onChange={(e) => setAmountRequested(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Diskripsi Penyaluran</label>
                <textarea 
                  placeholder="Tuliskan latar belakang, jumlah penerima, dan sasaran logistik..."
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
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
                className="w-full py-2.5 bg-gradient-to-r from-emerald-700 to-emerald-950 text-white hover:from-emerald-800 rounded-lg font-bold text-xs shadow cursor-pointer border border-amber-500/10"
              >
                Kirim Usulan Bantuan
              </button>
            </form>
          )}
        </div>

        {/* List Usulan / Pipeline Penyaluran Kas */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="font-display font-semibold text-slate-800 text-lg">Pipa Penyaluran Dana LAZ</h3>
            <p className="text-xs text-slate-400">Total rencana/peristiwa distribusi: {penyaluranList.length} agenda</p>
          </div>

          <div className="space-y-4">
            {penyaluranList.map((item) => {
              // Menentukan badge warna status
              const badgeColors: Record<PenyaluranStatus, string> = {
                'Usulan': 'bg-slate-100 text-slate-700 border-slate-200',
                'Verifikasi': 'bg-amber-50 text-amber-800 border-amber-200',
                'Persetujuan': 'bg-blue-50 text-blue-800 border-blue-200',
                'Penyaluran': 'bg-emerald-50 text-emerald-800 border-emerald-200',
                'Dokumentasi': 'bg-purple-100 text-purple-900 border-purple-200'
              };

              return (
                <div key={item.id} className="border border-slate-100 p-4 rounded-xl space-y-3 relative overflow-hidden bg-slate-50/50 hover:border-emerald-200/50 hover:bg-slate-50 transition-all">
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">{item.noPenyaluran}</span>
                      <h4 className="text-sm font-bold text-slate-800">{item.peruntukanName}</h4>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${badgeColors[item.status]}`}>
                      Status: {item.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Alokasi Asnaf</span>
                      <span className="font-bold text-emerald-800">Golongan {item.asnafTarget}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Sumber Kas Dana</span>
                      <span className="font-bold text-slate-700">{item.danaSourceType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Dana Diajukan</span>
                      <span className="font-bold text-slate-900 font-mono">{formatRupiah(item.amountRequested)}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 bg-white p-2 rounded border border-slate-100 italic leading-relaxed">
                    "{item.keterangan}"
                  </p>

                  {item.amountApproved > 0 && (
                    <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-100 text-xs flex justify-between items-center">
                      <span className="font-medium">Persetujuan Bendahara &amp; Ketua:</span>
                      <span className="font-black text-emerald-950 font-mono text-sm">{formatRupiah(item.amountApproved)}</span>
                    </div>
                  )}

                  {/* Operational workflow buttons based on roles */}
                  <div className="flex flex-wrap gap-2 pt-2 justify-end">
                    
                    {/* Step 1 to 2: Usulan -> Verifikasi (Amil/Lapangan) */}
                    {item.status === 'Usulan' && isAllowedToPropose && (
                      <button 
                        onClick={() => onUpdatePenyaluranStatus(item.id, { status: 'Verifikasi' })}
                        className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500 hover:text-white text-amber-800 rounded border border-amber-500/20 text-[11px] font-bold cursor-pointer"
                      >
                        Verifikasi Lapangan ✓
                      </button>
                    )}

                    {/* Step 2 to 3: Verifikasi -> Persetujuan Ketua */}
                    {item.status === 'Verifikasi' && isAllowedToApprove && (
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => {
                            const aprAmt = prompt("Masukkan jumlah dana disetujui (Rupiah):", item.amountRequested.toString());
                            if (aprAmt) {
                              onUpdatePenyaluranStatus(item.id, { 
                                status: 'Persetujuan', 
                                amountApproved: parseFloat(aprAmt) || item.amountRequested 
                              });
                            }
                          }}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold cursor-pointer"
                        >
                          Atur Persetujuan Belanja
                        </button>
                      </div>
                    )}

                    {/* Step 3 to 4: Persetujuan -> Penyaluran (Ready to hand digital payout receipt) */}
                    {item.status === 'Persetujuan' && isAllowedToDisburse && (
                      <button 
                        onClick={() => onUpdatePenyaluranStatus(item.id, { 
                          status: 'Penyaluran', 
                          tanggalPenyaluran: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) 
                        })}
                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-bold cursor-pointer"
                      >
                        Salurkan Dana Kas &rarr;
                      </button>
                    )}

                    {/* Step 4 to 5: Active Penyaluran -> Dokumentasi (Saves Signatures on Screen Canvas Drawing + Photo Verification) */}
                    {item.status === 'Penyaluran' && isAllowedToDisburse && (
                      <button 
                        onClick={() => {
                          setSelectedPenyaluranId(item.id);
                          // Initialize signature canvas slightly later after render
                          setTimeout(() => {
                            const canvas = canvasRef.current;
                            if (canvas) {
                              const ctx = canvas.getContext('2d');
                              if (ctx) {
                                ctx.clearRect(0,0, canvas.width, canvas.height);
                              }
                            }
                          }, 100);
                        }}
                        className="px-2.5 py-1.5 bg-gradient-to-r from-purple-700 to-indigo-800 hover:opacity-90 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Signature className="w-3.5 h-3.5" /> Isi Tanda Terima Digital & Bukti Foto
                      </button>
                    )}

                    {item.status === 'Dokumentasi' && (
                      <div className="w-full mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-white border border-slate-100 rounded-lg">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Bukti Dokumentasi Handover</span>
                          {item.buktiFotoUrl && (
                            <img 
                              src={item.buktiFotoUrl} 
                              alt="Bukti Serah Terima" 
                              className="w-full h-16 object-contain rounded bg-slate-50 border border-slate-200 mt-1" 
                              referrerPolicy="no-referrer"
                            />
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Tanda Terima Digital</span>
                          {item.tandaTerimaDigital ? (
                            <img 
                              src={item.tandaTerimaDigital} 
                              alt="Tanda Terima" 
                              className="w-full h-16 object-contain rounded bg-slate-50 border border-slate-200 mt-1" 
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="text-[10px] text-slate-400 italic block mt-2">Diberikan secara tunai/transfer langsung</span>
                          )}
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              );
            })}

            {penyaluranList.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                Belum ada agenda program penyaluran amalan. Sila ciptakan usulan di samping kiri!
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Modal Tanda Terima Digital & Bukti Kamera */}
      {selectedPenyaluranId && (
        <div className="bg-emerald-950/20 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5 text-purple-800">
                <Signature className="w-5 h-5 text-purple-700" />
                <h4 className="font-display font-semibold text-slate-800">Dokumentasi Tanda Terima</h4>
              </div>
              <button 
                onClick={() => setSelectedPenyaluranId(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                Tutup
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Sila ambil foto dokumentasi penyerahan beras/dana dan tanda tangani pada panel digital di bawah ini.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {/* Photo Upload section */}
              <div className="border border-slate-200 rounded-xl p-3 text-center flex flex-col justify-between h-44 bg-slate-50">
                <span className="text-[10px] font-bold text-slate-500 block">FOTO PENYERAHAN</span>
                
                {selectedFileUrl ? (
                  <div className="relative">
                    <img 
                      src={selectedFileUrl} 
                      alt="Camera Mock Proof" 
                      className="w-full h-24 object-contain rounded border mt-1" 
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      type="button"
                      onClick={() => setSelectedFileUrl('')}
                      className="absolute -top-1 -right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-800 text-[9px]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="my-auto space-y-2">
                    <button 
                      type="button"
                      onClick={handlePhotoMock}
                      className="mx-auto p-2 bg-purple-500/10 text-purple-800 border border-purple-200 rounded-full hover:bg-purple-100 text-xs inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" /> Ambil Kamera
                    </button>
                    <span className="text-[9px] text-slate-400 block">Simulasi capture foto amil di lapangan</span>
                  </div>
                )}
              </div>

              {/* Signature Canvas section */}
              <div className="border border-slate-200 rounded-xl p-3 text-center flex flex-col justify-between h-44 bg-slate-50">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-slate-500 block">TANDA TANGAN</span>
                  <button 
                    type="button" 
                    onClick={clearCanvas} 
                    className="text-[9px] text-rose-600 underline"
                  >
                    Hapus
                  </button>
                </div>

                <div className="bg-white border rounded border-slate-300 relative h-28 overflow-hidden touch-none cursor-crosshair">
                  <canvas 
                    ref={canvasRef}
                    width={180}
                    height={108}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full h-full block"
                  />
                  {!signatureData && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-[10px] text-slate-300 italic">
                      Goreskan ttd di sini
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setSelectedPenyaluranId(null)}
                className="px-3 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold"
              >
                Batal
              </button>
              <button 
                type="button" 
                onClick={executeFinalPenyaluran}
                className="px-4 py-1.5 bg-purple-700 hover:bg-purple-900 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Simpan &amp; Selesaikan Agenda
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
