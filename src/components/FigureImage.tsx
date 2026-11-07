import { useEffect, useState } from "react";

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
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  useEffect(() => {
    if (!src || src === loadedSrc) return;
    const timer = setTimeout(() => setFailedSrc(src), 8000);
    return () => clearTimeout(timer);
  }, [src, loadedSrc]);
  const loaded = loadedSrc === src;

  if (!src || failedSrc === src) {
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
        onLoad={() => setLoadedSrc(src)}
        onError={() => setFailedSrc(src)}
        className={
          "h-full w-full object-cover transition-all duration-700 group-hover:scale-105 " +
          (loaded ? "opacity-100" : "opacity-0")
        }
      />
    </div>
  );
}
