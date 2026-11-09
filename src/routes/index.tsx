import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { FigureCard } from "@/components/FigureCard";
import { QuoteOfTheDay } from "@/components/QuoteOfTheDay";
import heroImg from "@/assets/registan-hero.jpg";
import {
  CATEGORY_LABELS,
  FEATURED,
  FIGURES,
  type FigureCategory,
} from "@/lib/figures";
import { useT } from "@/lib/i18n";
import { localizedFigure } from "@/lib/figure-localization";
import { useUser } from "@/lib/user";
import { Button } from "@/components/ui/button";
import { matchesPeriod, type Period } from "@/lib/education-rules";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart-Sayohat: Ancients Speak — Tarixiy shaxslar bilan AI suhbat" },
      {
        name: "description",
        content: `Amir Temur, Al-Xorazmiy, Alisher Navoiy va yana ${FIGURES.length} tarixiy shaxs bilan ularning tilida jonli AI suhbat, ovozli eshitish va mikrofonli muloqot.`,
      },
      { property: "og:title", content: "Smart-Sayohat: Ancients Speak — Virtual Gid" },
      {
        property: "og:description",
        content: `${FIGURES.length} tarixiy shaxs bilan davri ruhida AI suhbat quring.`,
      },
      { property: "og:url", content: "https://ancients-speak.lovable.app/" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://ancients-speak.lovable.app/" }],
  }),
  component: Index,
});

const ALL = "all" as const;
type Filter = typeof ALL | FigureCategory;

function Index() {
  const { name } = useUser();
  const {lang,t}=useT();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>(ALL);
  const [visible, setVisible] = useState(40);
  const [period, setPeriod] = useState<Period>("all");
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, 100]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return FIGURES.filter((f) => {
      if (filter !== ALL && !f.categories?.includes(filter)) return false;
      if (!matchesPeriod(f.era, period)) return false;
      if (!needle) return true;
      return (
        f.name.toLowerCase().includes(needle) ||
        localizedFigure(f,lang).role.toLowerCase().includes(needle) ||
        localizedFigure(f,lang).bio.toLowerCase().includes(needle) || f.era.toLowerCase().includes(needle)
      );
    });
  }, [q, filter, period, lang]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisible(40);
  }, [q, filter, period]);

  const shown = filtered.slice(0, visible);

  const categories = Object.entries(CATEGORY_LABELS) as Array<
    [FigureCategory, string]
  >;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="relative isolate overflow-hidden aurora-bg">
        <motion.img
          src={heroImg}
          alt="Registon maydoni, Samarqand"
          width={1920}
          height={1080}
          style={reduced ? undefined : { y: heroY }}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="mx-auto max-w-6xl px-5 pb-10 pt-20 sm:pb-14 sm:pt-24 animate-fade-up">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            Smart-Sayohat · Ancients Speak
          </span>
          <p className="mt-5 text-gold">{t("hello",{name:name || t("traveler")})}</p>
          <h1 className="mt-2 max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-6xl">Smart-Sayohat: Ancients Speak</h1>
          <p className="mt-4 max-w-2xl font-serif text-xl">{t("hero_title")}</p>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">{t("hero_sub",{count:FIGURES.length})}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#figures"
              className="rounded-xl bg-gold-gradient px-5 py-3 text-sm font-semibold text-primary-foreground shadow-gold transition hover:brightness-110"
            >
              {t("choose")} →
            </a>
            <Link
              to="/quiz"
              className="glass rounded-xl px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
            >
              ✦ {t("quiz")}
            </Link>
            <a
              href="#how"
              className="rounded-xl border border-border px-5 py-3 text-sm font-medium text-muted-foreground transition hover:bg-secondary/50 hover:text-foreground"
            >
              {t("how")}
            </a>
          </div>

          <div className="mt-12 max-w-3xl">
            <QuoteOfTheDay />
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">
              {t("featured")}
            </p>
            <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
              {t("featured")}
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
        <div className="border-t border-border pt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                {t("catalog",{count:FIGURES.length})}
              </p>
              <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
                {t("all_figures")}
              </h2>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
            <select aria-label={t("period")} value={period} onChange={(e) => setPeriod(e.target.value as Period)} className="rounded-lg border border-border bg-secondary px-3 text-sm">
              <option value="all">{t("period_all")}</option><option value="ancient">{t("period_ancient")}</option><option value="medieval">{t("period_medieval")}</option><option value="early-modern">{t("period_early-modern")}</option><option value="modern">{t("period_modern")}</option>
            </select>
            <input aria-label={t("search")}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("search")}
              className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-primary transition focus:ring-2 sm:w-72"
            />
            </div>
          </div>

          <div className="-mx-1 mt-5 flex flex-wrap gap-2.5">
            <Chip active={filter === ALL} onClick={() => setFilter(ALL)}>
              {t("all")}
            </Chip>
            {categories.map(([key]) => (
              <Chip
                key={key}
                active={filter === key}
                onClick={() => setFilter(key)}
              >
                {t(`cat_${key}`)}
              </Chip>
            ))}
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            {t("found",{count:filtered.length,shown:shown.length})}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {shown.map((f) => (
              <FigureCard key={f.id} figure={f} />
            ))}
          </div>

          {visible < filtered.length && (
            <div className="mt-8 flex justify-center">
              <Button variant="outline"
                onClick={() => setVisible((v) => v + 40)}
                className="glass rounded-xl px-6 py-3 text-sm font-semibold text-foreground transition hover:border-gold/40 hover:bg-secondary"
              >
                {t("more")} · {Math.min(40, filtered.length - visible)}
              </Button>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              {t("empty")}
            </div>
          )}
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="relative pattern-tile">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 py-16 sm:grid-cols-3">
          {[
            ["1",t("how_1"),t("how_1_sub",{count:FIGURES.length})],
            ["2",t("how_2"),t("how_2_sub")],
            ["3",t("how_3"),t("how_3_sub")],
          ].map(([n, title, text]) => (
            <div key={n} className="p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold-gradient font-serif font-bold text-primary-foreground shadow-gold">
                {n}
              </span>
              <h3 className="mt-4 font-serif text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border bg-background py-8 text-center text-xs text-muted-foreground">
        Smart-Sayohat: Ancients Speak · {t("footer")}
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
    <Button variant="outline"
      onClick={onClick}
      className={
        "rounded-full px-3.5 py-1.5 text-xs font-medium transition " +
        (active
          ? "bg-gold-gradient text-primary-foreground shadow-gold"
          : "border border-border bg-secondary/50 text-foreground hover:bg-secondary")
      }
    >
      {children}
    </Button>
  );
}
