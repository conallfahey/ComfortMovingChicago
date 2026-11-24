import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { parse } from "parse5";
import { attribute, loadPage, text, walk } from "../src/lib/page-content.mjs";
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
const servicePages = pages.filter((page) => page.startsWith("services/"));
const neighborhoodPages = pages.filter((page) => page.startsWith("neighborhoods/"));
const hasClass = (node, name) => (attribute(node, "class") ?? "").split(/\s+/).includes(name);
const fieldNames = (form) => [...walk(form)]
  .filter((node) => ["input", "select", "textarea"].includes(node.tagName))
  .map((node) => attribute(node, "name")).filter(Boolean).sort();

function checkServiceMarkup(filename) {
  const nodes = [...walk(parse(emitted(filename)))];
  const mains = nodes.filter((node) => node.tagName === "main");
  assert.equal(mains.length, 1, `Expected one main landmark on ${filename}`);
  assert.ok(hasClass(mains[0], "cmc-service-main"), `Missing the service layout on ${filename}`);
  assert.ok(nodes.some((node) => node.tagName === "link" &&
    attribute(node, "href") === "/assets/css/service-pages.css"), `Missing the service stylesheet on ${filename}`);
  return nodes;
}

for (const page of pages) {
  const html = emitted(page);
  assert.deepEqual(searchMarkup(html), searchMarkup(readFileSync(page, "utf8")), page);
  const nodes = [...walk(parse(html))];
  const scripts = nodes.filter((node) => node.tagName === "script").map((node) => attribute(node, "src"));
  const attribution = scripts.indexOf("/assets/js/website-attribution.js");
  const quote = scripts.indexOf("/assets/js/quote-form-crm.js");
  assert.ok(attribution !== -1, `Missing website attribution on ${page}`);
  if (nodes.some((node) => node.tagName === "form" && attribute(node, "data-crm-quote-form") !== undefined)) {
    assert.notEqual(quote, -1, `Missing the quote handler on ${page}`);
  }
  assert.ok(quote === -1 || attribution < quote, `Attribution must load before the quote handler on ${page}`);
  assert.ok(redirects.has(`/${page.slice(0, -5)} /${page} 200`), `Missing URL alias for ${page}`);
}

for (const filename of servicePages) {
  const source = [...walk(parse(readFileSync(filename, "utf8")))];
  const built = checkServiceMarkup(filename);
  const ids = built.map((node) => attribute(node, "id")).filter(Boolean);
  assert.equal(new Set(ids).size, ids.length, `Duplicate IDs on ${filename}`);
  assert.equal(built.filter((node) => node.tagName === "details" && hasClass(node, "cmc-service-question")).length,
    source.filter((node) => hasClass(node, "accordion-item")).length, `FAQ count changed on ${filename}`);

  const originalForm = source.find((node) => node.tagName === "form");
  const planners = built.filter((node) =>
    node.tagName === "form" && attribute(node, "data-quote-planner") !== undefined);
  assert.equal(planners.length, 1, `Expected one Astro quote planner on ${filename}`);
  assert.deepEqual(fieldNames(planners[0]), fieldNames(originalForm), `Quote fields changed on ${filename}`);
  assert.equal(built.filter((node) => node.tagName === "script" &&
    attribute(node, "src") === "/assets/js/quote-form-crm.js").length, 1, `Expected one CRM handler on ${filename}`);
}

for (const filename of neighborhoodPages) {
  const source = [...walk(parse(readFileSync(filename, "utf8")))];
  const built = [...walk(parse(emitted(filename)))];
  const mains = built.filter((node) => node.tagName === "main");
  assert.equal(mains.length, 1, `Expected one main landmark on ${filename}`);
  assert.ok(hasClass(mains[0], "cmc-editorial-main"), `Missing the neighborhood layout on ${filename}`);
  const images = [...walk(mains[0])].filter((node) => node.tagName === "img");
  const leadPhoto = images.find((node) => hasClass(node, "cmc-editorial-overview-image") ||
    hasClass(node, "cmc-editorial-image"));
  assert.ok(leadPhoto && attribute(leadPhoto, "alt") && attribute(leadPhoto, "width") &&
    attribute(leadPhoto, "height"), `Missing neighborhood photo or its dimensions on ${filename}`);
  const media = images.flatMap((node) => [attribute(node, "src"),
    ...(attribute(node, "srcset") ?? "").split(",").map((candidate) => candidate.trim().split(/\s/)[0])]);
  const stylesheets = built.filter((node) => node.tagName === "link" && attribute(node, "rel") === "stylesheet")
    .map((node) => attribute(node, "href"));
  for (const path of [...media, ...stylesheets].filter(Boolean)) {
    const url = new URL(path, new URL(filename, "https://comfortmovingchicago.com/"));
    if (url.hostname !== "comfortmovingchicago.com") continue;
    assert.ok(existsSync(new URL(url.pathname.slice(1), output)), `Missing asset ${path} on ${filename}`);
  }
  const ids = built.map((node) => attribute(node, "id")).filter(Boolean);
  assert.equal(new Set(ids).size, ids.length, `Duplicate IDs on ${filename}`);
  const contents = built.find((node) => hasClass(node, "cmc-editorial-contents"));
  assert.ok(contents, `Missing page navigation on ${filename}`);
  for (const link of [...walk(contents)].filter((node) => node.tagName === "a")) {
    assert.ok(ids.includes(attribute(link, "href")?.slice(1)), `Broken section link on ${filename}`);
  }
  const originalForm = source.find((node) => node.tagName === "form" &&
    attribute(node, "data-crm-quote-form") !== undefined);
  const planners = built.filter((node) => node.tagName === "form" &&
    attribute(node, "data-quote-planner") !== undefined);
  assert.equal(planners.length, Number(Boolean(originalForm)), `Quote form count changed on ${filename}`);
  if (originalForm) {
    assert.deepEqual(fieldNames(planners[0]), fieldNames(originalForm), `Quote fields changed on ${filename}`);
  }
}

for (const filename of pages.filter((page) => page.startsWith("blog/blog-"))) {
  const { editorial } = loadPage(filename, { editorial: true });
  assert.ok(editorial.title && editorial.content && !editorial.content.includes("<h1"),
    `The shared layout must separate the article hero and body on ${filename}`);
}

const directory = checkServiceMarkup("services.html")
  .find((node) => hasClass(node, "cmc-service-catalog-grid"));
assert.ok(directory, "Missing the Services directory grid");
const directoryLinks = [...walk(directory)].filter((node) => node.tagName === "a")
  .map((node) => attribute(node, "href")).sort();
assert.deepEqual(directoryLinks, servicePages.map((page) => `/${page}`).sort(), "The directory must link to every service");

for (const filename of ["robots.txt", "sitemap.xml", "llms.txt", "llms-full.txt"]) {
  assert.equal(emitted(filename), readFileSync(filename, "utf8"), filename);
}

for (const [, location] of emitted("sitemap.xml").matchAll(/<loc>(.*?)<\/loc>/g)) {
  const { pathname } = new URL(location);
  const file = pathname.slice(1) + (pathname.endsWith("/") ? "index.html" : "");
  assert.ok(pages.includes(file), `Missing sitemap page: ${pathname}`);
}

console.log(`Verified search metadata, structured data, H1s, and URL aliases for ${pages.length} Astro pages.`);
console.log(`Verified the Services directory and ${servicePages.length} service pages, including FAQs, unique IDs, and quote forms.`);
console.log(`Verified layouts, images, stylesheets, section links, and quote fields on ${neighborhoodPages.length} neighborhood pages.`);
