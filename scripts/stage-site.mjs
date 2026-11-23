import { cpSync, existsSync, writeFileSync } from "node:fs";
import { assetDirectories, pages, rootAssets } from "./site-files.mjs";

const root = new URL("../", import.meta.url);
const output = new URL(".cloudflare/site/", root);
for (const path of [...assetDirectories, ...rootAssets]) {
  cpSync(new URL(path, root), new URL(path, output), { recursive: true });
}

// Redirect retired paths to their current destinations.
const redirects = [
  "/local-hoisting-chicago.html /services/local-hoisting-chicago.html 301",
  "/blog.html /blog/ 301",
  "/residential-moving-chicago.html /services/residential-moving-chicago.html 301",
  "/furniture-assembly-chicago.html /services/furniture-assembly-chicago.html 301",
  "/packing-services-chicago.html /services/packing-services-chicago.html 301",
  "/blog-packing-fragile-items.html /blog/blog-packing-fragile-items.html 301",
  "/blog-hoisting-benefits.html /blog/blog-hoisting-benefits.html 301",
  "/blog-best-time-to-move-chicago.html /blog/blog-best-time-to-move-chicago.html 301",
  "/blog-chicago-neighborhoods-guide.html /blog/blog-chicago-neighborhoods-guide.html 301",
  "/blog-elevator-loading-zone-permits-chicago.html /blog/blog-elevator-loading-zone-permits-chicago.html 301",
  "/blog-moving-wicker-lincoln-south-loop.html /blog/blog-moving-wicker-lincoln-south-loop.html 301",
  "/blog-stress-free-moving-day.html /blog/blog-stress-free-moving-day.html 301",
  "/sitemap /sitemap.xml 301",
];

// Preserve the public HTML paths and the existing extensionless aliases.
redirects.push("/ /index.html 200");
for (const page of [...pages, "branding/index.html", "partials/navbar.html", "partials/footer.html"]) {
  if (!existsSync(new URL(page, output))) throw new Error(`Missing built page: ${page}`);
  redirects.push(`/${page.slice(0, -5)} /${page} 200`);
  if (page.endsWith("/index.html")) {
    const directory = `/${page.slice(0, -"index.html".length)}`;
    redirects.push(`${directory.slice(0, -1)} ${directory} 301`, `${directory} /${page} 200`);
  }
}
writeFileSync(new URL("_redirects", output), `${redirects.join("\n")}\n`);

if (process.argv.includes("--preview")) {
  writeFileSync(new URL("_headers", output), "/*\n  X-Robots-Tag: noindex\n");
}
