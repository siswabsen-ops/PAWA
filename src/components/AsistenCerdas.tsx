import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Copy, Download, FileText, Printer, Check, CornerDownLeft, Eye } from 'lucide-react';
import { Message } from '../types';

export default function AsistenCerdas() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'pawa',
      text: 'Halo! Saya adalah PAWA (Panji Wafa), asisten cerdas Anda. Saya siap membantu Anda menyusun naskah video sinematik, menerjemahkan dokumen, memformulasikan konsep belajar-mengajar, atau membuat karya ilustrasi desain gratis. Coba letakkan ide Anda atau klik tombol asisten cepat di bawah!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input.trim();
    if (!promptToSend) return;

    if (!customPrompt) {
      setInput('');
    }

    const userMsg: Message = {
      id: Date.now().toString() + '-user',
      sender: 'user',
      text: promptToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: promptToSend })
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi pelayan PAWA.');
      }

      const data = await response.json();
      const text = data.text;

      // Detect SVG block
      const svgMatch = text.match(/```(?:xml|html|svg)?\s*(<svg[\s\S]*?<\/svg>)\s*```/i) || text.match(/(<svg[^>]*>[\s\S]*?<\/svg>)/i);
      
      const pawaMsg: Message = {
        id: Date.now().toString() + '-pawa',
        sender: 'pawa',
        text: text,
        timestamp: new Date(),
        isSvg: !!svgMatch,
        svgCode: svgMatch ? svgMatch[1] : undefined
      };

      setMessages((prev) => [...prev, pawaMsg]);
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + '-error',
          sender: 'pawa',
          text: `Aduh, mohon maaf. Terjadi gangguan koneksi: ${error.message || 'Gagal merespon'}. Silakan coba kirim ulang gagasan Anda.`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTXT = (text: string) => {
    // Clean codeblock markers for downloader
    const cleanedText = text.replace(/```[a-z]*\n?/gi, '');
    const blob = new Blob([cleanedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PAWA_Karya_Tulisan_${new Date().toISOString().slice(0,10)}_${Math.floor(100+Math.random()*900)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSVG = (svgCode: string) => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PAWA_Karya_Vector_Ilustrasi_${new Date().toISOString().slice(0,10)}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = (text: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const cleanHTML = text
      .replace(/\n/g, '<br/>')
      .replace(/```[a-z]*/gi, '<pre class="bg-gray-100 p-4 rounded text-sm my-2">')
      .replace(/```/g, '</pre>');

    printWindow.document.write(`
      <html>
        <head>
          <title>PAWA - Karya Tulisan Kreatif</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            .header { border-bottom: 2px solid #0f62fe; padding-bottom: 12px; margin-bottom: 24px; }
            .title { font-size: 24px; font-weight: bold; color: #0f172a; margin-top: 0; }
            .meta { font-size: 12px; color: #64748b; margin-top: -8px; }
            .content { font-size: 15px; }
            .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; text-align: center; color: #94a3b8; }
          </style>
        </head>
        <body onload="window.print()">
          <div class="header">
            <h1 class="title">Karya Tulisan Kreatif</h1>
            <p class="meta">Diproduksi secara instan oleh PAWA (Panji Wafa) - ${new Date().toLocaleDateString('id-ID')}</p>
          </div>
          <div class="content">
            ${cleanHTML}
          </div>
          <div class="footer">
            PAWA | Panduan Andal, Karya Sempurna &copy; 2026
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-210px)] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm" id="pawa_asisten_cerdas_container">
      {/* Thread Window */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto items-end animate-fade-in' : 'mr-auto items-start animate-fade-in'
            }`}
          >
            {/* Sender Label */}
            <span className="text-xs font-mono text-slate-400 mb-1 flex items-center gap-1">
              {msg.sender === 'pawa' ? (
                <>
                  <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" /> PAWA Asisten
                </>
              ) : (
                'Anda (Kreator)'
              )}
            </span>

            {/* Bubble */}
            <div
              className={`p-4 rounded-2xl leading-relaxed whitespace-pre-wrap text-sm md:text-base border ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none text-left shadow-sm'
                  : 'bg-white text-slate-800 border-slate-200 rounded-tl-none shadow-sm'
              }`}
            >
              {msg.text}

              {/* Renders Interactive SVG Design Output directly in the chat! */}
              {msg.isSvg && msg.svgCode && (
                <div className="mt-4 p-4 bg-slate-100 border border-slate-200 rounded-xl flex flex-col items-center">
                  <div className="text-xs font-mono text-slate-500 mb-2 flex items-center gap-1 border-b pb-1 w-full border-slate-200">
                    <Eye className="w-3.5 h-3.5 text-blue-600" /> Pratinjau Ilustrasi SVG:
                  </div>
                  <div 
                    className="max-w-full overflow-auto bg-white p-2 rounded-lg shadow-inner max-h-[250px] flex items-center justify-center border border-slate-100"
                    dangerouslySetInnerHTML={{ __html: msg.svgCode }}
                  />
                  <button
                    id={`btn_dl_svg_${msg.id}`}
                    onClick={() => handleDownloadSVG(msg.svgCode!)}
                    className="mt-3 flex items-center gap-1 p-2 bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs rounded-lg transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh Karya Vector (.SVG)
                  </button>
                </div>
              )}
            </div>

            {/* Message Action Utilities */}
            <div className="flex gap-2.5 mt-1.5 px-1">
              <button
                id={`btn_copy_${msg.id}`}
                onClick={() => handleCopy(msg.id, msg.text)}
                className="text-xs font-medium text-slate-400 hover:text-blue-600 flex items-center gap-1 p-1 rounded hover:bg-slate-100 transition-colors"
                title="Salin tulisan"
              >
                {copiedId === msg.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-500" /> Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Salin
                  </>
                )}
              </button>

              <button
                id={`btn_txt_${msg.id}`}
                onClick={() => handleDownloadTXT(msg.text)}
                className="text-xs font-medium text-slate-400 hover:text-blue-600 flex items-center gap-1 p-1 rounded hover:bg-slate-100 transition-colors"
                title="Unduh format TXT"
              >
                <Download className="w-3.5 h-3.5" /> Unduh TXT
              </button>

              <button
                id={`btn_print_${msg.id}`}
                onClick={() => handlePrint(msg.text)}
                className="text-xs font-medium text-slate-400 hover:text-blue-600 flex items-center gap-1 p-1 rounded hover:bg-slate-100 transition-colors"
                title="Cetak atau Unduh PDF"
              >
                <Printer className="w-3.5 h-3.5" /> Format PDF / Cetak
              </button>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex flex-col mr-auto max-w-[85%] items-start animate-pulse">
            <span className="text-xs font-mono text-slate-400 mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-500 animate-spin" /> PAWA merespon...
            </span>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 rounded-tl-none shadow-sm flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm font-medium text-slate-500">Menyusun karya berkualitas sinematik...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Fast Guides */}
      <div className="bg-slate-100/50 border-t border-slate-200/60 p-3 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          id="fast_act_1"
          onClick={() => handleSend('Tolong tuliskan naskah naskah video pendek YouTube menarik, berdurasi 1 menit membahas kecerdasan buatan, lengkap dengan efek visual dan musik pendukung.')}
          className="bg-white border border-slate-200 text-xs font-medium text-slate-600 px-3 py-1.5 rounded-full hover:border-blue-400 hover:text-blue-600 transition"
        >
          📝 Tulis Naskah YouTube Short
        </button>
        <button
          id="fast_act_2"
          onClick={() => handleSend('Rangkumlah teks berikut ke dalam 3 poin penting lalu terjemahkan ke Bahasa Inggris formal: \n"PAWA memberikan pelayanan terpadu bagi pembuat konten di era digital. Pengguna bisa mengasah naskah asisten cerdas, mengedit kecerahan video secara instan, serta menghasilkan format audio digital berkualitas CD secara gratis."')}
          className="bg-white border border-slate-200 text-xs font-medium text-slate-600 px-3 py-1.5 rounded-full hover:border-blue-400 hover:text-blue-600 transition"
        >
          🔄 Rangkum & Terjemahkan
        </button>
        <button
          id="fast_act_3"
          onClick={() => handleSend('Buat ilustrasi desain sederhana berupa bunga teratai geometris berwarna gradasi biru keemasan. Output harus mengandung blok kode SVG utuh.')}
          className="bg-white border border-slate-200 text-xs font-medium text-slate-600 px-3 py-1.5 rounded-full hover:border-blue-400 hover:text-blue-600 transition"
        >
          🎨 Buat Desain Ilustrasi SVG
        </button>
        <button
          id="fast_act_4"
          onClick={() => handleSend('Buat silabus materi ajar mandiri berdurasi 4 minggu mengenai tips mengarang tulisan naratif fiksi bagi pemula.')}
          className="bg-white border border-slate-200 text-xs font-medium text-slate-600 px-3 py-1.5 rounded-full hover:border-blue-400 hover:text-blue-600 transition"
        >
          📚 Susun Silabus Materi Belajar
        </button>
      </div>

      {/* Input Tray */}
      <div className="bg-white border-t border-slate-200 p-3 md:p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center rounded-xl bg-slate-100 border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 px-3 py-2 transition"
        >
          <input
            id="chat_input_field"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketikkan ide tulisan, silabus naskah, atau ajakan membuat desain SVG..."
            className="flex-1 bg-transparent border-none outline-none text-sm md:text-base text-slate-800 pr-12 pl-2 placeholder-slate-400"
            disabled={loading}
          />
          <button
            id="chat_submit_btn"
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="text-[10px] text-slate-400 text-center mt-1.5 flex items-center justify-center gap-1">
          <span>PAWA dipersenjatai dengan kecerdasan server Gemini.</span>
          <span>•</span>
          <span>Seret tulisan ke clipboard atau ekspor instan kapan pun.</span>
        </div>
      </div>
    </div>
  );
}
