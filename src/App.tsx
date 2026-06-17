import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Video, 
  Music, 
  FileText, 
  Info, 
  Download, 
  Volume2, 
  Home, 
  ShieldCheck, 
  Trash2, 
  ExternalLink,
  Bot
} from 'lucide-react';
import AsistenCerdas from './components/AsistenCerdas';
import EditorVideo from './components/EditorVideo';
import StudioMusik from './components/StudioMusik';

interface ExportItem {
  id: string;
  name: string;
  type: string;
  url: string;
  size: string;
  resolution?: string;
  timestamp: Date;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'asisten' | 'video' | 'musik' | 'tentang'>('home');
  const [exportedFiles, setExportedFiles] = useState<ExportItem[]>([
    {
      id: 'pre-demo-naskah',
      name: 'Naskah_Sinematik_PAWA.txt',
      type: 'TXT / Naskah',
      url: 'data:text/plain;charset=utf-8,PAWA%20Naskah%20Kreatif%3A%20Satu%20Aplikasi%2C%20Segala%20Gagasan%20Menjadi%20Nyata.',
      size: '1.2 KB',
      timestamp: new Date()
    }
  ]);

  const handleAddExport = (item: { id: string; name: string; type: string; url: string; size: string; resolution?: string }) => {
    const newItem: ExportItem = {
      ...item,
      timestamp: new Date()
    };
    setExportedFiles((prev) => [newItem, ...prev]);
  };

