import { Link } from "@tanstack/react-router";

import { CATEGORY_LABELS, type Figure } from "@/lib/figures";
import { FigureImage } from "@/components/FigureImage";
import { motion, useReducedMotion } from "framer-motion";

export function FigureCard({ figure }: { figure: Figure }) {
  const reduced = useReducedMotion();
  return (
    <motion.div className="h-full" initial={reduced ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
    <Link
      to="/figures/$id"
      params={{ id: figure.id }}
      className="group glass figure-card relative flex h-full flex-col overflow-hidden rounded-lg transition-all hover:-translate-y-1 hover:shadow-elegant hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <FigureImage figure={figure} />
        <div className="absolute inset-x-0 bottom-0 bg-background/80 p-3 backdrop-blur">
          <span className="inline-block text-[10px] font-medium text-foreground">
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
    </motion.div>
  );
}