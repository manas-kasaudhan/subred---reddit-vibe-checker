import Sentiment from "sentiment";

const analyzer = new Sentiment();

const POSITIVE = "positive";
const NEUTRAL = "neutral";
const NEGATIVE = "negative";

/** Analyze a single string and return score, comparative, and label. */
export function analyzeText(text) {
  const input = typeof text === "string" ? text : "";
  const result = analyzer.analyze(input);
  const { score = 0, comparative = 0 } = result || {};

  let label = NEUTRAL;
  if (score > 0) label = POSITIVE;
  else if (score < 0) label = NEGATIVE;

  return { score, comparative, label };
}

function clamp(value) {
  if (value == null || Number.isNaN(value)) return 0;
  return Math.max(-1, Math.min(1, value));
}

/**
 * Analyze an array of normalized posts and return enriched posts + aggregate stats.
 */
export function analyzePosts(posts) {
  const analyzed = posts.map((post) => ({
    ...post,
    sentiment: analyzeText(post.title),
  }));

  const total = analyzed.length;
  const positiveCount = analyzed.filter((p) => p.sentiment.label === POSITIVE).length;
  const negativeCount = analyzed.filter((p) => p.sentiment.label === NEGATIVE).length;
  const neutralCount = total - positiveCount - negativeCount;

  const pct = (count) => (total === 0 ? 0 : Math.round((count / total) * 100));
  const positivePct = pct(positiveCount);
  const negativePct = pct(negativeCount);
  const neutralPct = total === 0 ? 0 : 100 - positivePct - negativePct;

  const vibeScore =
    total === 0
      ? 0
      : Math.round(((positiveCount + neutralCount * 0.5) / total) * 100);

  const rawAverage =
    total === 0
      ? 0
      : analyzed.reduce((sum, p) => sum + (p.sentiment.comparative || 0), 0) / total;
  const averageSentiment = clamp(rawAverage);

  const distribution = analyzed
    .map((p) => clamp(p.sentiment.comparative))
    .sort((a, b) => a - b);

  const totalComments = analyzed.reduce((sum, p) => sum + (p.comments || 0), 0);
  const averageRedditScore =
    total === 0
      ? 0
      : Math.round(analyzed.reduce((sum, p) => sum + (p.score || 0), 0) / total);

  return {
    posts: analyzed,
    total,
    positiveCount,
    neutralCount,
    negativeCount,
    positivePct,
    neutralPct,
    negativePct,
    vibeScore,
    averageSentiment,
    distribution,
    totalComments,
    averageRedditScore,
  };
}
