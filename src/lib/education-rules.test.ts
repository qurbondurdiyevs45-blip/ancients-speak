import { describe, expect, test } from "bun:test";
import { validName, figureInitials, QUIZ_POINTS, ROUND_SIZE, RAPID_SECONDS, matchesPeriod } from "./education-rules";

describe("visitor name", () => {
  test("2–40 letters accepted", () => { expect(validName("Al")).toBe(true); expect(validName("A".repeat(40))).toBe(true); expect(validName("G‘ayrat")).toBe(true); });
  test("outside length rejected", () => { expect(validName("A")).toBe(false); expect(validName("A".repeat(41))).toBe(false); });
  test("numbers emoji and links rejected", () => { for (const s of ["Ali7", "Ali😀", "https://ali.uz"]) expect(validName(s)).toBe(false); });
});
test("parentheses ignored in initials", () => { expect(figureInitials("Oybek (Muso Toshmuhammad)" )).toBe("O"); expect(figureInitials("Hamza Hakimzoda Niyoziy")).toBe("HN"); });
test("quiz scoring 10/20/30", () => { expect(QUIZ_POINTS).toEqual({ easy: 10, medium: 20, hard: 30 }); });
test("10 questions per round", () => expect(ROUND_SIZE).toBe(10));
test("rapid quiz lasts 30 seconds", () => expect(RAPID_SECONDS).toBe(30));
test("period filter uses life dates", () => { expect(matchesPeriod("1336–1405", "medieval")).toBe(true); expect(matchesPeriod("e.a. 384–322", "ancient")).toBe(true); expect(matchesPeriod("1815–1852", "modern")).toBe(true); expect(matchesPeriod("1336–1405", "modern")).toBe(false); });