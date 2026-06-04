import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { getLesson, type Lesson } from "@/lib/lessons";
import {
  createSpeechController,
  isTTSAvailable,
  type SpeechController,
} from "@/lib/speech";

export const Route = createFileRoute("/lessons/$id")({
  loader: ({ params }) => {
    const lesson = getLesson(params.id);
    if (!lesson) throw notFound();
    return { lesson: lesson as Lesson };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.lesson.title} — Mutolaa` },
          { name: "description", content: loaderData.lesson.subtitle },
          { property: "og:title", content: loaderData.lesson.title },
          { property: "og:description", content: loaderData.lesson.subtitle },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <p className="font-serif text-2xl">Dars topilmadi.</p>
      <Link to="/lessons" className="mt-3 inline-block text-sm text-primary underline">
        ← Darslar ro‘yxati
      </Link>
    </div>
  ),
  component: LessonPage,
});

function LessonPage() {
  const { lesson } = Route.useLoaderData() as { lesson: Lesson };
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [state, setState] = useState<"playing" | "paused" | "stopped" | "ended">(
    "stopped",
  );
  const ctrlRef = useRef<SpeechController | null>(null);
  const queueRef = useRef<number>(0);

  useEffect(() => () => ctrlRef.current?.stop(), []);

  function playFrom(startIdx: number) {
    ctrlRef.current?.stop();
    queueRef.current = startIdx;
    speakNext();
  }

  function speakNext() {
    const idx = queueRef.current;
    if (idx >= lesson.paragraphs.length) {
      setActiveIdx(null);
      setState("ended");
      return;
    }
    setActiveIdx(idx);
    const c = createSpeechController(lesson.paragraphs[idx], {
      onStateChange: setState,
      onEnd: () => {
        queueRef.current = idx + 1;
        speakNext();
      },
    });
    ctrlRef.current = c;
    c.play();
  }

  function pause() {
    ctrlRef.current?.pause();
  }
  function resume() {
    ctrlRef.current?.resume();
  }
  function stop() {
    ctrlRef.current?.stop();
    setActiveIdx(null);
    setState("stopped");
  }

  const ttsOn = isTTSAvailable();

  return (
    <div className="min-h-screen bg-background pb-24 pt-12 text-foreground">
      <div className="mx-auto max-w-3xl px-5">
        <Link
          to="/lessons"
          className="glass inline-flex rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-white/10"
        >
          ← Darslar
        </Link>

        <p className="mt-8 text-[11px] font-semibold uppercase tracking-widest text-gold">
          {lesson.category} · {lesson.duration} · {lesson.era}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold leading-tight sm:text-5xl">
          {lesson.title}
        </h1>
        <p className="mt-3 text-base text-muted-foreground">{lesson.subtitle}</p>

        {/* Key dates */}
        <div className="mt-8 glass rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            Asosiy sanalar
          </p>
          <ul className="mt-3 space-y-2">
            {lesson.keyDates.map((d) => (
              <li key={d.date} className="flex gap-3 text-sm">
                <span className="min-w-[88px] font-serif font-semibold text-gold">
                  {d.date}
                </span>
                <span className="text-foreground/90">{d.event}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Lesson content */}
        <article className="mt-10 space-y-4">
          {lesson.paragraphs.map((p, i) => {
            const isActive = activeIdx === i;
            const done = activeIdx !== null && i < activeIdx;
            return (
              <button
                key={i}
                onClick={() => ttsOn && playFrom(i)}
                className={
                  "block w-full rounded-2xl border p-4 text-left text-[15px] leading-relaxed transition " +
                  (isActive
                    ? "border-gold/60 bg-gold/10 text-foreground shadow-gold"
                    : done
                      ? "border-white/5 bg-white/[0.03] text-muted-foreground"
                      : "border-white/10 bg-white/[0.04] text-foreground hover:border-gold/30 hover:bg-white/[0.07]")
                }
              >
                <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] text-gold">
                  {done ? "✓" : i + 1}
                </span>
                {p}
              </button>
            );
          })}
        </article>
      </div>

      {/* Sticky audio player */}
      {ttsOn && (
        <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
          <div className="glass-strong flex items-center gap-2 rounded-full px-3 py-2 shadow-elegant">
            {state !== "playing" ? (
              <button
                onClick={() => (state === "paused" ? resume() : playFrom(0))}
                aria-label="O‘ynatish"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-gradient text-lg text-primary-foreground shadow-gold"
              >
                ▶
              </button>
            ) : (
              <button
                onClick={pause}
                aria-label="Pauza"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-lg text-foreground"
              >
                ❚❚
              </button>
            )}
            <button
              onClick={stop}
              aria-label="To‘xtatish"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs text-foreground hover:bg-white/15"
            >
              ■
            </button>
            <div className="flex items-end gap-[2px] px-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={
                    "w-[3px] rounded-sm bg-gold " +
                    (state === "playing" ? "wave-bar h-4" : "h-1.5 opacity-40")
                  }
                  style={{ animationDelay: `${i * 0.12}s` }}
                />
              ))}
            </div>
            <p className="pr-3 text-[11px] text-muted-foreground">
              {activeIdx !== null
                ? `Paragraf ${activeIdx + 1}/${lesson.paragraphs.length}`
                : "Tinglash & O‘qish"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}