# Appliance Error Codes & Troubleshooting

A lightweight static website (semantic HTML5, one CSS file, vanilla JS, a JSON data
file) that explains appliance error codes — meanings checked against manufacturer
manuals, model family by model family. No backend, no database, no build step.
Designed for GitHub Pages and for future, clearly-separated advertising slots.

## File structure

- `index.html` — homepage with working search, category cards, recent guides.
- `error-codes.html` — browse/search all entries with filters.
- `categories/` — one static page per appliance category (8).
- `<brand>/<appliance>/<code>.html` — verified error-code guide pages, e.g.
  `hisense/dishwasher/e1.html`.
- `guides/` — general troubleshooting articles.
- `about.html`, `contact.html`, `privacy-policy.html`, `terms.html`,
  `disclaimer.html` — trust & safety pages (contact details are placeholders
  for the owner to fill in).
- `data/codes.json` — the structured data behind search, filters and listings.
- `styles.css`, `script.js`, `assets/logo.svg`, `404.html`,
  `robots.txt`, `sitemap.xml`.

All internal links are relative, so the site works from a domain root or a
repository subdirectory.

## Editing content

### Change a code's listing
Edit `data/codes.json`. Each entry has `brand`, `appliance`, `category`,
`code`, `status` (`verified` or `planned`), `meaning`, `path` and `source`.
- Only `verified` entries may have a `path` — and only when that page exists.
- `planned` entries must have `path: null` and `meaning: null`. They render in
  listings as "Guide in preparation" with no link. Never publish a meaning for
  a code until it has been checked in the manufacturer manual.

### Add a new error-code page
1. Verify the meaning in the manufacturer manual for the model family
   (check at least two families if the code is used across a range; record
   series differences — see existing pages for the series-table format).
2. Copy an existing page in the same brand/appliance folder and adapt it,
   keeping: breadcrumbs, the quick-answer box (with the manual named),
   applies-to/series table, causes, safe checks in order, technician signs,
   safety box, FAQ (and matching FAQ JSON-LD), related links, and the
   "checked against" source line.
3. Add/update the entry in `data/codes.json` (status `verified`, real `path`).
4. Link it from its category page's static list and from sibling code pages'
   related sections.
5. Add its URL to `sitemap.xml`.

### Advertising (future)
Pages contain clearly commented, empty `.ad-slot` containers. When the owner is
ready, paste the ad network's code inside the container marked by the HTML
comment. Keep ads inside those containers only: no pop-ups, overlays, forced
clicks, or anything styled to look like a repair step or button.

## Deploy to GitHub Pages

1. Create a repository named `<username>.github.io` (for a root site) or any
   repo name (for a project subpath site).
2. Upload/commit all files in this folder, keeping the structure as-is.
3. In the repo: Settings → Pages → deploy from branch `main`, folder `/ (root)`.
4. Wait for the "Your site is live" banner and open the URL to verify.
5. When a custom domain is added, update the canonical/Open Graph URLs and the
   sitemap/robots URLs from the `github.io` base to the final domain.

## House rules (do not break)

- Never invent an error-code meaning, model compatibility, part number,
  price, or citation. Unverified = labelled or left out.
- Never link to a page that does not exist.
- Reset instructions are published only where manufacturer documentation
  supports them.
- Refrigerant, gas and high-voltage topics are "technician only" — always.
