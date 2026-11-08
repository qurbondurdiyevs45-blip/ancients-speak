import { useEffect, useSyncExternalStore } from "react";
import uz from "./locales/uz.json";
import en from "./locales/en.json";
import ru from "./locales/ru.json";
import zh from "./locales/zh.json";
export type Lang = "uz" | "en" | "ru" | "zh";
export const LANGS: Array<{code: Lang; native: string; label: string; flag: string}> = [
  {code:"uz",native:"UZ",label:"O‘zbekcha",flag:"🇺🇿"},{code:"en",native:"EN",label:"English",flag:"🇬🇧"},{code:"ru",native:"RU",label:"Русский",flag:"🇷🇺"},{code:"zh",native:"中文",label:"简体中文",flag:"🇨🇳"},
];
export const LANG_NAME: Record<Lang,string> = {uz:"o‘zbek tilida (lotin)",en:"in English",ru:"на русском языке",zh:"用简体中文"};
export const VOICE_LOCALE: Record<Lang,string> = {uz:"uz-UZ",en:"en-US",ru:"ru-RU",zh:"zh-CN"};
const dictionaries: Record<Lang,Record<string,string>> = {uz,en,ru,zh};
const listeners = new Set<() => void>();
let cache: Lang = "uz";
let initialized = false;
export function detectLang(value: string): Lang { const code = value.toLowerCase().split(/[-_]/)[0]; return code === "en" || code === "ru" || code === "zh" ? code : "uz"; }
export function setLang(lang: Lang) { cache=lang; try {localStorage.setItem("ss_lang",lang);} catch {} document.documentElement.lang=lang; listeners.forEach(cb=>cb()); }
function init() { if(initialized)return; initialized=true; let saved: string|null=null; try {saved=localStorage.getItem("ss_lang");}catch {} setLang(saved && ["uz","en","ru","zh"].includes(saved) ? saved as Lang : detectLang(navigator.language)); window.addEventListener("storage",e=>{if(e.key==="ss_lang"&&e.newValue)setLang(detectLang(e.newValue));}); }
export function useLang(): Lang { const lang=useSyncExternalStore(cb=>{listeners.add(cb);return()=>{listeners.delete(cb);};},()=>cache,()=>"uz" as Lang); useEffect(init,[]); return lang; }
export function tr(key:string,lang:Lang,values:Record<string,string|number>={}) { let text=dictionaries[lang][key] ?? uz[key as keyof typeof uz] ?? ""; for(const [k,v] of Object.entries(values))text=text.replaceAll(`{${k}}`,String(v)); return text; }
export function useT(){const lang=useLang();return {lang,t:(key:string,values:Record<string,string|number>={})=>tr(key,lang,values)};}
