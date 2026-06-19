import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  Printer, 
  Download, 
  QrCode, 
  CheckCircle,
  FileText,
  BadgeAlert,
  Info,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { SetoranDana, DanaType } from '../types';

interface PenghimpunanProps {
  setoranList: SetoranDana[];
  onAddSetoran: (newSetoran: SetoranDana) => void;
  onUpdateSetoran: (updatedSetoran: SetoranDana) => void;
  onDeleteSetoran: (id: string) => void;
  userRole: string; // for access checks
}

export default function Penghimpunan({ 
  setoranList, 
  onAddSetoran, 
  onUpdateSetoran, 
  onDeleteSetoran, 
  userRole 
}: PenghimpunanProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  
  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [muzakkiName, setMuzakkiName] = useState('');
  const [phone, setPhone] = useState('');
  const [alamat, setAlamat] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<DanaType>('Zakat Fitrah');
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'Transfer Bank' | 'QRIS' | 'Lainnya'>('Tunai');
  const [keterangan, setKeterangan] = useState('');
  const [inputTanggal, setInputTanggal] = useState(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  });
  const [inputTahun, setInputTahun] = useState(() => new Date().getFullYear().toString());
  const [showQR, setShowQR] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<SetoranDana | null>(null);

  // Error & Success Feedbacks
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Check roles: Bendahara, Admin/Pengurus Yayasan, Ketua LAZ have entry options
  const isAllowedToInput = userRole === 'admin_yayasan' || userRole === 'bendahara' || userRole === 'ketua_laz' || userRole === 'sekretaris';

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const parseIndonesianDateToYmd = (dateStr: string) => {
    try {
      const months = {
        'januari': '01', 'februari': '02', 'maret': '03', 'april': '04', 
        'mei': '05', 'juni': '06', 'juli': '07', 'agustus': '08', 
        'september': '09', 'oktober': '10', 'november': '11', 'desember': '12'
      };
      const cleaned = dateStr.toLowerCase();
      const parts = cleaned.split(' ');
      if (parts.length >= 3) {
        const day = parts[0].padStart(2, '0');
        const monthName = parts[1];
        const year = parts[2];
        const monthNum = months[monthName as keyof typeof months] || '01';
        return `${year}-${monthNum}-${day}`;
      }
      return dateStr;
    } catch {
      const today = new Date();
      return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }
  };

  const handleStartEdit = (item: SetoranDana) => {
    setEditingId(item.id);
    setMuzakkiName(item.muzakkiName);
    setPhone(item.phone);
    setAlamat(item.alamat);
    setAmount(item.amount.toString());
    setType(item.type);
    setPaymentMethod(item.paymentMethod);
    setKeterangan(item.keterangan);
    setInputTanggal(parseIndonesianDateToYmd(item.tanggal));
    setInputTahun(item.tahun || new Date().getFullYear().toString());
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setMuzakkiName('');
    setPhone('');
    setAlamat('');
    setAmount('');
    setType('Zakat Fitrah');
    setPaymentMethod('Tunai');
    setKeterangan('');
    const today = new Date();
    setInputTanggal(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
    setInputTahun(today.getFullYear().toString());
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isAllowedToInput) {
      setErrorMsg('Hak Akses Terbatas. Hanya Admin, Bendahara, Sekretaris, dan Ketua yang dapat mencatat atau mengedit setoran.');
      return;
    }

    if (!muzakkiName.trim()) {
      setErrorMsg('Nama wajib diisi.');
      return;
    }

    const parseAmount = parseFloat(amount);
    if (isNaN(parseAmount) || parseAmount <= 0) {
      setErrorMsg('Jumlah setoran harus berupa angka positif.');
      return;
    }

    // Format tanggal as Indonesian text
    const formatIndonesianDate = (dateStr: string) => {
      try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      } catch (err) {
        return dateStr;
      }
    };

    if (editingId) {
      const originalSetoran = setoranList.find(s => s.id === editingId);
      if (!originalSetoran) {
        setErrorMsg('Data setoran asli tidak ditemukan.');
        return;
      }

      const updatedSetoran: SetoranDana = {
        ...originalSetoran,
        muzakkiName,
        phone,
        alamat,
        amount: parseAmount,
        type,
        paymentMethod,
        tanggal: inputTanggal.includes('-') && inputTanggal.split('-').length === 3 ? formatIndonesianDate(inputTanggal) : inputTanggal,
        tahun: inputTahun,
        keterangan: keterangan || `Setoran ${type} an. ${muzakkiName}`
      };

      onUpdateSetoran(updatedSetoran);
      setSuccessMsg(`Data setoran dengan Kwitansi #${originalSetoran.noKwitansi} berhasil direvisi.`);
      handleCancelEdit();
    } else {
      // Generate unique slip code using selected date
      const dateObj = new Date(inputTanggal);
      const prefixMap: Record<DanaType, string> = {
        'Zakat Fitrah': 'ZF',
        'Zakat Mal': 'ZM',
        'Infak': 'IF',
        'Sedekah': 'SD',
        'Wakaf': 'WK'
      };
      const prefix = prefixMap[type];
      const timestampSeed = dateObj.getTime().toString().slice(-4) || '99';
      const dateFormatted = `${dateObj.getFullYear() || new Date().getFullYear()}${(dateObj.getMonth()+1 || 1).toString().padStart(2, '0')}${(dateObj.getDate() || 1).toString().padStart(2, '0')}`;
      const noKwitansi = `LAZ-${prefix}-${dateFormatted}-${timestampSeed}`;

      const newSetoran: SetoranDana = {
        id: Math.random().toString(36).substring(2, 9),
        muzakkiName,
        phone,
        alamat,
        amount: parseAmount,
        type,
        paymentMethod,
        tanggal: formatIndonesianDate(inputTanggal),
        tahun: inputTahun,
        keterangan: keterangan || `Setoran ${type} an. ${muzakkiName}`,
        noKwitansi
      };

      onAddSetoran(newSetoran);
      setSuccessMsg(`Setoran an. ${muzakkiName} berhasil dicatat.`);
      
      // Auto show receipt
      setActiveReceipt(newSetoran);

      // Reset Form (maintain current date/year for convenience of multiple entry, clear name and details)
      setMuzakkiName('');
      setPhone('');
      setAlamat('');
      setAmount('');
      setKeterangan('');
    }
  };

  // Filter & Search
  const filteredSetoran = setoranList.filter(item => {
    const matchesSearch = item.muzakkiName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.noKwitansi.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.alamat.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'All' ? true : item.type === filterType;
    return matchesSearch && matchesType;
  });

  // Mock download function - triggers print modal style display for elegant user actions
  const triggerPrintReceipt = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const headers = ['No Kwitansi', 'Muzakki Name', 'No Kontak', 'Alamat', 'Tipe Dana', 'Jumlah', 'Metode Pembayaran', 'Tanggal', 'Keterangan'];
    const rows = filteredSetoran.map(item => [
      item.noKwitansi,
      item.muzakkiName,
      item.phone,
      item.alamat,
      item.type,
      item.amount,
      item.paymentMethod,
      item.tanggal,
      item.keterangan
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Penghimpunan_LAZ_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Formulir Pencatatan Dana Masuk */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              <h3 className="font-display font-semibold text-slate-800 text-lg">
                {editingId ? 'Revisi Penerimaan Kas' : 'Input Penerimaan Kas'}
              </h3>
            </div>
            {editingId && (
              <span className="text-[9px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Mode Edit
              </span>
            )}
          </div>

          {!isAllowedToInput ? (
            <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-200 text-xs flex gap-2">
              <BadgeAlert className="w-4 h-4 flex-shrink-0" />
              <div>
                <span className="font-bold">Akses Terbatas:</span> Anda login sebagai <strong className="uppercase">{userRole}</strong>. 
                Sila gunakan menu role di header jika Anda bermaksud mencatat transaksi sebagai Bendahara, Sekretaris, atau Ketua LAZ.
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Nama Muzakki / Donatur *</label>
                <input 
                  type="text"
                  placeholder="Contoh: Bpk. H. Ahmad Wafa"
                  value={muzakkiName}
                  onChange={(e) => setMuzakkiName(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">No. HP/WA</label>
                  <input 
                    type="tel"
                    placeholder="Contoh: 0812345..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Jenis Dana *</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value as DanaType)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none font-medium text-slate-800"
                  >
                    <option value="Zakat Fitrah">Zakat Fitrah</option>
                    <option value="Zakat Mal">Zakat Mal</option>
                    <option value="Infak">Infak</option>
                    <option value="Sedekah">Sedekah</option>
                    <option value="Wakaf">Wakaf</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Alamat Lengkap</label>
                <textarea 
                  placeholder="Masukkan Alamat Muzakki"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none h-14 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Jumlah Rp *</label>
                  <input 
                    type="number"
                    placeholder="Contoh: 200000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none font-bold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Metode Bayar *</label>
                  <select 
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-slate-800"
                  >
                    <option value="Tunai">Tunai</option>
                    <option value="Transfer Bank">Transfer Bank</option>
                    <option value="QRIS">QRIS / Online</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Keterangan / Niat Amalan</label>
                <input 
                  type="text"
                  placeholder="Misal: Zakat fitrah keluarga Bapak Ahmad, 4 jiwa"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Tanggal Penerimaan *</label>
                  <input 
                    type="date"
                    value={inputTanggal}
                    onChange={(e) => setInputTanggal(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-slate-800 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Tahun Keuangan *</label>
                  <input 
                    type="text"
                    placeholder="Contoh: 2026 atau 1447 H"
                    value={inputTahun}
                    onChange={(e) => setInputTahun(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-slate-800 font-medium"
                    required
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="text-[11px] text-red-600 font-medium bg-red-50 p-2 rounded border border-red-200">{errorMsg}</div>
              )}
              
              {successMsg && (
                <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-2 rounded border border-emerald-200">{successMsg}</div>
              )}

              <div className="space-y-2">
                <button 
                  type="submit" 
                  className={`w-full py-2.5 text-white rounded-lg font-bold text-xs transition-colors shadow-md flex justify-center items-center gap-1.5 cursor-pointer ${
                    editingId 
                      ? 'bg-amber-600 hover:bg-amber-700 border border-amber-600/30' 
                      : 'bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 border border-amber-500/20'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" /> {editingId ? 'Simpan Perubahan (Ubah)' : 'Catat & Ambil Kwitansi'}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={handleCancelEdit}
                    className="w-full py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 rounded-lg font-bold text-xs transition-all flex justify-center items-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" /> Batal Revisi (Batal)
                  </button>
                )}
              </div>

              <div className="pt-2 text-center">
                <button 
                  type="button" 
                  onClick={() => setShowQR(!showQR)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:underline cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-amber-500" /> {showQR ? 'Sembunyikan' : 'Tampilkan'} Rekening BRI & QRIS LAZ
                </button>
              </div>

              {showQR && (
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-center space-y-3 animate-fade-in">
                  
                  {/* Rekening BRI Details */}
                  <div className="bg-white rounded-lg p-2.5 border border-slate-100 shadow-sm text-center">
                    <span className="text-[9px] font-black uppercase text-amber-600 block tracking-wider">REKENING TRANSFER RESMI</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5">BANK BRI</span>
                    <span className="text-sm font-mono font-black text-emerald-800 block tracking-wide select-all bg-emerald-50 py-1 my-1 rounded border border-emerald-100/50">
                      4157-01-064388-53-4
                    </span>
                    <span className="text-[10px] text-slate-500 block">a.n. <strong className="text-slate-700">MDT AL JIHAD</strong></span>
                  </div>

                  <div className="border-t border-slate-200/60 my-1"></div>

                  <span className="text-[10px] font-black tracking-wider text-emerald-950 block">QRIS RESMI LAZ JIHAD</span>
                  
                  {/* Generated QR Mockup */}
                  <div className="mx-auto w-32 h-32 bg-white border border-slate-200 p-2 rounded-lg flex items-center justify-center relative shadow-inner">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Quiet Zone */}
                      <rect x="0" y="0" width="100" height="100" fill="white" />
                      {/* Outer Position Indicators */}
                      <rect x="5" y="5" width="25" height="25" fill="#047857" />
                      <rect x="9" y="9" width="17" height="17" fill="white" />
                      <rect x="13" y="13" width="9" height="9" fill="#047857" />
                      
                      <rect x="70" y="5" width="25" height="25" fill="#047857" />
                      <rect x="74" y="9" width="17" height="17" fill="white" />
                      <rect x="78" y="13" width="9" height="9" fill="#047857" />
 
                      <rect x="5" y="70" width="25" height="25" fill="#047857" />
                      <rect x="9" y="74" width="17" height="17" fill="white" />
                      <rect x="13" y="78" width="9" height="9" fill="#047857" />
 
                      {/* Code pixels mock */}
                      <rect x="40" y="10" width="10" height="4" fill="#000" />
                      <rect x="45" y="15" width="15" height="6" fill="#000" />
                      <rect x="35" y="25" width="8" height="8" fill="#d97706" /> {/* Gold center color for QRIS branding */}
                      <rect x="55" y="30" width="8" height="8" fill="#d97706" />
                      
                      <rect x="40" y="40" width="20" height="20" fill="#047857" />
                      <rect x="44" y="44" width="12" height="12" fill="white" />
                      {/* Tiny symbol representation */}
                      <circle cx="50" cy="50" r="4" fill="#d97706" />
 
                      <rect x="75" y="75" width="20" height="20" fill="#000" />
                      <rect x="79" y="79" width="12" height="12" fill="white" />
                      
                      <rect x="10" y="45" width="18" height="6" fill="#000" />
                      <rect x="42" y="70" width="16" height="18" fill="#000" />
                      <rect x="70" y="42" width="12" height="16" fill="#000" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-slate-500">Mendukung BRImo, BSI Mobile, GoPay, OVO & ShopeePay</p>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Tabel Data Setoran & Riwayat Lengkap */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-display font-semibold text-slate-800 text-lg">Keuangan Masuk (Penghimpunan)</h3>
              <p className="text-xs text-slate-400">Total terdata: {filteredSetoran.length} rekaman dana</p>
            </div>
            
            <button
              onClick={handleDownloadCSV}
              className="text-xs bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 rounded-lg px-3 py-1.5 hover:bg-emerald-100 flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export Excel/CSV
            </button>
          </div>

          {/* Search, Filter, Actions Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Cari Muzakki, No. Kwitansi, Alamat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-emerald-500 outline-none font-medium text-slate-700 bg-white"
              >
                <option value="All">Semua Dana</option>
                <option value="Zakat Fitrah">Zakat Fitrah</option>
                <option value="Zakat Mal">Zakat Mal</option>
                <option value="Infak">Infak</option>
                <option value="Sedekah">Sedekah</option>
                <option value="Wakaf">Wakaf</option>
              </select>
            </div>

          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                  <th className="p-3">No. Kwitansi</th>
                  <th className="p-3">Muzakki</th>
                  <th className="p-3">Jenis Dana</th>
                  <th className="p-3 text-right">Jumlah Setor</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3 text-center">Aksi Kwitansi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredSetoran.length > 0 ? (
                  filteredSetoran.slice().reverse().map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 font-mono text-emerald-800 text-[11px] font-semibold">{item.noKwitansi}</td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-800">{item.muzakkiName}</div>
                        <div className="text-[10px] text-slate-400">{item.phone || 'Gak ada WA'}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                          {item.type}
                        </span>
                      </td>
                      <td className="p-3 text-right font-black text-slate-950 text-[11px]">{formatRupiah(item.amount)}</td>
                      <td className="p-3 text-slate-500 whitespace-nowrap">
                        <div>{item.tanggal}</div>
                        {item.tahun && (
                          <div className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100/50 inline-block mt-0.5">
                            Th. {item.tahun}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            onClick={() => setActiveReceipt(item)}
                            title="Cetak Kwitansi"
                            className="px-2.5 py-1 text-[11px] font-bold border border-slate-200 hover:border-emerald-700 hover:text-emerald-900 rounded-lg transition-all text-slate-600 bg-white inline-flex items-center gap-1 text-center cursor-pointer"
                          >
                            <FileText className="w-3 h-3" /> Cetak
                          </button>
                          
                          {isAllowedToInput && (
                            <>
                              <button 
                                onClick={() => handleStartEdit(item)}
                                title="Revisi / Edit Data"
                                className={`px-2 py-1 text-[11px] font-bold border rounded-lg transition-all inline-flex items-center gap-1 text-center cursor-pointer ${
                                  editingId === item.id 
                                    ? 'border-amber-500 bg-amber-50 text-amber-800' 
                                    : 'border-slate-200 hover:border-amber-500 hover:text-amber-700 text-slate-600 bg-white'
                                }`}
                              >
                                <Edit2 className="w-3 h-3" /> Revisi
                              </button>
                              
                              <button 
                                onClick={() => {
                                  if (confirm(`Apakah Anda yakin ingin menghapus data setoran Muzakki ${item.muzakkiName} (#${item.noKwitansi})?`)) {
                                    onDeleteSetoran(item.id);
                                    if (editingId === item.id) {
                                      handleCancelEdit();
                                    }
                                  }
                                }}
                                title="Hapus Data"
                                className="px-2 py-1 text-[11px] font-bold border border-slate-200 hover:border-rose-500 hover:text-rose-700 rounded-lg transition-all text-slate-600 bg-white inline-flex items-center gap-1 text-center cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3 text-rose-500" /> Hapus
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400 font-light">Tidak ada data setoran yang cocok dengan pencarian Anda.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* Kwitansi Digital Modal Preview (Printable HTML structure matching standard official) */}
      {activeReceipt && (
        <div className="bg-emerald-950/20 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 print:p-0 print:shadow-none print:border-none relative">
            
            {/* Elegant Header with Logo representation */}
            <div className="flex justify-between items-start border-b-2 border-dashed border-emerald-200 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">KWITANSI RESMI DIGITAL</span>
                <h4 className="text-base font-black text-emerald-800 uppercase font-display leading-tight">LAZ MDT AL JIHAD</h4>
                <p className="text-[9px] text-slate-400 leading-tight">
                  Di Bawah Naungan Yayasan Al Hamid Hadum<br />
                  SK Kemenag No. 446 / UU No. 23 Thn 2011<br />
                  Kontak: 0812-7000-9988 | MDT Al Jihad
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">No. Kwitansi</span>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 p-1 px-2.5 rounded border border-emerald-100">
                  {activeReceipt.noKwitansi}
                </span>
                <span className="text-[10px] text-slate-400 block mt-2">
                  Dibuat: {activeReceipt.tanggal} {activeReceipt.tahun && `(Tahun Keuangan: ${activeReceipt.tahun})`}
                </span>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-1">
                <span className="text-slate-400">Telah Terima Dari:</span>
                <span className="col-span-2 font-bold text-slate-800 uppercase">: {activeReceipt.muzakkiName}</span>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <span className="text-slate-400">No. Kontak & Alamat:</span>
                <span className="col-span-2 text-slate-700">
                  : {activeReceipt.phone || '-'} | {activeReceipt.alamat || '-'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <span className="text-slate-400">Guna Keperluan:</span>
                <span className="col-span-2 font-semibold text-emerald-900">
                  : Penyetoran <strong className="underline underline-offset-2">{activeReceipt.type}</strong>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <span className="text-slate-400">Niat / Keterangan:</span>
                <span className="col-span-2 text-slate-600 italic">
                  : "{activeReceipt.keterangan}"
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <span className="text-slate-400">Metode Pembayaran:</span>
                <span className="col-span-2 text-slate-800 font-medium">: {activeReceipt.paymentMethod}</span>
              </div>

              {/* Large money badge representation */}
              <div className="bg-emerald-950 p-4 rounded-xl text-center border border-[#D4AF37]/30 my-4">
                <span className="text-[10px] text-emerald-300 font-semibold block uppercase tracking-widest">JUMLAH PENERIMAAN</span>
                <span className="text-2xl font-black text-amber-300 font-mono">
                  {formatRupiah(activeReceipt.amount)}
                </span>
                <span className="text-[9px] text-emerald-200 block italic mt-1 font-serif">
                  *Terbilang: {activeReceipt.amount.toLocaleString('id-ID')} Rupiah Sah*
                </span>
              </div>

              {/* Islamic Quote section */}
              <div className="text-[10px] text-center text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                "Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan mensucikan mereka..." (QS. At-Taubah: 103)
              </div>
            </div>

            {/* Hand Signatures footer */}
            <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block">Penyetor / Muzakki</span>
                <div className="h-10 mt-1 flex items-center justify-center italic text-slate-300 font-serif">
                  (Tertanda Digital)
                </div>
                <span className="font-bold text-slate-700 block">{activeReceipt.muzakkiName}</span>
              </div>
              
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block">Amil Penerima (LAZ)</span>
                <div className="h-10 mt-1 flex items-center justify-center font-serif text-emerald-800 text-[11px] font-bold bg-amber-500/5 rounded border border-amber-500/10 scale-90">
                  ✓ VERIFIED LAZ AD-DIWAN
                </div>
                <span className="font-bold text-slate-700 block font-display">Reni Nurhayani, M.Pd.</span>
              </div>
            </div>

            {/* Print & Close Control panel */}
            <div className="flex gap-2.5 pt-4 border-t border-slate-100 print:hidden justify-between">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-amber-500" /> Print Ctrl+P didukung
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveReceipt(null)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Tutup
                </button>
                <button 
                  onClick={triggerPrintReceipt}
                  className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-950 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Cetak Kwitansi
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
