const fs = require('fs');
const path = require('path');
const { BASE_URL, BUSINESS, PAGE_DEFINITIONS } = require('../seo/seo-config');

const root = path.resolve(__dirname, '..');

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), 'utf8');
}

function write(filePath, content) {
  fs.writeFileSync(path.join(root, filePath), content);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractTagContent(html, pattern) {
  const match = html.match(pattern);
  return match ? stripTags(match[1]) : '';
}

function extractAttribute(html, pattern) {
  const match = html.match(pattern);
  return match ? match[1].trim() : '';
}

function parseJsonLdBlocks(html) {
  return [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => {
      try {
        return JSON.parse(match[1]);
      } catch (error) {
        return null;
      }
    })
    .filter(Boolean);
}

function getCanonicalFor(filePath) {
  if (filePath === 'index.html') {
    return `${BASE_URL}/`;
  }
  if (filePath.endsWith('/index.html')) {
    return `${BASE_URL}/${filePath.replace(/index\.html$/, '')}`;
  }
  return `${BASE_URL}/${filePath}`;
}

function cleanHead(head) {
  return head.replace(/\s*<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi, '\n');
}

function buildPlace(value) {
  if (/^\d{5}$/.test(value)) {
    return { '@type': 'PostalCodeRangeSpecification', postalCode: value, addressCountry: 'US' };
  }

  const [name, region = ''] = value.split(',').map((part) => part.trim());
  const type = 'City';
  const place = { '@type': type, name };

  if (region) {
    place.address = {
      '@type': 'PostalAddress',
      addressRegion: region.replace('IL', 'IL'),
      addressCountry: 'US'
    };
  }

  return place;
}

function buildBreadcrumbSchema(filePath, html) {
  const items = [...html.matchAll(/<li class="breadcrumb-item(?: active)?[^"]*"[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((match) => stripTags(match[1]));

  if (items.length < 2) {
    return null;
  }

  const listItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${BASE_URL}/`
    }
  ];

  if (filePath.startsWith('blog/')) {
    listItems.push({
      '@type': 'ListItem',
      position: 2,
      name: 'Moving Tips',
      item: `${BASE_URL}/blog/`
    });
    listItems.push({
      '@type': 'ListItem',
      position: 3,
      name: items[items.length - 1]
    });
  }

  return {
    '@type': 'BreadcrumbList',
    itemListElement: listItems
  };
}

function extractFaqEntries(html) {
  return [...html.matchAll(/<div class="accordion-item">[\s\S]*?<button[^>]*>([\s\S]*?)<\/button>[\s\S]*?<div class="accordion-body">([\s\S]*?)<\/div>[\s\S]*?<\/div>\s*<\/div>/gi)]
    .map((match) => ({
      '@type': 'Question',
      name: stripTags(match[1]),
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripTags(match[2])
      }
    }));
}

function findArticleDates(html) {
  const blocks = parseJsonLdBlocks(html);
  for (const block of blocks) {
    const nodes = Array.isArray(block) ? block : [block];
    for (const node of nodes) {
      if (!node || !node['@type']) {
        continue;
      }
      const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
      if (types.includes('BlogPosting') || types.includes('Article')) {
        return {
          datePublished: node.datePublished || undefined,
          dateModified: node.dateModified || node.datePublished || undefined,
          author: node.author || { '@type': 'Person', name: 'Conall Fahey' }
        };
      }
    }
  }

  return {
    author: { '@type': 'Person', name: 'Conall Fahey' }
  };
}

function buildSchema(filePath, page, html) {
  const canonical = getCanonicalFor(filePath);
  const h1 = extractTagContent(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i) || page.serviceName;
  const lead = extractTagContent(
    html,
    /<p[^>]*class="[^"]*(?:lead|subtitle)[^"]*"[^>]*>([\s\S]*?)<\/p>/i
  );

  if (page.schemaType === 'none') {
    return null;
  }

  if (page.schemaType === 'home') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        BUSINESS,
        {
          '@type': 'WebPage',
          '@id': `${canonical}#webpage`,
          url: canonical,
          name: 'Chicago Movers | Local Moving Company',
          description: page.description,
          about: { '@id': BUSINESS['@id'] }
        }
      ]
    };
  }

  if (page.schemaType === 'faq' || page.schemaType === 'communityPostWithFaq') {
    const faqEntries = extractFaqEntries(html);
    const faqNode = {
      '@type': 'FAQPage',
      mainEntity: faqEntries
    };

    if (page.schemaType === 'faq') {
      return {
        '@context': 'https://schema.org',
        '@graph': [faqNode]
      };
    }

    const articleGraph = buildSchema(filePath, { ...page, schemaType: 'communityPost' }, html);
    return {
      '@context': 'https://schema.org',
      '@graph': [...articleGraph['@graph'], faqNode]
    };
  }

  if (page.schemaType === 'service' || page.schemaType === 'areaService') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        BUSINESS,
        {
          '@type': 'Service',
          '@id': `${canonical}#service`,
          url: canonical,
          name: page.serviceName || h1,
          serviceType: page.serviceType || 'Moving services',
          description: lead || page.description,
          provider: { '@id': BUSINESS['@id'] },
          areaServed: (page.areaServed || ['Chicago, IL']).map(buildPlace)
        }
      ]
    };
  }

  if (page.schemaType === 'blogPost' || page.schemaType === 'communityPost') {
    const { datePublished, dateModified, author } = findArticleDates(html);
    const breadcrumb = buildBreadcrumbSchema(filePath, html);
    const graph = [
      {
        '@type': filePath.startsWith('blog/') ? 'BlogPosting' : 'Article',
        '@id': `${canonical}#article`,
        headline: h1,
        description: page.description,
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
        author,
        publisher: {
          '@type': 'Organization',
          name: BUSINESS.name,
          logo: {
            '@type': 'ImageObject',
            url: BUSINESS.logo
          }
        },
        image: extractAttribute(
          html,
          /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i
        ) || BUSINESS.image
      }
    ];

    if (datePublished) {
      graph[0].datePublished = datePublished;
    }
    if (dateModified) {
      graph[0].dateModified = dateModified;
    }
    if (breadcrumb) {
      graph.push(breadcrumb);
    }

    return {
      '@context': 'https://schema.org',
      '@graph': graph
    };
  }

  return null;
}

