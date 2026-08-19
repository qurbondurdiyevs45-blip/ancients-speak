import { useEffect, useSyncExternalStore } from "react";

const KEY = "ss_pro_plan";

export type Plan = "free" | "plus" | "pro" | "school";

export const PLANS: Array<{
  id: Exclude<Plan, "free">;
  name: string;
  price: string;
  period: string;
  perks: string[];
  highlight?: boolean;
}> = [
  {
    id: "plus",
    name: "Plus",
    price: "29 000",
    period: "so‘m / oy",
    perks: [
      "Barcha PRO shaxslar bilan suhbat",
      "Cheksiz ovozli eshitish",
      "Tezkor kviz reytingi",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "59 000",
    period: "so‘m / oy",
    highlight: true,
    perks: [
      "Plus’dagi hamma narsa",
      "Al-Gid AI cheksiz",
      "Akademiya darslari to‘liq",
      "Sertifikat va statistika",
    ],
  },
  {
    id: "school",
    name: "Maktab / Institut",
    price: "499 000",
    period: "so‘m / oy",
    perks: [
      "30 tagacha o‘quvchi",
      "O‘qituvchilar paneli",
      "Sinf rejimi va topshiriqlar",
      "Guruh hisobotlari",
    ],
  },
];

const listeners = new Set<() => void>();
let cache: Plan = "free";

function read(): Plan {
  if (typeof window === "undefined") return "free";
  const v = localStorage.getItem(KEY);
  return v === "plus" || v === "pro" || v === "school" ? v : "free";
}

if (typeof window !== "undefined") cache = read();

function emit() {
  cache = read();
  listeners.forEach((l) => l());
}

export function activatePlan(p: Plan) {
  if (p === "free") localStorage.removeItem(KEY);
  else localStorage.setItem(KEY, p);
  emit();
}

export function usePlan(): Plan {
  const p = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => cache,
    () => "free" as Plan,
  );
  useEffect(emit, []);
  return p;
}

/** Deterministic premium marking: ~22% of figures are PRO-only. */
export function isPremiumFigure(id: string): boolean {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 100000;
  return h % 100 < 22;
}

/* --- global PRO modal channel --- */
const OPEN_EVT = "ss:open-pro";
export function openProModal() {
  window.dispatchEvent(new CustomEvent(OPEN_EVT));
}
export function onProModal(cb: () => void) {
  window.addEventListener(OPEN_EVT, cb);
  return () => window.removeEventListener(OPEN_EVT, cb);
}
