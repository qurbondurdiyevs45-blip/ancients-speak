import { useEffect, useSyncExternalStore } from "react";
import { validName } from "./education-rules";

const NAME_KEY = "ss_user_name";
const POINTS_KEY = "ss_user_points";

type UserState = { name: string | null; points: number; streak: number };
const SERVER_STATE: UserState = { name: null, points: 0, streak: 0 };

const listeners = new Set<() => void>();

function read(): UserState {
  if (typeof window === "undefined") return SERVER_STATE;
  const name = localStorage.getItem(NAME_KEY);
  return {
    name: name && validName(name) ? name : null,
    points: Number(localStorage.getItem(POINTS_KEY) || "0"),
    streak: Number(localStorage.getItem("ss_streak") || "0"),
  };
}

let cache: UserState = SERVER_STATE;

function emit() {
  cache = read();
  listeners.forEach((l) => l());
}

export function setUserName(name: string) {
  if (!validName(name)) return;
  localStorage.setItem(NAME_KEY, name.trim());
  emit();
}

export function clearUser() {
  localStorage.removeItem(NAME_KEY);
  localStorage.removeItem(POINTS_KEY);
  localStorage.removeItem("ss_streak");
  emit();
}

export function addPoints(n: number) {
  const cur = Number(localStorage.getItem(POINTS_KEY) || "0");
  localStorage.setItem(POINTS_KEY, String(cur + n));
  emit();
}

export function recordAnswer(correct: boolean) {
  localStorage.setItem("ss_streak", String(correct ? read().streak + 1 : 0));
  emit();
}

export function useUser(): UserState {
  const state = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => cache,
    () => SERVER_STATE,
  );
  // Re-read on mount in case ssr-cache is stale.
  useEffect(() => {
    cache = read();
    listeners.forEach((l) => l());
    window.addEventListener("storage", emit);
    return () => window.removeEventListener("storage", emit);
  }, []);
  return state;
}