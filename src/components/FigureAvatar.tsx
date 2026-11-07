import type { Figure } from "@/lib/figures";
import { figureInitials } from "@/lib/education-rules";

export function FigureAvatar({ figure, className = "" }: {
  figure: Pick<Figure, "id" | "name" | "category">; className?: string;
}) {
  return <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice"
    className={`smart-badge badge-${figure.category} h-full w-full ${className}`}
    role="img" aria-label={figure.name}>
    <rect width="200" height="250" className="badge-base" />
    <g className="badge-pattern" fill="none" strokeWidth="1">
      <path d="M100 20 155 65 180 125 155 185 100 230 45 185 20 125 45 65Z" />
      <path d="M100 35 165 125 100 215 35 125Z M35 60H165V190H35Z" />
      <circle cx="100" cy="125" r="65" /><circle cx="100" cy="125" r="78" strokeDasharray="2 5" />
      <path d="M0 0 30 30 0 60M200 0 170 30 200 60M0 190 30 220 0 250M200 190 170 220 200 250" />
    </g>
    <circle cx="100" cy="125" r="52" className="badge-medallion" />
    <text x="100" y="140" textAnchor="middle" className="badge-initials" fontSize="42" fontWeight="700" fontFamily="Georgia,serif">{figureInitials(figure.name)}</text>
  </svg>;
}
