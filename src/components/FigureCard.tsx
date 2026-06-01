import { Link } from "@tanstack/react-router";

import { CATEGORY_LABELS, type Figure } from "@/lib/figures";

function initials(name: string) {
  return name
    .replace(/[‘’']/g, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
}

export function FigureCard({ figure }: { figure: Figure }) {
  return (
    <Link
      to="/figures/$id"
      params={{ id: figure.id }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-elegant focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gold-gradient">
        {figure.image ? (
          <img
            src={figure.image}
            alt={figure.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-serif text-5xl font-bold text-primary-foreground/90 drop-shadow">
              {initials(figure.name)}
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <span className="inline-block rounded-full bg-card/90 px-2 py-0.5 text-[10px] font-medium text-foreground">
            {CATEGORY_LABELS[figure.category]}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-1 font-serif text-base font-semibold text-foreground">
          {figure.name}
        </h3>
        <p className="text-[11px] text-muted-foreground">{figure.era}</p>
        <p className="line-clamp-2 text-xs text-muted-foreground/90">{figure.role}</p>
      </div>
    </Link>
  );
}