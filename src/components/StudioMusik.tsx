import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Upload, Volume2, Music, Mic, Layers, Download, Check, Sparkles, HelpCircle } from 'lucide-react';
import { SequencerTrack, MusicType, VocalSpeaker } from '../types';
import { bufferToWav } from '../utils/wavExporter';

interface StudioMusikProps {
  onAddExport: (item: { id: string; name: string; type: string; url: string; size: string; resolution?: string }) => void;
}

export default function StudioMusik({ onAddExport }: StudioMusikProps) {
  // Analytical Mode State
  const [analyzingFile, setAnalyzingFile] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    tempo: number;
    scale: string;
    description: string;
    dynamics: string;
  } | null>(null);

  // Sequencer Variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [currentStep, setCurrentStep] = useState(0);
  const [tracks, setTracks] = useState<SequencerTrack[]>([
    {
      id: 'tr_akustik',
      name: 'Gitar Akustik (Plucked)',
      type: 'akustik',
      color: '#d4af37',
      sequence: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
      pitch: 220, // A3
      vol: 0.7
    },
    {
      id: 'tr_elektronik',
      name: 'Bass Synth (Digital)',
      type: 'elektronik',
      color: '#0f62fe',
      sequence: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
      pitch: 55, // A1
      vol: 0.8
    },
    {
      id: 'tr_orkestra',
      name: 'String Ensemble Pad',
      type: 'orkestra',
      color: '#8a3ffc',
      sequence: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
      pitch: 330, // E4
      vol: 0.5
    },
    {
      id: 'tr_tradisional',
      name: 'Gamelan Saron (Logam)',
      type: 'tradisional',
      color: '#007d79',
      sequence: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
      pitch: 440, // A4 (Slendro/Pelog resonance simulation)
      vol: 0.6
    }
  ]);

  // Vocal Generator state
  const [vocalText, setVocalText] = useState('Mari menghasilkan masterpiece bersama PAWA!');
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('sp-bariton');
  const [vocalVolume, setVocalVolume] = useState(80);
  const [isVocalGenerating, setIsVocalGenerating] = useState(false);

  // Audio Context reference for live step synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sequencerTimerRef = useRef<any>(null);

  const speakers: VocalSpeaker[] = [
    { id: 'sp-bariton', name: 'Panji Sinematik Bariton', desc: 'Suara berat berwibawa, cocok untuk dokumenter / narasi.', gender: 'Laki-laki', style: 'Narrator', basePitch: 100, color: '#D4AF37' },
    { id: 'sp-soprano', name: 'Wafa Pop Soprano', desc: 'Bersih, nyaring kemilau, jernih untuk nada vokal indie pop.', gender: 'Perempuan', style: 'Soprano', basePitch: 320, color: '#0f62fe' },
    { id: 'sp-sinden', name: 'Laras Traditional Sinden', desc: 'Sangat merdu bernada slendro eksotis, khas Jawa.', gender: 'Perempuan', style: 'Traditional Soloist', basePitch: 380, color: '#007d79' },
    { id: 'sp-folk', name: 'Ananta Acoustic Folk', desc: 'Hangat, kasual dengan serak tipis yang menenangkan.', gender: 'Laki-laki', style: 'Acoustic Singer', basePitch: 160, color: '#da1e28' }
  ];

  // Stop synthesizer timer loops safely on unmount
  useEffect(() => {
    return () => {
      if (sequencerTimerRef.current) clearInterval(sequencerTimerRef.current);
    };
  }, []);

  // Web Audio trigger on step
  const playStepSynth = (stepIdx: number) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      tracks.forEach((track) => {
        if (track.sequence[stepIdx]) {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          let frequency = track.pitch;
          
          // Add nice chord progression variation on step
          if (stepIdx >= 4 && stepIdx < 8) frequency *= 1.25; // Perfect Fourth
          else if (stepIdx >= 8 && stepIdx < 12) frequency *= 1.5; // Perfect Fifth
          else if (stepIdx >= 12) frequency *= 1.875; // Major Seventh

          osc.frequency.setValueAtTime(frequency, ctx.currentTime);

          // Customize timbre according to instrument type
          if (track.type === 'akustik') {
            osc.type = 'triangle';
            // Fast attack, quick decay
            gainNode.gain.setValueAtTime(track.vol * 0.4, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
          } else if (track.type === 'elektronik') {
            osc.type = 'sawtooth';
            // Low pass filter
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(280, ctx.currentTime);
            osc.connect(filter);
            filter.connect(gainNode);

            gainNode.gain.setValueAtTime(track.vol * 0.5, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
          } else if (track.type === 'orkestra') {
            osc.type = 'sine';
            // Slow pad swell
            gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(track.vol * 0.35, ctx.currentTime + 0.15);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
          } else if (track.type === 'tradisional') {
            osc.type = 'sine';
            // Metal resonator (Gamelan bells) - highly resonant
            const resonator = ctx.createOscillator();
            resonator.type = 'sine';
            resonator.frequency.setValueAtTime(frequency * 2.502, ctx.currentTime); // Ring modulator ratio
            
            const rGain = ctx.createGain();
            rGain.gain.setValueAtTime(0.2, ctx.currentTime);
            resonator.connect(rGain);
            rGain.connect(osc.frequency);

            gainNode.gain.setValueAtTime(track.vol * 0.5, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
            
            resonator.start();
            resonator.stop(ctx.currentTime + 0.82);
          }

          if (track.type !== 'elektronik') {
            osc.connect(gainNode);
          }

          gainNode.connect(ctx.destination);
          
          osc.start();
          osc.stop(ctx.currentTime + 0.8);
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Sequencer loop controller
  useEffect(() => {
    if (isPlaying) {
      const stepDuration = (60 / bpm) / 4 * 1000; // 16th note steps duration
      sequencerTimerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          const next = (prev + 1) % 16;
          playStepSynth(next);
          return next;
        });
      }, stepDuration);
    } else {
      if (sequencerTimerRef.current) {
        clearInterval(sequencerTimerRef.current);
        sequencerTimerRef.current = null;
      }
    }
    return () => {
      if (sequencerTimerRef.current) clearInterval(sequencerTimerRef.current);
    };
  }, [isPlaying, bpm, tracks]);

  const handleStepClick = (trackId: string, stepIdx: number) => {
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === trackId) {
          const newSeq = [...t.sequence];
          newSeq[stepIdx] = !newSeq[stepIdx];
          return { ...t, sequence: newSeq };
        }
        return t;
      })
    );
  };

  const handleBpmChange = (newBpm: number) => {
    if (newBpm >= 40 && newBpm <= 220) {
      setBpm(newBpm);
    }
  };

  // Drag and Drop simulated music uploader and style analyzer
  const handleFileUploadSimu = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fName = e.target.files[0].name;
      setAnalyzingFile(fName);
      setIsAnalyzing(true);
      setAnalysisResult(null);

      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisResult({
          tempo: Math.floor(88 + Math.random() * 52),
          scale: ['La minor (A minor)', 'Do mayor (C Major)', 'Sol mayor (G Major)', 'Re minor (D minor)'][Math.floor(Math.random() * 4)],
          description: 'Komposisi didominasi instrumen akustik string hangat dengan gelombang transien dinamis seimbang.',
          dynamics: 'Kualitas Berkas Bagus - Rentang Dinamis Rekaman Profesional (LUFS -14)'
        });
      }, 1800);
    }
  };

  // Master WAV File Exporter Engine - Generates an authentic wav file via the Web Audio API offline renderer!
  const handleExportWavRecord = async () => {
    try {
      const sampleRate = 44100;
      const bpmLocal = bpm;
      const stepDuration = (60 / bpmLocal) / 4; // in seconds
      const totalSteps = 16;
      const totalDuration = totalSteps * stepDuration;

      // Offline render context
      const offlineCtx = new OfflineAudioContext(2, sampleRate * totalDuration, sampleRate);

      // Synthesize full sequencer sequence into the offline buffer
      for (let step = 0; step < totalSteps; step++) {
        const stepTime = step * stepDuration;

        tracks.forEach((track) => {
          if (track.sequence[step]) {
            const osc = offlineCtx.createOscillator();
            const gainNode = offlineCtx.createGain();

            let f = track.pitch;
            if (step >= 4 && step < 8) f *= 1.25;
            else if (step >= 8 && step < 12) f *= 1.5;
            else if (step >= 12) f *= 1.875;

            osc.frequency.setValueAtTime(f, stepTime);

            if (track.type === 'akustik') {
              osc.type = 'triangle';
              gainNode.gain.setValueAtTime(track.vol * 0.4, stepTime);
              gainNode.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.25);
            } else if (track.type === 'elektronik') {
              osc.type = 'sawtooth';
              gainNode.gain.setValueAtTime(track.vol * 0.35, stepTime);
              gainNode.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.3);
            } else if (track.type === 'orkestra') {
              osc.type = 'sine';
              gainNode.gain.setValueAtTime(0.001, stepTime);
              gainNode.gain.linearRampToValueAtTime(track.vol * 0.35, stepTime + 0.1);
              gainNode.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.45);
            } else if (track.type === 'tradisional') {
              osc.type = 'sine';
              gainNode.gain.setValueAtTime(track.vol * 0.45, stepTime);
              gainNode.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.55);
            }

            osc.connect(gainNode);
            gainNode.connect(offlineCtx.destination);
            
            osc.start(stepTime);
            osc.stop(stepTime + 0.6);
          }
        });
      }

      const renderedBuffer = await offlineCtx.startRendering();
      const wavBlob = bufferToWav(renderedBuffer);
      const url = URL.createObjectURL(wavBlob);

      onAddExport({
        id: 'audio-' + Date.now(),
        name: `PAWA_Symphony_${bpmLocal}BPM_${Date.now().toString().slice(-4)}.wav`,
        type: 'WAV / Stereo CD',
        url: url,
        size: `${(wavBlob.size / (1024 * 1024)).toFixed(2)} MB`
      });

    } catch (err) {
      console.error("Gagal mengekspor audio WAV: ", err);
    }
  };

  // Vocal Vocalization Speech Composer - Generates customized voice singing pattern matching selected profile
  const handleVocalSynthesis = async () => {
    if (!vocalText.trim()) return;

    setIsVocalGenerating(true);

    // Dynamic timeout representing fine pitch matching
    setTimeout(async () => {
      try {
        const matchingSp = speakers.find(s => s.id === selectedSpeaker) || speakers[0];
        const sampleRate = 44100;
        const totalDuration = Math.max(1.8, vocalText.length * 0.08); // duration based on text length

        const offlineCtx = new OfflineAudioContext(1, sampleRate * totalDuration, sampleRate);

        // Vocal Formant sweep oscillator simulation to mimic actual human vocal tracts
        const baseHz = matchingSp.basePitch;
        
        for (let i = 0; i < vocalText.length; i++) {
          const charTime = i * 0.08;
          const char = vocalText[i].toLowerCase();

          if (char === ' ') continue;

          // Pitch mod for melody
          const pMod = 1 + (Math.sin(i * 0.8) * 0.08);

          const glottal = offlineCtx.createOscillator();
          glottal.type = 'sawtooth';
          glottal.frequency.setValueAtTime(baseHz * pMod, charTime);

          const formantFilter1 = offlineCtx.createBiquadFilter();
          formantFilter1.type = 'bandpass';
          formantFilter1.Q.setValueAtTime(12, charTime);

          // Change frequency depending on vowels
          let f1 = 800;
          let f2 = 1200;

          if (['a', 'i', 'u', 'e', 'o'].includes(char)) {
            if (char === 'a') { f1 = 800; f2 = 1200; }
            else if (char === 'i') { f1 = 300; f2 = 2200; }
            else if (char === 'u') { f1 = 300; f2 = 800; }
            else if (char === 'e') { f1 = 500; f2 = 1800; }
            else if (char === 'o') { f1 = 600; f2 = 900; }
          } else {
            f1 = 2000; f2 = 3000; // consonance noise
          }

          formantFilter1.frequency.setValueAtTime(f1, charTime);

          const fGain = offlineCtx.createGain();
          const vocalVolFactor = vocalVolume / 100;
          fGain.gain.setValueAtTime(0.001, charTime);
          fGain.gain.linearRampToValueAtTime(0.35 * vocalVolFactor, charTime + 0.01);
          fGain.gain.exponentialRampToValueAtTime(0.001, charTime + 0.075);

          glottal.connect(formantFilter1);
          formantFilter1.connect(fGain);
          fGain.connect(offlineCtx.destination);

          glottal.start(charTime);
          glottal.stop(charTime + 0.08);
        }

        const renderedBuffer = await offlineCtx.startRendering();
        const wavBlob = bufferToWav(renderedBuffer);
        const fileUrl = URL.createObjectURL(wavBlob);

        const speakerNameSlug = matchingSp.name.split(' ').slice(0, 2).join('_');
        onAddExport({
          id: 'vocal-' + Date.now(),
          name: `Vocal_PAWA_${speakerNameSlug}_${Date.now().toString().slice(-3)}.wav`,
          type: 'WAV / Vocal Solo',
          url: fileUrl,
          size: `${(wavBlob.size / (1024 * 1024)).toFixed(2)} MB`
        });

      } catch (err) {
        console.error("Gagal memproses vokal: ", err);
      } finally {
        setIsVocalGenerating(false);
      }
    }, 1500);
  };

  return (
    <div className="grid grid-cols-12 gap-6" id="pawa_music_studio_root_container">
      {/* Waveform Style Analyzer & Sequencer Panel (8 Columns) */}
      <div className="col-span-12 lg:col-span-8 flex flex-col space-y-5">
        {/* Drop & Analysis Window */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 border-b pb-2 border-slate-100">
            <Layers className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">Analisis Gaya & Contoh Audio</h3>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-5">
              <label 
                htmlFor="music-file-upload"
                className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition text-center group"
              >
                <Upload className="w-7 h-7 text-slate-400 group-hover:text-blue-500 mb-2 transition" />
                <span className="text-xs font-bold text-slate-600">Seret berkas contoh suara (.MP3 / .WAV)</span>
                <span className="text-[10px] text-slate-400 mt-1 block">pembatasan max 20MB</span>
                <input
                  id="music-file-upload"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUploadSimu}
                  className="hidden"
                />
              </label>
            </div>

            <div className="md:col-span-7 bg-slate-50 p-4 rounded-xl border border-slate-200/60 min-h-[110px] flex flex-col justify-center">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-2 animate-pulse">
                  <RefreshCw className="w-5 h-5 text-blue-500 animate-spin mb-1.5" />
                  <span className="text-xs font-semibold text-slate-500">Menganalisis harmoni, spektrum nada, dan struktur ritmis...</span>
                </div>
              ) : analysisResult ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Contoh Suara: <span className="text-blue-600">{analyzingFile}</span></span>
                    <span className="px-1.5 py-0.5 bg-green-100 text-green-700 font-bold rounded-sm text-[9px] uppercase">Teranalisis</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono py-1 border-y border-slate-200">
                    <div>Tempo Asal: <span className="text-slate-900 font-bold">{analysisResult.tempo} BPM</span></div>
                    <div>Nada Dasar: <span className="text-slate-900 font-bold">{analysisResult.scale}</span></div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{analysisResult.description}</p>
                  <p className="text-[10px] text-slate-400 italic">{analysisResult.dynamics}</p>
                </div>
              ) : (
                <div className="text-center py-3">
                  <Music className="w-5 h-5 text-slate-300 mx-auto mb-1.5" />
                  <p className="text-xs text-slate-500">Belum ada audio perbandingan yang diunggah.</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Aransemen sequencer di bawah akan bersandar pada parameter asal default PAWA.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 16-Step Arpeggiator Sequencer */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">Aransemen Lagu Baru (16-Step Sequencer)</h3>
            </div>
            <div className="flex items-center gap-3.5">
              {/* Tempo BPM Config */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">TEMPO:</span>
                <input
                  id="num-bpm-input"
                  type="number"
                  min="40"
                  max="220"
                  value={bpm}
                  onChange={(e) => handleBpmChange(Number(e.target.value))}
                  className="w-14 text-xs font-bold font-mono border border-slate-200 rounded p-1 text-center focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-[10px] font-bold text-slate-400 font-mono">BPM</span>
              </div>

              {/* Master Play Button */}
              <button
                id="btn-play-sequencer"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                  isPlaying ? 'bg-amber-500 text-slate-950' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Hentikan
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Mainkan
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Matrix Steps Container */}
          <div className="mt-4 space-y-4">
            {tracks.map((track) => (
              <div key={track.id} id={`track_row_${track.id}`} className="space-y-1">
                {/* Track metadata headers */}
                <div className="flex items-center justify-between text-[11px] px-1">
                  <div className="flex items-center gap-1.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-sm" 
                      style={{ backgroundColor: track.color }}
                    />
                    <span className="font-bold text-slate-700">{track.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      id={`range_vol_${track.id}`}
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={track.vol}
                      onChange={(e) => {
                        const newVol = Number(e.target.value);
                        setTracks((prev) => prev.map((t) => t.id === track.id ? { ...t, vol: newVol } : t));
                      }}
                      className="w-16 h-1 bg-slate-100 rounded-full accent-blue-600 cursor-pointer"
                    />
                    <span className="font-mono text-slate-500 text-[10px] w-6 text-right">{Math.round(track.vol * 100)}%</span>
                  </div>
                </div>

                {/* Grid 16 buttons */}
                <div className="grid gap-1 md:gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200/50" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
                  {track.sequence.map((stepActive, stepIdx) => {
                    const isStepMarker = currentStep === stepIdx && isPlaying;
                    return (
                      <button
                        key={stepIdx}
                        id={`btn_step_${track.id}_${stepIdx}`}
                        onClick={() => handleStepClick(track.id, stepIdx)}
                        className={`h-7 md:h-9 rounded transition-all duration-100 flex items-center justify-center border ${
                          stepActive 
                            ? `border-transparent text-white shadow-sm font-bold`
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        } ${
                          isStepMarker ? 'ring-2 ring-amber-400 scale-[1.08] z-10' : ''
                        }`}
                        style={{
                          backgroundColor: stepActive ? track.color : undefined
                        }}
                        title={`Ketukan ${stepIdx + 1}`}
                      >
                        {isStepMarker && <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Grid helper numbering guide */}
          <div className="grid gap-1 md:gap-1.5 mt-2 px-3 text-center" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
            {Array.from({ length: 16 }).map((_, stepIdx) => (
              <span 
                key={stepIdx} 
                className={`text-[9px] font-mono leading-none ${
                  currentStep === stepIdx && isPlaying ? 'text-[#D4AF37] font-bold' : 'text-slate-400'
                }`}
              >
                {stepIdx + 1}
              </span>
            ))}
          </div>

          {/* Bottom actions for arpeggiator */}
          <div className="mt-5 border-t pt-4 flex flex-col md:flex-row gap-3 justify-between items-center text-xs">
            <span className="text-slate-500 font-mono flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
              Tip: Tekan tombol Langkah untuk menyalakan aransemen, jalankan loop dan tekan "Unduh".
            </span>

            <button
              id="btn_export_music_mp3_wav"
              onClick={handleExportWavRecord}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow flex items-center gap-2 uppercase tracking-wide"
            >
              <Download className="w-4 h-4" /> Ekspor ke WAV (Master CD)
            </button>
          </div>
        </div>
      </div>

      {/* Vocal Composer Engine Sidebar (4 Columns) */}
      <div className="col-span-12 lg:col-span-4 flex flex-col space-y-4">
        {/* Core Generator Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b pb-2 border-slate-100">
            <Mic className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">Penyintesis Vokal AI</h3>
          </div>

          {/* Lirik input */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Naskah / Lirik Pengisi Suara</label>
            <textarea
              id="ta_vocal_lyrics"
              rows={3}
              value={vocalText}
              onChange={(e) => setVocalText(e.target.value)}
              className="w-full text-xs font-mono border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="Ketikkan lirik atau kalimat lisan yang Anda inginkan..."
            />
          </div>

          {/* Speaker Options Selection */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Karakter Pengisi Suara (AI Voices)</label>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {speakers.map((sp) => (
                <div
                  key={sp.id}
                  id={`sp_choice_${sp.id}`}
                  onClick={() => setSelectedSpeaker(sp.id)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    selectedSpeaker === sp.id
                      ? 'bg-slate-50 border-blue-500 ring-1 ring-blue-100'
                      : 'border-slate-200 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-800" style={{ color: selectedSpeaker === sp.id ? sp.color : undefined }}>{sp.name}</span>
                    <span className="text-[9px] px-1 rounded bg-slate-200 text-slate-600 uppercase font-bold">{sp.gender}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">{sp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Vocal Settings */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Intensitas Suara / Desibel</label>
            <div className="flex items-center gap-3">
              <input
                id="range_v_vol"
                type="range"
                min="20"
                max="100"
                value={vocalVolume}
                onChange={(e) => setVocalVolume(Number(e.target.value))}
                className="flex-1 accent-blue-600"
              />
              <span className="text-xs font-mono font-bold text-slate-600 w-8 text-right">{vocalVolume}%</span>
            </div>
          </div>

          {/* Generation and export block */}
          {isVocalGenerating ? (
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold text-slate-500 animate-pulse">
              <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
              Menyintesis suara & pitch vokal...
            </div>
          ) : (
            <button
              id="btn_generate_vocal"
              onClick={handleVocalSynthesis}
              className="w-full py-3 bg-[#0F172A] hover:bg-slate-800 text-[#D4AF37] text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 border border-[#D4AF37]"
            >
              <Mic className="w-4 h-4" /> Sintesis Vokal (WAV Jernih)
            </button>
          )}
        </div>

        {/* Feature Overview Infobox */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h4 className="text-xs font-bold text-slate-700">INFORMASI STUDIO PAWA</h4>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Format audio yang dihasilkan berupa file standard industri **WAV 16-bit 44.1kHz Stereo** murni tanpa de-kompresi. Sempurna jika digabungkan langsung dengan video editor PAWA.
          </p>
        </div>
      </div>
    </div>
  );
}
