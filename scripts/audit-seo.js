const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

function urlToFile(url) {
  const pathname = url.replace('https://comfortmovingchicago.com', '');
  if (!pathname || pathname === '/') {
    return 'index.html';
  }
  if (pathname.endsWith('/')) {
    return `${pathname.slice(1)}index.html`;
  }
  return pathname.slice(1);
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extract(html, regex) {
  const match = html.match(regex);
  return match ? stripTags(match[1]) : '';
}

function extractSchemaTypes(html) {
  return [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => {
      try {
        const parsed = JSON.parse(match[1]);
        const nodes = parsed['@graph'] ? parsed['@graph'] : Array.isArray(parsed) ? parsed : [parsed];
        return nodes.map((node) => node['@type']).flat().filter(Boolean);
      } catch (error) {
        return ['INVALID_JSON_LD'];
      }
    })
    .flat();
}

const rows = [];
for (const url of urls) {
  const filePath = path.join(root, urlToFile(url));
  if (!fs.existsSync(filePath)) {
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  rows.push({
    url,
    title: extract(html, /<title>([\s\S]*?)<\/title>/i),
    description: extract(html, /<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i),
    h1: extract(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i),
    canonical: extract(html, /<link\s+rel=["']canonical["']\s+href=["']([\s\S]*?)["']/i),
    schemaTypes: extractSchemaTypes(html)
  });
}

console.log(JSON.stringify(rows, null, 2));
