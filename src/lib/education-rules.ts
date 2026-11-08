export const QUIZ_POINTS = { easy: 10, medium: 10, hard: 10 } as const;
export type Difficulty = keyof typeof QUIZ_POINTS;
export const ROUND_SIZE = 10;
export const RAPID_SECONDS = 30;

export function validName(input: string): boolean {
  const name = input.trim();
  return [...name].length >= 2 && [...name].length <= 40 &&
    /^\p{L}+(?:[‘’ʻʼ']\p{L}+)*(?:[ -]\p{L}+(?:[‘’ʻʼ']\p{L}+)*)*$/u.test(name);
}

export function figureInitials(name: string): string {
  const words = name.replace(/\([^)]*\)/g, " ").replace(/[‘’'ʻ]/g, "").split(/\s+/).filter(Boolean);
  if (!words.length) return "?";
  return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
}

export type Period = "all" | "ancient" | "medieval" | "early-modern" | "modern";
export function matchesPeriod(era: string, period: Period): boolean {
  if (period === "all") return true;
  const ancient = /e\.a\.|miloddan|avval/i.test(era);
  if (ancient) return period === "ancient";
  const year = Number(era.match(/\d{3,4}/)?.[0]);
  if (!year) return false;
  return period === "medieval" ? year < 1500 : period === "early-modern" ? year >= 1500 && year < 1800 : year >= 1800;
}