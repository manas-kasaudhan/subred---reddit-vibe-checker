import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Clock, Loader2, Search, X } from "lucide-react";

const SUGGESTIONS = ["programming", "technology", "gaming", "AskReddit"];
const RECENT_KEY = "vibecheck_recent";
const MAX_RECENT = 5;

function loadRecent() {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function saveRecent(name, prev) {
  const next = [name, ...prev.filter((r) => r.toLowerCase() !== name.toLowerCase())].slice(0, MAX_RECENT);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch { /* quota */ }
  return next;
}

export default function SearchBar({ onSubmit, loading }) {
  const [value, setValue] = useState("");
  const [recent, setRecent] = useState(loadRecent);
  const inputRef = useRef(null);

  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const trimmed = value.trim();
      if (!trimmed || loading) return;
      setRecent((prev) => saveRecent(trimmed, prev));
      onSubmit(trimmed);
    },
    [value, loading, onSubmit]
  );

  const handleSuggestion = (s) => {
    setValue(s);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setValue("");
    inputRef.current?.focus();
  };

  const handleRecentClick = (name) => {
    setValue(name);
    setRecent((prev) => saveRecent(name, prev));
    onSubmit(name);
  };

  const clearRecent = () => {
    setRecent([]);
    try { localStorage.removeItem(RECENT_KEY); } catch { /* */ }
  };

  return (
    <section className="mx-auto max-w-5xl px-4" aria-label="Search a subreddit">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-lg border border-edge bg-surface px-3"
      >
        <Search className="h-4 w-4 shrink-0 text-fg-muted" aria-hidden="true" />
        <label htmlFor="subreddit-input" className="sr-only">Subreddit name</label>
        <input
          id="subreddit-input"
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search any subreddit..."
          autoComplete="off"
          spellCheck="false"
          disabled={loading}
          className="h-10 w-full bg-transparent text-sm text-fg placeholder:text-fg-muted focus:outline-none disabled:opacity-50"
        />
        {value && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-fg-muted hover:text-fg"
            aria-label="Clear"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="ml-1 inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-40"
        >
          {loading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
              <span>Analyzing</span>
            </>
          ) : (
            <>
              <span>Search</span>
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      <div className="mt-2 flex flex-wrap items-center gap-1 text-xs">
        <span className="text-fg-muted">Try:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleSuggestion(s)}
            className="rounded px-1.5 py-0.5 text-fg-secondary hover:text-primary"
          >
            {s}
          </button>
        ))}
      </div>

      {recent.length > 0 && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
          <Clock className="h-3 w-3 text-fg-muted" aria-hidden="true" />
          <span className="text-fg-muted">Recent:</span>
          {recent.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => handleRecentClick(name)}
              className="rounded border border-edge px-2 py-0.5 text-fg-secondary hover:text-primary"
            >
              r/{name}
            </button>
          ))}
          <button
            type="button"
            onClick={clearRecent}
            className="px-1 text-fg-muted hover:text-fg-secondary"
            aria-label="Clear recent searches"
          >
            Clear
          </button>
        </div>
      )}
    </section>
  );
}
