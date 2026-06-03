import { useEffect, useSyncExternalStore } from "react";

const NAME_KEY = "ss_user_name";
const POINTS_KEY = "ss_user_points";

type UserState = { name: string | null; points: number };

const listeners = new Set<() => void>();

function read(): UserState {
  if (typeof window === "undefined") return { name: null, points: 0 };
  return {
    name: localStorage.getItem(NAME_KEY),
    points: Number(localStorage.getItem(POINTS_KEY) || "0"),
  };
}

let cache: UserState = { name: null, points: 0 };

function emit() {
  cache = read();
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  cache = read();
  window.addEventListener("storage", emit);
}

export function setUserName(name: string) {
  localStorage.setItem(NAME_KEY, name);
  emit();
}

export function clearUser() {
  localStorage.removeItem(NAME_KEY);
  localStorage.removeItem(POINTS_KEY);
  emit();
}

export function addPoints(n: number) {
  const cur = Number(localStorage.getItem(POINTS_KEY) || "0");
  localStorage.setItem(POINTS_KEY, String(cur + n));
  emit();
}

export function useUser(): UserState {
  const state = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => cache,
    () => ({ name: null, points: 0 }),
  );
  // Re-read on mount in case ssr-cache is stale.
  useEffect(() => {
    cache = read();
    listeners.forEach((l) => l());
  }, []);
  return state;
}