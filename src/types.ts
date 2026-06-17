export interface Message {
  id: string;
  sender: 'user' | 'pawa';
  text: string;
  timestamp: Date;
  isSvg?: boolean;
  svgCode?: string;
}

export type MusicType = 'akustik' | 'elektronik' | 'orkestra' | 'tradisional';

export interface SequencerTrack {
  id: string;
  name: string;
  type: MusicType;
  color: string;
  sequence: boolean[]; // 16 steps
  pitch: number; // base midi note or frequency index
  vol: number; // volume multiplier (0.0 to 1.0)
}

export interface VideoFilter {
  brightness: number;  // 50% to 200%
  contrast: number;    // 50% to 200%
  saturation: number;  // 0% to 200%
  colorGrading: 'normal' | 'vintage' | 'cyberpunk' | 'golden' | 'noire' | 'cold';
  stabilization: 'none' | 'steady' | 'locked';
  scrollingText: string;
  textSpeed: number; // 1 to 10
  textSize: number; // px
  textColor: string;
  textBgColor: string;
  audioTrack: string; // 'none' | 'synth-ambient' | 'beat-loop' | 'orchestral-pad'
  vignette: boolean;
  vignetteIntensity: number; // 0.0 to 1.0
}

export interface StockVideo {
  id: string;
  name: string;
  url?: string;
  type: 'synth-cyberpunk' | 'synth-waves' | 'synth-sunset' | 'synth-mist';
}

export interface VocalSpeaker {
  id: string;
  name: string;
  desc: string;
  gender: 'Laki-laki' | 'Perempuan';
  style: string;
  basePitch: number; // scale adjustment factor
  color: string;
}
