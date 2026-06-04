import { type Figure } from "@/lib/figures";

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function initials(name: string) {
  return name
    .replace(/[‘’'ʻ]/g, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
}

/**
 * Premium glassmorphic SVG avatar — used when a figure has no portrait image.
 * Deterministic per-figure: unique aurora hue + concentric ornamental rings + monogram.
 */
export function FigureAvatar({
  figure,
  className = "",
}: {
  figure: Pick<Figure, "id" | "name" | "category">;
  className?: string;
}) {
  const h = hashString(figure.id);
  const hue1 = h % 360;
  const hue2 = (hue1 + 55) % 360;
  const gradId = `fa-g-${figure.id}`;
  const ringId = `fa-r-${figure.id}`;
  const star = (h % 3) + 6; // 6..8 ornamental rays
  return (
    <svg
      viewBox="0 0 200 250"
      preserveAspectRatio="xMidYMid slice"
      className={"h-full w-full " + className}
      aria-label={figure.name}
      role="img"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`oklch(0.35 0.14 ${hue1})`} />
          <stop offset="50%" stopColor={`oklch(0.22 0.10 ${(hue1 + hue2) / 2})`} />
          <stop offset="100%" stopColor={`oklch(0.18 0.08 ${hue2})`} />
        </linearGradient>
        <radialGradient id={ringId} cx="0.5" cy="0.45" r="0.7">
          <stop offset="0%" stopColor="oklch(0.82 0.15 80 / 0.55)" />
          <stop offset="60%" stopColor="oklch(0.82 0.15 80 / 0)" />
        </radialGradient>
      </defs>
      <rect width="200" height="250" fill={`url(#${gradId})`} />
      {/* aurora bloom */}
      <ellipse cx="100" cy="110" rx="140" ry="100" fill={`url(#${ringId})`} />
      {/* concentric ornamental rings */}
      <g
        fill="none"
        stroke="oklch(0.82 0.15 80 / 0.35)"
        strokeWidth="0.7"
      >
        <circle cx="100" cy="110" r="55" />
        <circle cx="100" cy="110" r="70" strokeDasharray="2 4" />
        <circle cx="100" cy="110" r="86" strokeDasharray="1 7" />
      </g>
      {/* ornamental star polygon */}
      <g transform="translate(100 110)" stroke="oklch(0.82 0.15 80 / 0.45)" fill="none">
        {Array.from({ length: star }).map((_, i) => {
          const a = (i * (Math.PI * 2)) / star;
          const x = Math.cos(a) * 92;
          const y = Math.sin(a) * 92;
          return <line key={i} x1="0" y1="0" x2={x} y2={y} strokeWidth="0.4" />;
        })}
      </g>
      {/* glass plate */}
      <rect
        x="20"
        y="32"
        width="160"
        height="160"
        rx="80"
        fill="oklch(1 0 0 / 0.06)"
        stroke="oklch(1 0 0 / 0.18)"
      />
      {/* monogram */}
      <text
        x="100"
        y="128"
        textAnchor="middle"
        fontFamily="ui-serif, Georgia, serif"
        fontWeight="700"
        fontSize="58"
        fill="oklch(0.95 0.04 80)"
        style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.45))" }}
      >
        {initials(figure.name)}
      </text>
      {/* bottom shimmer line */}
      <line
        x1="40"
        y1="208"
        x2="160"
        y2="208"
        stroke="oklch(0.82 0.15 80 / 0.55)"
        strokeWidth="0.8"
      />
    </svg>
  );
}