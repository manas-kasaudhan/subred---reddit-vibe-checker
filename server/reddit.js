const REDDIT_BASE = "https://www.reddit.com";
const REQUEST_TIMEOUT_MS = 15_000;
const CACHE_TTL_MS = 5 * 60 * 1000;

const cache = new Map();

export class RedditApiError extends Error {
  constructor(message, code = "unknown", status = 500) {
    super(message);
    this.name = "RedditApiError";
    this.code = code;
    this.status = status;
  }
}

/** Normalize user-supplied subreddit name. */
export function normalizeSubredditName(input) {
  if (typeof input !== "string") return "";
  let name = input.trim();
  name = name.replace(/^\/?r\//i, "");
  name = name.replace(/^\/+/, "");
  name = name.replace(/\/+$/, "");
  name = name.replace(/[^A-Za-z0-9_]/g, "");
  return name;
}

function normalizeAuthor(author) {
  if (!author || author === "[deleted]") return "deleted";
  return author;
}

function normalizeThumbnail(thumbnail) {
  if (
    !thumbnail ||
    thumbnail === "self" ||
    thumbnail === "default" ||
    thumbnail === "nsfw" ||
    thumbnail === "spoiler" ||
    thumbnail === "image"
  ) {
    return null;
  }
  return thumbnail;
}

function normalizePost(raw) {
  return {
    id: raw.id || "",
    title: (raw.title || "").trim(),
    author: normalizeAuthor(raw.author),
    score: typeof raw.score === "number" ? raw.score : raw.ups || 0,
    comments: typeof raw.num_comments === "number" ? raw.num_comments : 0,
    permalink: raw.permalink ? `https://www.reddit.com${raw.permalink}` : "",
    createdAt: raw.created_utc || 0,
    thumbnail: normalizeThumbnail(raw.thumbnail),
    subreddit: raw.subreddit || "",
    nsfw: Boolean(raw.over_18),
  };
}

/**
 * Fetch up to 50 hot posts for a subreddit from Reddit.
 * Runs server-side with a proper User-Agent header.
 */
export async function fetchHotPosts(subredditName) {
  const name = normalizeSubredditName(subredditName);

  if (!name) {
    throw new RedditApiError(
      "Please enter a valid subreddit name.",
      "empty_input",
      400
    );
  }

  const cacheKey = name.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.posts;
  }

  const url = `${REDDIT_BASE}/r/${name}/hot.json?limit=50&raw_json=1`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "subreddit-vibe-check/1.0 (server-side proxy)",
      },
    });
  } catch (err) {
    if (err && err.name === "AbortError") {
      throw new RedditApiError("Request to Reddit timed out.", "timeout", 504);
    }
    throw new RedditApiError("Couldn't reach Reddit.", "network", 502);
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 404) {
    throw new RedditApiError(`r/${name} doesn't exist.`, "not_found", 404);
  }
  if (response.status === 403 || response.status === 401) {
    throw new RedditApiError("Reddit blocked this request.", "forbidden", 403);
  }
  if (response.status === 429) {
    throw new RedditApiError("Reddit is rate-limiting us.", "rate_limit", 429);
  }
  if (response.status >= 500) {
    throw new RedditApiError("Reddit is having trouble.", "server", 502);
  }
  if (!response.ok) {
    throw new RedditApiError("Something went wrong contacting Reddit.", "http", 500);
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new RedditApiError("Unexpected response from Reddit.", "parse", 502);
  }

  const children = payload?.data?.children;
  if (!Array.isArray(children)) {
    throw new RedditApiError("Unexpected response from Reddit.", "parse", 502);
  }

  const posts = children
    .map((child) => child && child.data)
    .filter((d) => d && !d.stickied && d.kind !== "t3_sticky")
    .map(normalizePost)
    .filter((p) => p.title);

  if (posts.length === 0) {
    throw new RedditApiError(
      `No posts found in r/${name}.`,
      "empty",
      404
    );
  }

  const result = posts.slice(0, 50);
  cache.set(cacheKey, { posts: result, ts: Date.now() });
  return result;
}