function replaceOrInsertMeta(html, name, value, options = {}) {
  const { property = false } = options;
  const attr = property ? 'property' : 'name';
  const regex = new RegExp(`<meta\\s+${attr}=["']${name}["']\\s+content=["'][\\s\\S]*?["']\\s*\\/?>`, 'i');
  const replacement = `<meta ${attr}="${name}" content="${escapeHtml(value)}">`;

  if (regex.test(html)) {
    return html.replace(regex, replacement);
  }

  return html.replace(/<\/head>/i, `    ${replacement}\n</head>`);
}

function ensureCanonical(html, canonical) {
  const link = `<link rel="canonical" href="${canonical}" />`;
  if (/<link\s+rel=["']canonical["']/i.test(html)) {
    return html.replace(/<link\s+rel=["']canonical["']\s+href=["'][^"']+["']\s*\/?>/i, link);
  }
  return html.replace(/<head>/i, `<head>\n    ${link}`);
}

function updateHead(filePath, html, page) {
  const title = `<title>${escapeHtml(page.title)}</title>`;
  const canonical = getCanonicalFor(filePath);
  let next = html;

  next = next.replace(/<title>[\s\S]*?<\/title>/i, title);
  next = replaceOrInsertMeta(next, 'description', page.description);
  next = ensureCanonical(next, canonical);

  if (filePath === 'local-chicago-movers.html') {
    next = replaceOrInsertMeta(next, 'robots', 'noindex, follow');
  }

  if (/meta property="og:title"/i.test(next)) {
    next = replaceOrInsertMeta(next, 'og:title', page.title, { property: true });
  }
  if (/meta property="og:description"/i.test(next)) {
    next = replaceOrInsertMeta(next, 'og:description', page.description, { property: true });
  }
  if (/meta property="og:url"/i.test(next)) {
    next = replaceOrInsertMeta(next, 'og:url', canonical, { property: true });
  }
  if (/meta name="twitter:title"/i.test(next)) {
    next = replaceOrInsertMeta(next, 'twitter:title', page.title);
  }
  if (/meta name="twitter:description"/i.test(next)) {
    next = replaceOrInsertMeta(next, 'twitter:description', page.description);
  }

  const parts = next.split(/<\/head>/i);
  const head = cleanHead(parts[0]);
  const schema = buildSchema(filePath, page, html);
  const schemaBlock = schema
    ? `\n    <script type="application/ld+json">\n${JSON.stringify(schema, null, 2)
        .split('\n')
        .map((line) => `    ${line}`)
        .join('\n')}\n    </script>\n`
    : '\n';

  return `${head}${schemaBlock}</head>${parts.slice(1).join('</head>')}`;
}

function ensureServicesH1(html) {
  if (/<h1[\s>]/i.test(html)) {
    return html;
  }

  return html.replace(
    /<div class="service-container bg-service-residential">/,
    '<h1 class="visually-hidden">Chicago Moving Services</h1>\n\n        <div class="service-container bg-service-residential">'
  );
}

for (const [filePath, page] of Object.entries(PAGE_DEFINITIONS)) {
  const original = read(filePath);
  let updated = updateHead(filePath, original, page);

  if (filePath === 'services.html') {
    updated = ensureServicesH1(updated);
  }

  write(filePath, updated);
  console.log(`Updated ${filePath}`);
}
