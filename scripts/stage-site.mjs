import { cpSync, existsSync, writeFileSync } from "node:fs";
import { assetDirectories, pages, rootAssets } from "./site-files.mjs";

const root = new URL("../", import.meta.url);
const output = new URL(".cloudflare/site/", root);
for (const path of [...assetDirectories, ...rootAssets]) {
  cpSync(new URL(path, root), new URL(path, output), { recursive: true });
}

// Preserve the public HTML paths and the existing extensionless aliases.
const redirects = ["/ /index.html 200"];
for (const page of [...pages, "partials/navbar.html", "partials/footer.html"]) {
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
