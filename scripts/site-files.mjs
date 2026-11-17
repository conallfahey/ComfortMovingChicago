import { readdirSync } from "node:fs";
import { resolve } from "node:path";

const contentDirectories = ["blog", "neighborhoods", "services", "we-love-chicago"];
export const assetDirectories = ["assets", "Images", "llms", "partials"];
export const rootAssets = [
  "apple-touch-icon.png", "box-seam.svg", "favicon.ico", "llms-full.txt", "llms.txt", "preview", "robots.txt", "sitemap.xml",
];

function htmlFiles(directory = "") {
  return readdirSync(resolve(directory), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => directory ? `${directory}/${entry.name}` : entry.name);
}

export const pages = [
  ...htmlFiles().filter((page) => page !== "index-new.html"),
  ...contentDirectories.flatMap(htmlFiles),
];
