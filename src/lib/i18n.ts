import { useEffect, useSyncExternalStore } from "react";

export type Lang = "uz" | "en" | "ru";
export const LANGS: Array<{ code: Lang; label: string; flag: string; native: string }> = [
  { code: "uz", label: "O‘zbekcha", flag: "🇺🇿", native: "UZ" },
  { code: "en", label: "English", flag: "🇬🇧", native: "EN" },
  { code: "ru", label: "Русский", flag: "🇷🇺", native: "RU" },
];

const KEY = "ss_lang";
const listeners = new Set<() => void>();
let cache: Lang = "uz";

function read(): Lang {
  if (typeof window === "undefined") return "uz";
  const v = localStorage.getItem(KEY);
  return v === "en" || v === "ru" ? v : "uz";
}

if (typeof window !== "undefined") {
  cache = read();
  window.addEventListener("storage", () => {
    cache = read();
    listeners.forEach((l) => l());
  });
}

export function setLang(l: Lang) {
  localStorage.setItem(KEY, l);
  cache = l;
  listeners.forEach((x) => x());
}

export function useLang(): Lang {
  const l = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => cache,
    () => "uz" as Lang,
  );
  useEffect(() => {
    cache = read();
    listeners.forEach((x) => x());
  }, []);
  return l;
}

export const LANG_NAME: Record<Lang, string> = {
  uz: "o‘zbek tilida",
  en: "in English",
  ru: "на русском языке",
};

type Dict = Record<string, Record<Lang, string>>;

const DICT: Dict = {
  nav_home: { uz: "Bosh sahifa", en: "Home", ru: "Главная" },
  nav_quiz: { uz: "Kviz", en: "Quiz", ru: "Викторина" },
  nav_speed: { uz: "Tezkor kviz", en: "Speed Quiz", ru: "Блиц" },
  nav_lessons: { uz: "Darslar", en: "Lessons", ru: "Уроки" },
  nav_games: { uz: "O‘yinlar", en: "Games", ru: "Игры" },
  nav_teachers: { uz: "O‘qituvchilar", en: "Teachers", ru: "Учителям" },
  pro: { uz: "PRO", en: "PRO", ru: "PRO" },
  pro_title: { uz: "PRO Tariflar", en: "PRO Plans", ru: "PRO тарифы" },
  pro_sub: {
    uz: "Barcha 500+ shaxs, cheksiz suhbat va o‘qituvchi paneli.",
    en: "All 500+ figures, unlimited chat and the teacher hub.",
    ru: "Все 500+ личностей, безлимитный чат и панель учителя.",
  },
  locked: { uz: "PRO shaxs", en: "PRO figure", ru: "PRO персона" },
  unlock: { uz: "Ochish", en: "Unlock", ru: "Открыть" },
  facts: { uz: "Asosiy ishlari", en: "Key works", ru: "Главные труды" },
  quick_quiz: { uz: "Tezkor kviz", en: "Quick quiz", ru: "Мини-викторина" },
  search_ph: {
    uz: "Ism, kasb yoki davrni qidiring...",
    en: "Search name, role or era...",
    ru: "Поиск по имени, роли или эпохе...",
  },
};

export function tr(key: keyof typeof DICT | string, lang: Lang): string {
  const row = DICT[key];
  return row ? row[lang] : String(key);
}

export function useT() {
  const lang = useLang();
  return { lang, t: (k: string) => tr(k, lang) };
}
