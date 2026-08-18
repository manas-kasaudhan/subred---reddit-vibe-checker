import { useRef, useState, useCallback, lazy, Suspense } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import VibeScore from "./components/VibeScore";
import StatsCards from "./components/StatsCards";
import SentimentChart from "./components/SentimentChart";
import AverageSentiment from "./components/AverageSentiment";
import PostGrid from "./components/PostGrid";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";
import ErrorMessage from "./components/ErrorMessage";
import { fetchSubredditData, normalizeSubredditName, RedditApiError } from "./services/redditApi";

const ThreeBackground = lazy(() => import("./components/ThreeBackground"));

export default function App() {
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState(null);
  const [previousScore, setPreviousScore] = useState(null);
  const [loadingName, setLoadingName] = useState("");
  const [lastQuery, setLastQuery] = useState("");

  const loadingRef = useRef(false);

  const handleSearch = useCallback(async (rawInput) => {
    const name = normalizeSubredditName(rawInput);

    if (!name) {
      setError(
        new RedditApiError(
          "That doesn't look like a valid subreddit name. Try something like 'programming'.",
          "empty_input"
        )
      );
      setStatus("error");
      return;
    }

    if (loadingRef.current) return;
    loadingRef.current = true;

    setLastQuery(name);
    setLoadingName(name);
    setError(null);
    setStatus("loading");

    try {
      const data = await fetchSubredditData(name);
      setPreviousScore(result ? result.vibeScore : null);
      setResult(data);
      setStatus("success");
    } catch (err) {
      setError(
        err instanceof RedditApiError
          ? err
          : new RedditApiError("Something unexpected went wrong.", "unknown")
      );
      setStatus("error");
    } finally {
      loadingRef.current = false;
    }
  }, [result]);

  return (
    <div className="min-h-screen bg-base text-fg">
      {/* 3D background — lazy loaded, won't block initial render */}
      <Suspense fallback={null}>
        <ThreeBackground />
      </Suspense>

      <div className="relative z-10">
        <Header status={status} />

        <main className="pt-6 pb-8">
          <div className="mx-auto max-w-5xl px-4 pb-5">
            <h1 className="font-heading text-2xl font-bold text-fg sm:text-3xl animate-in-up">
              Subreddit Vibe Check
            </h1>
            <p className="mt-1 text-sm text-fg-muted animate-in-up" style={{ animationDelay: "0.05s" }}>
              Sentiment analysis on hot posts from any community.
            </p>
          </div>

          <div className="pb-4 animate-in-scale" style={{ animationDelay: "0.1s" }}>
            <SearchBar onSubmit={handleSearch} loading={status === "loading"} />
          </div>

          {status === "idle" && <EmptyState />}

          {status === "loading" && <LoadingState subreddit={loadingName} />}

          {status === "error" && error && (
            <ErrorMessage
              message={error.message}
              code={error.code}
              onRetry={() => handleSearch(lastQuery)}
            />
          )}

          {status === "success" && result && (
            <div className="mx-auto max-w-5xl px-4">
              <StatsCards data={result} subreddit={result.subreddit} />

              <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                <VibeScore score={result.vibeScore} previousScore={previousScore} />
                <SentimentChart data={result} />
                <AverageSentiment
                  averageSentiment={result.averageSentiment}
                  distribution={result.distribution}
                />
              </div>

              <div className="mt-8">
                <PostGrid posts={result.posts} />
              </div>
            </div>
          )}
        </main>

        <footer className="border-t border-edge">
          <div className="mx-auto max-w-5xl px-4 py-6">
            <p className="text-xs text-fg-muted">
              Built with React, Three.js, Vite &amp; sentiment · Not affiliated with Reddit
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
