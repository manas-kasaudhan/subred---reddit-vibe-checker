import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { fetchHotPosts, RedditApiError } from "./reddit.js";
import { analyzePosts } from "./sentiment.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ── API route ──────────────────────────────────────────────────────────────
app.get("/api/reddit/:subreddit", async (req, res) => {
  try {
    const posts = await fetchHotPosts(req.params.subreddit);
    const analysis = analyzePosts(posts);
    res.json({
      ok: true,
      subreddit: req.params.subreddit.replace(/^\/?r\//i, "").replace(/[^A-Za-z0-9_]/g, ""),
      ...analysis,
    });
  } catch (err) {
    if (err instanceof RedditApiError) {
      res.status(err.status).json({
        ok: false,
        code: err.code,
        message: err.message,
      });
    } else {
      console.error("Unexpected error:", err);
      res.status(500).json({
        ok: false,
        code: "unknown",
        message: "Something went wrong.",
      });
    }
  }
});

// ── Serve frontend in production ───────────────────────────────────────────
const distPath = path.resolve(__dirname, "..", "dist");
app.use(express.static(distPath));
app.get("{*path}", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
