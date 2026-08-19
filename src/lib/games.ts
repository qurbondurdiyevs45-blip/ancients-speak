export type Proverb = { text: string; meaning: string };
export type Riddle = { q: string; a: string; hint: string };
export type Pair = { left: string; right: string };
export type SpeedQ = { q: string; options: string[]; answer: number; level: 1 | 2 | 3 };

export const PROVERBS: Proverb[] = [
  { text: "Bilim — aql chirog‘i.", meaning: "Ilm insonning yo‘lini yoritadi." },
  { text: "Ko‘p o‘qigan bilmas, ko‘p yurgan bilar.", meaning: "Tajriba bilim bilan birga kerak." },
  { text: "Vatanni sevmoq — imondandir.", meaning: "Vatanparvarlik oliy fazilat." },
  { text: "Mehnat — baxt kaliti.", meaning: "Halol mehnat farovonlik keltiradi." },
  { text: "Do‘st boshga, dushman oyoqqa qaraydi.", meaning: "Chin do‘st fikringni qadrlaydi." },
  { text: "Bir daraxt kessang, o‘nta ek.", meaning: "Tabiatga mas’uliyat." },
  { text: "So‘z — kumush, sukut — oltin.", meaning: "O‘rinsiz gapdan tiyilish afzal." },
  { text: "Ustoz otangdek ulug‘.", meaning: "Ustozga hurmat — an’ana." },
];

export const RIDDLES: Riddle[] = [
  { q: "Men Samarqandda rasadxona qurdim, yulduzlar jadvalini yozdim. Kimman?", a: "Mirzo Ulug‘bek", hint: "Temuriylar sulolasidan, astronom." },
  { q: "Algoritm so‘zi mening ismimdan kelib chiqqan. Kimman?", a: "Al-Xorazmiy", hint: "Matematik, algebra asoschisi." },
  { q: "«Tib qonunlari» asarimni Yevropa 600 yil o‘qidi. Kimman?", a: "Ibn Sino", hint: "Tabobat sultoni." },
  { q: "«Xamsa» va «Xazoyin ul-maoniy» muallifiman. Kimman?", a: "Alisher Navoiy", hint: "O‘zbek adabiyoti asoschisi." },
  { q: "«Boburnoma» kitobini yozdim, Hindistonda saltanat qurdim. Kimman?", a: "Bobur", hint: "Temuriy shahzoda." },
  { q: "«Kuchli — adolatlidir» shiori bilan buyuk davlat qurdim. Kimman?", a: "Amir Temur", hint: "Sohibqiron." },
  { q: "Hadis ilmida eng ishonchli to‘plam meniki. Kimman?", a: "Imom Buxoriy", hint: "«Sahih» muallifi." },
  { q: "Yerning aylanishi va o‘lchovlari haqida yozgan qomusiy olimman. Kimman?", a: "Beruniy", hint: "Xorazm allomasi." },
];

export const PAIRS: Pair[] = [
  { left: "Al-Xorazmiy", right: "Algebra" },
  { left: "Ibn Sino", right: "Tib qonunlari" },
  { left: "Ulug‘bek", right: "Rasadxona" },
  { left: "Navoiy", right: "Xamsa" },
  { left: "Bobur", right: "Boburnoma" },
  { left: "Amir Temur", right: "Temuriylar davlati" },
  { left: "Beruniy", right: "Osor ul-boqiya" },
  { left: "Imom Buxoriy", right: "Sahihi Buxoriy" },
];

