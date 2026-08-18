import { Gauge } from "lucide-react";
import { vibeLabel } from "../utils/sentiment";
import TiltCard from "./TiltCard";

const RADIUS = 85;
const ARC_LENGTH = Math.PI * RADIUS;
const ARC_PATH = "M 15 100 A 85 85 0 0 1 185 100";

const TONE_CLASS = {
  positive: "text-positive",
  neutral: "text-warning",
  negative: "text-negative",
};

export default function VibeScore({ score, previousScore }) {
  const { label, tone } = vibeLabel(score);
  const dash = (Math.max(0, Math.min(100, score)) / 100) * ARC_LENGTH;
  const hasDelta = typeof previousScore === "number";
  const delta = hasDelta ? score - previousScore : 0;
  const deltaArrow = delta > 0 ? "↑" : delta < 0 ? "↓" : "→";
  const deltaColor = delta > 0 ? "text-positive" : delta < 0 ? "text-negative" : "text-fg-muted";

  return (
    <TiltCard intensity={5}>
      <div className="animate-rotate-in rounded-lg border border-edge bg-surface p-5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-fg-muted">
            Vibe Score
          </span>
          <Gauge className="h-4 w-4 text-fg-muted" aria-hidden="true" />
        </div>

        <div className="relative mx-auto mt-2 max-w-[220px]">
          <svg viewBox="0 0 200 120" className="w-full" role="img" aria-label={`Vibe score ${score} out of 100`}>
            <defs>
              <linearGradient id="vibe-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="35%" stopColor="#f97316" />
                <stop offset="65%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
            <path d={ARC_PATH} fill="none" stroke="#27272a" strokeWidth={12} strokeLinecap="round" />
            {score > 0 && (
              <path
                d={ARC_PATH}
                fill="none"
                stroke="url(#vibe-gradient)"
                strokeWidth={12}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${ARC_LENGTH}`}
                style={{ transition: "stroke-dasharray 0.8s ease-out" }}
              />
            )}
            <text x="8" y="118" fill="#52525b" fontSize="9" fontFamily="'Inter', sans-serif">0</text>
            <text x="188" y="118" fill="#52525b" fontSize="9" textAnchor="end" fontFamily="'Inter', sans-serif">100</text>
            <text
              x="100" y="72" textAnchor="middle"
              fill="#e4e4e7" fontSize="44" fontWeight="700"
              fontFamily="'Space Grotesk', sans-serif"
            >
              {score}
            </text>
          </svg>
        </div>

        <div className="-mt-1 text-center">
          <p className={`font-heading text-sm font-semibold ${TONE_CLASS[tone] || ""}`}>{label}</p>
          <p className="text-[11px] text-fg-muted">Out of 100</p>
        </div>

        {hasDelta && (
          <div className="mt-2 flex justify-center">
            <span className={`inline-flex items-center gap-1 rounded border border-edge px-2 py-0.5 text-[11px] ${deltaColor}`}>
              <span aria-hidden="true">{deltaArrow}</span>
              {Math.abs(delta).toFixed(1)}
              <span className="text-fg-muted">vs last</span>
            </span>
          </div>
        )}
      </div>
    </TiltCard>
  );
}
