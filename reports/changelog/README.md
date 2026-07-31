# Monthly Changelog

Monthly owner-report changelog files live in this folder as JSON arrays named `YYYY-MM.json`.

The CRM report generator fetches these files from GitHub at:

```text
reports/changelog/{month}.json
```

Add a new entry whenever a marketing-site change has customer or owner-facing impact.

Example:

```json
[
  {
    "id": "2026-07-homepage-hero-copy-refresh",
    "area": "website",
    "type": "content",
    "title": "Refreshed homepage hero copy",
    "summary": "Updated the homepage hero headline and supporting copy to better emphasize Chicago local moving services.",
    "impact": "Helps visitors understand the core service offering faster and supports stronger quote intent.",
    "shippedAt": "2026-07-31",
    "shippedBy": "Codex",
    "source": "manual",
    "relatedFiles": [
      "index.html"
    ],
    "tags": [
      "homepage",
      "conversion",
      "copy"
    ],
    "includeInReport": true,
    "ownerNote": "Customer-facing copy improvements are good candidates for the monthly owner report.",
    "customerVisible": true,
    "priority": "medium"
  }
]
```
