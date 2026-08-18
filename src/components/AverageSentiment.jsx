import { TrendingUp } from "lucide-react";
import { Area, AreaChart, ReferenceLine, ResponsiveContainer } from "recharts";
import { formatSentiment } from "../utils/format";
import TiltCard from "./TiltCard";

export default function AverageSentiment({ averageSentiment, distribution }) {
  const chartData = distribution.map((value, index) => ({ x: index, value }));

  const valueTone =
    averageSentiment > 0.05
      ? "text-positive"
      : averageSentiment < -0.05
        ? "text-negative"
        : "text-warning";

  return (
    <TiltCard intensity={5}>
      <div className="animate-rotate-in rounded-lg border border-edge bg-surface p-5" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-fg-muted">
            Avg Sentiment
          </span>
          <TrendingUp className="h-4 w-4 text-fg-muted" aria-hidden="true" />
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className={`font-heading text-2xl font-bold ${valueTone}`}>
            {formatSentiment(averageSentiment)}
          </span>
          <span className="text-[11px] text-fg-muted">/ 1.0</span>
        </div>

        <div className="mt-3 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="sentiment-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <ReferenceLine y={0} stroke="#27272a" strokeWidth={1} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={1.5}
                fill="url(#sentiment-fill)"
                isAnimationActive
                animationDuration={700}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </TiltCard>
  );
}
