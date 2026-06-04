import { Link } from "@tanstack/react-router";

import { CATEGORY_LABELS, type Figure } from "@/lib/figures";
import { FigureAvatar } from "@/components/FigureAvatar";

export function FigureCard({ figure }: { figure: Figure }) {
  return (
    <Link
      to="/figures/$id"
      params={{ id: figure.id }}
      className="group glass relative flex flex-col overflow-hidden rounded-2xl transition-all hover:-translate-y-1 hover:shadow-elegant hover:border-gold/40 focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {figure.image ? (
          <img
            src={figure.image}
            alt={figure.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <FigureAvatar figure={figure} />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <span className="inline-block rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
            {CATEGORY_LABELS[figure.category]}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <h3 className="break-words font-serif text-[15px] font-semibold leading-tight text-foreground">
          {figure.name}
        </h3>
        <p className="text-[11px] text-gold/90">{figure.era}</p>
        <p className="line-clamp-2 text-xs text-muted-foreground">{figure.role}</p>
      </div>
    </Link>
  );
}