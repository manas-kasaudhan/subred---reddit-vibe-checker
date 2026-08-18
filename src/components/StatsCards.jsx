import { ArrowUp, FileText, Frown, Meh, MessageCircle, Smile } from "lucide-react";
import { formatNumber } from "../utils/format";
import TiltCard from "./TiltCard";

export default function StatsCards({ data, subreddit }) {
  const cards = [
    { label: "Posts", value: String(data.total), sub: `r/${subreddit}`, icon: FileText, tone: "muted" },
    { label: "Positive", value: `${data.positivePct}%`, sub: `${data.positiveCount} posts`, icon: Smile, tone: "positive" },
    { label: "Neutral", value: `${data.neutralPct}%`, sub: `${data.neutralCount} posts`, icon: Meh, tone: "neutral" },
    { label: "Negative", value: `${data.negativePct}%`, sub: `${data.negativeCount} posts`, icon: Frown, tone: "negative" },
    { label: "Avg Score", value: formatNumber(data.averageRedditScore), sub: "Per post", icon: ArrowUp, tone: "muted" },
    { label: "Comments", value: formatNumber(data.totalComments), sub: "Total", icon: MessageCircle, tone: "muted" },
  ];

  const toneColor = {
    positive: "text-positive",
    neutral: "text-warning",
    negative: "text-negative",
    muted: "text-fg-muted",
  };

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
      {cards.map(({ label, value, sub, icon: Icon, tone }, i) => (
        <TiltCard key={label} intensity={6}>
          <div
            className="animate-in-up rounded-lg border border-edge bg-surface p-3"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-wider text-fg-muted">{label}</span>
              <Icon className={`h-3.5 w-3.5 ${toneColor[tone]}`} aria-hidden="true" />
            </div>
            <div className="mt-1.5">
              <span className="font-heading text-xl font-bold text-fg">{value}</span>
            </div>
            <p className="mt-0.5 truncate text-[11px] text-fg-muted">{sub}</p>
          </div>
        </TiltCard>
      ))}
    </div>
  );
}