  const handleRemoveExport = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExportedFiles((prev) => prev.filter(item => item.id !== id));
  };

  // Triggers downloading of all generated works in the export sidebar in parallel
  const handleDownloadAll = () => {
    if (exportedFiles.length === 0) return;
    exportedFiles.forEach((file) => {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden selection:bg-amber-100 selection:text-amber-900" id="pawa_app_root">
      
      {/* HEADER NAVIGATION */}
      <nav className="h-16 bg-[#0F172A] border-b-2 border-[#D4AF37] flex items-center justify-between px-4 md:px-8 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#D4AF37] flex items-center justify-center font-black text-[#0F172A] text-lg rounded-sm shadow-inner transition hover:scale-105 cursor-pointer" onClick={() => setActiveTab('home')}>
            P
          </div>
          <div className="flex flex-col cursor-pointer" onClick={() => setActiveTab('home')}>
            <span className="text-white font-black leading-none tracking-tight text-base md:text-lg">PAWA</span>
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-widest uppercase md:block">Panji Wafa</span>
          </div>
        </div>

        {/* Responsive Navbar Menu links */}
        <div className="flex gap-2 md:gap-7 text-xs md:text-sm font-semibold text-slate-300">
          <button 
            id="tab_home_btn"
            onClick={() => setActiveTab('home')}
            className={`pb-1 transition-all ${
              activeTab === 'home' 
                ? 'text-[#D4AF37] border-b border-[#D4AF37] font-bold' 
                : 'hover:text-white'
            }`}
          >
            Beranda
          </button>
          <button 
            id="tab_asisten_btn"
            onClick={() => setActiveTab('asisten')}
            className={`pb-1 transition-all ${
              activeTab === 'asisten' 
                ? 'text-[#D4AF37] border-b border-[#D4AF37] font-bold' 
                : 'hover:text-white'
            }`}
          >
            Asisten Cerdas
          </button>
          <button 
            id="tab_video_btn"
            onClick={() => setActiveTab('video')}
            className={`pb-1 transition-all ${
              activeTab === 'video' 
                ? 'text-[#D4AF37] border-b border-[#D4AF37] font-bold' 
                : 'hover:text-white'
            }`}
          >
            Editor Video
          </button>
          <button 
            id="tab_musik_btn"
            onClick={() => setActiveTab('musik')}
            className={`pb-1 transition-all ${
              activeTab === 'musik' 
                ? 'text-[#D4AF37] border-b border-[#D4AF37] font-bold' 
                : 'hover:text-white'
            }`}
          >
            Studio Musik
          </button>
          <button 
            id="tab_tentang_btn"
            onClick={() => setActiveTab('tentang')}
            className={`pb-1 transition-all ${
              activeTab === 'tentang' 
                ? 'text-[#D4AF37] border-b border-[#D4AF37] font-bold' 
                : 'hover:text-white'
            }`}
          >
            Tentang
          </button>
        </div>

        {/* Live system state badge */}
        <div className="hidden md:flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[11px] font-mono font-bold text-slate-400">ENGINE SECURE</span>
        </div>
      </nav>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* SIDEBAR QUICK ACCESS TOOLS */}
        <aside className="w-full lg:w-16 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex lg:flex-col items-center justify-center lg:justify-start py-3 lg:py-6 gap-5 md:gap-7 shrink-0">
          <button 
            id="side_btn_home"
            onClick={() => setActiveTab('home')}
            className={`p-3 rounded-xl transition ${
              activeTab === 'home' ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Beranda"
          >
            <Home className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button 
            id="side_btn_asisten"
            onClick={() => setActiveTab('asisten')}
            className={`p-3 rounded-xl transition ${
              activeTab === 'asisten' ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Asisten Cerdas"
          >
            <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button 
            id="side_btn_video"
            onClick={() => setActiveTab('video')}
            className={`p-3 rounded-xl transition ${
              activeTab === 'video' ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Editor Video"
          >
            <Video className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button 
            id="side_btn_musik"
            onClick={() => setActiveTab('musik')}
            className={`p-3 rounded-xl transition ${
              activeTab === 'musik' ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Studio Musik & Vokal"
          >
            <Music className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button 
            id="side_btn_tentang"
            onClick={() => setActiveTab('tentang')}
            className={`lg:mt-auto p-3 rounded-xl transition ${
              activeTab === 'tentang' ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Tentang PAWA"
          >
            <Info className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </aside>

        {/* MAIN workspace area */}
        <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 overflow-y-auto">
          
          {/* Header titles based on section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-black font-display text-slate-800 tracking-tight uppercase flex items-center gap-2">
                {activeTab === 'home' && 'Beranda Kreasi'}
                {activeTab === 'asisten' && 'Asisten Cerdas PAWA'}
                {activeTab === 'video' && 'Editor Video Sinematik'}
                {activeTab === 'musik' && 'Studio Musik & Vokal'}
                {activeTab === 'tentang' && 'Tentang PAWA'}
              </h1>
              <p className="text-slate-500 text-sm italic font-medium leading-relaxed">
                "Satu Aplikasi, Segala Gagasan Menjadi Nyata"
              </p>
            </div>
            
            <div className="flex gap-2">
              <span className="px-2.5 py-1 bg-green-100 border border-green-200 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider">
                Jernih (HD)
              </span>
              <span className="px-2.5 py-1 bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">
                Pro Mastering
              </span>
            </div>
          </div>

          {/* ACTIVE CONTENT VIEW WINDOW */}
          <div className="flex-1">
            
            {/* 1. BERANDA TAB VIEW */}
            {activeTab === 'home' && (
              <div className="space-y-6 animate-fade-in" id="workspace_home_view">
                
                {/* Visual Banner card with Geometric Balance details */}
                <div className="bg-[#0F172A] text-white p-6 md:p-8 rounded-2xl relative overflow-hidden border-2 border-[#D4AF37] shadow-lg">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Sparkles className="w-48 h-48 text-[#D4AF37] fill-transparent" />
                  </div>
                  <div className="relative z-10 max-w-2xl space-y-4">
                    <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-[#D4AF37] text-xs font-bold rounded">
                      STUDIO ASISTEN ULTRA MODERN
                    </span>
                    <h2 className="text-2xl md:text-4xl font-extrabold font-display tracking-tight">
                      Selamat Datang di Studio PAWA
                    </h2>
                    <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
                      Sinergi kecerdasan buatan, penyuntingan visual sinematik, serta instrumen simfoni audio digital di dalam genggaman Anda. Dirancang untuk kecepatan penuh, ramah perangkat komputer maupun smartphone Anda.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button 
                        id="start_asisten"
                        onClick={() => setActiveTab('asisten')}
                        className="px-4 py-2.5 bg-[#D4AF37] text-[#0F172A] hover:brightness-110 font-bold text-xs uppercase tracking-wider rounded-md transition"
                      >
                        Buka Asisten Cerdas
                      </button>
                      <button 
                        id="start_video"
                        onClick={() => setActiveTab('video')}
                        className="px-4 py-2.5 bg-white/10 border border-white/20 text-white hover:bg-white/20 font-bold text-xs uppercase tracking-wider rounded-md transition"
                      >
                        Mulai Edit Video
                      </button>
                    </div>
                  </div>
                </div>

                {/* Grid features shortcuts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Shortcut: Asisten Cerdas */}
                  <div 
                    onClick={() => setActiveTab('asisten')}
                    className="p-6 bg-white rounded-xl border border-slate-200 hover:border-blue-400/80 hover:shadow-md cursor-pointer transition text-left space-y-3 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center transition-transform group-hover:scale-105">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">1. Asisten Cerdas</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Menyusun dokumen, naskah YouTube, merangkum tulisan panjang, menerjemahkan bahasa formal, dan menggambar ilustrasi SVG murni.
                    </p>
                    <span className="text-xs font-bold text-[#D4AF37] transition group-hover:underline">
                      Mulai Sekarang &rarr;
                    </span>
                  </div>

                  {/* Shortcut: Editor Video */}
                  <div 
                    onClick={() => setActiveTab('video')}
                    className="p-6 bg-white rounded-xl border border-slate-200 hover:border-blue-400/80 hover:shadow-md cursor-pointer transition text-left space-y-3 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center transition-transform group-hover:scale-105">
                      <Video className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">2. Editor Video Sinematik</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Tuning kecerahan visual, kontras, saturasi filter vintage/cyberpunk, tambahkan running text, filter vignette, dan ekspor instan kualitas HD.
                    </p>
                    <span className="text-xs font-bold text-[#D4AF37] transition group-hover:underline">
                      Mulai Sekarang &rarr;
                    </span>
                  </div>

                  {/* Shortcut: Studio Musik */}
                  <div 
                    onClick={() => setActiveTab('musik')}
                    className="p-6 bg-white rounded-xl border border-slate-200 hover:border-blue-400/80 hover:shadow-md cursor-pointer transition text-left space-y-3 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center transition-transform group-hover:scale-105">
                      <Music className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">3. Studio Musik & Vokal</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Uji instrumen sequencer dengan Gamelan Saron, Bass digital, dan gitar elektrik. Buat pengisi suara AI vokal lirik dalam sekejap.
                    </p>
                    <span className="text-xs font-bold text-[#D4AF37] transition group-hover:underline">
                      Mulai Sekarang &rarr;
                    </span>
                  </div>
                </div>

                {/* Quick Info Box */}
                <div className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-xl flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 leading-relaxed">
                    <span className="font-bold">Sistem Penyimpanan Kualitas Tinggi Aktif:</span> Setiap kali Anda menekan tombol simpan atau ekspor di menu Editor Video maupun Studio Musik, berkas WAV, MP4 atau TXT asli akan langsung dimasukkan ke dalam daftar unduhan sidebar kanan di bawah untuk disimpan dengan mudah ke HP/komputer Anda.
                  </div>
                </div>

              </div>
            )}

            {/* 2. ASISTEN CERDAS TAB VIEW */}
            {activeTab === 'asisten' && <AsistenCerdas />}

            {/* 3. EDITOR VIDEO TAB VIEW */}
            {activeTab === 'video' && <EditorVideo onAddExport={handleAddExport} />}

            {/* 4. STUDIO MUSIK TAB VIEW */}
            {activeTab === 'musik' && <StudioMusik onAddExport={handleAddExport} />}

            {/* 5. TENTANG TAB VIEW */}
            {activeTab === 'tentang' && (
              <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm animate-fade-in" id="workspace_tentang_view">
                
                <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-slate-100">
                  <div className="w-20 h-20 bg-[#0F172A] border-2 border-[#D4AF37] flex items-center justify-center font-black text-[#D4AF37] text-4xl rounded-xl shrink-0 shadow-md">
                    P
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-slate-800">PAWA App</h2>
                    <p className="text-[#D4AF37] font-bold text-xs uppercase tracking-widest">Panduan Andal, Karya Sempurna</p>
                    <p className="text-xs text-slate-400 mt-1">Satu Aplikasi, Segala Gagasan Menjadi Nyata</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-1">Identitas Inti</h3>
                    <div className="space-y-2 text-sm leading-relaxed">
                      <div>
                        <span className="font-bold text-slate-600 block">Nama Aplikasi</span>
                        <p className="text-slate-800">PAWA</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-600 block">Kepanjangan Resmi</span>
                        <p className="text-slate-800">Panji Wafa</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-600 block">Makna Hakiki</span>
                        <p className="text-slate-800 text-justify">
                          <strong>"Panduan Andal, Karya Sempurna"</strong>. Menyimbolkan sebuah asisten handal yang senantiasa menuntun kreasi ke arah pencapaian estetika visual, literatur, serta simfoni suara yang memukau.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-1">Panduan Pengoperasian</h3>
                    <ul className="text-xs text-slate-600 space-y-2 leading-relaxed list-disc list-inside">
                      <li>Tulis pesan ke Asisten Cerdas untuk mengkomposisi puisi, naskah presentasi, ataupun skrip film. Gunakan asisten tombol cepat untuk menghemat waktu.</li>
                      <li>Di layar Editor Video, modifikasi filter warna visual secara real-time lalu tekan tombol <strong>"Simpan Video (HD / Full HD)"</strong>.</li>
                      <li>Di Studio Musik, klik kotakan grid untuk menyusun arpeggiator sequencer, lalu download hasilnya dengan format <strong>WAV Master kualitas studio CD</strong>.</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-[#0F172A] border-2 border-[#D4AF37] text-white p-5 rounded-xl text-center space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                    KAMI MENJAGA INTEGRITAS KARYA ANDA
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Setiap algoritma pemrosesan audio, gambar, dan video dirakit agar tidak mereduksi kualitas (lossless). Setiap berkas buatan Anda adalah milik Anda sepenuhnya.
                  </p>
                </div>
              </div>
            )}

          </div>
        </main>

        {/* EXPORT PANEL (KARYA SIAP UNDUH) (Right Sidebar) */}
        <aside className="w-full lg:w-72 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col p-6 shrink-0">
          <div className="flex items-center justify-between mb-4 pb-2 border-b">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <span>Karya Siap Unduh</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-bold rounded-full text-[10px] uppercase">
                {exportedFiles.length}
              </span>
            </h2>
            {exportedFiles.length > 0 && (
              <button 
                id="clear_export_list"
                onClick={() => setExportedFiles([])}
                className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-0.5" 
                title="Kosongkan Semua"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Export Items List container */}
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] lg:max-h-none pr-1">
            {exportedFiles.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-center text-slate-400 bg-slate-50 border border-dashed rounded-lg p-4">
                <Download className="w-8 h-8 text-slate-300 mb-2 animate-bounce" />
                <span className="text-xs font-medium">Belum ada karya yang diekspor.</span>
                <span className="text-[10px] text-slate-400 mt-1">Gunakan Editor Video / Studio Musik untuk mengekspor WAV/MP4 kualitas CD.</span>
              </div>
            ) : (
              exportedFiles.map((file) => (
                <div 
                  key={file.id} 
                  id={`export_card_${file.id}`}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-amber-400/80 transition shadow-sm flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#0F172A] text-[#D4AF37] border border-[#D4AF37] flex items-center justify-center rounded-lg text-[9px] font-mono font-black shadow-inner">
                      {file.name.slice(-3).toUpperCase()}
                    </div>
                    <div className="max-w-[120px] md:max-w-none">
                      <div className="text-xs font-bold text-slate-700 truncate" title={file.name}>
                        {file.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {file.size} • {file.type}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      id={`btn_del_exp_${file.id}`}
                      onClick={(e) => handleRemoveExport(file.id, e)}
                      className="p-1.5 text-slate-300 hover:text-red-500 rounded transition"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <a
                      id={`btn_dl_exp_${file.id}`}
                      href={file.url}
                      download={file.name}
                      className="p-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition"
                      title="Unduh sekarang"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-4 border-t">
            <button 
              id="download_all_btn"
              disabled={exportedFiles.length === 0}
              onClick={handleDownloadAll}
              className="w-full py-3.5 bg-[#D4AF37] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-[#0F172A] font-black uppercase text-xs tracking-wider hover:brightness-110 flex items-center justify-center gap-2 rounded-lg transition-all"
            >
              Unduh Semua Karya ({exportedFiles.length})
              <Download className="w-4 h-4" />
            </button>
            <p className="text-[9px] text-center text-slate-400 mt-2.5 uppercase tracking-widest font-mono">
              PANDUAN ANDAL, KARYA SEMPURNA
            </p>
          </div>
        </aside>
      </div>

      {/* BOTTOM STATUS BAR (Footer) */}
      <footer className="h-8 bg-[#0F172A] text-white flex items-center px-4 md:px-6 justify-between shrink-0 z-40 border-t border-slate-800">
        <div className="flex gap-4 md:gap-6">
          <span className="text-[10px] font-bold uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> 
            Mesin PAWA Aktif
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">Panji Wafa v2.4.0</span>
        </div>
        <div className="flex gap-4">
          <span className="text-[10px] text-slate-400 font-mono">LATENCY: 8ms</span>
          <span className="text-[10px] text-[#D4AF37] font-bold font-mono">CPU USAGE: 12%</span>
        </div>
      </footer>
    </div>
  );
}
