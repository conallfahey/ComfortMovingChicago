const fs = require('fs');
const path = require('path');
const { REVIEW_PROFILES, PAGE_REVIEW_PROFILES } = require('../seo/review-profiles');

const root = path.resolve(__dirname, '..');
function loadReviewFiles() {
  const reviewsDir = path.join(root, 'reviews');
  const files = fs.readdirSync(reviewsDir).filter((file) => file.endsWith('.json'));
  const allReviews = [];

  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(reviewsDir, file), 'utf8'));
    if (Array.isArray(raw.reviews)) {
      allReviews.push(...raw.reviews);
    }
  }

  return allReviews;
}

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), 'utf8');
}

function write(filePath, content) {
  fs.writeFileSync(path.join(root, filePath), content);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatDate(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/Chicago'
  }).format(date);
}

function initialsFromName(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

function buildIndex(reviews) {
  const byReviewer = new Map();

  for (const review of reviews) {
    const key = review.reviewer.displayName.toLowerCase();
    const existing = byReviewer.get(key);

    if (!existing || new Date(review.createTime) > new Date(existing.createTime)) {
      byReviewer.set(key, review);
    }
  }

  return byReviewer;
}

function renderReviewItem(entry, index) {
  const avatarColors = ['#28a745', '#0d6efd', '#6f42c1', '#dc3545'];
  const color = avatarColors[index % avatarColors.length];
  const initials = initialsFromName(entry.reviewer);

  return `                   <div class="review-item">
                      <div class="d-flex gap-3 align-items-start">
                         <div class="review-avatar flex-shrink-0" style="background-color: ${color};">${escapeHtml(initials)}</div>
                         <div>
                            <div class="fw-bold text-dark">${escapeHtml(entry.reviewer)}</div>
                            <div class="small text-muted">${escapeHtml(entry.date)}</div>
                            <div class="text-secondary-brand small my-1">
                               <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                            </div>
                            <p class="small text-muted mb-0">${escapeHtml(entry.excerpt)}</p>
                         </div>
                      </div>
                   </div>`;
}

function renderProfile(profile, reviewIndex) {
  const items = profile.map((item) => {
    const sourceReview = reviewIndex.get(item.reviewer.toLowerCase());

    if (!sourceReview) {
      throw new Error(`Missing review source for "${item.reviewer}"`);
    }

    return {
      reviewer: item.reviewer,
      date: formatDate(sourceReview.createTime),
      excerpt: item.excerpt
    };
  });

  return items.map(renderReviewItem).join('\n\n');
}

function replaceReviewBlocks(html, renderedReviews) {
  return html.replace(
    /(<div class="reviews-scroll-container flex-grow-1">)[\s\S]*?(<\/div>\s*<div class="google-review-btn-container">)/g,
    `$1\n${renderedReviews}\n                $2`
  );
}

const reviewIndex = buildIndex(loadReviewFiles());

for (const [filePath, profileKey] of Object.entries(PAGE_REVIEW_PROFILES)) {
  const html = read(filePath);
  const profile = REVIEW_PROFILES[profileKey];

  if (!profile) {
    throw new Error(`Missing review profile "${profileKey}"`);
  }

  const next = replaceReviewBlocks(html, renderProfile(profile, reviewIndex));
  write(filePath, next);
  console.log(`Updated reviews in ${filePath}`);
}
