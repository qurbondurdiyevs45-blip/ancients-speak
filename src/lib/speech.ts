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

/**
 * Preprocess Uzbek text for cleaner TTS:
 * - strip markdown noise
 * - normalize tutuq belgisi (o‘ → oʻ, g‘ → gʻ) which most TTS engines pronounce better
 * - collapse whitespace
 */
export function cleanForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[#*_~>]/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[‘’`´ʼ]/g, "ʻ")
    .replace(/\s+/g, " ")
    .trim();
}

export function speak(text: string, onEnd?: () => void): void {
  if (!isTTSAvailable()) return;
  window.speechSynthesis.cancel();
  const clean = cleanForSpeech(text).slice(0, 1500);
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

export type SpeechController = {
  play: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  getState: () => "playing" | "paused" | "stopped" | "ended";
};

export type SpeechHandlers = {
  onBoundary?: (charIndex: number, word: string) => void;
  onStateChange?: (s: "playing" | "paused" | "stopped" | "ended") => void;
  onEnd?: () => void;
};

/**
 * Create a controllable utterance with play/pause/resume/stop and word boundary events.
 * Falls back gracefully if speechSynthesis is unavailable.
 */
export function createSpeechController(
  text: string,
  handlers: SpeechHandlers = {},
): SpeechController {
  let state: "playing" | "paused" | "stopped" | "ended" = "stopped";
  const setState = (s: typeof state) => {
    state = s;
    handlers.onStateChange?.(s);
  };
  if (!isTTSAvailable()) {
    return {
      play: () => handlers.onEnd?.(),
      pause: () => {},
      resume: () => {},
      stop: () => {},
      getState: () => state,
    };
  }
  const clean = cleanForSpeech(text);
  const u = new SpeechSynthesisUtterance(clean);
  const v = pickUzbekVoice();
  if (v) u.voice = v;
  u.lang = v?.lang || "uz-UZ";
  u.rate = 0.95;
  u.pitch = 1;
  u.onstart = () => setState("playing");
  u.onpause = () => setState("paused");
  u.onresume = () => setState("playing");
  u.onend = () => {
    setState("ended");
    handlers.onEnd?.();
  };
  u.onerror = () => {
    setState("ended");
    handlers.onEnd?.();
  };
  u.onboundary = (e: SpeechSynthesisEvent) => {
    if (e.name && e.name !== "word") return;
    const idx = e.charIndex ?? 0;
    const rest = clean.slice(idx);
    const word = rest.split(/\s+/)[0] || "";
    handlers.onBoundary?.(idx, word);
  };
  return {
    play: () => {
      window.speechSynthesis.cancel();
      setState("playing");
      window.speechSynthesis.speak(u);
    },
    pause: () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        setState("paused");
      }
    },
    resume: () => {
      window.speechSynthesis.resume();
      setState("playing");
    },
    stop: () => {
      window.speechSynthesis.cancel();
      setState("stopped");
    },
    getState: () => state,
  };
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