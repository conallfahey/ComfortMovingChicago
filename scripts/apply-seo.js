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

  const parts = value.split(',').map((part) => part.trim()).filter(Boolean);
  const [name] = parts;
  const region = parts.at(-1);
  const locality = parts.length > 2 ? parts[1] : name;
  const place = {
    '@type': parts.length > 2 ? 'Place' : 'City',
    name: parts.length > 2 ? `${name}, ${locality}` : name
  };

  if (parts.length > 1) {
    place.address = {
      '@type': 'PostalAddress',
      addressLocality: locality,
      addressRegion: region,
      addressCountry: 'US'
    };
  }

  return place;
}

function buildBreadcrumbSchema(filePath, html, page) {
  const items = [...html.matchAll(/<li class="breadcrumb-item(?: active)?[^"]*"[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((match) => stripTags(match[1]));

  if (items.length >= 2) {
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

  if (filePath === 'services.html') {
    return {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Moving Services', item: `${BASE_URL}/services.html` }
      ]
    };
  }

  if (filePath.startsWith('services/')) {
    return {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Moving Services', item: `${BASE_URL}/services.html` },
        { '@type': 'ListItem', position: 3, name: page.serviceName || items[items.length - 1] || '' }
      ]
    };
  }

  if (filePath.startsWith('neighborhoods/')) {
    return {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
        { '@type': 'ListItem', position: 2, name: page.serviceName || items[items.length - 1] || '' }
      ]
    };
  }

  return null;
}

