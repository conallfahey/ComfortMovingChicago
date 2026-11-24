import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { parse } from "parse5";
import { attribute, text, walk } from "../src/lib/page-content.mjs";
import { pages } from "./site-files.mjs";

const site = "https://comfortmovingchicago.com";
const output = new URL("../.cloudflare/site/", import.meta.url);
const [page, ...inboundFiles] = process.argv.slice(2);
assert.match(page ?? "", /^(?:neighborhoods|blog)\/[a-z0-9-]+\.html$/, "Pass the staged page path and its required inbound source files.");
assert.ok(pages.includes(page), "The proposed page must be in the Astro content catalog.");
assert.ok(inboundFiles.length && inboundFiles.every(file => pages.includes(file) && file !== page), "Supply existing pages that will link to the new page.");

const built = file => readFileSync(new URL(file, output), "utf8");
const document = file => [...walk(parse(built(file)))];
const article = document(page);
const canonical = article.filter(node => node.tagName === "link" && attribute(node,"rel") === "canonical");
assert.deepEqual(canonical.map(node=>attribute(node,"href")), [site+"/"+page], "Expected one self-canonical URL.");
assert.ok(!article.some(node => node.tagName === "meta" &&
  ["robots","googlebot"].includes(attribute(node,"name")?.toLowerCase()) &&
  /(?:^|[\s,])(?:noindex|none)(?:$|[\s,])/i.test(attribute(node,"content") ?? "")), "New page must be indexable.");
assert.ok(built("sitemap.xml").includes("<loc>"+site+"/"+page+"</loc>"), "Canonical is missing from the sitemap.");

function anchors(nodes, from) {
  return nodes.filter(node => node.tagName === "a" && attribute(node,"href"))
    .map(node=>({target:new URL(attribute(node,"href"),from),label:text(node).trim()}));
}

for (const from of inboundFiles) {
  assert.ok(anchors(document(from),site+"/"+from).some(link =>
    link.target.origin===site && link.target.pathname==="/"+page && link.label),
  "Missing a descriptive link to "+page+" from "+from+".");
}

const main = article.find(node => node.tagName === "main");
assert.ok(main,"Expected a main landmark.");
const links = anchors([...walk(main)],site+"/"+page);
assert.ok(links.some(link=>link.target.origin===site && link.target.pathname==="/" && link.target.hash==="#quoteForm"),
  "Expected a link to the existing quote form.");

const localTargets = new Map();
for (const {target} of links.filter(link=>link.target.origin===site)) {
  const file = target.pathname.endsWith("/") ? target.pathname.slice(1)+"index.html" : target.pathname.slice(1);
  assert.ok(existsSync(new URL(file,output)), "Unresolved link "+target.href);
  if (target.hash) {
    if (!localTargets.has(file)) localTargets.set(file,new Set(document(file).map(node=>attribute(node,"id"))));
    assert.ok(localTargets.get(file).has(decodeURIComponent(target.hash.slice(1))), "Unresolved fragment "+target.href);
  }
}

console.log("Verified the canonical, sitemap, quote CTA, outbound links and "+inboundFiles.length+" inbound placements for "+page+".");
