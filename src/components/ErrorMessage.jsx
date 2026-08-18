import { AlertTriangle, Clock, RotateCcw, Search, WifiOff } from "lucide-react";

const ERROR_ICONS = {
  network: WifiOff,
  timeout: Clock,
  not_found: Search,
  empty: Search,
  rate_limit: Clock,
};

export default function ErrorMessage({ message, code, onRetry }) {
  const Icon = ERROR_ICONS[code] || AlertTriangle;

  return (
    <div
      className="mx-auto flex max-w-5xl flex-col items-center px-4 py-14 text-center"
      role="alert"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-edge bg-surface">
        <Icon className="h-5 w-5 text-negative" aria-hidden="true" />
      </div>
      <h2 className="font-heading mt-4 text-base font-semibold text-fg">
        Couldn&apos;t load that subreddit
      </h2>
      <p className="mt-1.5 max-w-md text-sm text-fg-muted">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-edge px-3 py-1.5 text-sm text-fg hover:bg-surface"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}
