import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { FIGURES } from "@/lib/figures";
import { addPoints, useUser } from "@/lib/user";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Tarixiy Kviz — Smart-Sayohat: Ancients Speak" },
      {
        name: "description",
        content:
          "Amir Temur, Al-Xorazmiy, Navoiy va 200+ tarixiy shaxs haqida bilimingizni sinab ko‘ring. Ball to‘plang.",
      },
    ],
  }),
  component: QuizPage,
});

type Q = { prompt: string; correctId: string; options: string[] };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(n = 8): Q[] {
  const pool = FIGURES.filter((f) => f.role && f.bio);
  const picked = shuffle(pool).slice(0, n);
  return picked.map((target) => {
    const distractors = shuffle(pool.filter((f) => f.id !== target.id))
      .slice(0, 3)
      .map((f) => f.name);
    const opts = shuffle([target.name, ...distractors]);
    const prompt = `“${target.bio}” (${target.era}) — bu kim?`;
    return { prompt, correctId: target.name, options: opts };
  });
}

function QuizPage() {
  const { name, points } = useUser();
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => buildQuestions(8), [seed]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[idx];

  function pick(opt: string) {
    if (picked) return;
    setPicked(opt);
    if (opt === q.correctId) {
      setScore((s) => s + 1);
      addPoints(10);
    }
  }

  function next() {
    if (idx + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
  }

  function restart() {
    setSeed((s) => s + 1);
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  return (
    <div className="min-h-screen bg-background text-foreground aurora-bg">
      <header className="border-b border-white/10 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link to="/" className="glass rounded-lg px-2.5 py-1.5 text-xs font-medium">
            ← Bosh sahifa
          </Link>
          <p className="text-xs text-muted-foreground">
            Sizning ballaringiz: <span className="font-bold text-gold">★ {points}</span>
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold">
          ✦ Tarixiy Kviz
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
          Bilimingizni sinab ko‘ring, {name || "sayyoh"}!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Har bir to‘g‘ri javob uchun <strong className="text-gold">10 ball</strong> olasiz.
        </p>

        {!done ? (
          <div className="glass mt-8 rounded-3xl p-6 sm:p-8 shadow-elegant">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Savol {idx + 1} / {questions.length}
              </span>
              <span>Ball: <strong className="text-gold">{score}</strong></span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gold-gradient transition-all"
                style={{ width: `${((idx + (picked ? 1 : 0)) / questions.length) * 100}%` }}
              />
            </div>

            <h2 className="mt-6 font-serif text-xl leading-snug text-foreground sm:text-2xl">
              {q.prompt}
            </h2>

            <div className="mt-6 grid gap-3">
              {q.options.map((opt) => {
                const isCorrect = opt === q.correctId;
                const isPicked = picked === opt;
                let cls =
                  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-foreground transition hover:border-gold/40 hover:bg-white/10";
                if (picked) {
                  if (isCorrect)
                    cls =
                      "w-full rounded-xl border border-emerald-400/60 bg-emerald-400/10 px-4 py-3 text-left text-sm text-emerald-200";
                  else if (isPicked)
                    cls =
                      "w-full rounded-xl border border-destructive/60 bg-destructive/10 px-4 py-3 text-left text-sm text-destructive";
                  else
                    cls =
                      "w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-left text-sm text-muted-foreground opacity-60";
                }
                return (
                  <button key={opt} onClick={() => pick(opt)} className={cls}>
                    {opt}
                  </button>
                );
              })}
            </div>

            {picked && (
              <button
                onClick={next}
                className="mt-6 w-full rounded-xl bg-gold-gradient px-5 py-3 text-sm font-semibold text-primary-foreground shadow-gold transition hover:brightness-110"
              >
                {idx + 1 >= questions.length ? "Yakuniy natija" : "Keyingi savol →"}
              </button>
            )}
          </div>
        ) : (
          <div className="glass mt-8 rounded-3xl p-8 text-center shadow-elegant">
            <p className="text-xs uppercase tracking-widest text-gold">Natija</p>
            <h2 className="mt-2 font-serif text-3xl font-bold">
              {score} / {questions.length} to‘g‘ri
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Siz <strong className="text-gold">+{score * 10}</strong> ball topdingiz.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={restart}
                className="rounded-xl bg-gold-gradient px-5 py-3 text-sm font-semibold text-primary-foreground shadow-gold transition hover:brightness-110"
              >
                Yana o‘ynash
              </button>
              <Link
                to="/"
                className="glass rounded-xl px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-white/10"
              >
                Bosh sahifaga
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}