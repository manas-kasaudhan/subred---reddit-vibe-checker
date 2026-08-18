import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { vibeLabel } from "../utils/sentiment";
import TiltCard from "./TiltCard";

const COLORS = {
  Positive: "#22c55e",
  Neutral: "#eab308",
  Negative: "#ef4444",
};

export default function SentimentChart({ data }) {
  const chartData = [
    { name: "Positive", value: data.positiveCount, color: COLORS.Positive },
    { name: "Neutral", value: data.neutralCount, color: COLORS.Neutral },
    { name: "Negative", value: data.negativeCount, color: COLORS.Negative },
  ];

  const legend = [
    { name: "Positive", pct: data.positivePct, count: data.positiveCount, color: COLORS.Positive },
    { name: "Neutral", pct: data.neutralPct, count: data.neutralCount, color: COLORS.Neutral },
    { name: "Negative", pct: data.negativePct, count: data.negativeCount, color: COLORS.Negative },
  ];

  const { tone: moodTone } = vibeLabel(data.vibeScore);
  const dominantName =
    data.positivePct >= data.neutralPct && data.positivePct >= data.negativePct
      ? "Positive"
      : data.negativePct >= data.positivePct && data.negativePct >= data.neutralPct
        ? "Negative"
        : "Neutral";

  const moodClass = {
    positive: "text-positive",
    neutral: "text-warning",
    negative: "text-negative",
  };

  return (
    <TiltCard intensity={5}>
      <div className="animate-rotate-in rounded-lg border border-edge bg-surface p-5" style={{ animationDelay: "0.1s" }}>
        <h3 className="text-[11px] font-medium uppercase tracking-wider text-fg-muted">
          Sentiment Breakdown
        </h3>

        <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
          <div className="relative h-40 w-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={68}
                  paddingAngle={2}
                  stroke="none"
                  isAnimationActive
                  animationDuration={700}
                  startAngle={90}
                  endAngle={-270}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-heading text-xs font-semibold ${moodClass[moodTone]}`}>
                {dominantName}
              </span>
            </div>
          </div>

          <div className="w-full max-w-[180px]">
            <ul className="space-y-2.5">
              {legend.map(({ name, pct, count, color }) => (
                <li key={name}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-fg-secondary">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                      {name}
                    </span>
                    <span className="font-heading font-semibold text-fg">{pct}%</span>
                  </div>
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-elevated">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className="text-[10px] text-fg-muted">{count} posts</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}
