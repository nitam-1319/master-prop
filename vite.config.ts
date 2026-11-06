import { readdirSync } from "node:fs";
import { sep } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The gallery plus every page under templates/ (landing, signup/ and signin/ per template).
const templatePages = Object.fromEntries(
  readdirSync("templates", { recursive: true, encoding: "utf8" })
    .map((file) => file.split(sep).join("/"))
    .filter((file) => file.endsWith("/index.html"))
    .map((file) => [file.slice(0, -"/index.html".length), `templates/${file}`]),
);

// Root-level auth pages
const authPages = Object.fromEntries(
  ["signup", "signin"].map((page) => [page, `${page}/index.html`]),
);

export default defineConfig({
  // Relative asset paths, so the build works on GitHub Pages, Netlify or any folder.
  base: "./",
  plugins: [react()],
  build: { rollupOptions: { input: { index: "index.html", ...templatePages, ...authPages } } },
});
