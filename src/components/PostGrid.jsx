import PostCard from "./PostCard";

export default function PostGrid({ posts }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="font-heading text-sm font-semibold text-fg">
          Hot Posts
        </h2>
        <span className="text-xs text-fg-muted">({posts.length})</span>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </section>
  );
}
