# The Subreddit Vibe Check 🔥

> See what the internet is feeling right now.

A premium, dark-first analytics dashboard that measures the **mood** of any
subreddit. Enter a community name — `programming`, `r/technology`, `gaming`,
`AskReddit` — and the app fetches its 50 hottest posts, runs sentiment analysis
on the titles **entirely in the browser**, and distills everything into a single
**Vibe Score**, plus a full breakdown of positive / neutral / negative sentiment.

---

## 1. Project Overview

The Subreddit Vibe Check turns raw Reddit activity into an at-a-glance emotional
readout. It's built as a take-home assignment for a Full Stack Developer
Internship, demonstrating clean frontend architecture, real API integration,
client-side data processing, and production-quality UI polish.

The flow:

```
subreddit → 50 hot posts → extract titles → sentiment analysis
        → positive / neutral / negative → Vibe Score + dashboard
```

Only **post titles** are analyzed. No backend, no database, no auth, no tracking.

## 2. Features

- 🔎 **Search any subreddit** — accepts `programming`, `r/programming`, `/r/programming`.
- ✖️ **Clear button** — one click to reset the search input.
- 🕐 **Recent searches** — last 5 searches saved to `localStorage` for quick re-access.
- 📊 **Vibe Score** — a 0–100 gauge (red → orange → yellow → green) computed from the data.
- 📈 **Sentiment summary** — dynamic counts and percentages for positive / neutral / negative.
- 🍩 **Sentiment breakdown** — animated donut chart with legend and community mood label.
- 🧮 **Average sentiment** — normalized to a −1.0 … +1.0 scale with a distribution sparkline.
- 📉 **Engagement metrics** — average Reddit score and total comments across analyzed posts.
- 🟢 **Live data indicator** — status badge reflects actual connection state (green=live, yellow=connecting, red=offline, gray=ready).
- 🔥 **Top 50 hot posts** — responsive two-column card grid with rank, metadata,
  sentiment badge, sentiment score, upvotes, comments, post age, and external link.
- ⚡ **Caching** — 5-minute in-memory cache prevents duplicate requests for the same subreddit.
- 📱 **Fully responsive** — desktop sidebar, tablet tab bar, mobile hamburger drawer.
- ♿ **Accessible** — semantic HTML, keyboard focus states, `aria-label`s, visible focus rings, safe external links.
- 🧹 **Resilient** — loading skeletons, beautiful empty state, and friendly error handling
  with context-specific icons (invalid input, missing subreddit, rate limiting, network errors, empty results).

## 3. Tech Stack

