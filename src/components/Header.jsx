import RedditLogo from "./RedditLogo";

const STATUS_DOT = {
  idle: "bg-fg-muted",
  loading: "bg-warning",
  success: "bg-positive",
  error: "bg-negative",
};

const STATUS_LABEL = {
  idle: "Ready",
  loading: "Loading",
  success: "Live",
  error: "Error",
};

export default function Header({ status = "idle" }) {
  return (
    <header className="sticky top-0 z-30 border-b border-edge bg-base/90 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <RedditLogo className="h-6 w-6" />
          <span className="font-heading text-sm font-semibold text-fg">
            Vibe Check
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
          <span className="text-[11px] text-fg-muted">
            {STATUS_LABEL[status]}
          </span>
        </div>
      </div>
    </header>
  );
}
