# Agent notes — guitar site

## Homepage prerender (SEO)

The build runs `scripts/prerender-catalog.mjs`, `scripts/prerender-home.mjs`, and `scripts/prerender-njgo.mjs` after `vite build`:

- `dist/index.html` — landing page with links to catalog
- `dist/catalog.html` — prerendered catalog for `/catalog` (crawlers and first paint)
- `dist/njgo.html` — prerendered NJGO overview + roster for `njgo.org/` and `/njgo`
- `dist/catalog/view/*.html` — prerendered score viewer pages for `/catalog/view/…`

**Keep `scripts/prerender-catalog.mjs` in sync** when you change homepage catalog layout or markup in:

- `src/pages/Home.jsx`
- `src/components/Catalog.jsx`
- `src/components/CompositionCard.jsx`
- `src/components/TableOfContents.jsx`
- `src/components/PdfLinkList.jsx`

**Keep `scripts/prerender-catalog-views.mjs` in sync** when you change score viewer page layout or metadata in:

- `src/pages/ViewPdf.jsx`
- `src/components/PdfViewer.jsx`

**Keep `scripts/prerender-njgo.mjs` in sync** when you change NJGO public page layout or markup in:

- `src/pages/Njgo.jsx`
- `src/components/NjgoOverview.jsx`
- `src/components/NjgoLinks.jsx` (public links only in prerender)
- `src/components/NjgoRoster.jsx`
- `src/data/njgo-overview.yaml`
- `src/data/njgo-roster.yaml`

After layout changes, run `npm run build` and confirm `dist/index.html` (landing), `dist/catalog.html` (catalog), `dist/catalog/view/*.html` (score pages), and `dist/njgo.html` (NJGO) still reflect the expected structure.

## Search Console (manual)

After deploying to `https://guitar.skelterjohn.me`:

1. Add `https://guitar.skelterjohn.me` as a property in [Google Search Console](https://search.google.com/search-console) (not `skelterjohn.me` — that apex domain is a separate Squarespace parking page with `noindex`).
2. Verify ownership (DNS TXT record is usually easiest if the domain is already on Google Cloud).
3. Submit the sitemap: `https://guitar.skelterjohn.me/sitemap.xml`
4. Use **URL inspection** on `https://guitar.skelterjohn.me/catalog` first; click **Request indexing**.
5. Inspect a few `/catalog/view/…` URLs (for example a composition title you care about) and request indexing for those too.
6. Check **Pages** → **Sitemaps** after a day or two to confirm Google fetched the sitemap and discovered URLs. **Indexing can take days to weeks** for a new site with few inbound links.

The catalog and each `/catalog/view/…` page are prerendered as static HTML for crawlers. PDF files are also linked directly at `/pdf/…`; Google may index those PDFs separately once it crawls the viewer pages.

After deploying to `https://njgo.org`:

1. Add `https://njgo.org` as a property in Search Console.
2. Submit the sitemap: `https://njgo.org/njgo-sitemap.xml`
3. Request indexing for the homepage after deploys that change NJGO content or SEO tags.

`/rep` is private: `robots.txt` disallows it, nginx sends `X-Robots-Tag: noindex`, and repertoire pages set `noindex` in meta.

`robots.txt`, `sitemap.xml`, and `njgo-sitemap.xml` are generated at build time (`scripts/generate-sitemap.mjs`).

## Catalog PDF bucket (`skelterjohnguitar-pdf`)

**Current:** `allUsers` has **Storage Legacy Object Reader** (direct read by exact object URL only). **Storage Legacy Bucket Reader** was removed so the bucket cannot be listed anonymously. “Secret” scores rely on unguessable object prefixes (e.g. `pub/…` vs other prefixes), not real auth.

**TODO:** Lock this down properly one day — remove public object read, make the bucket private, and have the site nginx proxy authenticate to GCS as `skelterjohnguitar-site@…` (e.g. nginx njs + metadata-server token on `/pdf/`). Update dev (`vite.config.js` `/pdf` proxy) accordingly. Grant `skelterjohnguitar-site` **Storage Object Viewer** on `skelterjohnguitar-pdf` only.
