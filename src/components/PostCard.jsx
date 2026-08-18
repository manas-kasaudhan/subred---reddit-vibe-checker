import { memo } from "react";
import { ArrowUp, Clock, ExternalLink, MessageCircle } from "lucide-react";
import { formatNumber, formatSentiment, timeAgo } from "../utils/format";
import TiltCard from "./TiltCard";

const TONE = {
  positive: {
    border: "border-l-positive",
    badge: "bg-positive/10 text-positive",
    label: "Positive",
  },
  neutral: {
    border: "border-l-warning",
    badge: "bg-warning/10 text-warning",
    label: "Neutral",
  },
  negative: {
    border: "border-l-negative",
    badge: "bg-negative/10 text-negative",
    label: "Negative",
  },
};

const PostCard = memo(function PostCard({ post, index }) {
  const tone = TONE[post.sentiment.label] || TONE.neutral;
  const age = timeAgo(post.createdAt);

  return (
    <TiltCard intensity={4}>
      <article
        className={`animate-flip-in rounded-lg border border-edge bg-surface p-3 border-l-2 ${tone.border}`}
        style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
      >
        <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-fg">
          {post.title}
        </h3>

        <p className="mt-1.5 truncate text-[11px] text-fg-muted">
          r/{post.subreddit} · u/{post.author}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${tone.badge}`}>
            {tone.label}
          </span>
          <span className="font-mono text-[10px] text-fg-secondary">
            {formatSentiment(post.sentiment.comparative)}
          </span>

          <span className="ml-auto flex items-center gap-2 text-[10px] text-fg-muted">
            <span className="flex items-center gap-0.5" title={`${post.score} upvotes`}>
              <ArrowUp className="h-3 w-3" aria-hidden="true" />
              {formatNumber(post.score)}
            </span>
            <span className="flex items-center gap-0.5" title={`${post.comments} comments`}>
              <MessageCircle className="h-3 w-3" aria-hidden="true" />
              {formatNumber(post.comments)}
            </span>
            {age && (
              <span className="flex items-center gap-0.5">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {age}
              </span>
            )}
            <a
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open on Reddit"
              className="p-0.5 text-fg-muted hover:text-fg"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </span>
        </div>
      </article>
    </TiltCard>
  );
});

export default PostCard;
