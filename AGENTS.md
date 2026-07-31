# Agent Instructions

## Monthly marketing changelog

Every future agent must update the monthly owner-report changelog whenever it makes meaningful marketing-site changes.

Changelog files live at:

```text
reports/changelog/YYYY-MM.json
```

For example, July 2026 must be available at:

```text
reports/changelog/2026-07.json
```

Add an entry when a change affects:

- Marketing site content
- Pages or sections
- Forms and lead capture
- SEO metadata/content
- Conversion tracking
- Analytics
- Performance improvements
- Meaningful bug fixes
- Customer-visible design/layout changes

Skip changelog entries for:

- Tiny formatting-only changes
- Internal refactors with no customer- or owner-facing impact
- Dependency/build noise unless important

Each changelog entry must be an object in the monthly JSON array with these fields:

- `id`
- `area`
- `type`
- `title`
- `summary`
- `impact`
- `shippedAt`
- `shippedBy`
- `source`
- `relatedFiles`
- `tags`
- `includeInReport`

Optional fields:

- `ownerNote`
- `customerVisible`
- `priority`

Use values compatible with:

- `area`: `website` or `marketing`
- `type`: `feature`, `fix`, `content`, `analytics`, `maintenance`, or `reporting`

Keep entries concise, owner-readable, and useful for the monthly Comfort Moving owner report.
