import type { BallQism } from './test';
import { yol } from '../yol';

export interface TinglashHolati {
  tugadi: () => void;
  xato: (boshlangan: boolean) => void;
  boshlandi: () => void;
  progress: (qism: number) => void;
}

export function audioIjro(qism: BallQism, holat: TinglashHolati): () => void {
  if (qism.audio) {
    const audio = new Audio(yol(qism.audio));
    let faol = true;
    let boshlangan = false;
    audio.addEventListener('playing', () => {
      if (faol && !boshlangan) { boshlangan = true; holat.boshlandi(); }
    });
    audio.addEventListener('timeupdate', () => {
      if (faol && Number.isFinite(audio.duration)) holat.progress(audio.currentTime / audio.duration);
    });
    audio.addEventListener('ended', () => { if (faol) holat.tugadi(); });
    audio.addEventListener('error', () => {
      if (faol) { faol = false; holat.xato(boshlangan); }
    });
    void audio.play().catch(() => {
      if (faol) { faol = false; holat.xato(boshlangan); }
    });
    return () => { faol = false; audio.pause(); };
  }

  const sintez = window.speechSynthesis;
  const script = qism.script ?? [];
  const voices = sintez?.getVoices().filter((voice) => voice.localService && /^en\b/i.test(voice.lang)) ?? [];
  if (!sintez || !script.length || !voices.length) {
    queueMicrotask(() => holat.xato(false));
    return () => {};
  }

  const speakers = [...new Set(script.map((line) => line.speaker))];
  let index = 0;
  let faol = true;
  let boshlangan = false;
  let jumla: SpeechSynthesisUtterance;
  const keyingi = () => {
    const line = script[index];
    if (!faol) return;
    if (!line) { holat.tugadi(); return; }
    jumla = new SpeechSynthesisUtterance(line.text);
    jumla.voice = voices[speakers.indexOf(line.speaker) % voices.length];
    jumla.lang = jumla.voice.lang;
    jumla.rate = 0.94;
    jumla.onstart = () => {
      if (faol && !boshlangan) { boshlangan = true; holat.boshlandi(); }
    };
    jumla.onend = () => {
      if (!faol) return;
      index += 1;
      holat.progress(index / script.length);
      keyingi();
    };
    jumla.onerror = () => { if (faol) { faol = false; holat.xato(boshlangan); } };
    sintez.speak(jumla);
  };
  keyingi();
  return () => { faol = false; sintez.cancel(); };
}
