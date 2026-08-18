/**
 * Reddit API service.
 *
 * Calls the Express backend at /api/reddit/:subreddit which proxies to Reddit
 * and runs sentiment analysis server-side.
 */

const REQUEST_TIMEOUT_MS = 20_000;

export class RedditApiError extends Error {
  constructor(message, code = "unknown") {
    super(message);
    this.name = "RedditApiError";
    this.code = code;
  }
}

/** Normalize a user-supplied subreddit name (accepts "r/x", "/r/x", "x"). */
export function normalizeSubredditName(input) {
  if (typeof input !== "string") return "";
  let name = input.trim();
  name = name.replace(/^\/?r\//i, "");
  name = name.replace(/^\/+/, "");
  name = name.replace(/\/+$/, "");
  name = name.replace(/[^A-Za-z0-9_]/g, "");
  return name;
}

/**
 * Fetch analyzed subreddit data from the backend.
 * Returns the full analysis result (posts + stats).
 */
export async function fetchSubredditData(subredditName) {
  const name = normalizeSubredditName(subredditName);

  if (!name) {
    throw new RedditApiError(
      "That doesn't look like a valid subreddit name. Try something like 'programming'.",
      "empty_input"
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`/api/reddit/${encodeURIComponent(name)}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
  } catch (err) {
    if (err && err.name === "AbortError") {
      throw new RedditApiError(
        "The request timed out. Try again.",
        "timeout"
      );
    }
    throw new RedditApiError(
      "Couldn't reach the server. Check your connection.",
      "network"
    );
  } finally {
    clearTimeout(timeout);
  }

  let body;
  try {
    body = await response.json();
  } catch {
    throw new RedditApiError(
      "Received an unexpected response from the server.",
      "parse"
    );
  }

  if (!response.ok || !body.ok) {
    throw new RedditApiError(
      body.message || "Something went wrong.",
      body.code || "unknown"
    );
  }

  return body;
}
