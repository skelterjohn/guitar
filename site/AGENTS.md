# Agent notes — guitar site

## Homepage prerender (SEO)

The build runs `scripts/prerender-catalog.mjs` then `scripts/prerender-home.mjs` after `vite build`:

- `dist/index.html` — landing page with links to catalog and repertoire
- `dist/catalog.html` — prerendered catalog for `/catalog` (crawlers and first paint)

**Keep `scripts/prerender-catalog.mjs` in sync** when you change homepage catalog layout or markup in:

- `src/pages/Home.jsx`
- `src/components/Catalog.jsx`
- `src/components/CompositionCard.jsx`
- `src/components/TableOfContents.jsx`
- `src/components/PdfLinkList.jsx`

After layout changes, run `npm run build` and confirm `dist/index.html` (landing) and `dist/catalog.html` (catalog) still reflect the expected structure.

## Search Console (manual)

After deploying to `https://guitar.skelterjohn.me`:

1. Add `https://guitar.skelterjohn.me` as a property in [Google Search Console](https://search.google.com/search-console) (not `skelterjohn.me` — that apex domain is a separate Squarespace parking page with `noindex`).
2. Verify ownership (DNS TXT record is usually easiest if the domain is already on Google Cloud).
3. Submit the sitemap: `https://guitar.skelterjohn.me/sitemap.xml`
4. Use **URL inspection** on the homepage and a few `/view/…` pages; request indexing after deploys that change catalog or SEO tags.

`robots.txt` and `sitemap.xml` are generated at build time (`public/robots.txt` and `scripts/generate-sitemap.mjs`).