export const SPEED_BANK: SpeedQ[] = [
  { q: "Amir Temur poytaxti qaysi shahar edi?", options: ["Buxoro", "Samarqand", "Xiva", "Toshkent"], answer: 1, level: 1 },
  { q: "«Algoritm» atamasi kimning nomidan kelib chiqqan?", options: ["Beruniy", "Al-Farg‘oniy", "Al-Xorazmiy", "Forobiy"], answer: 2, level: 1 },
  { q: "Ulug‘bek rasadxonasi qachon qurilgan?", options: ["1220", "1428", "1501", "1620"], answer: 1, level: 2 },
  { q: "«Xamsa» necha dostondan iborat?", options: ["3", "4", "5", "7"], answer: 2, level: 1 },
  { q: "Bobur qaysi davlatga asos solgan?", options: ["Saljuqiylar", "Boburiylar", "Shayboniylar", "Ashtarxoniylar"], answer: 1, level: 2 },
  { q: "Ibn Sino qaysi shahar yaqinida tug‘ilgan?", options: ["Urganch", "Buxoro (Afshona)", "Termiz", "Marv"], answer: 1, level: 2 },
  { q: "«Muallim as-soniy» (Ikkinchi muallim) laqabi kimga berilgan?", options: ["Forobiy", "Beruniy", "Ibn Sino", "Xorazmiy"], answer: 0, level: 3 },
  { q: "Registon ansambli qaysi shaharda?", options: ["Xiva", "Buxoro", "Samarqand", "Shahrisabz"], answer: 2, level: 1 },
  { q: "Imom Buxoriy to‘plagan hadis kitobi nomi?", options: ["Sahih", "Shohnoma", "Qobusnoma", "Devon"], answer: 0, level: 2 },
  { q: "Al-Farg‘oniy qaysi soha allomasi?", options: ["Tibbiyot", "Astronomiya", "Huquq", "She’riyat"], answer: 1, level: 2 },
  { q: "Xorazmshohlar davlati qaysi bosqin natijasida quladi?", options: ["Arab", "Mo‘g‘ul", "Salib", "Fors"], answer: 1, level: 3 },
  { q: "«Boburnoma» qaysi tilda yozilgan?", options: ["Fors", "Arab", "Eski o‘zbek (chig‘atoy)", "Sanskrit"], answer: 2, level: 2 },
  { q: "Yassaviy qaysi shaharda dafn etilgan?", options: ["Turkiston", "Buxoro", "Nasaf", "Termiz"], answer: 0, level: 3 },
  { q: "Zij-i Gurgoniy asari muallifi kim?", options: ["Ulug‘bek", "Qozizoda Rumiy", "Ali Qushchi", "Beruniy"], answer: 0, level: 2 },
  { q: "Samarqand qaysi yilda Temur poytaxtiga aylangan?", options: ["1336", "1370", "1405", "1447"], answer: 1, level: 3 },
  { q: "Navoiy qaysi shaharda tug‘ilgan?", options: ["Hirot", "Samarqand", "Balx", "Nishopur"], answer: 0, level: 2 },
  { q: "«Tib qonunlari» necha kitobdan iborat?", options: ["3", "5", "7", "10"], answer: 1, level: 3 },
  { q: "Beruniy qaysi hukmdor saroyida ishlagan?", options: ["Mahmud G‘aznaviy", "Amir Temur", "Bobur", "Ismoil Somoniy"], answer: 0, level: 3 },
];

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Small WebAudio blips for game feedback. */
export function blip(kind: "ok" | "bad" | "tick") {
  if (typeof window === "undefined") return;
  const Ctor = window.AudioContext || (window as any).webkitAudioContext;
  if (!Ctor) return;
  try {
    const ctx = new Ctor();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = kind === "bad" ? "sawtooth" : "sine";
    o.frequency.value = kind === "ok" ? 880 : kind === "bad" ? 180 : 500;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
    o.start();
    o.stop(ctx.currentTime + 0.24);
    setTimeout(() => ctx.close(), 400);
  } catch {
    /* ignore */
  }
}

export type Score = { name: string; score: number; at: number };
const LB_KEY = "ss_speed_leaderboard";

export function readLeaderboard(): Score[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LB_KEY) || "[]") as Score[];
  } catch {
    return [];
  }
}

export function saveScore(name: string, score: number) {
  const next = [...readLeaderboard(), { name, score, at: Date.now() }]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  localStorage.setItem(LB_KEY, JSON.stringify(next));
  return next;
}
