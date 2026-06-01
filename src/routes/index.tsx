import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { FigureCard } from "@/components/FigureCard";
import heroImg from "@/assets/registan-hero.jpg";
import {
  CATEGORY_LABELS,
  FEATURED,
  FIGURES,
  type FigureCategory,
} from "@/lib/figures";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart-Sayohat — Tarixiy shaxslar bilan AI suhbat" },
      {
        name: "description",
        content:
          "Amir Temur, Al-Xorazmiy, Navoiy va 200+ tarixiy shaxs bilan ularning tilidan jonli AI suhbat. Sardorbek tomonidan.",
      },
      { property: "og:title", content: "Smart-Sayohat — Virtual Gid" },
      {
        property: "og:description",
        content: "200+ tarixiy shaxs bilan ularning ovozida suhbatlashing.",
      },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Index,
});

const ALL = "all" as const;
type Filter = typeof ALL | FigureCategory;

function Index() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>(ALL);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return FIGURES.filter((f) => {
      if (filter !== ALL && f.category !== filter) return false;
      if (!needle) return true;
      return (
        f.name.toLowerCase().includes(needle) ||
        f.role.toLowerCase().includes(needle) ||
        f.bio.toLowerCase().includes(needle)
      );
    });
  }, [q, filter]);

  const categories = Object.entries(CATEGORY_LABELS) as Array<
    [FigureCategory, string]
  >;

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImg}
          alt="Registon maydoni, Samarqand"
          width={1920}
          height={1080}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 -z-10 bg-hero-gradient opacity-80" />
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Smart-Sayohat · Virtual Gid
          </span>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold leading-tight text-white sm:text-6xl">
            Salom, <span className="text-gold">Sardorbek</span>.<br />
            Tarixiy shaxslar bilan suhbatlashing.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-white/85 sm:text-lg">
            Amir Temur, Al-Xorazmiy, Mirzo Ulug‘bek va boshqa <strong>200+</strong>{" "}
            tarixiy siymo bilan ularning o‘z tilida, o‘z davri va xarakteridan
            kelib chiqib jonli suhbat quring.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#figures"
              className="rounded-xl bg-gold-gradient px-5 py-3 text-sm font-semibold text-foreground shadow-gold transition hover:brightness-105"
            >
              Shaxs tanlash →
            </a>
            <a
              href="#how"
              className="rounded-xl border border-white/30 bg-white/5 px-5 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
            >
              Qanday ishlaydi
            </a>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Tavsiya etilgan
            </p>
            <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
              Sohibqironlar bilan boshlang
            </h2>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((f) => (
            <FigureCard key={f.id} figure={f} />
          ))}
        </div>
      </section>

      {/* DIRECTORY */}
      <section id="figures" className="mx-auto max-w-6xl px-5 pb-20">
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Katalog · {FIGURES.length}+ shaxs
              </p>
              <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
                Barcha tarixiy siymolar
              </h2>
            </div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ism, kasb yoki davrni qidiring..."
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none ring-ring transition focus:ring-2 sm:w-72"
            />
          </div>

          <div className="-mx-1 mt-5 flex flex-wrap gap-2">
            <Chip active={filter === ALL} onClick={() => setFilter(ALL)}>
              Hammasi
            </Chip>
            {categories.map(([key, label]) => (
              <Chip
                key={key}
                active={filter === key}
                onClick={() => setFilter(key)}
              >
                {label}
              </Chip>
            ))}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            {filtered.length} ta shaxs topildi
          </p>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((f) => (
              <FigureCard key={f.id} figure={f} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Hech narsa topilmadi. Boshqa kalit so‘z bilan urinib ko‘ring.
            </div>
          )}
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="bg-secondary/60 pattern-tile">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:grid-cols-3">
          {[
            ["1", "Shaxsni tanlang", "200+ siymo orasidan qiziqqaningizni toping."],
            ["2", "Suhbatni boshlang", "AI o‘sha shaxs tilidan, o‘z davri va xarakterida javob beradi."],
            ["3", "Tarixni his eting", "Hikoyalar, maslahatlar va savollar — barchasi jonli."],
          ].map(([n, title, text]) => (
            <div key={n} className="rounded-2xl border border-border bg-card p-6">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold-gradient font-serif font-bold text-foreground">
                {n}
              </span>
              <h3 className="mt-4 font-serif text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border bg-background py-8 text-center text-xs text-muted-foreground">
        Sardorbekning Smart-Sayohat loyihasi · O‘zbekiston merosi × AI
      </footer>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full border px-3 py-1.5 text-xs font-medium transition " +
        (active
          ? "border-transparent bg-primary text-primary-foreground shadow"
          : "border-border bg-background text-foreground hover:bg-secondary")
      }
    >
      {children}
    </button>
  );
}
