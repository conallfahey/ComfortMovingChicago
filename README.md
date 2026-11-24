# Comfort Moving Chicago

Astro pre-renders the Comfort Moving Chicago marketing site. Cloudflare Workers serves the generated files with Workers Static Assets.

## Local development

Use Node.js 22.18 or later.

```sh
npm ci
npm run dev
npm run check:seo
npm run deploy -- --dry-run
```

Restart `npm run dev` after editing site files. Existing HTML files remain the source for individual page content, metadata, and structured data. Astro supplies the shared site shell and quote planner. The build preserves the published `.html` URLs, extensionless aliases, and custom 404. Raw review exports and owner reports stay in the repository.

## Checking a new SEO page

Save publishable neighborhood guides as `neighborhoods/<area-slug>-movers.html`, for example `neighborhoods/berwyn-movers.html`. The Astro build picks up the route and links it from the shared service-area lists. Areas already listed on the homepage keep their regional grouping. Guides for other areas appear under “More moving guides.”

After building an approved page and adding its links to the existing site, pass the new source file and the pages that should link to it.

```sh
npm run build
npm run check:seo
node scripts/check-seo-release.mjs neighborhoods/berwyn-movers.html index.html neighborhoods/oak-park-movers.html services/residential-moving-chicago.html
```

## Google Analytics

The public site uses GA4 Measurement ID `G-YN1JXWB920`. The tag loads on `comfortmovingchicago.com` and `www.comfortmovingchicago.com`. To test Analytics on another hostname, set `PUBLIC_GA_MEASUREMENT_ID` to a separate test web stream ID when building. The site sends `generate_lead` after the CRM accepts a completed moving quote.

## Releasing to Cloudflare

Run `npm exec -- wrangler login` to authenticate locally. Run `npm run deploy:preview` for the separate Astro preview Worker. Its responses ask search engines to exclude it from indexing. Test the quote flow using an intercepted CRM response so test leads stay out of the live CRM.

Run `npm run deploy` to release to the existing production Worker and custom domains. Check the HTTPS and `www` redirects, sitemap and canonical routes, a service quote, and the payment return pages. Restore the prior Worker deployment in Cloudflare if a release needs to be rolled back. [Cloudflare static Astro setup](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/#if-you-have-a-static-site)
