// Browser Web Speech API helpers (TTS + STT). All client-only.

export function isTTSAvailable() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function pickUzbekVoice(): SpeechSynthesisVoice | null {
  if (!isTTSAvailable()) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => /uz|uzbek/i.test(v.lang) || /uz|uzbek/i.test(v.name)) ||
    voices.find((v) => /^ru/i.test(v.lang)) ||
    voices.find((v) => /^tr/i.test(v.lang)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    voices[0] ||
    null
  );
}

export function speak(text: string, onEnd?: () => void): void {
  if (!isTTSAvailable()) return;
  window.speechSynthesis.cancel();
  const clean = text.replace(/[#*_`>~\[\]()]/g, "").slice(0, 1200);
  const u = new SpeechSynthesisUtterance(clean);
  const v = pickUzbekVoice();
  if (v) u.voice = v;
  u.lang = v?.lang || "uz-UZ";
  u.rate = 0.95;
  u.pitch = 1;
  if (onEnd) {
    u.onend = onEnd;
    u.onerror = onEnd;
  }
  window.speechSynthesis.speak(u);
}

export function stopSpeak() {
  if (isTTSAvailable()) window.speechSynthesis.cancel();
}

type WindowWithSR = Window & {
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  SpeechRecognition?: new () => SpeechRecognitionLike;
};

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { results: { [k: number]: { [k: number]: { transcript: string } } } & { length: number } }) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export function isSTTAvailable() {
  if (typeof window === "undefined") return false;
  const w = window as WindowWithSR;
  return !!(w.webkitSpeechRecognition || w.SpeechRecognition);
}

export function createRecognizer(): SpeechRecognitionLike | null {
  if (!isSTTAvailable()) return null;
  const w = window as WindowWithSR;
  const Ctor = w.webkitSpeechRecognition || w.SpeechRecognition!;
  const r = new Ctor();
  r.lang = "uz-UZ";
  r.continuous = false;
  r.interimResults = false;
  return r;
}