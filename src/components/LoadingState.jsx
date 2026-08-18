import { Loader2 } from "lucide-react";

function Bar({ className = "" }) {
  return <div className={`rounded bg-elevated ${className}`} />;
}

export default function LoadingState({ subreddit }) {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16">
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-edge bg-surface px-3 py-2.5">
        <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
        <span className="text-sm text-fg">
          Analyzing <span className="text-primary">r/{subreddit}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton rounded-lg border border-edge p-3">
            <Bar className="h-2 w-12" />
            <Bar className="mt-3 h-5 w-10" />
            <Bar className="mt-2 h-2 w-16" />
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton rounded-lg border border-edge p-5">
            <Bar className="h-2 w-16" />
            <Bar className="mx-auto mt-4 h-24 w-24 rounded-full" />
            <Bar className="mx-auto mt-3 h-2.5 w-20" />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Bar className="h-4 w-24" />
        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton rounded-lg border border-edge p-3">
              <Bar className="h-3 w-3/4" />
              <Bar className="mt-2 h-2.5 w-1/3" />
              <Bar className="mt-2 h-4 w-14 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
