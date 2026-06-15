# Agent notes — guitar site

## Homepage prerender (SEO)

The build runs `scripts/prerender-home.mjs` after `vite build` and injects static HTML into `dist/index.html` so crawlers see the catalog without executing JavaScript.

**Keep `scripts/prerender-home.mjs` in sync** when you change homepage catalog layout or markup in:

- `src/pages/Home.jsx`
- `src/components/Catalog.jsx`
- `src/components/CompositionCard.jsx`
- `src/components/TableOfContents.jsx`
- `src/components/PdfLinkList.jsx`

After layout changes, run `npm run build` and confirm `dist/index.html` still reflects the homepage structure (piece titles, descriptions, links, TOC).
