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

## Releasing to Cloudflare

Run `npm exec -- wrangler login` to authenticate locally. Run `npm run deploy:preview` for the separate Astro preview Worker. Its responses ask search engines to exclude it from indexing. Test the quote flow using an intercepted CRM response so test leads stay out of the live CRM.

Run `npm run deploy` to release to the existing production Worker and custom domains. Check the HTTPS and `www` redirects, sitemap and canonical routes, a service quote, and the payment return pages. Restore the prior Worker deployment in Cloudflare if a release needs to be rolled back. [Cloudflare static Astro setup](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/#if-you-have-a-static-site)
