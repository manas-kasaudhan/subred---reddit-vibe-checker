import Sentiment from "sentiment";

/**
 * Sentiment analysis module.
 *
 * Uses the `sentiment` package (AFINN-165 word list + emoji ranking) to score
 * Reddit post titles entirely client-side. No external AI / API is used.
 */

const analyzer = new Sentiment();

export const POSITIVE = "positive";
export const NEUTRAL = "neutral";
export const NEGATIVE = "negative";

/**
 * Analyze a single string of text.
 * @param {string} text
 * @returns {{ score: number, comparative: number, label: 'positive'|'neutral'|'negative', words: string[] }}
 */
export function analyzeText(text) {
  const input = typeof text === "string" ? text : "";
  const result = analyzer.analyze(input);

  const { score = 0, comparative = 0 } = result || {};

  let label = NEUTRAL;
  if (score > 0) label = POSITIVE;
  else if (score < 0) label = NEGATIVE;

  return {
    score,
    comparative,
    label,
    words: (result && result.words) || [],
  };
}

/**
 * Clamp a number into the range [-1, 1].
 */
function clamp(value) {
  if (value == null || Number.isNaN(value)) return 0;
  return Math.max(-1, Math.min(1, value));
}

/**
 * Analyze an array of normalized posts (only their titles) and produce both the
 * enriched post objects and the aggregate dashboard statistics.
 *
 * @param {Array<{ title: string }>} posts
 * @returns {{
 *   posts: Array,
 *   total: number,
 *   positiveCount: number,
 *   neutralCount: number,
 *   negativeCount: number,
 *   positivePct: number,
 *   neutralPct: number,
 *   negativePct: number,
 *   vibeScore: number,
 *   averageSentiment: number,
 *   distribution: number[]
 * }}
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

  // Vibe Score: 0 (all negative) → 100 (all positive). Neutral weighs half.
  const vibeScore =
    total === 0
      ? 0
      : Math.round(((positiveCount + neutralCount * 0.5) / total) * 100);

  // Average comparative score, normalized to the [-1, 1] scale.
  const rawAverage =
    total === 0
      ? 0
      : analyzed.reduce((sum, p) => sum + (p.sentiment.comparative || 0), 0) / total;
  const averageSentiment = clamp(rawAverage);

  // Per-post comparative scores (clamped) for the distribution chart, sorted.
  const distribution = analyzed
    .map((p) => clamp(p.sentiment.comparative))
    .sort((a, b) => a - b);

  // Aggregate Reddit engagement metrics.
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

/**
 * Return a human-friendly label + tone color for a given vibe score (0-100).
 */
export function vibeLabel(score) {
  if (score >= 60) return { label: "Positive Vibes", tone: "positive" };
  if (score >= 40) return { label: "Mixed Vibes", tone: "neutral" };
  return { label: "Negative Vibes", tone: "negative" };
}
