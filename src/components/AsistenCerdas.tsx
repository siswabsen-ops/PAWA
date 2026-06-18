import React, { useState } from 'react';
import { 
  Compass, 
  Send, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Key, 
  CheckCircle,
  Brain,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AsistenCerdasProps {
  userRole: string;
}

export default function AsistenCerdas({ userRole }: AsistenCerdasProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Assalamualaikum wr. wb. Saya Asisten Cerdas PAWA (Panduan Andal, Karya Sempurna) untuk LAZ MDT Al Jihad. Saya siap membantu Anda memahami hukum Fiqih Zakat, batas amil, memformulasikan naskah sosialisasi amaliah, atau memandu langkah operasional sistem ini. Ada yang bisa saya bantu hari ini?',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick Action triggers
  const promptAsisten = async (queryText: string) => {
    if (loading) return;
    
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    try {
      const historyPayload = [...messages, userMsg]
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text
        }));

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          prompt: queryText,
          history: historyPayload
        })
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi asisten pintar.');
      }

      const data = await response.json();
      const replyText = data.text || 'Maaf, saya tidak dapat merespons saat ini. Sila coba beberapa saat lagi.';

      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (e: any) {
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'assistant',
        text: `Mohon maaf, sistem mengalami kendala koneksi dengan server AI: ${e.message}. Namun secara fiqih, zakat fitrah terhitung 2.5 kg atau 3.5 liter beras atau senilai uang standar BAZNAS setara Rp45.000 per jiwa.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    promptAsisten(inputVal);
  };

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
            <span className="font-bold text-emerald-900 block">1. Cara Mencatat Dana Masuk</span>
            <p className="leading-relaxed">
              Buka menu <strong>"Penghimpunan"</strong>. Isi nama muzakki/donatur, nomor HP, jumlah nominal, jenis amal (fitrah, mal, infak, sedekah, wakaf) dan klik <strong>"Catat &amp; Ambil Kwitansi"</strong>. Klik tombol <strong>"Cetak"</strong> untuk memunculkan slip PDF resmi.
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
              Buka menu <strong>"Penyaluran"</strong>. Buat agenda program bantuan. Pipa alur kerja akan mengawal prosesnya. Ketika berstatus <strong>"Penyaluran"</strong>, Anda dapat menekan tombol <strong>"Isi Tanda Terima Digital &amp; Bukti Foto"</strong> untuk menggambar tanda tangan basah di layar secara langsung!
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

      {/* Sisi Kanan: Asisten Interaktif Cerdas PAWA */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col h-[580px] justify-between">
        
        {/* Header Asisten */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md relative">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <div className="absolute right-0 bottom-0 w-2 h-2 rounded-full bg-emerald-400 border border-white"></div>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm font-display">Asisten Cerdas PAWA</h4>
              <p className="text-[10px] text-emerald-600 font-bold">Panduan Andal, Karya Sempurna</p>
            </div>
          </div>
          
          <div className="text-right text-[10px] text-slate-400 font-mono">
            <span>Model: Gemini 3.5 Flash</span>
          </div>
        </div>

        {/* Chat Messages Log Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 my-2 scrollbar-thin scrollbar-thumb-emerald-100">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div 
                key={m.id} 
                className={`flex gap-2.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Bubble Avatar */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isUser ? 'bg-emerald-800 text-white' : 'bg-amber-100 text-amber-800'}`}>
                  {isUser ? 'U' : 'P'}
                </div>

                {/* Bubble chat text body */}
                <div className={`rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${isUser ? 'bg-emerald-850 text-white rounded-tr-none' : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'}`}>
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <span className={`block text-[8px] mt-1 text-right ${isUser ? 'text-emerald-300' : 'text-slate-400'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-2 mr-auto max-w-[80%] animate-pulse">
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs">
                <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />
              </div>
              <div className="rounded-2xl p-3 bg-slate-50 border border-slate-100 text-[10px] text-slate-400 italic">
                PAWA sedang menghitung &amp; merumuskan nasihat syariah...
              </div>
            </div>
          )}
        </div>

        {/* Quick Click Question suggestions */}
        <div className="flex flex-wrap gap-1.5 pb-2 border-t border-slate-100 pt-2 flex-shrink-0">
          <button 
            type="button"
            onClick={() => promptAsisten("Bagaimana pembagian hak amil 12.5% sesuai fiqih?")}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-[10px] font-semibold text-left cursor-pointer"
          >
            📋 Fiqih Batas Amil 12.5%?
          </button>
          <button 
            type="button"
            onClick={() => promptAsisten("Bagaimana syarat nisab zakat mal emas?")}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-[10px] font-semibold text-left cursor-pointer"
          >
            💰 Syarat Nisab Emas?
          </button>
          <button 
            type="button"
            onClick={() => promptAsisten("Buatkan naskah ajakan berzakat fitrah di MDT Al Jihad")}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-[10px] font-semibold text-left cursor-pointer"
          >
            📢 Naskah Ajakan Zakat?
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="flex gap-2 flex-shrink-0">
          <input 
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Tanyakan fatwa zakat murtad, nisab, atau cara cetak kuitansi disini..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            disabled={loading}
          />
          <button 
            type="submit"
            className="p-2 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
            disabled={loading || !inputVal.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