function extractFaqEntries(html) {
  const seen = new Set();

  return [...html.matchAll(/<div class="accordion-item">[\s\S]*?<button[^>]*>([\s\S]*?)<\/button>[\s\S]*?<div class="accordion-body">([\s\S]*?)<\/div>[\s\S]*?<\/div>\s*<\/div>/gi)]
    .map((match) => ({
      '@type': 'Question',
      name: stripTags(match[1]),
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripTags(match[2])
      }
    }))
    .filter((entry) => {
      const key = entry.name.toLowerCase();
      if (!entry.name || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

function findArticleDates(html) {
  const blocks = parseJsonLdBlocks(html);
  let detectedAuthor = { '@type': 'Person', name: 'Conall Fahey' };

  for (const block of blocks) {
    const nodes = Array.isArray(block) ? block : block['@graph'] || [block];
    for (const node of nodes) {
      if (!node || !node['@type']) {
        continue;
      }
      const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
      if (types.includes('BlogPosting') || types.includes('Article')) {
        detectedAuthor = node.author || detectedAuthor;
        if (node.datePublished) {
          return {
            datePublished: node.datePublished,
            dateModified: node.dateModified || node.datePublished,
            author: detectedAuthor
          };
        }
      }
    }
  }

  const visibleDate = stripTags(html).match(
    /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},\s+\d{4}\b/i
  );
  if (visibleDate) {
    const parsedDate = new Date(visibleDate[0]);
    if (!Number.isNaN(parsedDate.getTime())) {
      const datePublished = parsedDate.toISOString().slice(0, 10);
      return {
        datePublished,
        dateModified: datePublished,
        author: detectedAuthor
      };
    }
  }

  return {
    author: detectedAuthor
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

  const websiteReference = { '@id': `${BASE_URL}/#website` };
  const businessReference = { '@id': BUSINESS['@id'] };
  const buildWebPage = (overrides = {}) => ({
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: page.title,
    description: page.description,
    isPartOf: websiteReference,
    about: businessReference,
    inLanguage: 'en-US',
    ...overrides
  });

  if (page.schemaType === 'home') {
    const faqEntries = extractFaqEntries(html);
    const breadcrumb = buildBreadcrumbSchema(filePath, html, page);
    const graph = [
      BUSINESS,
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: `${BASE_URL}/`,
        name: 'Comfort Moving Chicago',
        publisher: businessReference,
        inLanguage: 'en-US'
      },
      buildWebPage({
        primaryImageOfPage: {
          '@id': `${BASE_URL}/#primaryimage`
        }
      }),
      {
        '@type': 'ImageObject',
        '@id': `${BASE_URL}/#primaryimage`,
        url: `${BASE_URL}/Images/Chicago-Movers-Loading-Large-Box-Truck.webp`,
        contentUrl: `${BASE_URL}/Images/Chicago-Movers-Loading-Large-Box-Truck.webp`,
        width: 1800,
        height: 1200,
        caption: 'Comfort Moving Chicago crew loading a moving truck'
      }
    ];

    if (breadcrumb) {
      graph.push(breadcrumb);
    }
    if (faqEntries.length) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: faqEntries
      });
    }

    return {
      '@context': 'https://schema.org',
      '@graph': graph
    };
  }

  if (page.schemaType === 'faq' || page.schemaType === 'communityPostWithFaq') {
    const faqEntries = extractFaqEntries(html);
    const faqNode = {
      '@type': 'FAQPage',
      '@id': `${canonical}#faq`,
      isPartOf: websiteReference,
      mainEntity: faqEntries
    };

    if (page.schemaType === 'faq') {
      return {
        '@context': 'https://schema.org',
        '@graph': [
          BUSINESS,
          buildWebPage({ mainEntity: { '@id': `${canonical}#faq` } }),
          faqNode
        ]
      };
    }

    const articleGraph = buildSchema(filePath, { ...page, schemaType: 'communityPost' }, html);
    return {
      '@context': 'https://schema.org',
      '@graph': [...articleGraph['@graph'], faqNode]
    };
  }

  if (page.schemaType === 'webPage') {
    const breadcrumb = buildBreadcrumbSchema(filePath, html, page);
    const graph = [
      BUSINESS,
      buildWebPage()
    ];

    if (breadcrumb) {
      graph.push(breadcrumb);
    }

    return {
      '@context': 'https://schema.org',
      '@graph': graph
    };
  }

  if (page.schemaType === 'service' || page.schemaType === 'areaService') {
    const faqEntries = extractFaqEntries(html);
    const breadcrumb = buildBreadcrumbSchema(filePath, html, page);
    const areaServed = (page.areaServed || ['Chicago, IL']).map(buildPlace);
    const graph = [
      BUSINESS,
      buildWebPage({ about: { '@id': `${canonical}#service` } }),
      {
        '@type': 'Service',
        '@id': `${canonical}#service`,
        url: canonical,
        name: page.serviceName || h1,
        serviceType: page.serviceType || 'Moving services',
        description: lead || page.description,
        provider: businessReference,
        areaServed,
        mainEntityOfPage: { '@id': `${canonical}#webpage` }
      }
    ];

    if (breadcrumb) {
      graph.push(breadcrumb);
    }

    if (faqEntries.length) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: faqEntries
      });
    }

    return {
      '@context': 'https://schema.org',
      '@graph': graph
    };
  }

  if (page.schemaType === 'blogPost' || page.schemaType === 'communityPost') {
    const { datePublished, dateModified, author } = findArticleDates(html);
    const breadcrumb = buildBreadcrumbSchema(filePath, html, page);
    const articleNode = {
      '@type': filePath.startsWith('blog/') ? 'BlogPosting' : 'Article',
      '@id': `${canonical}#article`,
      headline: h1,
      description: page.description,
      mainEntityOfPage: { '@id': `${canonical}#webpage` },
      author,
      publisher: businessReference,
      image: extractAttribute(
        html,
        /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i
      ) || BUSINESS.image[0]
    };
    const graph = [
      BUSINESS,
      buildWebPage({
        about: businessReference,
        mainEntity: { '@id': `${canonical}#article` }
      }),
      articleNode
    ];

    if (datePublished) {
      articleNode.datePublished = datePublished;
    }
    if (dateModified) {
      articleNode.dateModified = dateModified;
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
    : '';

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

const requestedFiles = new Set(process.argv.slice(2).map((filePath) => filePath.replace(/\\/g, '/')));

for (const [filePath, page] of Object.entries(PAGE_DEFINITIONS)) {
  if (requestedFiles.size && !requestedFiles.has(filePath)) {
    continue;
  }
  const original = read(filePath);
  let updated = updateHead(filePath, original, page);

  if (filePath === 'services.html') {
    updated = ensureServicesH1(updated);
  }

  write(filePath, updated);
  console.log(`Updated ${filePath}`);
}
