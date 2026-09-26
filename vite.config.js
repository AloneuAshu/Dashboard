import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const webRoot = path.dirname(fileURLToPath(import.meta.url));

function newsRefresh() {
  return {
    name: "news-refresh",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || "").split("?")[0];
        if (!url.endsWith("/api/refresh-news")) {
          next();
          return;
        }
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("POST only");
          return;
        }
        const script = path.resolve(webRoot, "../news_feed.py");
        const child = spawn("python", [script, "latest"], { windowsHide: true });
        child.on("close", (code) => {
          res.statusCode = code === 0 ? 200 : 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: code === 0 }));
        });
      });
    },
  };
}

export default defineConfig({
  base: "/Dashboard/",
  plugins: [react(), newsRefresh()],
  server: { port: 5173, strictPort: true },
});
