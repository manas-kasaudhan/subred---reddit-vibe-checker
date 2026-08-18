/**
 * Small formatting helpers used across the dashboard.
 */

/** Format a raw integer as a compact human-friendly string (e.g. 2100 → "2.1k"). */
export function formatNumber(value) {
  const n = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(n)) return "0";

  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

/** Format a sentiment comparative value with an explicit sign (e.g. +0.68). */
export function formatSentiment(value) {
  const n = typeof value === "number" && !Number.isNaN(value) ? value : 0;
  if (n > 0) return `+${n.toFixed(2)}`;
  if (n < 0) return n.toFixed(2);
  return "0.00";
}

/** Convert a unix timestamp (seconds) into a compact relative time string. */
export function timeAgo(unixSeconds) {
  if (!unixSeconds) return "";
  const seconds = Math.max(0, Math.floor(Date.now() / 1000) - unixSeconds);

  const MIN = 60;
  const HOUR = 60 * MIN;
  const DAY = 24 * HOUR;
  const MONTH = 30 * DAY;
  const YEAR = 365 * DAY;

  if (seconds < MIN) return "just now";
  if (seconds < HOUR) return `${Math.floor(seconds / MIN)}m ago`;
  if (seconds < DAY) return `${Math.floor(seconds / HOUR)}h ago`;
  if (seconds < MONTH) return `${Math.floor(seconds / DAY)}d ago`;
  if (seconds < YEAR) return `${Math.floor(seconds / MONTH)}mo ago`;
  return `${Math.floor(seconds / YEAR)}y ago`;
}
