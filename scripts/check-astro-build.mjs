import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parse } from "parse5";
import { attribute, text, walk } from "../src/lib/page-content.mjs";
import { pages } from "./site-files.mjs";

const output = new URL("../.cloudflare/site/", import.meta.url);
const emitted = (file) => readFileSync(new URL(file, output), "utf8");

function searchMarkup(html) {
  const nodes = [...walk(parse(html))];
  const tag = (name) => nodes.filter((node) => node.tagName === name);
  return {
    titles: tag("title").map(text),
    descriptionsAndDirectives: tag("meta")
      .filter((node) => attribute(node, "name") || attribute(node, "property")).map((node) => node.attrs),
    canonical: tag("link").filter((node) => attribute(node, "rel") === "canonical").map((node) => node.attrs),
    schema: tag("script").filter((node) => attribute(node, "type") === "application/ld+json")
      .map((node) => JSON.parse(text(node))),
    headings: tag("h1").map((node) => text(node).trim()),
  };
}

const redirects = new Set(emitted("_redirects").trim().split("\n"));
for (const page of pages) {
  assert.deepEqual(searchMarkup(emitted(page)), searchMarkup(readFileSync(page, "utf8")), page);
  assert.ok(redirects.has(`/${page.slice(0, -5)} /${page} 200`), `Missing URL alias for ${page}`);
}

for (const filename of ["robots.txt", "sitemap.xml", "llms.txt", "llms-full.txt"]) {
  assert.equal(emitted(filename), readFileSync(filename, "utf8"), filename);
}

for (const [, location] of emitted("sitemap.xml").matchAll(/<loc>(.*?)<\/loc>/g)) {
  const { pathname } = new URL(location);
  const file = pathname.slice(1) + (pathname.endsWith("/") ? "index.html" : "");
  assert.ok(pages.includes(file), `Missing sitemap page: ${pathname}`);
}

console.log(`Verified search metadata, structured data, H1s, and URL aliases for ${pages.length} Astro pages.`);
