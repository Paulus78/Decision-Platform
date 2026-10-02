// Kleine Soundeffekte direkt im Browser erzeugt (keine Dateien, keine Kosten).

let ctx: AudioContext | null = null;
let muted = false;

export function setSfxMuted(value: boolean) {
  muted = value;
}

function context(): AudioContext {
  ctx ??= new AudioContext();
  return ctx;
}

function tone(freq: number, start: number, length: number, volume: number) {
  if (muted) return;
  const ac = context();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.frequency.value = freq;
  const t = ac.currentTime + start;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t + length);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + length + 0.05);
}

// Handy-Klingeln: zweimal ein kurzer Doppelton.
export function ring() {
  for (const start of [0, 0.5]) {
    tone(880, start, 0.18, 0.12);
    tone(1175, start + 0.18, 0.22, 0.12);
  }
}

export function pop() {
  tone(520, 0, 0.12, 0.15);
  tone(780, 0.05, 0.14, 0.1);
}
