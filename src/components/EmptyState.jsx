import ThreeOrb from "./ThreeOrb";

export default function EmptyState() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-10 text-center">
      <ThreeOrb />
      <h2 className="font-heading mt-2 text-base font-semibold text-fg animate-in-up">
        Ready to check the vibe?
      </h2>
      <p className="mt-1.5 max-w-sm text-sm text-fg-muted animate-in-up" style={{ animationDelay: "0.1s" }}>
        Enter a subreddit above to analyze sentiment.
      </p>
    </div>
  );
}
