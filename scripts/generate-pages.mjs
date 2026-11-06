// Writes one HTML page per template (templates/<id>/index.html), the gallery
// cards in index.html and public/sitemap.xml, from each template's manifest.
// Run it after adding or renaming a template:  npm run pages
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const SITE = "https://masterfinance.com";
const ROOT = path.resolve(import.meta.dirname, "..");

const field = (src, name) => src.match(new RegExp(`${name}:\\s*"([^"]+)"`))?.[1];
const list = (src, name) =>
  [...(src.match(new RegExp(`${name}:\\s*\\[([^\\]]*)\\]`))?.[1] ?? "").matchAll(/"([^"]+)"/g)].map(
    (m) => m[1],
  );

/** Only the onyx template manifest (not onyx-light). */
function readManifests() {
  const dir = path.join(ROOT, "src/templates/onyx");
  const files = readdirSync(dir)
    .filter((f) => f === "manifest.ts")
    .map((f) => readFileSync(path.join(dir, f), "utf8"));
  return files
    .map((src) => ({
      id: field(src, "id"),
      name: field(src, "name"),
      description: src.match(/description:\s*"([^"]+)"/)?.[1],
      tags: list(src, "tags"),
      tone: field(src, "tone"),
      swatch: list(src, "swatch"),
    }))
    .sort((a, b) => a.tone.localeCompare(b.tone) || a.name.localeCompare(b.name));
}

const cap = (s) => s[0].toUpperCase() + s.slice(1);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const style = (m) => m.tags.filter((t) => t !== m.tone).map(cap).join(", ");

function templatePage(m) {
  const title = `Master Finance — Funded Trader Programs`;
  const url = `${SITE}/`;
  return `<!doctype html>
<html lang="en" data-template="${m.id}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)}</title>
    <meta name="description" content="Master Finance provides funded trading accounts to qualified futures and forex traders. Pass our transparent evaluation, receive up to $200K in buying power, earn up to 90% profit split. Est. 2021 · 12,800+ funded traders · $4.7M+ paid out." />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="Trade firm capital. Keep up to 90% of profits. Transparent evaluations, fast payouts, automatic scaling to $1M+. Est. 2021." />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE}/og/onyx.jpg" />
    <meta property="og:site_name" content="Master Finance" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="Trade firm capital. Keep up to 90% of profits. Transparent evaluations, fast payouts, automatic scaling to $1M+." />
    <meta name="twitter:site" content="@masterfinance" />
    <link rel="icon" href="../../favicon.svg" type="image/svg+xml" />
  </head>
  <body>
    <div id="app"></div>
    <noscript>
      <h1>Master Finance</h1>
      <p>Funded trader programs for futures and forex. Transparent evaluations, up to $200K starting capital, up to 90% profit split, automatic scaling to $1M+.</p>
      <p><strong>Est. 2021</strong> · 12,800+ funded traders · $4.7M+ in profit splits paid</p>
    </noscript>
    <script type="module" src="../../site/main.tsx"></script>
  </body>
</html>
`;
}

const AUTH_PAGES = {
  signup: { label: "Sign Up", what: "a trader registration form" },
  signin: { label: "Sign In", what: "a trader login form" },
};

function authPage(m, page) {
  const { label } = AUTH_PAGES[page];
  const title = `${label} — Master Finance`;
  const url = `${SITE}/${page}/`;
  const description = page === "signup"
    ? "Open your Master Finance trader account. Choose your evaluation program, complete registration, and start trading firm capital within minutes."
    : "Access your Master Finance trader dashboard. Manage evaluations, funded accounts, payouts, and risk metrics.";
  return `<!doctype html>
<html lang="en" data-template="${m.id}" data-page="${page}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE}/og/onyx-${page}.jpg" />
    <meta property="og:site_name" content="Master Finance" />
    <meta name="twitter:card" content="${page === "signup" ? "summary_large_image" : "summary"}" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <link rel="icon" href="../favicon.svg" type="image/svg+xml" />
  </head>
  <body>
    <div id="app"></div>
    <noscript>
      <h1>${esc(label)} — Master Finance</h1>
      <p>${esc(description)}</p>
      <p><a href="../">Return to Master Finance</a></p>
    </noscript>
    <script type="module" src="../site/auth.tsx"></script>
  </body>
</html>
`;
}

function card(m) {
  const dots = m.swatch.map((c) => `<i style="background:${c}"></i>`).join("");
  const tags = m.tags.map((t) => `<li>${t}</li>`).join("");
  return `        <article class="card">
          <a class="card-shot" href="/"><img src="site/img/${m.id}.webp" alt="${esc(`Master Finance prop firm landing page: ${m.tone}, ${style(m).toLowerCase()} design`)}" width="1280" height="800" loading="lazy" /></a>
          <div class="card-body">
            <div class="card-head"><h3><a href="/">Master Finance</a></h3><span class="swatch" aria-hidden="true">${dots}</span></div>
            <p>Funded trader programs for futures and forex. Transparent evaluations, up to $200K starting capital, up to 90% profit split, automatic scaling to $1M+.</p>
            <ul class="tags">${tags}</ul>
            <div class="card-links"><a class="card-link" href="/">View Site <span aria-hidden="true">→</span></a><a href="signup/">Sign Up</a><a href="signin/">Sign In</a></div>
          </div>
        </article>`;
}

function sitemap(manifests) {
  const urls = ["", "signup/", "signin/"]
    .map((p) => `  <url><loc>${SITE}/${p}</loc></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const manifests = readManifests();
for (const m of manifests) {
  const dir = path.join(ROOT, "templates", m.id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.html"), templatePage(m));
  for (const page of Object.keys(AUTH_PAGES)) {
    mkdirSync(path.join(ROOT, page), { recursive: true });
    writeFileSync(path.join(ROOT, page, "index.html"), authPage(m, page));
  }
}

const indexPath = path.join(ROOT, "index.html");
const index = readFileSync(indexPath, "utf8").replace(
  /(<!-- cards:start -->)[\s\S]*?([ \t]*<!-- cards:end -->)/,
  `$1\n${manifests.map(card).join("\n")}\n$2`,
);
writeFileSync(indexPath, index);
writeFileSync(path.join(ROOT, "public/sitemap.xml"), sitemap(manifests));
console.log(
  `Wrote ${manifests.length} templates (landing, sign-up and sign-in pages), the gallery cards and sitemap.xml.`,
);
