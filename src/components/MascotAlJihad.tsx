import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageCircle, Heart, HandHelping, X, ShieldCheck, Moon } from 'lucide-react';

interface MascotAlJihadProps {
  onNavigateTab?: (tabName: string) => void;
}

const INSIGHTS = [
  { text: "Assalamualaikum! Saya Ami, maskot Al-Jihad. Ada yang bisa saya bantu hari ini?", icon: "👋" },
  { text: "Zakat mensucikan harta kita, sedekah melipatgandakan pahala dan berkah.", icon: "✨" },
  { text: "Bapak/Ibu sudah cek menu 'Mustahik'? Di sana kita memantau keadilan distribusi 8 Asnaf.", icon: "🕌" },
  { text: "Gunakan 'Asisten Cerdas' untuk berkonsultasi mengenai fiqih zakat darurat secara otomatis!", icon: "🤖" },
  { text: "Ubah hidup para mustahik dengan menyalurkan dana amanah Anda lewat menu Penghimpunan.", icon: "💝" },
  { text: "Seluruh pencatatan keuangan di website LAZ Al-Jihad ini bersifat real-time & transparan lho!", icon: "📊" }
];

export default function MascotAlJihad({ onNavigateTab }: MascotAlJihadProps) {
  const [activeMessageIdx, setActiveMessageIdx] = useState(0);
  const [showSpeech, setShowSpeech] = useState(true);
  const [mood, setMood] = useState<'idle' | 'happy' | 'wave'>('idle');
  const [dismissed, setDismissed] = useState(false);

  // Rotate messages automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMessageIdx((prev) => (prev + 1) % INSIGHTS.length);
      setShowSpeech(true);
      // Spark momentary happy animation
      setMood('happy');
      setTimeout(() => setMood('idle'), 1800);
    }, 12000);

    return () => clearInterval(timer);
  }, []);

  const handleMascotClick = () => {
    // Cycle message and do a waving/happy animation
    setMood('wave');
    setActiveMessageIdx((prev) => (prev + 1) % INSIGHTS.length);
    setShowSpeech(true);
    setTimeout(() => setMood('idle'), 2000);
  };

  if (dismissed) return null;

  const currentInsight = INSIGHTS[activeMessageIdx];

  return (
    <div 
      id="laz-mascot-ami" 
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2.5 max-w-xs md:max-w-sm font-sans"
    >
      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        {showSpeech && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-emerald-100 relative flex flex-col gap-2 w-72"
          >
            {/* Speach tail */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-emerald-100 rotate-45"></div>
            
            <button 
              onClick={() => setShowSpeech(false)}
              className="absolute top-1.5 right-1.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition"
              title="Sembunyikan gelembung kata"
            >
              <X className="w-3 h-3" />
            </button>

            <div className="flex items-center gap-1.5 border-b border-emerald-50 pb-1.5">
              <span className="text-xs">{currentInsight.icon}</span>
              <span className="text-[10px] font-black text-emerald-800 tracking-wider font-display uppercase">Ami (Amil Cilik Al-Jihad)</span>
              <span className="bg-amber-100 text-amber-900 text-[8px] font-bold px-1 py-0.2 rounded-full scale-95">MASKOT LAZ</span>
            </div>

            <p className="text-[11px] text-slate-600 leading-normal font-sans font-medium">
              "{currentInsight.text}"
            </p>

            <div className="flex gap-1.5 pt-1">
              <button
                onClick={() => {
                  // Direct to donation/penghimpunan tab
                  const targetBtn = document.getElementById('tab-button-Penghimpunan');
                  if (targetBtn) {
                    targetBtn.click();
                  }
                  if (onNavigateTab) {
                    onNavigateTab('penghimpunan');
                  }
                  setMood('happy');
                }}
                className="flex items-center justify-center gap-1 flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black uppercase py-1.5 rounded-lg transition-all active:scale-95 shadow cursor-pointer"
              >
                <Heart className="w-2.5 h-2.5 fill-white text-white shrink-0" />
                Bayar Kas Masuk / Zakat
              </button>
              <button
                onClick={() => {
                  // Direct to Smart Assistant
                  const targetBtn = document.getElementById('tab-button-AsistenCerdas');
                  if (targetBtn) {
                    targetBtn.click();
                  }
                  if (onNavigateTab) {
                    onNavigateTab('bantuan');
                  }
                  setMood('wave');
                }}
                className="flex items-center justify-center gap-1 flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[9px] font-bold uppercase py-1.5 rounded-lg transition-all active:scale-95 shadow cursor-pointer"
              >
                <HandHelping className="w-2.5 h-2.5 shrink-0" />
                Konsultasi Syariah
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Mascot Character Layout */}
      <div className="flex items-end gap-1.5 mr-3 select-none">
        
        {/* Helper quick label */}
        <div className="flex flex-col items-end">
          <span className="bg-emerald-950/80 backdrop-blur-sm text-[9px] font-bold text-amber-300 font-display px-2 py-0.5 rounded-full shadow border border-amber-500/20">
            Klik Ami! 👆
          </span>
        </div>

        {/* Mascot Wrapper */}
        <motion.div
          onClick={handleMascotClick}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative cursor-pointer w-20 h-20 md:w-24 md:h-24 bg-gradient-to-tr from-emerald-900/30 to-amber-500/10 rounded-full p-1.5 border border-emerald-500/20 backdrop-blur-sm group"
          animate={
            mood === 'wave' 
              ? { rotate: [0, -6, 6, -6, 6, 0], y: [0, -5, 0] } 
              : mood === 'happy' 
              ? { scale: [1, 1.15, 1, 1.1, 1], y: [0, -8, 0] }
              : { y: [0, -4, 0] } // idle floating bounce
          }
          transition={
            mood === 'wave'
              ? { duration: 1.5, ease: "easeInOut" }
              : mood === 'happy'
              ? { duration: 1.2, ease: "easeOut" }
              : { repeat: Infinity, duration: 4, ease: "easeInOut" } // Slow beautiful floating
          }
        >
          {/* Sparkles radiating off mascot */}
          {mood !== 'idle' && (
            <div className="absolute inset-x-0 -top-2 flex justify-between px-2 animate-ping pointer-events-none">
              <Sparkles className="w-4 h-4 text-amber-405 fill-amber-400" />
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          )}

          {/* Maskot SVG Graphic */}
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
            {/* Shadow beneath mascot */}
            <ellipse cx="50" cy="88" rx="22" ry="4" fill="rgba(6, 78, 59, 0.25)" className="animate-pulse" />

            {/* Body: Indonesian/Malay Sarong (Green & Golden grid) */}
            <path d="M32,62 L68,62 L64,85 C64,85 50,89 36,85 Z" fill="#047857" stroke="#065f46" strokeWidth="1.5" />
            {/* Grid pattern lines on Sarong */}
            <path d="M40,62 L42,85" stroke="#f59e0b" strokeWidth="0.8" opacity="0.6" strokeDasharray="2,2" />
            <path d="M50,62 L50,87" stroke="#f59e0b" strokeWidth="0.8" opacity="0.6" strokeDasharray="2,2" />
            <path d="M60,62 L58,85" stroke="#f59e0b" strokeWidth="0.8" opacity="0.6" strokeDasharray="2,2" />
            {/* Horizontal checker string on Sarong */}
            <path d="M34,70 C43,72 57,72 66,70" stroke="#f59e0b" strokeWidth="0.8" opacity="0.6" strokeDasharray="2,2" />
            <path d="M34,78 C43,80 57,80 66,78" stroke="#f59e0b" strokeWidth="0.8" opacity="0.6" strokeDasharray="2,2" />

            {/* Shirt: Clean White Koko shirt */}
            <path d="M34,50 L66,50 L68,64 L32,64 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Dark green vest / amil strap overlay */}
            <path d="M34,50 L42,50 L45,64 L33,64 Z" fill="#065f46" opacity="0.85" />
            <path d="M66,50 L58,50 L55,64 L67,64 Z" fill="#065f46" opacity="0.85" />
            {/* Logo Badge representing Al Jihad on the pocket */}
            <circle cx="39" cy="56" r="3" fill="#f59e0b" />
            <polygon points="39,54 40,56 41,56 40,57 40,58 39,57 38,58 39,57 38,56 39,56" fill="#ffffff" />

            {/* Arm left (peace/wave or rest) */}
            {mood === 'wave' ? (
              // Raised hand for waving
              <g>
                <path d="M66,53 C74,48 78,34 76,30 C74,26 69,32 66,42" fill="#fed7aa" stroke="#c2410c" strokeWidth="1.5" />
                {/* Waving sleeve */}
                <path d="M65,52 L69,45 L73,48 Z" fill="#ffffff" />
              </g>
            ) : (
              // Resting hand
              <path d="M66,54 C72,58 75,66 73,70" fill="#fed7aa" stroke="#334155" strokeWidth="1" />
            )}

            {/* Arm right (giving high-five / peace sign) */}
            <path d="M34,54 C26,51 21,43 23,38 C25,33 29,38 34,46" fill="#fed7aa" stroke="#c2410c" strokeWidth="1.5" />
            {/* Sleeve */}
            <path d="M35,53 L31,46 L27,48 Z" fill="#ffffff" />

            {/* Face / Head */}
            <circle cx="50" cy="38" r="18" fill="#ffedd5" stroke="#ea580c" strokeWidth="1.5" />
            
            {/* Headwear: Traditional Black/Emerald Muslim Peci (Songkok) with fine yellow border */}
            <path d="M34,26 C36,13 64,13 66,26 Z" fill="#022c22" stroke="#065f46" strokeWidth="1.5" />
            {/* Fine gold embroidery line at bottom of peci */}
            <path d="M34,25 C45,26 55,26 66,25" stroke="#f59e0b" strokeWidth="1.2" fill="none" />

            {/* Eyes - Dynamic blinking action based on state */}
            {mood === 'happy' ? (
              // Arched laughing eyes ^_^
              <g>
                <path d="M40,36 Q44,32 47,36" stroke="#065f46" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M53,36 Q56,32 60,36" stroke="#065f46" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </g>
            ) : (
              // Warm round eyes with sparkling white pupils
              <g>
                <circle cx="43" cy="36" r="3.5" fill="#1e293b" />
                <circle cx="44.2" cy="34.8" r="1.1" fill="#ffffff" />
                
                <circle cx="57" cy="36" r="3.5" fill="#1e293b" />
                <circle cx="58.2" cy="34.8" r="1.1" fill="#ffffff" />
              </g>
            )}

            {/* Cute rosy cheeks for warmth */}
            <ellipse cx="38" cy="40" rx="2.5" ry="1.5" fill="#fda4af" opacity="0.6" />
            <ellipse cx="62" cy="40" rx="2.5" ry="1.5" fill="#fda4af" opacity="0.6" />

            {/* Nose */}
            <path d="M49,38 Q50,40 51,38" stroke="#f97316" strokeWidth="1.5" fill="none" strokeLinecap="round" />

            {/* Mouth - Generous smiling curl */}
            {mood === 'happy' ? (
              // Open cheerful laughing mouth D:
              <path d="M45,41 Q50,48 55,41 Z" fill="#be123c" stroke="#9013fe" strokeWidth="0.5" />
            ) : (
              // Sweet curve smile :)
              <path d="M45,42 Q50,46 55,42" stroke="#ea580c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            )}

          </svg>

          {/* Tiny glowing tag badge */}
          <div className="absolute bottom-1 right-1 bg-amber-500 rounded-full p-1 border border-white text-[7px] text-slate-950 font-black animate-bounce shadow">
            AMI
          </div>
        </motion.div>
      </div>

    </div>
  );
}