| Layer      | Technology                                              |
| ---------- | ------------------------------------------------------- |
| Framework  | React 19 (function components + hooks)                  |
| Build tool | Vite 7                                                  |
| Language   | JavaScript (JSX)                                        |
| Styling    | Tailwind CSS 4                                          |
| Sentiment  | [`sentiment`](https://www.npmjs.com/package/sentiment) (AFINN-165) |
| Charts     | [Recharts](https://recharts.org)                        |
| Icons      | [Lucide React](https://lucide.dev)                      |
| Fonts      | Space Grotesk (headings) + Inter (body)                 |

## 4. Architecture

```
src/
├── components/
│   ├── Sidebar.jsx          # Desktop navigation rail
│   ├── Header.jsx           # Sticky top bar + mobile drawer + dynamic LIVE indicator
│   ├── Hero.jsx             # Headline + orbital visual
│   ├── SearchBar.jsx        # Subreddit input + suggestions + recent searches + clear
│   ├── VibeScore.jsx        # Semi-circular score gauge (SVG)
│   ├── StatsCards.jsx       # 6 stat cards (posts, pos/neu/neg, avg score, comments)
│   ├── SentimentChart.jsx   # Donut chart + community mood label (Recharts)
│   ├── AverageSentiment.jsx # Average score + distribution sparkline
│   ├── PostCard.jsx         # Single post card (memoized)
│   ├── PostGrid.jsx         # Two-column post grid
│   ├── LoadingState.jsx     # Skeleton placeholders
│   ├── EmptyState.jsx       # Pre-search state
│   ├── ErrorMessage.jsx     # Context-specific error icons + retry action
│   └── RedditLogo.jsx       # Reusable Snoo-inspired mark
├── services/
│   └── redditApi.js         # Reddit fetch + normalization + typed errors + 5min cache
├── utils/
│   ├── sentiment.js         # Sentiment analysis + aggregate stats + engagement metrics
│   └── format.js            # Number / time / sentiment formatting
├── App.jsx                  # State orchestration + layout
├── main.jsx                 # Entry point
└── index.css                # Tailwind theme tokens + animations + accessibility
```

**Data flow:** `App` owns the async state machine (`idle → loading → success/error`).
`services/redditApi.js` fetches, normalizes, and caches posts. `utils/sentiment.js`
enriches each post and computes aggregate statistics + engagement metrics. The
presentational components render purely from that data. Sentiment logic and network
logic are deliberately isolated from the UI.

## 5. Reddit API Integration

- **Endpoint:** `GET https://www.reddit.com/r/{subreddit}/hot.json?limit=50`
- **Access method:** Reddit's public JSON listing endpoint (CORS-enabled, no credentials).
- **Caching:** In-memory cache with 5-minute TTL per subreddit to reduce API load.

> **Why no OAuth?** Reddit's authenticated Data API uses OAuth 2.0
> *client-credentials*, which requires a **client secret**. A secret embedded in
> frontend code would be exposed to anyone who opens DevTools — a violation of the
> assignment requirement to *"never expose Reddit client secrets in frontend code."*
> For a pure client-side app, the unauthenticated JSON endpoint is the correct,
> credential-free access path.

> ⚠️ **2026 note:** Reddit has begun deprecating *unauthenticated* `.json` access
> and throttles it aggressively (occasionally returning `403`). This app handles
> those responses gracefully with a friendly message. For a production deployment,
> proxy the request through a serverless function that holds OAuth credentials
> server-side, then set `VITE_REDDIT_BASE_URL` to that proxy (see §8).

### Error Handling

| HTTP Status | Error Code   | User-Facing Message                                     |
| ----------- | ------------ | ------------------------------------------------------- |
| 401 / 403   | `forbidden`  | "Reddit blocked this request…"                          |
| 404         | `not_found`  | "r/{name} doesn't exist…"                               |
| 429         | `rate_limit` | "Reddit is rate-limiting us…"                           |
| 500+        | `server`     | "Reddit is having trouble right now…"                   |
| Network     | `network`    | "Couldn't reach Reddit…"                                |
| Timeout     | `timeout`    | "The request timed out…"                                |
| Empty       | `empty`      | "No posts found in r/{name}…"                           |
| Parse       | `parse`      | "Received an unexpected response…"                      |

**Normalization** (`redditApi.js`) maps raw listing children into clean objects:

```js
{ id, title, author, score, comments, permalink, createdAt, thumbnail, subreddit, nsfw }
```

Missing values are handled gracefully (`[deleted]` authors → `"deleted"`,
non-image thumbnails → `null`, stickied posts filtered out, empty titles dropped).

## 6. Sentiment Analysis Approach

Sentiment is computed **client-side** with the `sentiment` package, which scores
text against the **AFINN-165** word list (plus emoji ranking). Only `post.title`
is passed in — no external AI or API.

Classification (in `utils/sentiment.js`):

```js
score > 0   → Positive
score < 0   → Negative
score === 0 → Neutral
```

Derived metrics:

- **Vibe Score** = `round(((positive + 0.5 × neutral) / total) × 100)` → 0–100.
- **Average sentiment** = mean of per-title `comparative` scores, clamped to −1.0 … +1.0.
- **Percentages** = rounded share of each label.
- **Average Reddit score** = mean upvotes across analyzed posts.
- **Total comments** = sum of all comment counts across analyzed posts.

## 7. Installation

```bash
git clone <repo-url>
cd subreddit-vibe-check
npm install
```

## 8. Environment Variables

| Variable                 | Required | Default               | Purpose                          |
| ------------------------ | -------- | --------------------- | -------------------------------- |
| `VITE_REDDIT_BASE_URL`   | No       | `https://www.reddit.com` | Base URL for Reddit requests (point at a serverless proxy for production). |

Create a `.env` from `.env.example` if you need to override the base URL.
**Never** commit secrets — `.env` is git-ignored.

## 9. Local Development

```bash
npm run dev
```

Open the printed local URL. Verify:

- `npm install` ✅
- `npm run dev` ✅
- `npm run build` ✅

## 10. Deployment

The project is ready for **Vercel** out of the box:

1. Push the repository to GitHub/GitLab.
2. Import it in Vercel (framework preset: **Vite**).
3. Build command `npm run build`, output directory `dist`.
4. (Recommended) add a serverless proxy function for authenticated Reddit access
   and set `VITE_REDDIT_BASE_URL` in Vercel's project settings.

## 11. Known Reddit API Limitations

- **Rate limiting:** Unauthenticated `.json` endpoints are aggressively throttled. You may see `403` or `429` responses during heavy use.
- **Deprecation:** Reddit has been deprecating unauthenticated JSON access since 2026. The app handles these errors gracefully.
- **CORS:** The public `.json` endpoint supports CORS, but some corporate/school networks may block it.
- **Private subreddits:** Cannot be accessed without authentication; the app shows a "not found" error.
- **Recommended fix:** Use a serverless proxy (e.g. Vercel Edge Function or Cloudflare Worker) with Reddit OAuth credentials stored server-side.

## 12. Screenshots

Key views:

- **Empty state** — hero + search with the "Ready to check the vibe?" prompt.
- **Dashboard** — Vibe Score gauge, 6 sentiment/engagement stat cards, donut chart with community mood, average sentiment sparkline.
- **Posts** — two-column grid of ranked post cards with sentiment badges, scores, age.
- **Loading** — skeleton placeholders while data streams in.
- **Error** — context-specific error icons with friendly messages and retry.
- **Mobile** — hamburger drawer navigation, responsive card layouts.

*(Add `screenshot-*.png` captures of these states to `docs/` and reference them here.)*

## 13. Future Improvements

- Serverless proxy with Reddit OAuth to avoid unauthenticated rate limits.
- Search autocomplete for subreddit names.
- Time-series "vibe history" persisted to `localStorage` for multi-check comparisons.
- Analyze comments (not just titles) with a configurable toggle.
- Named-entity / emoji breakdown and word-level highlights on each card.
- Shareable "vibe card" image export.
- Light theme variant and a real theme toggle in the header.

---

Built with ❤️ for developers. Not affiliated with Reddit.
