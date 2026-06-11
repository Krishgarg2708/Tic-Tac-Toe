// Web Audio API synthesizer for Tic-Tac-Toe AI game sound effects.
// Includes click, AI move, win, lose, draw, and undo synthesized sounds.

let audioCtx: AudioContext | null = null;
let isMuted: boolean = false;

// Initialize AudioContext lazily on first user interaction
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    // Standard and vendor prefixed support
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const setMutedState = (mute: boolean) => {
  isMuted = mute;
};

export const getMutedState = (): boolean => {
  return isMuted;
};

/**
 * Procedural Synthesizer for game events
 */
export const playSound = (type: 'click' | 'aiMove' | 'win' | 'lose' | 'draw' | 'undo' | 'clickSoft') => {
  if (isMuted) return;
  
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    
    switch (type) {
      case 'click': {
        // High-pitched click-pop sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
        
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.09);
        break;
      }

      case 'clickSoft': {
        // High-pitched light click-pop sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
        
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }

      case 'aiMove': {
        // AI digital double chirp
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(440, now);
        osc1.frequency.setValueAtTime(880, now + 0.08);
        
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        osc1.connect(gain);
        gain.connect(ctx.destination);
        
        osc1.start(now);
        osc1.stop(now + 0.2);
        break;
      }

      case 'undo': {
        // Swooshing undo chord going backwards
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.15);
        
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.16);
        break;
      }

      case 'win': {
        // Upward major arpeggio
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + index * 0.08);
          
          gain.gain.setValueAtTime(0.0, now + index * 0.08);
          gain.gain.linearRampToValueAtTime(0.15, now + index * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.08 + 0.3);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(now + index * 0.08);
          osc.stop(now + index * 0.08 + 0.35);
        });
        break;
      }

      case 'lose': {
        // Melodramatic falling minor chords with vibrato
        const notes = [311.13, 293.66, 261.63]; // Eb4, D4, C4
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + index * 0.12);
          osc.frequency.linearRampToValueAtTime(freq - 40, now + index * 0.12 + 0.25);
          
          gain.gain.setValueAtTime(0.0, now + index * 0.12);
          gain.gain.linearRampToValueAtTime(0.08, now + index * 0.12 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.005, now + index * 0.12 + 0.4);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(now + index * 0.12);
          osc.stop(now + index * 0.12 + 0.42);
        });
        break;
      }

      case 'draw': {
        // Deep cowbell/metallic strike chime
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(200, now);
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(312, now);
        
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        
        osc1.start(now);
        osc2.start(now);
        
        osc1.stop(now + 0.32);
        osc2.stop(now + 0.32);
        break;
      }
    }
  } catch (error) {
    console.warn("Audio Context playback failed or was suspended: ", error);
  }
};
