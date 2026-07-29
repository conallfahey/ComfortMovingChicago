const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const today = new Date().toISOString().slice(0, 10);
const ignoredDirectories = new Set(['.git', 'node_modules', 'llms']);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (ignoredDirectories.has(entry.name)) return [];
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return entry.name.endsWith('.html') ? [fullPath] : [];
  });
}

function lastModified(filePath) {
  const relative = path.relative(root, filePath);
  try {
    const status = execFileSync('git', ['status', '--porcelain', '--', relative], {
      cwd: root,
      encoding: 'utf8'
    }).trim();
    if (status) return today;

    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', relative], {
      cwd: root,
      encoding: 'utf8'
    }).trim();
    return date || today;
  } catch {
    return today;
  }
}

const byCanonical = new Map();
for (const filePath of walk(root)) {
  const html = fs.readFileSync(filePath, 'utf8');
  if (/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html)) continue;

  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1];
  if (!canonical?.startsWith('https://comfortmovingchicago.com/')) continue;

  const candidate = { filePath, lastmod: lastModified(filePath) };
  const current = byCanonical.get(canonical);
  if (!current || candidate.lastmod > current.lastmod) byCanonical.set(canonical, candidate);
}

function rank(url) {
  if (url === 'https://comfortmovingchicago.com/') return 0;
  if (url.endsWith('/services.html')) return 1;
  if (url.includes('/services/')) return 2;
  if (url.includes('/neighborhoods/')) return 3;
  if (url.endsWith('/blog/') || url.endsWith('/we-love-chicago/')) return 4;
  if (url.includes('/blog/') || url.includes('/we-love-chicago/')) return 5;
  return 6;
}

const entries = [...byCanonical.entries()].sort(([urlA], [urlB]) =>
  rank(urlA) - rank(urlB) || urlA.localeCompare(urlB)
);

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.flatMap(([url, { lastmod }]) => [
    '  <url>',
    `    <loc>${url}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    '  </url>'
  ]),
  '</urlset>',
  ''
].join('\n');

fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
console.log(`Wrote ${entries.length} canonical URLs to sitemap.xml`);
