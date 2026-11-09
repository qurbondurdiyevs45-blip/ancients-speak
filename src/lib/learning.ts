import quoteData from "./data/quotes.json";
import quizData from "./data/quiz.json";
import type { Lang } from "./i18n";
import { ROUND_SIZE, type Difficulty } from "./education-rules";

export type LocalQuestion = { prompt: string; options: string[]; explanation: string };
export type Question = { id: string; difficulty: string; figureId: string | null; correct: number; localized: Partial<Record<Lang, LocalQuestion>> & { uz: LocalQuestion } };
export const QUESTION_BANK: Question[] = quizData;
export const WISDOM_BANK: Array<{id:string; author:string; source:string; text: Partial<Record<Lang,string>> & {uz:string}}> = quoteData;
export function tashkentDay(now: Date): number { return Math.floor((now.getTime() + 5 * 3600000) / 86400000); }
export function dailyWisdom(now = new Date()) { return WISDOM_BANK[((tashkentDay(now) % WISDOM_BANK.length) + WISDOM_BANK.length) % WISDOM_BANK.length]; }
export function shuffled<T>(rows: readonly T[], random = Math.random): T[] {
  const result = [...rows];
  for (let i=result.length-1;i>0;i--) {const j=Math.floor(random()*(i+1)); [result[i],result[j]]=[result[j],result[i]];}
  return result;
}
export type RoundQuestion = { question: Question; optionOrder: number[] };
export function createRound(difficulty: Difficulty, random = Math.random): RoundQuestion[] {
  return shuffled(QUESTION_BANK.filter(q=>q.difficulty===difficulty),random).slice(0,ROUND_SIZE).map(question=>({question,optionOrder:shuffled([0,1,2,3],random)}));
}
export function answerPoints(correct: boolean): number {return correct ? 10 : 0;}
export function bestScore(previous: number, score: number): number {return Math.max(previous,score);}
export function localQuestion(question: Question, lang: Lang): LocalQuestion {return question.localized[lang] ?? question.localized.uz;}