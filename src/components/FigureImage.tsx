import { useState } from "react";

import { getPortrait } from "@/lib/portraits";
import { FigureAvatar } from "@/components/FigureAvatar";
import type { Figure } from "@/lib/figures";

/**
 * Figure portrait with graceful degradation:
 * bundled image → Wikimedia Commons portrait → ornamental avatar.
 * Shows a skeleton while loading; never renders a broken-image icon.
 */
export function FigureImage({
  figure,
  className = "",
}: {
  figure: Pick<Figure, "id" | "name" | "category" | "image">;
  className?: string;
}) {
  const src = figure.image ?? getPortrait(figure.id)?.src;
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || failed) {
    return <FigureAvatar figure={figure} className={className} />;
  }

  return (
    <div className={"relative h-full w-full overflow-hidden " + className}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-secondary" aria-hidden />
      )}
      <img
        src={src}
        alt={figure.name}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={
          "h-full w-full object-cover transition-all duration-700 group-hover:scale-105 " +
          (loaded ? "opacity-100" : "opacity-0")
        }
      />
    </div>
  );
}
