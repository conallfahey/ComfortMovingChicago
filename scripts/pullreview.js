const fs = require('fs');
const path = require('path');

// 1. Google Business Profile API Fetcher
// Note: To use this, you must run `npm install googleapis` 
// and place your service account key at the root as `google-credentials.json`.
async function fetchFromGoogleApi() {
  let google;
  try {
    google = require('googleapis').google;
  } catch (e) {
    console.warn('[!] "googleapis" package not found. Skipping auto-fetch.');
    console.log('    To enable API fetching, run: npm install googleapis');
    return null;
  }

  const KEY_FILE_PATH = path.join(__dirname, '../google-credentials.json');
  
  // These IDs match the ones found in your current reviews.json
  const ACCOUNT_ID = '116507434882864969255';
  const LOCATION_ID = '10010227020373101361';

  if (!fs.existsSync(KEY_FILE_PATH)) {
    console.warn(`[!] Skipping Google API fetch: Credentials not found at ${KEY_FILE_PATH}`);
    return null;
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: ['https://www.googleapis.com/auth/business.manage'],
  });

  const authClient = await auth.getClient();
  const url = `https://mybusinessreviews.googleapis.com/v1/accounts/${ACCOUNT_ID}/locations/${LOCATION_ID}/reviews`;
  
  let allReviews = [];
  let nextPageToken = null;

  console.log('Fetching reviews from Google Business Profile API...');
  try {
    do {
      const params = new URLSearchParams();
      if (nextPageToken) params.append('pageToken', nextPageToken);

      const response = await authClient.request({
        url: `${url}?${params.toString()}`,
        method: 'GET'
      });

      const data = response.data;
      if (data.reviews) {
        allReviews = allReviews.concat(data.reviews);
      }
      nextPageToken = data.nextPageToken;
    } while (nextPageToken);

    console.log(`Successfully fetched ${allReviews.length} reviews.`);
    return allReviews;
  } catch (err) {
    console.error('[!] Error fetching from Google API:', err.message);
    return null;
  }
}

// 2. Convert reviews to an LLM-friendly Markdown file
function convertToMarkdown(reviews, outputPath) {
  let mdContent = '# Customer Reviews\n\n';
  
  // Sort reviews by newest first
  const sortedReviews = [...reviews].sort((a, b) => new Date(b.createTime) - new Date(a.createTime));

  sortedReviews.forEach(review => {
    const name = review.reviewer?.displayName || 'Anonymous';
    const rating = review.starRating || 'Unknown';
    
    // Format date nicely
    const dateObj = new Date(review.createTime);
    const date = isNaN(dateObj.getTime()) ? 'Unknown Date' : dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
    
    // Clean up comment text
    const comment = review.comment ? review.comment.replace(/\n/g, ' ') : '*No comment provided*';
    
    mdContent += `### ${name}\n`;
    mdContent += `- **Rating:** ${rating}\n`;
    mdContent += `- **Date:** ${date}\n`;
    mdContent += `- **Comment:** ${comment}\n\n`;
  });

  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(outputPath, mdContent);
  console.log(`[+] Successfully generated LLM-friendly Markdown at: ${outputPath}`);
}

async function main() {
  const rootDir = path.resolve(__dirname, '..');
  const REVIEWS_JSON_PATH = path.join(rootDir, 'reviews.json');
  const REVIEWS_MD_PATH = path.join(rootDir, 'llms', 'reviews.md');
  
  // Try to fetch new reviews from Google API
  let reviews = await fetchFromGoogleApi();
  
  // If API fetch was skipped or failed, fallback to existing local JSON
  if (!reviews) {
    if (fs.existsSync(REVIEWS_JSON_PATH)) {
      console.log(`Reading existing reviews from ${REVIEWS_JSON_PATH}...`);
      const fileData = fs.readFileSync(REVIEWS_JSON_PATH, 'utf8');
      reviews = JSON.parse(fileData).reviews || [];
    } else {
      console.error('No reviews found to process.');
      return;
    }
  } else {
    // If we fetched new reviews, update the local JSON file
    fs.writeFileSync(REVIEWS_JSON_PATH, JSON.stringify({ reviews }, null, 2));
    console.log(`[+] Updated ${REVIEWS_JSON_PATH} with latest reviews.`);
  }

  // Always generate/update the Markdown version for LLMs
  convertToMarkdown(reviews, REVIEWS_MD_PATH);
}

main().catch(console.error);