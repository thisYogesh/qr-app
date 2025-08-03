import fs from "fs";
import path from "path";

/**
 * Vite plugin to serve a custom admin.html at /admin
 */
export default function AdminHtmlPlugin() {
  return {
    name: "vite-plugin-admin-html",

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/admin") {
          const filePath = path.resolve(process.cwd(), "admin.html");
          const html = fs.readFileSync(filePath, "utf-8");
          res.setHeader("Content-Type", "text/html");
          res.end(html);
          return;
        }
        next();
      });
    },

    // Optional: Hook to log when plugin runs
    buildStart() {
      console.log("[vite-plugin-admin-html] Plugin active");
    },
  };
}
