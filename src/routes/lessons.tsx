import { createFileRoute, Link } from "@tanstack/react-router";

import { LESSONS } from "@/lib/lessons";

export const Route = createFileRoute("/lessons")({
  head: () => ({
    meta: [
      { title: "Darslar va Mutolaa — Smart-Sayohat" },
      {
        name: "description",
        content:
          "Tarix darslari, chuqur tahliliy maqolalar va Tinglash & O‘qish rejimi. Smart-Sayohat: Ancients Speak.",
      },
      { property: "og:title", content: "Darslar va Mutolaa" },
      {
        property: "og:description",
        content: "Audio matn bilan tarixiy darslar — Mutolaa rejimi.",
      },
    ],
  }),
  component: LessonsIndex,
});

function LessonsIndex() {
  return (
    <div className="min-h-screen bg-background pb-20 pt-12 text-foreground aurora-bg">
      <div className="mx-auto max-w-5xl px-5">
        <Link
          to="/"
          className="glass inline-flex rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-white/10"
        >
          ← Bosh sahifa
        </Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-gold">
          Interactive Academy
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold sm:text-5xl">
          Darslar va Mutolaa
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Chuqur tahliliy darslar, asosiy sanalar va Tinglash & O‘qish rejimi —
          matn audio bilan birga real vaqt rejimida yoritiladi.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {LESSONS.map((l) => (
            <Link
              key={l.id}
              to="/lessons/$id"
              params={{ id: l.id }}
              className="glass group relative overflow-hidden rounded-2xl p-6 transition hover:-translate-y-1 hover:border-gold/40 hover:shadow-elegant"
            >
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gold/90">
                {l.category} · {l.duration}
              </p>
              <h2 className="mt-2 font-serif text-xl font-bold leading-tight text-foreground sm:text-2xl">
                {l.title}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">{l.era}</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                {l.subtitle}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-gold">
                Mutolaani boshlash →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}